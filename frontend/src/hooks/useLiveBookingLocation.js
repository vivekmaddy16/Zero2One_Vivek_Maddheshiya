import { useEffect, useMemo, useRef, useState } from 'react';
import { shareBookingLocation } from '../api';

const activeStatuses = ['pending', 'confirmed', 'in_progress'];

function isFiniteCoordinate(value) {
  return Number.isFinite(value);
}

function shouldSkipSend(lastSent, lat, lng) {
  const now = Date.now();
  if (lastSent.lat === null || lastSent.lng === null) return false;

  const sameSpot =
    Math.abs(lastSent.lat - lat) < 0.00005 &&
    Math.abs(lastSent.lng - lng) < 0.00005;

  return sameSpot && now - lastSent.at < 10000;
}

export function applyBookingLocationUpdate(bookings, payload) {
  if (!payload?._id) return bookings;

  return bookings.map((booking) => {
    if (booking._id !== payload._id) return booking;

    return {
      ...booking,
      customerLat: payload.customerLat ?? booking.customerLat ?? null,
      customerLng: payload.customerLng ?? booking.customerLng ?? null,
      customerLocationUpdatedAt: payload.customerLocationUpdatedAt ?? booking.customerLocationUpdatedAt ?? null,
      providerLat: payload.providerLat ?? booking.providerLat ?? null,
      providerLng: payload.providerLng ?? booking.providerLng ?? null,
      providerLocationUpdatedAt: payload.providerLocationUpdatedAt ?? booking.providerLocationUpdatedAt ?? null,
      userId: booking.userId
        ? {
            ...booking.userId,
            lat: payload.customerLat ?? booking.userId.lat,
            lng: payload.customerLng ?? booking.userId.lng,
          }
        : booking.userId,
      providerId: booking.providerId
        ? {
            ...booking.providerId,
            lat: payload.providerLat ?? booking.providerId.lat,
            lng: payload.providerLng ?? booking.providerId.lng,
          }
        : booking.providerId,
    };
  });
}

export default function useLiveBookingLocation({ bookings, role, socket, onLocationPatch }) {
  const [isSharing, setIsSharing] = useState(false);
  const [locationError, setLocationError] = useState('');
  const watchIdRef = useRef(null);
  const lastSentRef = useRef({ lat: null, lng: null, at: 0 });
  const errorShownRef = useRef(false);

  const trackableBookings = useMemo(
    () => bookings.filter((booking) => activeStatuses.includes(booking.status)),
    [bookings]
  );
  const trackableSignature = useMemo(
    () => trackableBookings.map((booking) => `${booking._id}:${booking.status}`).join('|'),
    [trackableBookings]
  );
  const trackableBookingsRef = useRef(trackableBookings);

  const sharingSupported = typeof navigator !== 'undefined' && Boolean(navigator.geolocation);

  useEffect(() => {
    trackableBookingsRef.current = trackableBookings;
  }, [trackableSignature]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleBookingLocationUpdate = (payload) => {
      onLocationPatch(payload);
    };

    socket.on('bookingLocationUpdated', handleBookingLocationUpdate);
    return () => {
      socket.off('bookingLocationUpdated', handleBookingLocationUpdate);
    };
  }, [socket, onLocationPatch]);

  useEffect(() => {
    if (!sharingSupported || trackableBookings.length === 0) {
      setIsSharing(false);
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return undefined;
    }

    let stopped = false;

    const updateLocation = async ({ latitude, longitude }) => {
      if (!isFiniteCoordinate(latitude) || !isFiniteCoordinate(longitude)) return;
      if (shouldSkipSend(lastSentRef.current, latitude, longitude)) return;

      lastSentRef.current = {
        lat: latitude,
        lng: longitude,
        at: Date.now(),
      };

      setIsSharing(true);
      setLocationError('');
      errorShownRef.current = false;

      await Promise.all(
        trackableBookingsRef.current.map(async (booking) => {
          try {
            const { data } = await shareBookingLocation(booking._id, {
              lat: latitude,
              lng: longitude,
            });

            onLocationPatch(data);

            const targetUserId = role === 'customer' ? booking.providerId?._id : booking.userId?._id;
            if (socket && targetUserId) {
              socket.emit('bookingLocationUpdate', {
                targetUserId,
                location: data,
              });
            }
          } catch (error) {
            if (!errorShownRef.current) {
              setLocationError(error.response?.data?.message || 'Live location could not be shared right now.');
              errorShownRef.current = true;
            }
          }
        })
      );
    };

    const successHandler = (position) => {
      if (stopped) return;
      updateLocation(position.coords).catch(() => {});
    };

    const errorHandler = (error) => {
      if (stopped) return;
      setIsSharing(false);
      setLocationError(
        error.code === 1
          ? 'Location permission is blocked. Allow browser location to share live tracking.'
          : 'Live location is temporarily unavailable.'
      );
    };

    watchIdRef.current = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000,
    });

    return () => {
      stopped = true;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [sharingSupported, trackableSignature, role, socket, onLocationPatch]);

  return {
    hasTrackableBookings: trackableBookings.length > 0,
    isSharing,
    locationError,
    sharingSupported,
  };
}
