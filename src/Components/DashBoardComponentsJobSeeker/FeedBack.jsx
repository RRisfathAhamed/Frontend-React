import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './FeedBackUI.css';

const FeedBackUI = () => {
  const [details, setDetails] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDetails = async (roleId) => {
    try {
      const response = await axios.get(`http://localhost:8081/jobseeker/getSkills/${roleId}`);
      setDetails(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching details:', error);
      setError('Failed to fetch details from the backend.');
      return null;
    }
  };

  const handleGenerateFeedback = async () => {
    setLoading(true);
    setError('');
    const roleId = localStorage.getItem('roleId');
    let detailsData = details;

    if (!detailsData && roleId) {
      detailsData = await fetchDetails(roleId);
    }

    if (detailsData) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/feedback', { skills: detailsData });
        setFeedback(response.data.response);
      } catch (error) {
        console.error('Error generating feedback:', error);
        setError('Failed to generate feedback from the Flask API.');
      }
    }
    setLoading(false);
  };

  const handleClearFeedback = () => {
    setFeedback('');
    setError('');
  };

  return (
    <div className="feedback-container">
      <button className="generate-feedback-button" onClick={handleGenerateFeedback} disabled={loading}>
        {loading ? 'Generating Feedback...' : 'Generate Feedback'}
      </button>
      <button className="clear-feedback-button" onClick={handleClearFeedback} disabled={loading || !feedback}>
        Clear Feedback
      </button>
      {error && <div className="error-message">{error}</div>}
      {feedback && (
        <div className="feedback-output">
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default FeedBackUI;