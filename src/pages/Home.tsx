import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, BookOpen, Users, Award, Target, ChevronRight, Star, Mountain, Waves,
  Bell, MessageSquare, Video, Shield, CheckCircle, Trophy,
  Zap, Globe, Gift, Timer, Code
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [liveStats, setLiveStats] = useState({
    students: 0,
    completedCourses: 0,
    satisfaction: 0
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 30
  });
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    preferredTime: '',
    message: ''
  });

  useEffect(() => {
    fetchCourses();
    animateStats();
    startCountdown();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.courses.list);
      if (response.ok) {
        const data = await response.json();
        setCourses(data.slice(0, 3)); // Show only 3 courses
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Animate statistics counters
  const animateStats = () => {
    const targets = { students: 147, completedCourses: 89, satisfaction: 96 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;

    Object.keys(targets).forEach(key => {
      const target = targets[key as keyof typeof targets];
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setLiveStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, stepTime);
    });
  };

  // Countdown timer for limited offer
  const startCountdown = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  // Handle demo form submission
  const handleDemoFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.demoRequests.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoForm)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Thank you! We will contact you soon to schedule your demo.');
        setShowDemoForm(false);
        setDemoForm({
          name: '',
          email: '',
          phone: '',
          course: '',
          preferredTime: '',
          message: ''
        });
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting demo form:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleDemoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDemoForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Faculty data
  const facultyHighlights = [
    {
      name: "Adfar Rasheed",
      role: "Lead Full Stack Developer",
      experience: "8+ years",
      image: "/api/placeholder/120/120",
      expertise: ["React", "Node.js", "MongoDB", "DevOps"],
      achievement: "Ex-Microsoft Engineer",
      students: "200+ students trained"
    },
    {
      name: "Mustansir Nisar",
      role: "Senior Frontend Developer",
      experience: "6+ years", 
      image: "/api/placeholder/120/120",
      expertise: ["React", "Vue.js", "TypeScript", "UI/UX"],
      achievement: "Google Certified",
      students: "150+ students mentored"
    },
    {
      name: "Shahid ul Islam",
      role: "Backend Specialist",
      experience: "7+ years",
      image: "/api/placeholder/120/120", 
      expertise: ["Python", "Django", "PostgreSQL", "AWS"],
      achievement: "AWS Solutions Architect",
      students: "180+ students guided"
    }
  ];

  // Interactive features
  const platformFeatures = [
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Get instant updates on assignments, announcements, and course progress",
      color: "bg-blue-500",
      demo: "Live notifications system"
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Connect with peers, ask questions, and collaborate on projects",
      color: "bg-green-500", 
      demo: "Active community of 500+ students"
    },
    {
      icon: Video,
      title: "Live & Recorded Classes",
      description: "Attend live sessions or watch recordings at your convenience",
      color: "bg-purple-500",
      demo: "HD quality streaming"
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achievements",
      color: "bg-orange-500",
      demo: "Smart progress insights"
    },
    {
      icon: Code,
      title: "Interactive Coding",
      description: "Practice coding directly in the browser with instant feedback",
      color: "bg-red-500",
      demo: "Built-in code editor"
    },
    {
      icon: Award,
      title: "Certification System",
      description: "Earn industry-recognized certificates upon course completion",
      color: "bg-indigo-500",
      demo: "Blockchain verified certificates"
    }
  ];

  // Badges and certifications
  const badges = [
    { name: "Industry Recognized", icon: Award, color: "text-yellow-600" },
    { name: "Government Approved", icon: Shield, color: "text-green-600" },
    { name: "ISO 9001:2015 Certified", icon: CheckCircle, color: "text-blue-600" },
    { name: "NASSCOM Partner", icon: Star, color: "text-purple-600" },
    { name: "Google for Education", icon: Globe, color: "text-red-600" },
    { name: "Microsoft Learn Partner", icon: Zap, color: "text-blue-500" }
  ];

  const stats = [
    { icon: BookOpen, label: 'Courses Offered', value: '6+', color: 'text-orange-600' },
    { icon: Users, label: 'Students Enrolled', value: '500+', color: 'text-emerald-600' },
    { icon: Award, label: 'Success Rate', value: '95%', color: 'text-orange-600' },
    { icon: Target, label: 'Placement Rate', value: '85%', color: 'text-emerald-600' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-orange-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20">
          <div className="absolute top-10 left-10 opacity-10">
            <Mountain className="w-32 h-32" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-10">
            <Waves className="w-24 h-24" />
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 bg-orange-500/20 rounded-full text-orange-200 text-sm">
                <Star className="w-4 h-4 mr-2" />
                Quality Education in Jammu and Kashmir
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-tight">
                Empowering Students in
                <span className="text-orange-400"> Jammu and Kashmir</span>
                <br />with Quality Education
              </h1>
{/*               
              <p className="text-xl text-emerald-100 leading-relaxed">
                Join Edupi School today and take your first step towards success — online and offline learning 
                combined for your future. Experience modern education with traditional values.
              </p> */}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                  Explore Courses
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative w-full h-96 bg-gradient-to-br from-orange-400/20 to-emerald-500/20 rounded-2xl backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-24 h-24 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold mb-2">Learn. Build. Grow.</h3>
                  <p className="text-emerald-200">Modern learning platform for Jammu and Kashmir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-emerald-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-serif font-bold text-emerald-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular courses designed to build skills that matter in today's digital world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {courses.map((course: any) => (
              <div key={course._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{course.duration}</span>
                    <span className="text-sm font-medium text-emerald-600">{course.mode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-orange-600">
                      ₹{course.price}
                    </div>
                    <Link
                      to={`/course/${course._id}`}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors group"
                    >
                      View Details
                      <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/courses"
              className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-lg group"
            >
              View All Courses
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-6">
                Why Choose Edupi School?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Faculty</h3>
                    <p className="text-gray-600">Learn from industry experts and experienced educators who understand both technology and Kashmir's unique context.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Batch Size</h3>
                    <p className="text-gray-600">Personal attention with small batch sizes ensuring every student gets the support they need to succeed.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Practical Learning</h3>
                    <p className="text-gray-600">Hands-on projects and real-world applications that prepare you for actual industry challenges.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-emerald-100 to-orange-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Award className="w-32 h-32 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif font-bold text-emerald-900">Excellence in Education</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Time Offer Section */}
      <section className="py-12 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
              <Gift className="w-4 h-4 mr-2" />
              New Year Special Offer
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
              🎉 50% OFF on All Courses!
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Limited time offer! Start your learning journey with massive savings. 
              Don't miss this opportunity to transform your career.
            </p>
            
            {/* Countdown Timer */}
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                  <div className="text-2xl lg:text-3xl font-bold">{timeLeft.days}</div>
                  <div className="text-sm text-pink-200">Days</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                  <div className="text-2xl lg:text-3xl font-bold">{timeLeft.hours}</div>
                  <div className="text-sm text-pink-200">Hours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                  <div className="text-2xl lg:text-3xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-sm text-pink-200">Minutes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                  <div className="text-2xl lg:text-3xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-sm text-pink-200">Seconds</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold group"
              >
                Claim Your Discount
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors text-lg">
                <Timer className="mr-2 w-5 h-5" />
                Limited Time Only
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics Dashboard */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-4">
              Our Success in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time statistics that showcase our commitment to student success and educational excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{liveStats.students}+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
              <div className="text-sm text-green-600 mt-1">↗ Currently Enrolled</div>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{liveStats.completedCourses}+</div>
              <div className="text-gray-600 font-medium">Courses Completed</div>
              <div className="text-sm text-green-600 mt-1">↗ Successful Graduates</div>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-12 h-12 text-purple-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{liveStats.satisfaction}%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              <div className="text-sm text-purple-600 mt-1">↗ Student Feedback</div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-serif font-bold text-center mb-8 text-gray-900">
              📚 Recent Student Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
                <p className="mt-2 font-medium">Arjun M. completed JavaScript Fundamentals</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">1 day ago</span>
                </div>
                <p className="mt-2 font-medium">New student enrolled in React Course</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">2 days ago</span>
                </div>
                <p className="mt-2 font-medium">Sakshi R. achieved 98% in final assessment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Demo */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-4">
              Experience Our Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful tools and features that make learning engaging, interactive, and effective
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-green-700 font-medium">{feature.demo}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-sm text-emerald-600 font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Available in Platform
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to see it in action?</h3>
              <p className="text-gray-600 mb-6">Book a free demo session and explore all features</p>
              <button 
                onClick={() => setShowDemoForm(true)}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all"
              >
                Schedule Free Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Spotlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-4">
              Meet Our Expert Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from industry professionals and experienced educators who are passionate about your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facultyHighlights.map((faculty, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-blue-100 p-1">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {faculty.experience}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{faculty.name}</h3>
                  <p className="text-emerald-600 font-semibold mb-3">{faculty.role}</p>
                  <p className="text-orange-600 font-medium text-sm mb-4">{faculty.achievement}</p>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700 mb-3">Expertise:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {faculty.expertise.map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-6">
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{faculty.students}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center text-sm text-emerald-600 font-medium py-3">
                    <Star className="w-4 h-4 mr-2" />
                    Expert Instructor
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Badges & Certifications */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted & Certified
            </h2>
            <p className="text-xl text-gray-600">
              Our certifications and partnerships ensure quality education
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {badges.map((badge, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <badge.icon className={`w-12 h-12 ${badge.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">{badge.name}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Verified & Trusted by 500+ Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of students who are already transforming their careers with Edupi School. 
            Your success story starts here in the beautiful valleys of Kashmir.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold group"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Demo Registration Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Schedule Free Demo</h3>
                <button
                  onClick={() => setShowDemoForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleDemoFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={demoForm.name}
                    onChange={handleDemoFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={demoForm.email}
                    onChange={handleDemoFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={demoForm.phone}
                    onChange={handleDemoFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interested Course
                  </label>
                  <select
                    name="course"
                    value={demoForm.course}
                    onChange={handleDemoFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select a course</option>
                    <option value="web-development">Web Development</option>
                    <option value="react-masterclass">React Masterclass</option>
                    <option value="backend-development">Backend Development</option>
                    <option value="full-stack">Full Stack Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="mobile-development">Mobile Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time
                  </label>
                  <select
                    name="preferredTime"
                    value={demoForm.preferredTime}
                    onChange={handleDemoFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 8 PM)</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={demoForm.message}
                    onChange={handleDemoFormChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Any specific questions or requirements?"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDemoForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all"
                  >
                    Schedule Demo
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-emerald-600" />
                  <span>Your information is secure and will only be used to contact you about the demo.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;