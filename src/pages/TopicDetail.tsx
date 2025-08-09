import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Clock, Heart, Reply as ReplyIcon, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Topic {
  _id: string;
  title: string;
  content: string;
  authorId: {
    _id: string;
    username?: string;
    studentName?: string;
    email: string;
  };
  authorModel: string;
  tags: string[];
  viewsCount: number;
  repliesCount: number;
  forumId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Reply {
  _id: string;
  content: string;
  authorId: {
    _id: string;
    username?: string;
    studentName?: string;
    email: string;
  };
  authorModel: string;
  likesCount: number;
  createdAt: string;
  isEdited: boolean;
  editedAt?: string;
}

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const { state } = useAuth();

  useEffect(() => {
    if (topicId) {
      fetchTopicWithReplies();
    }
  }, [topicId]);

  const fetchTopicWithReplies = async () => {
    try {
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/forums/topics/${topicId}`);
      if (response.ok) {
        const data = await response.json();
        setTopic(data.topic);
        setReplies(data.replies);
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.isAuthenticated || !newReply.trim()) return;

    setSubmittingReply(true);
    try {
      const token = state.userType === 'admin' 
        ? localStorage.getItem('adminToken')
        : localStorage.getItem('studentToken');
      
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/forums/topics/${topicId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newReply })
      });

      if (response.ok) {
        const createdReply = await response.json();
        setReplies([...replies, createdReply]);
        setNewReply('');
        // Update topic reply count
        if (topic) {
          setTopic({ ...topic, repliesCount: topic.repliesCount + 1 });
        }
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!state.isAuthenticated) return;

    try {
      const token = state.userType === 'admin' 
        ? localStorage.getItem('adminToken')
        : localStorage.getItem('studentToken');
      
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/forums/replies/${replyId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReplies(replies.map(reply => 
          reply._id === replyId 
            ? { ...reply, likesCount: data.likesCount }
            : reply
        ));
      }
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleDeleteTopic = async () => {
    if (!state.isAuthenticated || !topic) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this topic? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const token = state.userType === 'admin' 
        ? localStorage.getItem('adminToken')
        : localStorage.getItem('studentToken');
      
      const response = await fetch(`https://edupischoolbackend.onrender.com/api/forums/topics/${topicId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Redirect back to forum
        window.location.href = `/forums/${topic.forumId._id}`;
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getAuthorName = (author: any) => {
    return author.username || author.studentName || 'Unknown User';
  };

  const canDeleteTopic = () => {
    if (!state.isAuthenticated || !topic) return false;
    
    // Admin can delete any topic, user can delete their own topic
    return (
      state.userType === 'admin' || 
      (topic.authorId._id === state.user?.id && topic.authorModel === state.userType)
    );
  };

  if (loading || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-emerald-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/forums/${topic.forumId._id}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {topic.forumId.name}
          </Link>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2">{topic.title}</h1>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>👁️ {topic.viewsCount} views</span>
                <span>💬 {topic.repliesCount} replies</span>
                <span>⏰ {formatTime(topic.createdAt)}</span>
              </div>
            </div>
            
            {canDeleteTopic() && (
              <button
                onClick={handleDeleteTopic}
                className="ml-4 inline-flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Topic Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-gray-900">{getAuthorName(topic.authorId)}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    topic.authorModel === 'Admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {topic.authorModel === 'Admin' ? 'Admin' : 'Student'}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{formatTime(topic.createdAt)}</span>
                </div>
                
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{topic.content}</p>
                </div>
                
                {topic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {topic.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Replies ({replies.length})
          </h2>
          
          {replies.map((reply) => (
            <div key={reply._id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{getAuthorName(reply.authorId)}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reply.authorModel === 'Admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {reply.authorModel === 'Admin' ? 'Admin' : 'Student'}
                        </span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-500 text-sm">{formatTime(reply.createdAt)}</span>
                        {reply.isEdited && reply.editedAt && (
                          <>
                            <span className="text-gray-500 text-sm">•</span>
                            <span className="text-gray-500 text-sm">edited {formatTime(reply.editedAt)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none mb-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLikeReply(reply._id)}
                        className="inline-flex items-center text-gray-500 hover:text-red-500 transition-colors"
                        disabled={!state.isAuthenticated}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {reply.likesCount}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {state.isAuthenticated ? (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Post a Reply</h3>
              <form onSubmit={handleReplySubmit}>
                <div className="mb-4">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={4}
                    placeholder="Write your reply here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReply || !newReply.trim()}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">Please log in to post a reply</p>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Login to Reply
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicDetail;