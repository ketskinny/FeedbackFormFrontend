import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import api from '../../services/api';

const FeedbackFormModal = ({ isOpen, onClose, feedback, teamMembers, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    strengths: '',
    areas_to_improve: '',
    sentiment: 'neutral',
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (feedback) {
      setFormData({
        employee_id: feedback.employee_id,
        strengths: feedback.strengths,
        areas_to_improve: feedback.areas_to_improve,
        sentiment: feedback.sentiment,
        tags: feedback.tags || [],
      });
    } else {
      setFormData({
        employee_id: '',
        strengths: '',
        areas_to_improve: '',
        sentiment: 'neutral',
        tags: [],
      });
    }
  }, [feedback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (feedback) {
        await api.feedback.update(feedback.id, formData);
      } else {
        await api.feedback.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={feedback ? 'Edit Feedback' : 'Create Feedback'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!feedback && (
          <Select
            label="Team Member"
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            options={[
              { value: '', label: 'Select team member' },
              ...teamMembers.map(member => ({
                value: member.id,
                label: member.name
              }))
            ]}
            required
          />
        )}
        <Textarea
          label="Strengths"
          value={formData.strengths}
          onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
          placeholder="What are they doing well?"
          required
        />
        <Textarea
          label="Areas to Improve"
          value={formData.areas_to_improve}
          onChange={(e) => setFormData({ ...formData, areas_to_improve: e.target.value })}
          placeholder="What could be improved?"
          required
        />
        <Select
          label="Overall Sentiment"
          value={formData.sentiment}
          onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
          options={[
            { value: 'positive', label: 'Positive' },
            { value: 'neutral', label: 'Neutral' },
            { value: 'negative', label: 'Negative' },
          ]}
        />
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : feedback ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackFormModal;