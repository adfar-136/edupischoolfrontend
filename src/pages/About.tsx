import React from 'react';
import { Target, Users, Award, Heart, Mountain, BookOpen, Star, Compass } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Student Dashboard Experience',
      description: 'Enrolled students get access to a dedicated dashboard to track courses, view recordings, access assessments, attempt quizzes, and check marks in real time.'
    },
    {
      icon: Users,
      title: 'Free Learning Access',
      description: 'Students not enrolled in any course have access to two free courses with open reading content to help them start their learning journey.'
    },
    {
      icon: Award,
      title: 'Live & Recorded Sessions',
      description: 'We offer a variety of courses with live classes, recorded sessions, assessments, and interactive quizzes for comprehensive learning.'
    },
    {
      icon: Heart,
      title: 'Traditional Values + Modern Methods',
      description: 'Combining traditional teaching values with modern digital learning methods to ensure the best educational experience for our students.'
    }
  ];

  const team = [
    {
      name: 'Adfar Rasheed',
      role: 'Senior Educator & Technology Expert',
      description: 'Experienced educator specializing in technology and computer science, passionate about making complex technical concepts accessible to students.',
      image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Mustansir Nisar',
      role: 'Science & Mathematics Instructor',
      description: 'Dedicated teacher with expertise in science and mathematics, focused on building strong foundational knowledge in students.',
      image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Shahid ul Islam',
      role: 'Academic Coordinator',
      description: 'Experienced academic coordinator ensuring quality education delivery and student progress tracking across all courses.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Roohul ul Amin',
      role: 'Learning Specialist',
      description: 'Learning specialist focused on innovative teaching methodologies and personalized learning approaches for student success.',
      image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-800 to-orange-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20">
          <Mountain className="absolute top-10 right-10 w-32 h-32 opacity-10" />
          <Compass className="absolute bottom-10 left-10 w-24 h-24 opacity-10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 rounded-full text-orange-200 text-sm mb-6">
              <Star className="w-4 h-4 mr-2" />
              Empowering Students in Jammu and Kashmir
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6">
              About Edupi School
            </h1>
            
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
              A modern learning platform designed to make high-quality education accessible to students in Jammu and Kashmir and beyond. 
              Combining traditional teaching values with modern digital learning methods.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our mission is to combine traditional teaching values with modern digital learning methods, 
                ensuring every student gets the best opportunity to grow academically and professionally.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We offer a variety of courses in technology, sciences, and skills development, along with 
                live classes, recorded sessions, assessments, and interactive quizzes to enhance learning.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                To become the leading educational platform in Jammu and Kashmir, providing students with 
                a dedicated dashboard to track progress, access content, and achieve academic excellence.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We envision students having complete control over their learning journey with access to 
                recorded lectures, course materials, assessments, quizzes, marks, and real-time feedback. 
                as a hub of technological innovation and educational excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Edupi School
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate educators and industry experts dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-orange-50 to-emerald-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-emerald-100">Students Enrolled</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-emerald-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-emerald-100">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-emerald-100">Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Take the first step towards transforming your future. Explore our courses and begin your journey with Edupi School today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-lg font-semibold"
            >
              View Courses
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-lg font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;