import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  ArrowLeft, 
  BookOpen, 
  User, 
  Lock,
  Award,
  Target,
  Download
} from 'lucide-react';
import QuizAttempt from '../components/QuizAttempt';
import QuizResults from '../components/QuizResults';

const CourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    checkStudentAccess();
  }, [id]);

  const checkStudentAccess = async () => {
    const token = localStorage.getItem('studentToken');
    const student = localStorage.getItem('studentData');
    
    if (!token || !student) {
      navigate('/login');
      return;
    }

    const studentInfo = JSON.parse(student);
    setStudentData(studentInfo);

    try {
      // Check if student is enrolled and approved
      const enrollmentResponse = await fetch(
        `https://edupischoolbackend.onrender.com/api/enrollments/student/${studentInfo.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (enrollmentResponse.ok) {
        const enrollments = await enrollmentResponse.json();
        const courseEnrollment = enrollments.find((e: any) => 
          e.courseId._id === id && e.status === 'approved'
        );

        if (!courseEnrollment) {
          navigate(`/courses/${id}`);
          return;
        }

        setEnrollment(courseEnrollment);
        await Promise.all([
          fetchCourse(),
          fetchCurriculum(),
          fetchAssessments(),
          fetchProgress()
        ]);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      navigate(`/courses/${id}`);
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
  };

  const fetchCurriculum = async () => {
    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/curriculum/course/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCurriculum(data);
        // Auto-select first lecture
        if (data.length > 0 && data[0].lectures && data[0].lectures.length > 0) {
          setSelectedLecture(data[0].lectures[0]);
        }
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
    setLoading(false);
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/progress/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const markLectureComplete = async (lectureId: string) => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/progress/lecture/${lectureId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: id,
          watchTime: 0 // You could track actual watch time
        })
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setProgress(updatedProgress);
        // Update the enrollment in parent if needed
      }
    } catch (error) {
      console.error('Error marking lecture complete:', error);
    }
  };

  const isLectureCompleted = (lectureId: string) => {
    if (!progress || !progress.lectureProgress) return false;
    const lectureProgress = progress.lectureProgress.find((lp: any) => lp.lectureId === lectureId);
    return lectureProgress?.completed || false;
  };

  const startQuiz = (assessment: any) => {
    setSelectedAssessment(assessment);
    setShowQuiz(true);
  };

  const handleQuizComplete = (result: any) => {
    setQuizResult(result);
    setShowQuiz(false);
    setShowResults(true);
    // Refresh progress
    fetchProgress();
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setShowQuiz(true);
  };

  const handleBackToCourse = () => {
    setShowQuiz(false);
    setShowResults(false);
    setSelectedAssessment(null);
    setQuizResult(null);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url; // Return original URL if not YouTube
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need to be enrolled and approved to access this content.</p>
          <button
            onClick={() => navigate(`/courses/${id}`)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // Show quiz attempt
  if (showQuiz && selectedAssessment) {
    return (
      <QuizAttempt
        assessment={selectedAssessment}
        courseId={id!}
        onComplete={handleQuizComplete}
        onCancel={handleBackToCourse}
      />
    );
  }

  // Show quiz results
  if (showResults && quizResult && selectedAssessment) {
    return (
      <QuizResults
        result={quizResult}
        assessmentTitle={selectedAssessment.title}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToCourse={handleBackToCourse}
        allowRetake={!quizResult.passed}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/student/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: {enrollment.progress?.overallProgress || 0}%
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progress?.overallProgress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Curriculum Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>
              
              <div className="space-y-4">
                {curriculum.map((module: any, moduleIndex) => (
                  <div key={module._id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setActiveModule(moduleIndex)}
                      className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg transition-colors ${
                        activeModule === moduleIndex ? 'bg-emerald-50 border-emerald-200' : ''
                      }`}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Module {module.order}: {module.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {module.lectures?.length || 0} lectures
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {/* Progress indicator */}
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      </div>
                    </button>
                    
                    {activeModule === moduleIndex && module.lectures && (
                      <div className="border-t border-gray-200 p-2">
                        {module.lectures.map((lecture: any) => (
                          <button
                            key={lecture._id}
                            onClick={() => setSelectedLecture(lecture)}
                            className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors ${
                              selectedLecture?._id === lecture._id ? 'bg-blue-50 border border-blue-200' : ''
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {lecture.videoUrl ? (
                                <Play className="w-4 h-4 text-blue-600" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {lecture.order}. {lecture.title}
                              </p>
                              {lecture.duration && (
                                <p className="text-xs text-gray-500">{lecture.duration}</p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {/* Completion status */}
                              {isLectureCompleted(lecture._id) ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Assessments Section */}
              {assessments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessments</h3>
                  <div className="space-y-2">
                    {assessments.map((assessment: any) => (
                      <div key={assessment._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{assessment.title}</p>
                          <p className="text-xs text-gray-600">{assessment.type} • {assessment.questions?.length || 0} questions</p>
                        </div>
                        <button 
                          onClick={() => startQuiz(assessment)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Take Quiz
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedLecture ? (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedLecture.title}</h1>
                  <p className="text-gray-600">{selectedLecture.description}</p>
                  {selectedLecture.duration && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{selectedLecture.duration}</span>
                    </div>
                  )}
                </div>

                {/* Video Player */}
                {selectedLecture.videoUrl && (
                  <div className="mb-8">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedLecture.videoUrl)}
                        title={selectedLecture.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Lecture Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => markLectureComplete(selectedLecture._id)}
                    disabled={isLectureCompleted(selectedLecture._id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isLectureCompleted(selectedLecture._id)
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isLectureCompleted(selectedLecture._id) ? 'Completed' : 'Mark as Complete'}</span>
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    {selectedLecture.downloadUrl && (
                      <a
                        href={selectedLecture.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Resources</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {course.title}</h2>
                <p className="text-gray-600 mb-6">Select a lecture from the sidebar to get started with your learning journey.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Play className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Video Lectures</h3>
                    <p className="text-sm text-gray-600">Watch high-quality video content</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Assessments</h3>
                    <p className="text-sm text-gray-600">Test your knowledge with quizzes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Track Progress</h3>
                    <p className="text-sm text-gray-600">Monitor your learning progress</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;