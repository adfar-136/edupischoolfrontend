import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import NotificationPopup from '../components/NotificationPopup';
import { SOCKET_URL } from '../config/api';

interface NotificationData {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  createdBy: string;
  timestamp: string;
  actionUrl?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  showNotificationPopup: (notification: NotificationData) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  showNotificationPopup: () => {}
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const { state } = useAuth();

  useEffect(() => {
    // Only create socket connection for authenticated students
    if (state.isAuthenticated && state.userType === 'student' && state.user) {
      const newSocket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      // Set up connection event handlers
      newSocket.on('connect', () => {
        console.log('🔗 Connected to notification server');
        setIsConnected(true);
        
        // Authenticate the student with the server
        newSocket.emit('student_auth', {
          studentId: state.user._id || state.user.id,
          studentName: state.user.studentName || state.user.name
        });
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 Disconnected from notification server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setIsConnected(false);
      });

      // Listen for new announcement notifications
      newSocket.on('new_announcement', (data: NotificationData) => {
        console.log('📢 Received new announcement notification:', data);
        
        // Show popup notification
        setCurrentNotification(data);
        
        // Play notification sound (optional)
        try {
          const audio = new Audio('/notification.mp3'); // You can add a notification sound file
          audio.volume = 0.3;
          audio.play().catch(() => {
            // Ignore audio play errors (user interaction required)
          });
        } catch (error) {
          // Ignore audio errors
        }

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(`New Announcement: ${data.title}`, {
            body: data.content,
            icon: '/favicon.ico',
            tag: 'announcement',
            requireInteraction: false
          });
        }
      });

      setSocket(newSocket);

      // Request browser notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('📱 Notification permission:', permission);
        });
      }

      return () => {
        console.log('🔌 Cleaning up socket connection');
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Clean up socket if user is not authenticated or not a student
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [state.isAuthenticated, state.userType, state.user]);

  const showNotificationPopup = (notification: NotificationData) => {
    setCurrentNotification(notification);
  };

  const handleNotificationClose = () => {
    setCurrentNotification(null);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, showNotificationPopup }}>
      {children}
      
      {/* Global Notification Popup */}
      <NotificationPopup
        notification={currentNotification}
        onClose={handleNotificationClose}
        onAction={() => {
          setCurrentNotification(null);
        }}
      />
    </SocketContext.Provider>
  );
};

export default SocketProvider;