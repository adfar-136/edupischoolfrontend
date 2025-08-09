import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Clock, Pin, Lock, Plus, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Forum {
  _id: string;
  name: string;
  description: string;
  category: string;
  courseId?: {
    _id: string;
    title: string;
  };
  topicsCount: number;
  repliesCount: number;
  lastActivity: string;
  createdBy: {
    username?: string;
    studentName?: string;
    email: string;
  };
}

const Forums = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({
    name: '',
    description: '',
    category: 'general'
  });
  const { state } = useAuth();

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await fetch('https://edupischoolbackend.onrender.com/api/forums');
      if (response.ok) {
        const data = await response.json();
        setForums(data);
      }
    } catch (error) {
      console.error('Error fetching forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.isAuthenticated || state.userType !== 'admin') return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://edupischoolbackend.onrender.com/api/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newForum)
      });

      if (response.ok) {
        const createdForum = await response.json();
        setForums([...forums, createdForum]);
        setNewForum({ name: '', description: '', category: 'general' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcements':
        return '📢';
      case 'academics':
        return '📚';
      case 'technical':
        return '💻';
      case 'course-specific':
        return '🎓';
      default:
        return '💬';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcements':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'academics':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'technical':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'course-specific':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Discussion Forums</h1>
            <p className="text-gray-600">Connect with fellow students and teachers</p>
          </div>
          
          {state.isAuthenticated && state.userType === 'admin' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Forum
            </button>
          )}
        </div>

        {/* Create Forum Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Create New Forum</h3>
              <form onSubmit={handleCreateForum}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forum Name
                  </label>
                  <input
                    type="text"
                    value={newForum.name}
                    onChange={(e) => setNewForum({ ...newForum, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newForum.description}
                    onChange={(e) => setNewForum({ ...newForum, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newForum.category}
                    onChange={(e) => setNewForum({ ...newForum, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="general">General Discussion</option>
                    <option value="academics">Academic Help</option>
                    <option value="technical">Technical Support</option>
                    <option value="announcements">Announcements</option>
                    <option value="course-specific">Course Specific</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Create Forum
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Forums List */}
        <div className="space-y-6">
          {['announcements', 'academics', 'technical', 'general', 'course-specific'].map(category => {
            const categoryForums = forums.filter(forum => forum.category === category);
            if (categoryForums.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {category.replace('-', ' ')}
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {categoryForums.map(forum => (
                    <Link
                      key={forum._id}
                      to={`/forums/${forum._id}`}
                      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900 mr-3">{forum.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(forum.category)}`}>
                              {forum.category}
                            </span>
                            {forum.courseId && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Tag className="w-3 h-3 mr-1" />
                                {forum.courseId.title}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{forum.description}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {forum.topicsCount} topics
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {forum.repliesCount} replies
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatLastActivity(forum.lastActivity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {forums.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forums yet</h3>
            <p className="text-gray-600">Be the first to create a discussion forum!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forums;