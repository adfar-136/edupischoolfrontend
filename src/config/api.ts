// API Configuration
// Change this URL to switch between local development and production

// For local development, use:
// export const API_BASE_URL = 'http://localhost:8000';

// For production, use:
export const API_BASE_URL = 'https://edupischoolbackend.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    adminLogin: `${API_BASE_URL}/api/auth/login`,
    adminVerify: `${API_BASE_URL}/api/auth/verify`,
    studentLogin: `${API_BASE_URL}/api/student-auth/login`,
    studentRegister: `${API_BASE_URL}/api/student-auth/register`,
  },

  // Courses
  courses: {
    list: `${API_BASE_URL}/api/courses`,
    detail: (id: string) => `${API_BASE_URL}/api/courses/${id}`,
    create: `${API_BASE_URL}/api/courses`,
    update: (id: string) => `${API_BASE_URL}/api/courses/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/courses/${id}`,
  },

  // Curriculum
  curriculum: {
    byCourse: (courseId: string) => `${API_BASE_URL}/api/curriculum/course/${courseId}`,
    addModule: (courseId: string) => `${API_BASE_URL}/api/curriculum/${courseId}/modules`,
    addLecture: (courseId: string, moduleId: string) => `${API_BASE_URL}/api/curriculum/${courseId}/modules/${moduleId}/lectures`,
  },

  // Assessments
  assessments: {
    byCourse: (courseId: string) => `${API_BASE_URL}/api/assessments/course/${courseId}`,
    create: `${API_BASE_URL}/api/assessments`,
    update: (id: string) => `${API_BASE_URL}/api/assessments/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/assessments/${id}`,
  },

  // Enrollments
  enrollments: {
    list: `${API_BASE_URL}/api/enrollments`,
    byStudent: (studentId: string) => `${API_BASE_URL}/api/enrollments/student/${studentId}`,
    create: `${API_BASE_URL}/api/enrollments`,
    updateStatus: (enrollmentId: string, action: string) => `${API_BASE_URL}/api/enrollments/${enrollmentId}/${action}`,
  },

  // Student Progress
  progress: {
    byCourse: (courseId: string) => `${API_BASE_URL}/api/progress/course/${courseId}`,
    completeActivity: (activityId: string, type: string) => `${API_BASE_URL}/api/progress/${type}/${activityId}/complete`,
    completeLecture: (lectureId: string) => `${API_BASE_URL}/api/progress/lecture/${lectureId}/complete`,
    submitAssessment: (assessmentId: string) => `${API_BASE_URL}/api/progress/assessment/${assessmentId}/attempt`,
  },

  // Demo Requests
  demoRequests: {
    list: `${API_BASE_URL}/api/demo-requests`,
    create: `${API_BASE_URL}/api/demo-requests`,
    update: (id: string) => `${API_BASE_URL}/api/demo-requests/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/demo-requests/${id}`,
  },

  // Announcements
  announcements: {
    list: `${API_BASE_URL}/api/announcements`,
    create: `${API_BASE_URL}/api/announcements`,
    update: (id: string) => `${API_BASE_URL}/api/announcements/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/announcements/${id}`,
    stats: `${API_BASE_URL}/api/announcements/admin/stats`,
    markRead: (id: string) => `${API_BASE_URL}/api/announcements/${id}/read`,
  },

  // Notifications
  notifications: {
    list: `${API_BASE_URL}/api/notifications`,
    markRead: (id: string) => `${API_BASE_URL}/api/notifications/${id}/read`,
    markAllRead: `${API_BASE_URL}/api/notifications/mark-all-read`,
  },

  // Forums
  forums: {
    list: `${API_BASE_URL}/api/forums`,
    create: `${API_BASE_URL}/api/forums`,
    detail: (id: string) => `${API_BASE_URL}/api/forums/${id}`,
    topics: (forumId: string) => `${API_BASE_URL}/api/forums/${forumId}/topics`,
    createTopic: (forumId: string) => `${API_BASE_URL}/api/forums/${forumId}/topics`,
    topicDetail: (topicId: string) => `${API_BASE_URL}/api/forums/topics/${topicId}`,
    topicReplies: (topicId: string) => `${API_BASE_URL}/api/forums/topics/${topicId}/replies`,
    likeReply: (replyId: string) => `${API_BASE_URL}/api/forums/replies/${replyId}/like`,
    updateTopic: (topicId: string) => `${API_BASE_URL}/api/forums/topics/${topicId}`,
  },

  // Legacy/Old endpoints (if still needed)
  registrations: {
    list: `${API_BASE_URL}/api/registrations`,
    update: (id: string) => `${API_BASE_URL}/api/registrations/${id}`,
  },
};

// WebSocket URL (for Socket.IO)
export const SOCKET_URL = API_BASE_URL;

// Helper function to check if we're in development mode
export const isDevelopment = () => {
  return API_BASE_URL.includes('localhost');
};

// Helper function to check if we're in production mode
export const isProduction = () => {
  return API_BASE_URL.includes('render.com') || !API_BASE_URL.includes('localhost');
};

export default API_ENDPOINTS;