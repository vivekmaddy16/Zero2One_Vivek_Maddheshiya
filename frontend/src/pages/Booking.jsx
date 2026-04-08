import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, FileText, IndianRupee, CheckCircle, Loader } from 'lucide-react';
import { getService, createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';
import toast from 'react-hot-toast';

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
];

export default function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ scheduledDate: '', timeSlot: '', address: '', notes: '' });
  const [customerCoords, setCustomerCoords] = useState({ lat: null, lng: null });

  useEffect(() => { loadService(); }, [serviceId]);

  const loadService = async () => {
    try { const { data } = await getService(serviceId); setService(data); }
    catch { toast.error('Service not found'); navigate('/services'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user?.lat && user?.lng) {
      setCustomerCoords({ lat: user.lat, lng: user.lng });
    }
  }, [user]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCustomerCoords({ lat: coords.latitude, lng: coords.longitude });
        setFormData((prev) => ({
          ...prev,
          address: prev.address || `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
        }));
        toast.success('Current location captured for booking');
      },
      () => {
        toast.error('Unable to access location. Please allow location access and try again.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.scheduledDate || !formData.timeSlot || !formData.address) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    try {
      await createBooking({
        serviceId,
        ...formData,
        customerLat: customerCoords.lat,
        customerLng: customerCoords.lng
      });
      toast.success('Booking created! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally { setSubmitting(false); }
  };

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Book Service</h1>
          <p className="text-slate-500 mb-8">Complete the form below to schedule your booking</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              <div className="card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                  <Calendar className="w-5 h-5 text-primary-500" /> Select Date
                </h3>
                <input type="date" value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  min={minDate} className="input-field" required />
              </div>

              <div className="card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                  <Clock className="w-5 h-5 text-primary-500" /> Select Time
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button key={slot} type="button"
                      onClick={() => setFormData({ ...formData, timeSlot: slot })}
                      className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        formData.timeSlot === slot
                          ? 'bg-primary-500 text-white shadow-primary'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
                      }`}>{slot}</button>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                  <MapPin className="w-5 h-5 text-primary-500" /> Service Address
                </h3>
                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your full address..." rows={3} className="input-field resize-none" required />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Exact coordinates help providers arrive faster.</p>
                  <button type="button" onClick={useCurrentLocation}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800">
                    Use my current location
                  </button>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                  <FileText className="w-5 h-5 text-primary-500" /> Notes (Optional)
                </h3>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific requirements..." rows={2} className="input-field resize-none" />
              </div>

              <button type="submit" disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 !py-4 text-lg">
                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Confirm Booking</>}
              </button>
            </form>

            <div className="lg:col-span-5">
              <div className="card p-6 sticky top-24">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Booking Summary</h3>
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-2xl shrink-0">
                    {service?.category === 'electrician' ? '⚡' : service?.category === 'plumber' ? '🔧' : service?.category === 'tutor' ? '📚' : '🚚'}
                  </div>
                  <div><h4 className="font-semibold text-slate-800">{service?.title}</h4><p className="text-sm text-slate-500">by {service?.providerId?.name}</p></div>
                </div>
                <div className="space-y-3 mb-6">
                  {formData.scheduledDate && <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-primary-500" /><span className="text-slate-600">{new Date(formData.scheduledDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>}
                  {formData.timeSlot && <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-primary-500" /><span className="text-slate-600">{formData.timeSlot}</span></div>}
                  {formData.address && <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-primary-500" /><span className="text-slate-600 line-clamp-2">{formData.address}</span></div>}
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Amount</span>
                    <div className="flex items-center gap-1"><IndianRupee className="w-5 h-5 text-primary-600" /><span className="text-2xl font-bold text-primary-600">{service?.price?.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>
              {(typeof service?.providerId?.lat === 'number' && typeof service?.providerId?.lng === 'number') || (customerCoords.lat && customerCoords.lng) ? (
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Booking map</h3>
                  <MapView
                    markers={[
                      service?.providerId?.lat && service?.providerId?.lng && {
                        id: 'provider',
                        label: 'Provider',
                        lat: service.providerId.lat,
                        lng: service.providerId.lng,
                        color: '#2563eb'
                      },
                      customerCoords.lat && customerCoords.lng && {
                        id: 'customer',
                        label: 'You',
                        lat: customerCoords.lat,
                        lng: customerCoords.lng,
                        color: '#059669'
                      }
                    ].filter(Boolean)}
                    center={typeof service?.providerId?.lat === 'number' && typeof service?.providerId?.lng === 'number' ? { lat: service.providerId.lat, lng: service.providerId.lng } : { lat: customerCoords.lat, lng: customerCoords.lng }}
                    zoom={10}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
