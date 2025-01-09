// ResetPassword.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate ,} from 'react-router-dom';
import './ResetPasswordJobSeeker.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
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

    const token = new URLSearchParams(location.search).get('token');

    try {
      const response = await axios.post('http://localhost:8081/jobseeker/reset-password', {
        token,
        password
      });

      if (response.status === 200) {
        setSuccess('Password reset successfully!');
        setError('');
        navigate('/login/jobSeeker');
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      setSuccess('');
    }
  };

  const handlehome = async () => {
    navigate('/home');
};

  return (
    <div className="reset-password-container">
    <div className="reset-password-content">
      <h1>Stay Calm</h1>
      <h2>Forgot your password? Don't worry, we've got you covered.</h2>
      <div className="input-group">
        <label htmlFor="password">Type your new password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <button onClick={handleReset}>Reset Password</button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  </div>
  );
};

export default ResetPassword;