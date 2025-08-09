import React from 'react';
import { BookOpen, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-serif font-bold">Edupi School</span>
                <p className="text-sm text-orange-200 -mt-1">Learn. Build. Grow.</p>
              </div>
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed mb-4">
              Empowering Kashmir's youth with quality education in technology, science, and innovation. 
              Building tomorrow's leaders through comprehensive learning programs that blend tradition with modernity.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-emerald-300 hover:text-orange-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-emerald-300 hover:text-orange-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-emerald-300 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-200">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/courses" className="text-emerald-100 hover:text-orange-300 transition-colors">All Courses</a></li>
              <li><a href="/about" className="text-emerald-100 hover:text-orange-300 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-emerald-100 hover:text-orange-300 transition-colors">Contact</a></li>
              <li><a href="#" className="text-emerald-100 hover:text-orange-300 transition-colors">Student Portal</a></li>
                              <li><a href="/login" className="text-emerald-100 hover:text-orange-300 transition-colors">Login</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-200">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span className="text-emerald-100">Jammu and Kashmir, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-emerald-100">7006525041</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="text-emerald-100">edupischool@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-emerald-200 text-sm">
              © 2025 Edupi School. Empowering students in Jammu and Kashmir with quality education.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-emerald-200 hover:text-orange-300 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-emerald-200 hover:text-orange-300 text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;