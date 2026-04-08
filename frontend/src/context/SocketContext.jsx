import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [providerAvailability, setProviderAvailability] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL);
      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket.emit('register', user._id);
      });

      newSocket.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Listen for real-time provider availability changes
      newSocket.on('providerAvailabilityChanged', (data) => {
        if (data && data.providerId) {
          setProviderAvailability((prev) => ({
            ...prev,
            [data.providerId]: {
              isAvailable: data.isAvailable,
              availableIn: data.availableIn,
              acceptsEmergency: data.acceptsEmergency,
              updatedAt: data.updatedAt || new Date().toISOString(),
            },
          }));
        }
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
        socketRef.current = null;
      };
    } else {
      // Cleanup on logout
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocket(null);
        socketRef.current = null;
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, providerAvailability }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

