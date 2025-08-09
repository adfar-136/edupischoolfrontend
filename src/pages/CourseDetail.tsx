import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, BookOpen, CheckCircle, Calendar, Phone, Mail, MapPin as LocationIcon, UserPlus } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [curriculumOverview, setCurriculumOverview] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [userEnrollment, setUserEnrollment] = useState<any>(null);

  useEffect(() => {
    fetchCourse();
    fetchCurriculumOverview();
    fetchAssessments();
    checkStudentLogin();
  }, [id]);

  const checkStudentLogin = async () => {
    const token = localStorage.getItem('studentToken');
    const student = localStorage.getItem('studentData');
    if (token && student) {
      setIsLoggedIn(true);
      const studentInfo = JSON.parse(student);
      setStudentData(studentInfo);
      
      // Check if student is enrolled in this course
      try {
        const response = await fetch(`https://edupischoolbackend.onrender.com/api/enrollments/student/${studentInfo.id}`);
        if (response.ok) {
          const enrollments = await response.json();
          const courseEnrollment = enrollments.find((e: any) => e.courseId._id === id);
          setUserEnrollment(courseEnrollment);
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
      }
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/courses/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
    setLoading(false);
  };

  const fetchCurriculumOverview = async () => {
    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/curriculum/course/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCurriculumOverview(data);
      }
    } catch (error) {
      console.error('Error fetching curriculum:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/assessments/course/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleEnrollment = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setEnrollmentStatus('');

    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch('https://edupischoolbackend.onrender.com/api/enrollments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: studentData.id,
          courseId: id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEnrollmentStatus('success');
      } else {
        setEnrollmentStatus('error');
        console.error('Enrollment error:', data.message);
      }
    } catch (error) {
      setEnrollmentStatus('error');
      console.error('Error submitting enrollment:', error);
    }
    setEnrolling(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-full">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {course.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{course.mode}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{course.instructor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">{course.level}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-orange-600">
                  ₹{course.price?.toLocaleString()}
                </div>
                
                {userEnrollment && userEnrollment.status === 'approved' ? (
                  <button
                    onClick={() => navigate(`/courses/${id}/content`)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Access Course Content</span>
                  </button>
                ) : userEnrollment && userEnrollment.status === 'pending' ? (
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Enrollment pending approval</span>
                  </div>
                ) : enrollmentStatus === 'success' ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Enrollment request submitted!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleEnrollment}
                    disabled={enrolling}
                    className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enrolling...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>{isLoggedIn ? 'Enroll Now' : 'Login to Enroll'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {enrollmentStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Enrollment Request Submitted!</h4>
                  <p className="text-green-700 text-sm">
                    Your enrollment request has been submitted successfully. An admin will review and approve your request. 
                    You'll need to pay the course fee (₹{course.price?.toLocaleString()}) offline for approval.
                  </p>
                </div>
              )}
              
              {enrollmentStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Enrollment Failed</h4>
                  <p className="text-red-700 text-sm">
                    There was an error submitting your enrollment request. You may have already enrolled in this course or there might be other restrictions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Curriculum Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6">Course Curriculum</h2>
          
          {curriculumOverview.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Curriculum Coming Soon</h3>
              <p className="text-gray-600">The detailed curriculum for this course is being prepared.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {curriculumOverview.map((module: any, index: number) => (
                <div key={module._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {module.order}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>
                  </div>
                  
                  {module.lectures && module.lectures.length > 0 && (
                    <div className="ml-11">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Lectures ({module.lectures.length})</h4>
                      <div className="space-y-2">
                        {module.lectures.map((lecture: any, lectureIndex: number) => (
                          <div key={lecture._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {lecture.order}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">{lecture.title}</p>
                              <p className="text-gray-600 text-xs">{lecture.description}</p>
                              {lecture.duration && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{lecture.duration}</span>
                                </div>
                              )}
                            </div>
                            {!isLoggedIn && (
                              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                🔒 Enroll to access
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Assessments Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6">Assessments & Quizzes</h2>
          
          {assessments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessments Yet</h3>
              <p className="text-gray-600">Assessments and quizzes will be added as the course develops.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.map((assessment: any) => (
                <div key={assessment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      assessment.type === 'quiz' ? 'bg-blue-100 text-blue-800' :
                      assessment.type === 'exam' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {assessment.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{assessment.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{assessment.totalMarks} marks</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{assessment.questions?.length || 0} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Pass: {assessment.passingMarks} marks</span>
                    </div>
                  </div>
                  
                  {!isLoggedIn && (
                    <div className="mt-4 text-center text-xs text-gray-500 bg-gray-50 py-2 rounded">
                      🔒 Enroll to take assessments
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default CourseDetail;