import React, { useState, useEffect } from 'react';
import { Megaphone, AlertTriangle, Calendar, Bell, BookOpen, Eye, Clock, User } from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  targetAudience: string;
  publishedAt: string;
  expiresAt?: string;
  createdBy: {
    username: string;
    email: string;
  };
  courseId?: {
    _id: string;
    title: string;
  };
  stats: {
    totalViews: number;
    totalReads: number;
    targetCount: number;
  };
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('https://edupischoolbackend.onrender.com/api/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (announcementId: string) => {
    const token = localStorage.getItem('studentToken');
    if (!token) return;

    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/announcements/${announcementId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Update the announcement stats locally
        setAnnouncements(announcements.map(ann => 
          ann._id === announcementId 
            ? { ...ann, stats: { ...ann.stats, totalReads: ann.stats.totalReads + 1 } }
            : ann
        ));
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    markAsRead(announcement._id);
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
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (announcement: Announcement) => {
    return announcement.expiresAt && new Date(announcement.expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2">School Announcements</h1>
          <p className="text-gray-600">Stay updated with the latest news and important information</p>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {announcements.map((announcement) => {
            const TypeIcon = getTypeIcon(announcement.type);
            const expired = isExpired(announcement);
            
            return (
              <div
                key={announcement._id}
                onClick={() => handleAnnouncementClick(announcement)}
                className={`
                  bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer 
                  hover:shadow-md transition-shadow
                  ${expired ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`
                        p-2 rounded-full 
                        ${announcement.priority === 'urgent' ? 'bg-red-100' : 
                          announcement.priority === 'high' ? 'bg-orange-100' : 
                          announcement.priority === 'normal' ? 'bg-blue-100' : 'bg-gray-100'}
                      `}>
                        <TypeIcon className={`
                          w-5 h-5 
                          ${announcement.priority === 'urgent' ? 'text-red-600' : 
                            announcement.priority === 'high' ? 'text-orange-600' : 
                            announcement.priority === 'normal' ? 'text-blue-600' : 'text-gray-600'}
                        `} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {announcement.createdBy.username}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(announcement.publishedAt)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {announcement.stats.totalViews} views
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {announcement.content.length > 200 
                        ? announcement.content.substring(0, 200) + '...'
                        : announcement.content
                      }
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority} priority
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {announcement.type}
                      </span>
                      {announcement.courseId && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          📚 {announcement.courseId.title}
                        </span>
                      )}
                      {expired && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
            <p className="text-gray-600">Check back later for important updates and news!</p>
          </div>
        )}

        {/* Announcement Detail Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {React.createElement(getTypeIcon(selectedAnnouncement.type), { 
                      className: `w-6 h-6 ${
                        selectedAnnouncement.priority === 'urgent' ? 'text-red-600' : 
                        selectedAnnouncement.priority === 'high' ? 'text-orange-600' : 
                        selectedAnnouncement.priority === 'normal' ? 'text-blue-600' : 'text-gray-600'
                      }`
                    })}
                    <h2 className="text-xl font-semibold text-gray-900">{selectedAnnouncement.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>By: {selectedAnnouncement.createdBy.username}</span>
                    <span>Published: {formatDate(selectedAnnouncement.publishedAt)}</span>
                    {selectedAnnouncement.expiresAt && (
                      <span>Expires: {formatDate(selectedAnnouncement.expiresAt)}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                      {selectedAnnouncement.priority} priority
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {selectedAnnouncement.type}
                    </span>
                    {selectedAnnouncement.courseId && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        📚 {selectedAnnouncement.courseId.title}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedAnnouncement.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;