import React from 'react';
import { Edit2, Trash2, CheckCircle, Star, Target } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const FeedbackCard = ({ feedback, currentUser, onEdit, onDelete, onAcknowledge }) => {
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
            {feedback.sentiment}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(feedback.created_at)}
          </span>
        </div>
        {currentUser.role === 'manager' && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(feedback)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(feedback.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-green-600" />
            Strengths
          </h4>
          <p className="text-gray-700">{feedback.strengths}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            Areas to Improve
          </h4>
          <p className="text-gray-700">{feedback.areas_to_improve}</p>
        </div>
        {feedback.tags && feedback.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {feedback.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {currentUser.role === 'employee' && !feedback.is_acknowledged && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => onAcknowledge(feedback.id)}
              variant="success"
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Acknowledge
            </Button>
          </div>
        )}
        {feedback.is_acknowledged && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">
                Acknowledged on {formatDate(feedback.acknowledged_at)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedbackCard;