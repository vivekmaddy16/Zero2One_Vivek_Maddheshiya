import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fixify_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fixify_token');
      localStorage.removeItem('fixify_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Services
export const getServices = (params) => API.get('/services', { params });
export const getService = (id) => API.get(`/services/${id}`);
export const createService = (data) => API.post('/services', data);
export const updateService = (id, data) => API.put(`/services/${id}`, data);
export const deleteService = (id) => API.delete(`/services/${id}`);
export const getMyServices = () => API.get('/services/my/services');

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const createEmergencyBooking = (data) => API.post('/bookings/emergency', data);
export const getMyBookings = (params) => API.get('/bookings/my', { params });
export const getProviderRequests = (params) => API.get('/bookings/requests', { params });
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}/status`, { status });
export const shareBookingLocation = (id, coords) => API.put(`/bookings/${id}/location`, coords);
export const markBookingPaid = (id) => API.put(`/bookings/${id}/pay`);
export const getBookingStats = () => API.get('/bookings/stats');

// Availability
export const toggleAvailability = (data) => API.put('/availability/toggle', data);
export const getAvailableProviders = (params) => API.get('/availability/providers', { params });
export const getEmergencyProviders = (params) => API.get('/availability/emergency-providers', { params });

// Ratings
export const createRating = (data) => API.post('/ratings', data);
export const getServiceRatings = (serviceId) => API.get(`/ratings/service/${serviceId}`);
export const getProviderRatings = (providerId) => API.get(`/ratings/provider/${providerId}`);
export const checkRating = (bookingId) => API.get(`/ratings/check/${bookingId}`);

// Messages
export const getConversations = () => API.get('/messages');
export const getConversation = (otherUserId) => API.get(`/messages/${otherUserId}`);
export const sendMessage = (data) => API.post('/messages', data);

// Recommendations
export const getRecommendations = () => API.get('/recommend');
export const askServiceAssistant = (message) => API.post('/recommend/assistant', { message });

// Users (for chat)
export const getUserById = (id) => API.get(`/auth/user/${id}`);

export default API;
