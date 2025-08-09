import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, ArrowLeft } from 'lucide-react';

interface Question {
  _id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: { text: string; isCorrect: boolean }[];
  points: number;
}

interface Assessment {
  _id: string;
  title: string;
  description: string;
  type: string;
  timeLimit: number;
  totalPoints: number;
  passingScore: number;
  questions: Question[];
}

interface QuizAttemptProps {
  assessment: Assessment;
  courseId: string;
  onComplete: (result: any) => void;
  onCancel: () => void;
}

const QuizAttempt: React.FC<QuizAttemptProps> = ({ assessment, courseId, onComplete, onCancel }) => {
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [timeLeft, setTimeLeft] = useState(assessment.timeLimit * 60); // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionIndex: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('studentToken');
      const startTime = assessment.timeLimit * 60;
      const timeSpent = Math.round((startTime - timeLeft) / 60); // Convert back to minutes

      const formattedAnswers = Object.entries(answers).map(([questionIndex, answer]) => ({
        questionIndex: parseInt(questionIndex),
        answer
      }));

      const response = await fetch(`https://edupischoolbackend.onrender.com/api/progress/assessment/${assessment._id}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          answers: formattedAnswers,
          timeSpent
        })
      });

      if (response.ok) {
        const result = await response.json();
        onComplete(result);
      } else {
        console.error('Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const userAnswer = answers[index];

    return (
      <div key={question._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Question {index + 1} of {assessment.questions.length}</span>
            <span className="text-sm text-gray-500">{question.points} points</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
        </div>

        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={optionIndex}
                  checked={userAnswer === optionIndex}
                  onChange={(e) => handleAnswerChange(index, parseInt(e.target.value))}
                  className="text-emerald-600 mr-3"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`question-${index}`}
                value="true"
                checked={userAnswer === 'true'}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="text-emerald-600 mr-3"
              />
              <span className="text-gray-700">True</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`question-${index}`}
                value="false"
                checked={userAnswer === 'false'}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="text-emerald-600 mr-3"
              />
              <span className="text-gray-700">False</span>
            </label>
          </div>
        )}

        {question.type === 'short-answer' && (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            rows={4}
          />
        )}
      </div>
    );
  };

  const answeredQuestions = Object.keys(answers).length;
  const isComplete = answeredQuestions === assessment.questions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Course</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{assessment.title}</h1>
                <p className="text-sm text-gray-600">{assessment.type} • {assessment.totalPoints} points</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                {answeredQuestions}/{assessment.questions.length} answered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {assessment.description && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{assessment.description}</p>
          </div>
        )}

        {/* Quiz Instructions */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Answer all questions to complete the quiz</li>
            <li>• Time limit: {assessment.timeLimit} minutes</li>
            <li>• Passing score: {assessment.passingScore}%</li>
            <li>• You can change your answers before submitting</li>
          </ul>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {assessment.questions.map((question, index) => renderQuestion(question, index))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isComplete ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>All questions answered</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-orange-600">
                  <XCircle className="w-4 h-4" />
                  <span>{assessment.questions.length - answeredQuestions} questions remaining</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isComplete && !isSubmitting
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;