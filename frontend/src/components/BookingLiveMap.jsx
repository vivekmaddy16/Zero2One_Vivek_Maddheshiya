import { MapPin, Radar, UserRound } from 'lucide-react';
import MapView from './MapView';

function formatUpdatedTime(value) {
  if (!value) return 'Waiting for live sharing';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Waiting for live sharing';

  return `Updated ${parsed.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}`;
}

function hasCoords(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng);
}

export default function BookingLiveMap({
  booking,
  role,
  isSharing,
  locationError,
  hasTrackableBookings,
}) {
  const canActivelyTrack = ['pending', 'confirmed', 'in_progress'].includes(booking.status);
  const customerLat = booking.customerLat ?? booking.userId?.lat ?? null;
  const customerLng = booking.customerLng ?? booking.userId?.lng ?? null;
  const providerLat = booking.providerLat ?? booking.providerId?.lat ?? null;
  const providerLng = booking.providerLng ?? booking.providerId?.lng ?? null;

  const customerAvailable = hasCoords(customerLat, customerLng);
  const providerAvailable = hasCoords(providerLat, providerLng);

  if (!customerAvailable && !providerAvailable && !canActivelyTrack && !locationError) {
    return null;
  }

  const markers = [
    customerAvailable && {
      id: 'customer',
      label: role === 'customer' ? 'You' : 'Customer',
      lat: customerLat,
      lng: customerLng,
      color: role === 'customer' ? '#059669' : '#0f766e',
    },
    providerAvailable && {
      id: 'provider',
      label: role === 'provider' ? 'You' : 'Provider',
      lat: providerLat,
      lng: providerLng,
      color: role === 'provider' ? '#2563eb' : '#7c3aed',
    },
  ].filter(Boolean);

  const center = providerAvailable
    ? { lat: providerLat, lng: providerLng }
    : customerAvailable
      ? { lat: customerLat, lng: customerLng }
      : null;

  return (
    <div className="mt-6 rounded-[28px] border border-[#eadfc8] bg-[#fffdf8] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Shared live map</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink-900">See both sides on the map</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Track customer and provider positions during the active booking flow.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
          <Radar className="h-4 w-4" />
          {isSharing ? 'Sharing live' : 'Live tracking'}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#eadfc8] bg-white px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <UserRound className="h-4 w-4 text-accent-700" />
            Customer location
          </div>
          <p className="mt-2 text-xs text-slate-500">{formatUpdatedTime(booking.customerLocationUpdatedAt)}</p>
          <p className="mt-2 text-sm text-slate-600">{customerAvailable ? 'Visible on map' : 'Waiting for customer location'}</p>
        </div>
        <div className="rounded-2xl border border-[#eadfc8] bg-white px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <MapPin className="h-4 w-4 text-primary-700" />
            Provider location
          </div>
          <p className="mt-2 text-xs text-slate-500">{formatUpdatedTime(booking.providerLocationUpdatedAt)}</p>
          <p className="mt-2 text-sm text-slate-600">{providerAvailable ? 'Visible on map' : 'Waiting for provider location'}</p>
        </div>
      </div>

      {locationError ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {locationError}
        </div>
      ) : null}

      {markers.length > 0 ? (
        <MapView className="mt-5 !h-72" markers={markers} center={center} zoom={12} />
      ) : canActivelyTrack || hasTrackableBookings ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[#dcc9ab] bg-white px-5 py-6 text-sm text-slate-500">
          Open this booking from both sides and allow location access to start live map sharing.
        </div>
      ) : null}
    </div>
  );
}
