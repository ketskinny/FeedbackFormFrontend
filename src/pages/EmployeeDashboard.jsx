import React, { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, Target } from 'lucide-react';
import StatsCard from '../components/stats/StatsCard';
import FeedbackCard from '../components/feedback/FeedbackCard';
import Card from '../components/common/Card';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, feedbackData] = await Promise.all([
        api.feedback.stats(),
        api.feedback.list(),
      ]);
      setStats(statsData);
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcknowledge = async (feedbackId) => {
    try {
      await api.feedback.acknowledge(feedbackId);
      loadData();
    } catch (error) {
      console.error('Error acknowledging feedback:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Feedback"
            value={stats.total_feedback}
            icon={MessageSquare}
            color="blue"
          />
          <StatsCard
            title="Positive Feedback"
            value={stats.positive_feedback}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Areas to Improve"
            value={stats.negative_feedback}
            icon={Target}
            color="yellow"
          />
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">My Feedback History</h2>
        {feedback.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback received yet</h3>
            <p className="text-gray-600">Your manager will provide feedback here when available.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {feedback.map((item) => (
              <FeedbackCard
                key={item.id}
                feedback={item}
                currentUser={user}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;