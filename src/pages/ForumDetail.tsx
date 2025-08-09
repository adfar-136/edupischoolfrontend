import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Eye, Clock, Pin, Lock, Plus, User, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Topic {
  _id: string;
  title: string;
  content: string;
  authorId: {
    username?: string;
    studentName?: string;
    email: string;
  };
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
  viewsCount: number;
  repliesCount: number;
  lastReplyAt: string;
  lastReplyBy?: {
    authorName: string;
  };
  createdAt: string;
}

interface Forum {
  _id: string;
  name: string;
  description: string;
  category: string;
}

const ForumDetail = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const [forum, setForum] = useState<Forum | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const { state } = useAuth();

  useEffect(() => {
    if (forumId) {
      fetchForum();
      fetchTopics();
    }
  }, [forumId]);

  const fetchForum = async () => {
    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/forums/${forumId}`);
      if (response.ok) {
        const data = await response.json();
        setForum(data);
      }
    } catch (error) {
      console.error('Error fetching forum:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/forums/${forumId}/topics`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.isAuthenticated) return;

    try {
      const token = state.userType === 'admin' 
        ? localStorage.getItem('adminToken')
        : localStorage.getItem('studentToken');
      
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/forums/${forumId}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newTopic,
          tags: newTopic.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (response.ok) {
        const createdTopic = await response.json();
        setTopics([createdTopic, ...topics]);
        setNewTopic({ title: '', content: '', tags: '' });
        setShowCreateTopic(false);
      }
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  const formatTime = (dateString: string) => {
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

  const getAuthorName = (author: any) => {
    return author.username || author.studentName || 'Unknown User';
  };

  if (loading || !forum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/forums"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Forums
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2">{forum.name}</h1>
              <p className="text-gray-600">{forum.description}</p>
            </div>
            
            {state.isAuthenticated && (
              <button
                onClick={() => setShowCreateTopic(true)}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Topic
              </button>
            )}
          </div>
        </div>

        {/* Create Topic Modal */}
        {showCreateTopic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Create New Topic</h3>
              <form onSubmit={handleCreateTopic}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newTopic.content}
                    onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={6}
                    placeholder="Write your topic content here..."
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTopic.tags}
                    onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., homework, javascript, help"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Create Topic
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateTopic(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Topics List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {topics.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {topics.map((topic, index) => (
                <Link
                  key={topic._id}
                  to={`/forums/topics/${topic._id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {topic.isPinned && (
                          <Pin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        )}
                        {topic.isLocked && (
                          <Lock className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {topic.title}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {topic.content.substring(0, 150)}...
                      </p>
                      
                      {topic.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {topic.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>by {getAuthorName(topic.authorId)}</span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {topic.viewsCount}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {topic.repliesCount}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(topic.lastReplyAt)}
                          {topic.lastReplyBy && (
                            <span className="ml-1">by {topic.lastReplyBy.authorName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No topics yet</h3>
              <p className="text-gray-600 mb-4">Be the first to start a discussion in this forum!</p>
              {state.isAuthenticated && (
                <button
                  onClick={() => setShowCreateTopic(true)}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Topic
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;