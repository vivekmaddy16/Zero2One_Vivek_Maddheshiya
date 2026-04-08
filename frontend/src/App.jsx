import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyButton from './components/EmergencyButton';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Booking from './pages/Booking';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function AppLayout() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/chat');

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/booking/:serviceId" element={<ProtectedRoute role="customer"><Booking /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/provider-dashboard" element={<ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <Footer />}
      <EmergencyButton />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fffdf8',
            color: '#172033',
            border: '1px solid #eadfc8',
            borderRadius: '18px',
            boxShadow: '0 18px 40px -22px rgba(120, 87, 29, 0.22)',
          },
          success: { iconTheme: { primary: '#2f9b59', secondary: '#fffdf8' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fffdf8' } },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppLayout />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

