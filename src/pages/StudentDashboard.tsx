import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, Download, Calendar, Users, Target, TrendingUp, LogOut, AlertCircle, Bell, X, Eye, Megaphone, Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { isConnected } = useSocket();

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    const student = localStorage.getItem('studentData');
    
    if (!token || !student) {
      navigate('/login');
      return;
    }
    
    setStudentData(JSON.parse(student));
    fetchStudentData();
  }, [navigate]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const student = JSON.parse(localStorage.getItem('studentData'));
      
      // Fetch enrollments
      const enrollmentsResponse = await fetch(`https://edupischoolbackend.onrender.com/api/enrollments/student/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData);
      }
      
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('https://edupischoolbackend.onrender.com/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setNotifications(notifications.map((notif: any) => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        ));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('https://edupischoolbackend.onrender.com/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setNotifications(notifications.map((notif: any) => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification._id);
    }
    
    // Navigate to related content if actionUrl exists
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    if (studentData) {
      fetchNotifications();
    }
  }, [studentData]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/login');
  };

  const getStatsFromEnrollments = () => {
    const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
    const completedCourses = enrollments.filter(e => e.status === 'completed');
    const totalProgress = approvedEnrollments.reduce((sum, e) => sum + (e.progress?.overallProgress || 0), 0);
    const avgProgress = approvedEnrollments.length > 0 ? Math.round(totalProgress / approvedEnrollments.length) : 0;
    
    return {
      enrolledCourses: approvedEnrollments.length,
      completedCourses: completedCourses.length,
      averageProgress: avgProgress,
      totalLectures: approvedEnrollments.reduce((sum, e) => sum + (e.progress?.completedLectures?.length || 0), 0)
    };
  };

  const getAchievements = () => {
    const achievements = [];
    const stats = getStatsFromEnrollments();
    
    if (stats.enrolledCourses > 0) {
      achievements.push({
        title: 'First Course Enrolled',
        date: enrollments[0]?.requestedAt ? new Date(enrollments[0].requestedAt).toLocaleDateString() : 'Recently',
        icon: BookOpen
      });
    }
    
    if (stats.totalLectures > 0) {
      achievements.push({
        title: `${stats.totalLectures} Lectures Completed`,
        date: 'This month',
        icon: Award
      });
    }
    
    if (stats.completedCourses > 0) {
      achievements.push({
        title: `${stats.completedCourses} Course${stats.completedCourses > 1 ? 's' : ''} Completed`,
        date: 'This month',
        icon: Target
      });
    }
    
    if (achievements.length === 0) {
      achievements.push({
        title: 'Welcome to Edupi School!',
        date: 'Today',
        icon: Users
      });
    }
    
    return achievements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = getStatsFromEnrollments();
  const achievements = getAchievements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-2">
              Student Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {studentData?.studentName}! Continue your learning journey.</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Connection Status Indicator */}
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`} title={isConnected ? 'Connected to notification server' : 'Disconnected from notification server'} />
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-sm text-emerald-600 hover:text-emerald-700"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {notifications.slice(0, 5).map((notification: any) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {notification.type === 'announcement' ? (
                                <Megaphone className="w-5 h-5 text-blue-600" />
                              ) : notification.type === 'course' ? (
                                <BookOpen className="w-5 h-5 text-green-600" />
                              ) : (
                                <Bell className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className={`text-sm font-medium ${
                                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No notifications yet</p>
                    </div>
                  )}
                  
                  {notifications.length > 5 && (
                    <div className="p-3 border-t border-gray-200 text-center">
                      <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Enrolled Courses</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.enrolledCourses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Lectures</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalLectures}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Courses</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.completedCourses}</p>
              </div>
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Progress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.averageProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h3>
                  <p className="text-gray-600 mb-4">Browse our course catalog and enroll in courses to start learning!</p>
                  <button 
                    onClick={() => navigate('/courses')}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map(enrollment => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{enrollment.courseId?.title}</h3>
                          <p className="text-sm text-gray-600">Instructor: {enrollment.courseId?.instructor}</p>
                          <p className="text-sm text-gray-500">Level: {enrollment.courseId?.level} • Duration: {enrollment.courseId?.duration}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          enrollment.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                        </span>
                      </div>
                      
                      {enrollment.status === 'approved' && (
                        <>
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium text-gray-900">{enrollment.progress?.overallProgress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-orange-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${enrollment.progress?.overallProgress || 0}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
                            </div>
                            <button 
                              onClick={() => navigate(`/courses/${enrollment.courseId._id}/content`)}
                              className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Continue Learning
                            </button>
                          </div>
                        </>
                      )}
                      
                      {enrollment.status === 'pending' && (
                        <div className="flex items-center space-x-2 text-sm text-yellow-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>Waiting for admin approval. Payment required: ₹{enrollment.courseId?.price}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              {enrollments.length === 0 ? (
                <div className="text-center py-4">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.slice(0, 3).map(enrollment => (
                    <div key={enrollment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{enrollment.courseId?.title}</h3>
                        <p className="text-sm text-gray-600">
                          {enrollment.status === 'pending' ? 'Enrollment requested' :
                           enrollment.status === 'approved' ? 'Enrollment approved' :
                           enrollment.status === 'completed' ? 'Course completed' : 'Status updated'}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(enrollment.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Classes</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Web Development</p>
                    <p className="text-sm text-gray-600">Today, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Data Science</p>
                    <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <achievement.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resources</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-700">Course Materials</span>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-700">Study Guides</span>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-gray-700">Video Recordings</span>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;