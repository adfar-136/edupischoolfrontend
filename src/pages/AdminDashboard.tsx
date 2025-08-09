import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  CheckCircle, 
  Clock, 
  X,
  Eye,
  UserCheck,
  UserX,
  FileText,
  Bell,
  Megaphone,
  AlertTriangle,
  Calendar,
  Send,
  Video
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  
  // Announcements management state
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    targetAudience: 'all',
    courseId: '',
    expiresAt: ''
  });
  const [announcementStats, setAnnouncementStats] = useState({
    totalAnnouncements: 0,
    urgentAnnouncements: 0,
    totalViews: 0,
    totalReads: 0,
    readRate: 0
  });

  // Demo requests state
  const [demoRequests, setDemoRequests] = useState([]);
  const [demoStats, setDemoStats] = useState({
    total: 0,
    pending: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0
  });
  const [selectedDemoRequest, setSelectedDemoRequest] = useState(null);
  const [showDemoDetails, setShowDemoDetails] = useState(false);
  
  // Curriculum management state
  const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState(null);
  const [curriculumData, setCurriculumData] = useState([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 1,
    lectures: []
  });
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [lectureForm, setLectureForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    order: 1,
    moduleId: ''
  });
  
  // Assessment management state  
  const [selectedCourseForAssessment, setSelectedCourseForAssessment] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [assessmentForm, setAssessmentForm] = useState({
    title: '',
    description: '',
    type: 'quiz',
    timeLimit: 30,
    totalMarks: 100,
    passingMarks: 60,
    questions: [] as any[]
  });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 5,
    explanation: ''
  });

  const navigate = useNavigate();
  const { state, logout } = useAuth();

  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    duration: '',
    mode: 'Online',
    instructor: '',
    image: '',
    price: 0,
    level: 'Beginner'
  });

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [state.isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [coursesRes, registrationsRes, enrollmentsRes, demoRequestsRes] = await Promise.all([
        fetch('https://edupischoolbackend.onrender.com/api/courses', { headers }),
        fetch('https://edupischoolbackend.onrender.com/api/registrations', { headers }),
        fetch('https://edupischoolbackend.onrender.com/api/enrollments', { headers }),
        fetch('https://edupischoolbackend.onrender.com/api/demo-requests', { headers })
      ]);

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }

      if (registrationsRes.ok) {
        const registrationsData = await registrationsRes.json();
        setRegistrations(registrationsData);
      }

      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(enrollmentsData);
      }

      if (demoRequestsRes.ok) {
        const demoData = await demoRequestsRes.json();
        setDemoRequests(demoData.demoRequests);
        setDemoStats(demoData.stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Demo requests management functions
  const updateDemoRequestStatus = async (demoId: string, status: string, scheduledDate?: string, notes?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/demo-requests/${demoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          scheduledDate,
          notes
        })
      });

      if (response.ok) {
        // Refresh demo requests data
        const demoResponse = await fetch('https://edupischoolbackend.onrender.com/api/demo-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          setDemoRequests(demoData.demoRequests);
          setDemoStats(demoData.stats);
        }
        
        alert('Demo request updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update demo request');
      }
    } catch (error) {
      console.error('Error updating demo request:', error);
      alert('Failed to update demo request');
    }
  };

  const deleteDemoRequest = async (demoId: string) => {
    if (!confirm('Are you sure you want to delete this demo request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/demo-requests/${demoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        // Refresh demo requests data
        const demoResponse = await fetch('https://edupischoolbackend.onrender.com/api/demo-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          setDemoRequests(demoData.demoRequests);
          setDemoStats(demoData.stats);
        }
        
        alert('Demo request deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete demo request');
      }
    } catch (error) {
      console.error('Error deleting demo request:', error);
      alert('Failed to delete demo request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleEnrollmentAction = async (enrollmentId: string, action: string, paymentReceived = false, feesPaid = 0) => {
    setEnrollmentLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/enrollments/${enrollmentId}/${action}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          adminId: state.admin.id,
          paymentReceived,
          feesPaid
        })
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error(`Error ${action} enrollment:`, error);
    }
    setEnrollmentLoading(false);
  };

  // Curriculum management functions
  const fetchCurriculum = async (courseId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/curriculum/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCurriculumData(data); // data is already the modules array
      }
    } catch (error) {
      console.error('Error fetching curriculum:', error);
    }
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      // Use the course-specific module creation API
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/curriculum/${selectedCourseForCurriculum._id}/modules`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(moduleForm)
      });

      if (response.ok) {
        setShowModuleForm(false);
        setEditingModule(null);
        setModuleForm({ title: '', description: '', order: 1, lectures: [] });
        fetchCurriculum(selectedCourseForCurriculum._id);
      }
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const handleLectureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      // Use the course and module specific lecture creation API
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/curriculum/${selectedCourseForCurriculum._id}/modules/${lectureForm.moduleId}/lectures`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: lectureForm.title,
          description: lectureForm.description,
          videoUrl: lectureForm.videoUrl,
          duration: lectureForm.duration,
          order: lectureForm.order
        })
      });

      if (response.ok) {
        setShowLectureForm(false);
        setLectureForm({ title: '', description: '', videoUrl: '', duration: '', order: 1, moduleId: '' });
        fetchCurriculum(selectedCourseForCurriculum._id);
      }
    } catch (error) {
      console.error('Error saving lecture:', error);
    }
  };

  // Assessment management functions
  const fetchAssessments = async (courseId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/assessments/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingAssessment 
        ? `https://edupischoolbackend.onrender.com/api/assessments/${editingAssessment._id}`
        : 'https://edupischoolbackend.onrender.com/api/assessments';
      
      const response = await fetch(url, {
        method: editingAssessment ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: assessmentForm.title,
          description: assessmentForm.description,
          type: assessmentForm.type,
          timeLimit: assessmentForm.timeLimit,
          totalPoints: assessmentForm.totalMarks,
          passingScore: assessmentForm.passingMarks,
          questions: assessmentForm.questions,
          courseId: selectedCourseForAssessment._id
        })
      });

      if (response.ok) {
        setShowAssessmentForm(false);
        setEditingAssessment(null);
        setAssessmentForm({ title: '', description: '', type: 'quiz', timeLimit: 30, totalMarks: 100, passingMarks: 60, questions: [] });
        fetchAssessments(selectedCourseForAssessment._id);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const addQuestionToAssessment = () => {
    // Convert frontend question format to backend format
    const formattedQuestion = {
      question: questionForm.question,
      type: questionForm.type,
      points: questionForm.marks, // maps 'marks' to 'points'
      options: questionForm.type === 'multiple-choice' 
        ? questionForm.options.map((option, index) => ({
            text: option,
            isCorrect: index === questionForm.correctAnswer
          }))
        : [],
      correctAnswer: questionForm.type !== 'multiple-choice' ? questionForm.correctAnswer : undefined
    };

    setAssessmentForm(prev => ({
      ...prev,
      questions: [...prev.questions, formattedQuestion]
    }));
    
    setQuestionForm({
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 5,
      explanation: ''
    });
    setShowQuestionForm(false);
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const isEditing = editingCourse !== null;

    try {
      const url = isEditing ? `https://edupischoolbackend.onrender.com/api/courses/${editingCourse}` : 'https://edupischoolbackend.onrender.com/api/courses';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });

      if (response.ok) {
        fetchData();
        setShowCourseForm(false);
        setEditingCourse(null);
        setCourseForm({
          title: '',
          category: 'Web Development',
          description: '',
          duration: '',
          mode: 'Online',
          instructor: '',
          image: '',
          price: 0,
          level: 'Beginner'
        });
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleEditCourse = (course: any) => {
    setCourseForm({
      title: course.title,
      category: course.category,
      description: course.description,
      duration: course.duration,
      mode: course.mode,
      instructor: course.instructor,
      image: course.image,
      price: course.price,
      level: course.level
    });
    setEditingCourse(course._id);
    setShowCourseForm(true);
  };

  const updateRegistrationStatus = async (registrationId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/registrations/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating registration:', error);
    }
  };

  // Announcement management functions
  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://edupischoolbackend.onrender.com/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchAnnouncementStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://edupischoolbackend.onrender.com/api/announcements/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncementStats(data);
      }
    } catch (error) {
      console.error('Error fetching announcement stats:', error);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingAnnouncement 
        ? `https://edupischoolbackend.onrender.com/api/announcements/${editingAnnouncement._id}`
        : 'https://edupischoolbackend.onrender.com/api/announcements';
      
      const method = editingAnnouncement ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...announcementForm,
          courseId: announcementForm.courseId || null,
          expiresAt: announcementForm.expiresAt || null
        })
      });

      if (response.ok) {
        fetchAnnouncements();
        fetchAnnouncementStats();
        setShowAnnouncementForm(false);
        setEditingAnnouncement(null);
        setAnnouncementForm({
          title: '',
          content: '',
          type: 'general',
          priority: 'normal',
          targetAudience: 'all',
          courseId: '',
          expiresAt: ''
        });
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      courseId: announcement.courseId?._id || '',
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : ''
    });
    setShowAnnouncementForm(true);
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`https://edupischoolbackend.onrender.com/api/announcements/${announcementId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          fetchAnnouncements();
          fetchAnnouncementStats();
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return AlertTriangle;
      case 'academic': return BookOpen;
      case 'event': return Calendar;
      case 'system': return Bell;
      default: return Megaphone;
    }
  };

  // Load announcements when tab is active
  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements();
      fetchAnnouncementStats();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-orange-600' },
    { label: 'Total Enrollments', value: enrollments.length, icon: UserCheck, color: 'text-emerald-600' },
    { label: 'Pending Enrollments', value: enrollments.filter((e: any) => e.status === 'pending').length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Approved Enrollments', value: enrollments.filter((e: any) => e.status === 'approved').length, icon: CheckCircle, color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-serif font-bold text-emerald-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {state.admin?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: 'overview', label: 'Overview', icon: BookOpen },
                { key: 'courses', label: 'Manage Courses', icon: BookOpen },
                { key: 'enrollments', label: 'Enrollments', icon: UserCheck },
                { key: 'demo-requests', label: 'Demo Requests', icon: Video },
                { key: 'announcements', label: 'Announcements', icon: Megaphone },
                { key: 'registrations', label: 'Old Registrations', icon: Users },
                { key: 'assessments', label: 'Assessments', icon: CheckCircle },
                { key: 'curriculum', label: 'Curriculum', icon: Edit }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Registrations */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
                <div className="space-y-3">
                  {registrations.slice(0, 5).map((registration: any) => (
                    <div key={registration._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{registration.studentName}</p>
                        <p className="text-sm text-gray-600">{registration.courseId?.title}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        registration.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        registration.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {registration.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Manage Courses</h2>
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Course</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: any) => (
                  <div key={course._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{course.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">₹{course.price}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Registrations</h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((registration: any) => (
                      <tr key={registration._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{registration.studentName}</p>
                            <p className="text-sm text-gray-500">{registration.education}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{registration.courseId?.title}</p>
                            <p className="text-sm text-gray-500">{registration.preferredSlot}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{registration.email}</p>
                            <p className="text-sm text-gray-500">{registration.phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            registration.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            registration.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateRegistrationStatus(registration._id, 'Approved')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateRegistrationStatus(registration._id, 'Rejected')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Enrollments Tab */}
          {activeTab === 'enrollments' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Student Enrollments</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Pending: {enrollments.filter((e: any) => e.status === 'pending').length}</span>
                </div>
              </div>
              
              {enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrollment Requests</h3>
                  <p className="text-gray-600">Students haven't enrolled in any courses yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {enrollments.map((enrollment: any) => (
                        <tr key={enrollment._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-gray-900">{enrollment.studentId?.studentName}</p>
                              <p className="text-sm text-gray-500">{enrollment.studentId?.email}</p>
                              <p className="text-sm text-gray-500">{enrollment.studentId?.phone}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-gray-900">{enrollment.courseId?.title}</p>
                              <p className="text-sm text-gray-500">{enrollment.courseId?.instructor}</p>
                              <p className="text-sm text-gray-500">{enrollment.courseId?.duration}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-lg font-semibold text-orange-600">
                              ₹{enrollment.courseId?.price?.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              enrollment.status === 'approved' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              enrollment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                            </span>
                            {enrollment.paymentStatus && (
                              <div className="mt-1">
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  enrollment.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  Payment: {enrollment.paymentStatus}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(enrollment.requestedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {enrollment.status === 'pending' ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEnrollmentAction(enrollment._id, 'approve', true, enrollment.courseId?.price)}
                                  disabled={enrollmentLoading}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                                  title="Approve (Mark as Paid)"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEnrollmentAction(enrollment._id, 'reject')}
                                  disabled={enrollmentLoading}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                  title="Reject"
                                >
                                  <UserX className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                {enrollment.approvedBy && (
                                  <span>By: {enrollment.approvedBy.username}</span>
                                )}
                                {enrollment.approvedAt && (
                                  <span>{new Date(enrollment.approvedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Demo Requests Tab */}
          {activeTab === 'demo-requests' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Demo Requests</h2>
                  <p className="text-gray-600">Manage student demo session requests</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Video className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Requests</p>
                      <p className="text-2xl font-bold text-blue-900">{demoStats.total}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-900">{demoStats.pending}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Scheduled</p>
                      <p className="text-2xl font-bold text-blue-900">{demoStats.scheduled}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Completed</p>
                      <p className="text-2xl font-bold text-green-900">{demoStats.completed}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <X className="w-8 h-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-red-600">Cancelled</p>
                      <p className="text-2xl font-bold text-red-900">{demoStats.cancelled}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Requests List */}
              {demoRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Demo Requests</h3>
                  <p className="text-gray-600">Students haven't requested any demos yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Interest</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {demoRequests.map((request: any) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{request.name}</div>
                              <div className="text-sm text-gray-500">{request.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.phone}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.course || 'Not specified'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.preferredTime || 'Flexible'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(request.createdAt)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {request.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    const scheduledDate = prompt('Enter scheduled date and time (e.g., 2024-01-15T14:00):');
                                    if (scheduledDate) {
                                      updateDemoRequestStatus(request._id, 'scheduled', scheduledDate);
                                    }
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Schedule Demo"
                                >
                                  <Calendar className="w-4 h-4" />
                                </button>
                              )}
                              {request.status === 'scheduled' && (
                                <button
                                  onClick={() => updateDemoRequestStatus(request._id, 'completed')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Mark as Completed"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedDemoRequest(request);
                                  setShowDemoDetails(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteDemoRequest(request._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Demo Details Modal */}
              {showDemoDetails && selectedDemoRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Demo Request Details</h3>
                        <button
                          onClick={() => setShowDemoDetails(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedDemoRequest.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedDemoRequest.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedDemoRequest.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Course Interest</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedDemoRequest.course || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedDemoRequest.preferredTime || 'Flexible'}</p>
                        </div>
                        {selectedDemoRequest.message && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedDemoRequest.message}</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDemoRequest.status)}`}>
                            {selectedDemoRequest.status}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Requested At</label>
                          <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDemoRequest.createdAt)}</p>
                        </div>
                        {selectedDemoRequest.scheduledDate && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                            <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDemoRequest.scheduledDate)}</p>
                          </div>
                        )}
                        {selectedDemoRequest.notes && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedDemoRequest.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button
                          onClick={() => setShowDemoDetails(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Close
                        </button>
                        {selectedDemoRequest.status === 'pending' && (
                          <button
                            onClick={() => {
                              const scheduledDate = prompt('Enter scheduled date and time (e.g., 2024-01-15T14:00):');
                              if (scheduledDate) {
                                updateDemoRequestStatus(selectedDemoRequest._id, 'scheduled', scheduledDate);
                                setShowDemoDetails(false);
                              }
                            }}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Schedule Demo
                          </button>
                        )}
                        {selectedDemoRequest.status === 'scheduled' && (
                          <button
                            onClick={() => {
                              updateDemoRequestStatus(selectedDemoRequest._id, 'completed');
                              setShowDemoDetails(false);
                            }}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Announcements</h2>
                  <p className="text-gray-600">Create and manage school announcements</p>
                </div>
                <button
                  onClick={() => setShowAnnouncementForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Announcement</span>
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Total Announcements</p>
                      <p className="text-2xl font-bold text-blue-900">{announcementStats.totalAnnouncements}</p>
                    </div>
                    <Megaphone className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600">Urgent Announcements</p>
                      <p className="text-2xl font-bold text-red-900">{announcementStats.urgentAnnouncements}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Total Views</p>
                      <p className="text-2xl font-bold text-green-900">{announcementStats.totalViews}</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600">Read Rate</p>
                      <p className="text-2xl font-bold text-purple-900">{announcementStats.readRate}%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Announcements List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">All Announcements</h3>
                </div>
                {announcements.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {announcements.map((announcement: any) => {
                      const TypeIcon = getTypeIcon(announcement.type);
                      return (
                        <div key={announcement._id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <TypeIcon className="w-5 h-5 text-gray-600" />
                                <h4 className="text-lg font-medium text-gray-900">{announcement.title}</h4>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                                  {announcement.priority}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                  {announcement.type}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Target: {announcement.targetAudience}</span>
                                <span>Views: {announcement.stats.totalViews}</span>
                                <span>Reads: {announcement.stats.totalReads}</span>
                                <span>Published: {new Date(announcement.publishedAt).toLocaleDateString()}</span>
                                {announcement.expiresAt && (
                                  <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleEditAnnouncement(announcement)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAnnouncement(announcement._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                    <p className="text-gray-600 mb-4">Create your first announcement to notify students</p>
                    <button
                      onClick={() => setShowAnnouncementForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Announcement
                    </button>
                  </div>
                )}
              </div>

              {/* Announcement Form Modal */}
              {showAnnouncementForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">
                        {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowAnnouncementForm(false);
                          setEditingAnnouncement(null);
                          setAnnouncementForm({
                            title: '',
                            content: '',
                            type: 'general',
                            priority: 'normal',
                            targetAudience: 'all',
                            courseId: '',
                            expiresAt: ''
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <form onSubmit={handleAnnouncementSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={announcementForm.title}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                          <select
                            value={announcementForm.type}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="general">General</option>
                            <option value="urgent">Urgent</option>
                            <option value="academic">Academic</option>
                            <option value="event">Event</option>
                            <option value="system">System</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                          <select
                            value={announcementForm.priority}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                          <select
                            value={announcementForm.targetAudience}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, targetAudience: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          >
                            <option value="all">All Users</option>
                            <option value="students">All Students</option>
                            <option value="enrolled">Enrolled Students Only</option>
                          </select>
                        </div>
                        
                        {announcementForm.targetAudience === 'enrolled' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                            <select
                              value={announcementForm.courseId}
                              onChange={(e) => setAnnouncementForm({ ...announcementForm, courseId: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              required
                            >
                              <option value="">Select Course</option>
                              {courses.map((course: any) => (
                                <option key={course._id} value={course._id}>
                                  {course.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expires At (Optional)</label>
                          <input
                            type="datetime-local"
                            value={announcementForm.expiresAt}
                            onChange={(e) => setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <textarea
                          value={announcementForm.content}
                          onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          rows={6}
                          required
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAnnouncementForm(false);
                            setEditingAnnouncement(null);
                          }}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Assessment Management</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCourseForAssessment?._id || ''}
                    onChange={(e) => {
                      const course = courses.find(c => c._id === e.target.value);
                      setSelectedCourseForAssessment(course || null);
                      if (course) fetchAssessments(course._id);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                  {selectedCourseForAssessment && (
                    <button
                      onClick={() => setShowAssessmentForm(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Assessment</span>
                    </button>
                  )}
                </div>
              </div>

              {!selectedCourseForAssessment ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                  <p className="text-gray-600">Choose a course to manage its assessments and quizzes.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Course: {selectedCourseForAssessment.title}</h3>
                    <p className="text-gray-600 text-sm">{selectedCourseForAssessment.description}</p>
                  </div>

                  {assessments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessments Yet</h3>
                      <p className="text-gray-600 mb-4">Create quizzes and assignments for this course.</p>
                      <button
                        onClick={() => setShowAssessmentForm(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Create First Assessment
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {assessments.map((assessment) => (
                        <div key={assessment._id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{assessment.title}</h4>
                              <p className="text-gray-600 text-sm">{assessment.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Type: {assessment.type}</span>
                                <span>Time: {assessment.timeLimit} mins</span>
                                <span>Total: {assessment.totalMarks} marks</span>
                                <span>Pass: {assessment.passingMarks} marks</span>
                                <span>Questions: {assessment.questions?.length || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingAssessment(assessment);
                                  setAssessmentForm(assessment);
                                  setShowAssessmentForm(true);
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {assessment.questions && assessment.questions.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-700 mb-2">Questions Preview:</h5>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {assessment.questions.slice(0, 3).map((question, index) => (
                                  <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                                    <p className="font-medium">{index + 1}. {question.question}</p>
                                    <p className="text-gray-600 text-xs">Marks: {question.marks}</p>
                                  </div>
                                ))}
                                {assessment.questions.length > 3 && (
                                  <p className="text-sm text-gray-500 text-center">
                                    +{assessment.questions.length - 3} more questions
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Curriculum Management</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCourseForCurriculum?._id || ''}
                    onChange={(e) => {
                      const course = courses.find(c => c._id === e.target.value);
                      setSelectedCourseForCurriculum(course || null);
                      if (course) fetchCurriculum(course._id);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                  {selectedCourseForCurriculum && (
                    <button
                      onClick={() => setShowModuleForm(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Module</span>
                    </button>
                  )}
                </div>
              </div>

              {!selectedCourseForCurriculum ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                  <p className="text-gray-600">Choose a course to manage its curriculum and modules.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Course: {selectedCourseForCurriculum.title}</h3>
                    <p className="text-gray-600 text-sm">{selectedCourseForCurriculum.description}</p>
                  </div>

                  {curriculumData.length === 0 ? (
                    <div className="text-center py-8">
                      <Edit className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Yet</h3>
                      <p className="text-gray-600 mb-4">Start building your course curriculum by adding modules.</p>
                      <button
                        onClick={() => setShowModuleForm(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Add First Module
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {curriculumData.map((module, index) => (
                        <div key={module._id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                Module {module.order}: {module.title}
                              </h4>
                              <p className="text-gray-600 text-sm">{module.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setLectureForm(prev => ({ ...prev, moduleId: module._id }));
                                  setShowLectureForm(true);
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                              >
                                Add Lecture
                              </button>
                              <button
                                onClick={() => {
                                  setEditingModule(module);
                                  setModuleForm(module);
                                  setShowModuleForm(true);
                                }}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {module.lectures && module.lectures.length > 0 && (
                            <div className="ml-4 space-y-2">
                              <h5 className="font-medium text-gray-700 mb-2">Lectures:</h5>
                              {module.lectures.map((lecture, lectureIndex) => (
                                <div key={lecture._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{lecture.order}. {lecture.title}</p>
                                    <p className="text-sm text-gray-600">{lecture.description}</p>
                                    {lecture.videoUrl && (
                                      <a
                                        href={lecture.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                                      >
                                        <span>🎥 Video Link</span>
                                      </a>
                                    )}
                                    {lecture.duration && (
                                      <p className="text-xs text-gray-500">Duration: {lecture.duration}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Course Form Modal */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-serif font-bold text-emerald-900">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCourseForm(false);
                      setEditingCourse(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={courseForm.category}
                        onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Machine Learning">Machine Learning</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                        required
                        placeholder="e.g., 4 weeks"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode *</label>
                      <select
                        value={courseForm.mode}
                        onChange={(e) => setCourseForm({...courseForm, mode: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                      <select
                        value={courseForm.level}
                        onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructor *</label>
                      <input
                        type="text"
                        value={courseForm.instructor}
                        onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({...courseForm, price: parseInt(e.target.value) || 0})}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                    <input
                      type="url"
                      value={courseForm.image}
                      onChange={(e) => setCourseForm({...courseForm, image: e.target.value})}
                      required
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                    >
                      {editingCourse ? 'Update Course' : 'Create Course'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCourseForm(false);
                        setEditingCourse(null);
                      }}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Module Form Modal */}
        {showModuleForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingModule ? 'Edit Module' : 'Add New Module'}
                </h3>
                <form onSubmit={handleModuleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Module Title *</label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Introduction to React"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Describe what students will learn in this module"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Module Order</label>
                    <input
                      type="number"
                      value={moduleForm.order}
                      onChange={(e) => setModuleForm({...moduleForm, order: parseInt(e.target.value)})}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {editingModule ? 'Update Module' : 'Create Module'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowModuleForm(false);
                        setEditingModule(null);
                        setModuleForm({ title: '', description: '', order: 1, lectures: [] });
                      }}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lecture Form Modal */}
        {showLectureForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Lecture</h3>
                <form onSubmit={handleLectureSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Title *</label>
                    <input
                      type="text"
                      value={lectureForm.title}
                      onChange={(e) => setLectureForm({...lectureForm, title: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="What is React?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={lectureForm.description}
                      onChange={(e) => setLectureForm({...lectureForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Describe the content of this lecture"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                    <input
                      type="url"
                      value={lectureForm.videoUrl}
                      onChange={(e) => setLectureForm({...lectureForm, videoUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={lectureForm.duration}
                      onChange={(e) => setLectureForm({...lectureForm, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="45 minutes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Order</label>
                    <input
                      type="number"
                      value={lectureForm.order}
                      onChange={(e) => setLectureForm({...lectureForm, order: parseInt(e.target.value)})}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Lecture
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLectureForm(false);
                        setLectureForm({ title: '', description: '', videoUrl: '', duration: '', order: 1, moduleId: '' });
                      }}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Form Modal */}
        {showAssessmentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
                </h3>
                <form onSubmit={handleAssessmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Title *</label>
                      <input
                        type="text"
                        value={assessmentForm.title}
                        onChange={(e) => setAssessmentForm({...assessmentForm, title: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="React Basics Quiz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={assessmentForm.type}
                        onChange={(e) => setAssessmentForm({...assessmentForm, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                        <option value="exam">Exam</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={assessmentForm.description}
                      onChange={(e) => setAssessmentForm({...assessmentForm, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Describe the assessment objectives"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                      <input
                        type="number"
                        value={assessmentForm.timeLimit}
                        onChange={(e) => setAssessmentForm({...assessmentForm, timeLimit: parseInt(e.target.value)})}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                      <input
                        type="number"
                        value={assessmentForm.totalMarks}
                        onChange={(e) => setAssessmentForm({...assessmentForm, totalMarks: parseInt(e.target.value)})}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
                      <input
                        type="number"
                        value={assessmentForm.passingMarks}
                        onChange={(e) => setAssessmentForm({...assessmentForm, passingMarks: parseInt(e.target.value)})}
                        min="1"
                        max={assessmentForm.totalMarks}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Questions ({assessmentForm.questions.length})</h4>
                      <button
                        type="button"
                        onClick={() => setShowQuestionForm(true)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Add Question
                      </button>
                    </div>
                    
                    {assessmentForm.questions.length > 0 && (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {assessmentForm.questions.map((question, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{index + 1}. {question.question}</p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Type: {question.type} | Marks: {question.points || question.marks}
                                </p>
                                {question.type === 'multiple-choice' && question.options && (
                                  <div className="mt-2 text-xs text-gray-600">
                                    Options: {question.options
                                      .filter((opt: any) => opt && (typeof opt === 'string' ? opt.trim() : opt.text && opt.text.trim()))
                                      .map((opt: any) => typeof opt === 'string' ? opt : opt.text)
                                      .join(', ')}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setAssessmentForm(prev => ({
                                    ...prev,
                                    questions: prev.questions.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="text-red-600 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {editingAssessment ? 'Update Assessment' : 'Create Assessment'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAssessmentForm(false);
                        setEditingAssessment(null);
                        setAssessmentForm({ title: '', description: '', type: 'quiz', timeLimit: 30, totalMarks: 100, passingMarks: 60, questions: [] });
                      }}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Question Form Modal */}
        {showQuestionForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Question</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                    <textarea
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="What is React?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                    <select
                      value={questionForm.type}
                      onChange={(e) => setQuestionForm({...questionForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="short-answer">Short Answer</option>
                    </select>
                  </div>
                  
                  {questionForm.type === 'multiple-choice' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                      {questionForm.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={questionForm.correctAnswer === index}
                            onChange={() => setQuestionForm({...questionForm, correctAnswer: index})}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options];
                              newOptions[index] = e.target.value;
                              setQuestionForm({...questionForm, options: newOptions});
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                      <p className="text-xs text-gray-500">Select the radio button for the correct answer</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                    <input
                      type="number"
                      value={questionForm.marks}
                      onChange={(e) => setQuestionForm({...questionForm, marks: parseInt(e.target.value)})}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                    <textarea
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({...questionForm, explanation: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Explain the correct answer"
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={addQuestionToAssessment}
                      disabled={!questionForm.question.trim()}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Add Question
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setQuestionForm({
                          question: '',
                          type: 'multiple-choice',
                          options: ['', '', '', ''],
                          correctAnswer: 0,
                          marks: 5,
                          explanation: ''
                        });
                      }}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
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

export default AdminDashboard;