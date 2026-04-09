import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  Loader,
  MapPin,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createBooking, getService } from '../api';
import MapView from '../components/MapView';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { fetchCurrentLocationAddress } from '../utils/locationAutofill';
import { formatPriceUnit, getServiceMeta } from '../utils/serviceMeta';

const timeSlots = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
];

const bookingSteps = [
  'Choose your preferred date',
  'Pick a time slot that works',
  'Confirm the address and notes',
];

export default function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [formData, setFormData] = useState({
    scheduledDate: '',
    timeSlot: '',
    address: user?.location || '',
    notes: '',
  });
  const providerHasCoords =
    Number.isFinite(service?.providerId?.lat) && Number.isFinite(service?.providerId?.lng);
  const customerCoords = {
    lat:
      Number.isFinite(currentLocation?.lat)
        ? currentLocation.lat
        : Number.isFinite(user?.lat) && user?.lat !== 0
          ? user.lat
          : null,
    lng:
      Number.isFinite(currentLocation?.lng)
        ? currentLocation.lng
        : Number.isFinite(user?.lng) && user?.lng !== 0
          ? user.lng
          : null,
  };
  const customerHasCoords =
    Number.isFinite(customerCoords.lat) && Number.isFinite(customerCoords.lng);

  useEffect(() => {
    const loadService = async () => {
      try {
        const { data } = await getService(serviceId);
        setService(data);
      } catch (error) {
        toast.error('Service not found');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [navigate, serviceId]);

  const handleAutofillAddress = async () => {
    setFetchingLocation(true);

    try {
      const locationData = await fetchCurrentLocationAddress();
      setCurrentLocation(locationData);
      setFormData((prev) => ({
        ...prev,
        address: locationData.address,
      }));
      toast.success('Current location added to the address field');
    } catch (error) {
      toast.error(error.message || 'Unable to fetch your current location');
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.scheduledDate || !formData.timeSlot || !formData.address.trim()) {
      toast.error('Please fill in the required booking details');
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await createBooking({
        serviceId,
        ...formData,
        address: formData.address.trim(),
        customerLat: customerHasCoords ? customerCoords.lat : null,
        customerLng: customerHasCoords ? customerCoords.lng : null,
      });

      if (socket && data?.providerId?._id) {
        socket.emit('bookingUpdate', {
          targetUserId: data.providerId._id,
          booking: data,
        });
      }

      toast.success('Booking created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
      </div>
    );
  }

  const meta = getServiceMeta(service?.category);
  const Icon = meta.icon;

  return (
    <div className="pb-16 pt-28">
      <div className="section-shell">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_340px]">
          <div>
            <span className="eyebrow">Booking flow</span>
            <h1 className="mt-5 font-display text-4xl font-semibold text-ink-900">Book with confidence and keep the details clear.</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              The goal of this screen is simple: confirm a trusted provider, choose a time, and review the booking summary
              without surprises.
            </p>
          </div>

          <div className="card px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Booking checklist</p>
            <div className="mt-4 space-y-3">
              {bookingSteps.map((step) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-primary-700" />
                  <span className="text-sm text-slate-600">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="card-elevated p-7">
              <div className="flex items-start gap-4">
                <div className={`inline-flex rounded-[24px] bg-gradient-to-br ${meta.gradient} p-4 text-white shadow-soft`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Selected service</p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">{service?.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">by {service?.providerId?.name}</p>
                </div>
              </div>
              {providerHasCoords || customerHasCoords ? (
                <div className="mt-6 card p-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Booking map</h3>
                  <MapView
                    markers={[
                      providerHasCoords && {
                        id: 'provider',
                        label: 'Provider',
                        lat: service.providerId.lat,
                        lng: service.providerId.lng,
                        color: '#2563eb'
                      },
                      customerHasCoords && {
                        id: 'customer',
                        label: 'You',
                        lat: customerCoords.lat,
                        lng: customerCoords.lng,
                        color: '#059669'
                      }
                    ].filter(Boolean)}
                    center={providerHasCoords ? { lat: service.providerId.lat, lng: service.providerId.lng } : { lat: customerCoords.lat, lng: customerCoords.lng }}
                    zoom={10}
                  />
                </div>
              ) : null}
            </div>

            <div className="card p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary-50 p-3 text-primary-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Step 1</p>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Choose a date</h2>
                </div>
              </div>

              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(event) => setFormData({ ...formData, scheduledDate: event.target.value })}
                min={minDate}
                className="input-field mt-5"
                required
              />
            </div>

            <div className="card p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary-50 p-3 text-primary-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Step 2</p>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Pick a time slot</h2>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, timeSlot: slot })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                      formData.timeSlot === slot
                        ? 'border-primary-500 bg-primary-600 text-white shadow-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary-50 p-3 text-primary-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Step 3</p>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Add the service address</h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutofillAddress}
                disabled={fetchingLocation}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {fetchingLocation ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Fetching current location
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4" />
                    Use current location
                  </>
                )}
              </button>

              <textarea
                value={formData.address}
                onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                placeholder="Enter the full address where the provider should arrive."
                rows={4}
                className="input-field mt-5 resize-none"
                required
              />

              <p className="mt-3 text-xs text-slate-400">
                Allow location access to autofill your address from your current position.
              </p>
            </div>

            <div className="card p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary-50 p-3 text-primary-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Optional note</p>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Share any special instructions</h2>
                </div>
              </div>

              <textarea
                value={formData.notes}
                onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
                placeholder="Examples: access instructions, preferred arrival window, or task details."
                rows={3}
                className="input-field mt-5 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 !py-4 text-base"
            >
              {submitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Confirming booking
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Confirm booking
                </>
              )}
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="card-elevated sticky top-28 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Booking summary</p>

              <div className="mt-5 rounded-[28px] bg-slate-950 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-300">{meta.label}</p>
                    <h2 className="mt-2 font-display text-3xl font-semibold">{service?.title}</h2>
                    <p className="mt-2 text-sm text-slate-300">by {service?.providerId?.name}</p>
                  </div>
                  <div className="rounded-[24px] bg-white/12 p-3">
                    <Icon className="h-6 w-6 text-sky-100" />
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {formData.scheduledDate ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-primary-700" />
                    {new Date(formData.scheduledDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                ) : null}

                {formData.timeSlot ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-primary-700" />
                    {formData.timeSlot}
                  </div>
                ) : null}

                {formData.address ? (
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                    <span className="line-clamp-3">{formData.address}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 rounded-[28px] border border-primary-100 bg-primary-50 px-5 py-5">
                <p className="text-sm text-primary-700">Estimated total</p>
                <div className="mt-2 inline-flex items-center gap-1 text-primary-700">
                  <IndianRupee className="h-5 w-5" />
                  <span className="font-display text-3xl font-semibold">{service?.price?.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm text-primary-700">{formatPriceUnit(service?.priceUnit)}</p>
              </div>
            </div>

            <div className="card p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary-50 p-3 text-primary-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">What happens next</p>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">A calmer booking experience</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  'Your booking appears in the dashboard right after confirmation.',
                  'Use chat if you need to coordinate before the appointment.',
                  'Payment and review flow can happen after the service is completed.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
                    <span className="text-sm leading-7 text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
