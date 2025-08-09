import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Megaphone, AlertTriangle, Calendar, Bell, BookOpen } from 'lucide-react';

interface NotificationPopupProps {
  notification: {
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    createdBy: string;
    timestamp: string;
    actionUrl?: string;
  } | null;
  onClose: () => void;
  onAction?: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      // Auto-close after 10 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleAction = () => {
    if (notification?.actionUrl) {
      navigate(notification.actionUrl);
    }
    if (onAction) {
      onAction();
    }
    handleClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'academic': return BookOpen;
      case 'event': return Calendar;
      case 'system': return Bell;
      default: return Megaphone;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'normal': return 'border-blue-500 bg-blue-50';
      case 'low': return 'border-gray-500 bg-gray-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!notification || !isVisible) return null;

  const TypeIcon = getTypeIcon(notification.type);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Popup Container */}
      <div className="flex items-start justify-center pt-20 px-4">
        <div 
          className={`
            max-w-md w-full bg-white rounded-lg shadow-2xl border-l-4 pointer-events-auto
            transform transition-all duration-300 ease-out
            ${getPriorityColor(notification.priority)}
            ${isClosing ? 'translate-y-[-20px] opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}
          `}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-full 
                  ${notification.priority === 'urgent' ? 'bg-red-100' : 
                    notification.priority === 'high' ? 'bg-orange-100' : 
                    notification.priority === 'normal' ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  <TypeIcon className={`
                    w-5 h-5 
                    ${notification.priority === 'urgent' ? 'text-red-600' : 
                      notification.priority === 'high' ? 'text-orange-600' : 
                      notification.priority === 'normal' ? 'text-blue-600' : 'text-gray-600'}
                  `} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">New Announcement</h3>
                  <p className="text-sm text-gray-600">From: {notification.createdBy}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadgeColor(notification.priority)}`}>
                  {notification.priority}
                </span>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {notification.title}
            </h4>
            <p className="text-gray-600 mb-3 leading-relaxed">
              {notification.content}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Type: {notification.type}</span>
              <span>Time: {formatTime(notification.timestamp)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
            <div className="flex space-x-3">
              <button
                onClick={handleAction}
                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                View Details
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>

          {/* Progress bar for auto-close */}
          <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
            <div 
              className={`
                h-full transition-all duration-[10000ms] ease-linear
                ${notification.priority === 'urgent' ? 'bg-red-500' : 
                  notification.priority === 'high' ? 'bg-orange-500' : 
                  notification.priority === 'normal' ? 'bg-blue-500' : 'bg-gray-500'}
                ${isClosing ? 'w-0' : 'w-full'}
              `}
              style={{ width: isClosing ? '0%' : '0%', animation: !isClosing ? 'progress 10s linear forwards' : 'none' }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationPopup;