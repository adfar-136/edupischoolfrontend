import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StudentLogin from './pages/StudentLogin';
import CourseContent from './pages/CourseContent';
import StudentDashboard from './pages/StudentDashboard';
import Forums from './pages/Forums';
import ForumDetail from './pages/ForumDetail';
import TopicDetail from './pages/TopicDetail';
import Announcements from './pages/Announcements';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <SocketProvider>
          <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50">
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/courses/:id/content" element={<CourseContent />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/forums/:forumId" element={<ForumDetail />} />
            <Route path="/forums/topics/:topicId" element={<TopicDetail />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/:id" element={<Announcements />} />
          </Routes>
          <Footer />
        </div>
        </SocketProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;