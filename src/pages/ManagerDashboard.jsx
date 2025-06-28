import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import StatsCard from '../components/stats/StatsCard';
import FeedbackCard from '../components/feedback/FeedbackCard';
import FeedbackFormModal from '../components/feedback/FeedbackFormModal';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, teamData, feedbackData] = await Promise.all([
        api.feedback.stats(),
        api.users.team(),
        api.feedback.list(),
      ]);
      setStats(statsData);
      setTeamMembers(teamData);
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

  const handleCreateFeedback = () => {
    setEditingFeedback(null);
    setShowFeedbackModal(true);
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    setShowFeedbackModal(true);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.feedback.delete(feedbackId);
        loadData();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Feedback"
            value={stats.total_feedback}
            icon={MessageSquare}
            color="blue"
          />
          <StatsCard
            title="Team Size"
            value={stats.team_size}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Positive Feedback"
            value={stats.positive_feedback}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Needs Attention"
            value={stats.negative_feedback}
            icon={AlertCircle}
            color="red"
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Team Feedback</h2>
        <Button onClick={handleCreateFeedback} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Feedback
        </Button>
      </div>
      {feedback.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
          <p className="text-gray-600 mb-4">Start providing feedback to your team members.</p>
          <Button onClick={handleCreateFeedback}>Create First Feedback</Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {feedback.map((item) => (
            <FeedbackCard
              key={item.id}
              feedback={item}
              currentUser={user}
              onEdit={handleEditFeedback}
              onDelete={handleDeleteFeedback}
            />
          ))}
        </div>
      )}
      <FeedbackFormModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedback={editingFeedback}
        teamMembers={teamMembers}
        onSuccess={loadData}
      />
    </div>
  );
};

export default ManagerDashboard;