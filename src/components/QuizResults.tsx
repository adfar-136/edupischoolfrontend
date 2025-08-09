import React from 'react';
import { CheckCircle, XCircle, Award, RotateCcw, ArrowLeft } from 'lucide-react';

interface QuizResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  attempt: {
    assessmentId: string;
    score: number;
    totalPoints: number;
    answers: any[];
    completedAt: string;
    timeSpent: number;
  };
  overallProgress: number;
}

interface QuizResultsProps {
  result: QuizResult;
  assessmentTitle: string;
  onRetakeQuiz: () => void;
  onBackToCourse: () => void;
  allowRetake?: boolean;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  result, 
  assessmentTitle, 
  onRetakeQuiz, 
  onBackToCourse,
  allowRetake = true 
}) => {
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getBgColor = (passed: boolean) => {
    return passed ? 'from-green-50 to-emerald-50' : 'from-red-50 to-orange-50';
  };

  const getIconColor = (passed: boolean) => {
    return passed ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBgColor(result.passed)} py-8`}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.passed ? (
              <CheckCircle className={`w-10 h-10 ${getIconColor(result.passed)}`} />
            ) : (
              <XCircle className={`w-10 h-10 ${getIconColor(result.passed)}`} />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Quiz Complete'}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {result.passed 
              ? 'You have successfully passed the quiz!' 
              : 'Keep practicing and try again!'}
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800">{assessmentTitle}</h2>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getGradeColor(result.percentage)}`}>
                  {result.percentage}%
                </div>
                <div className={`text-2xl font-semibold ${getGradeColor(result.percentage)}`}>
                  {getGradeLetter(result.percentage)}
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-lg text-gray-600">
                Score: {result.score} out of {result.totalPoints} points
              </p>
              {result.passed && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Passed!</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.attempt.timeSpent}
              </div>
              <div className="text-sm text-gray-600">Minutes Spent</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.score}/{result.totalPoints}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {result.overallProgress}%
              </div>
              <div className="text-sm text-gray-600">Course Progress</div>
            </div>
          </div>

          {/* Progress Update */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Progress Updated</h3>
            <p className="text-blue-700 text-sm">
              Your course progress has been updated to {result.overallProgress}%. 
              {result.passed 
                ? ' Great job completing this assessment!' 
                : ' Keep learning and try the quiz again when you\'re ready.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBackToCourse}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Course</span>
            </button>
            
            {allowRetake && !result.passed && (
              <button
                onClick={onRetakeQuiz}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Feedback</h3>
          
          {result.passed ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Excellent work!</p>
                  <p className="text-green-700 text-sm">
                    You demonstrated a strong understanding of the material.
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Continue to the next lesson or explore additional practice materials 
                  to reinforce your learning.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Keep practicing!</p>
                  <p className="text-orange-700 text-sm">
                    Review the course materials and try again when you're ready.
                  </p>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-orange-800 text-sm">
                  Consider reviewing the lecture videos and taking notes before 
                  attempting the quiz again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;