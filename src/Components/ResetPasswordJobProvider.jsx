// ResetPasswordJP.js
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPasswordJobSeeker.css';

const ResetPasswordJP = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pwd);
  };

  const handleReset = async () => {
    if (!validatePassword(password)) {
      setError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const token = new URLSearchParams(location.search).get('token');

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/reset-password', {
        token,
        password
      });

      if (response.status === 200) {
        setSuccess('Password reset successfully!');
        setError('');
        setTimeout(() => {
          navigate('/login/jobProvider');
        }, 2000);
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setSuccess('');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-content">
        <h1>Reset Password</h1>
        <div className="input-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <button onClick={handleReset}>Reset Password</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordJP;