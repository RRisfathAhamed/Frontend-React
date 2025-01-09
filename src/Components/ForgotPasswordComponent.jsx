import React, { useState } from 'react';
import axios from 'axios';
// import './ForgotPasswordComponent.css';

const ForgotPasswordComponent = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleUserNameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/jobseeker/get-security-question', { userName });
      if (response.data.success) {
        setSecurityQuestion(response.data.securityQuestion);
        setStep(2);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleSecurityAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/jobseeker/validate-security-answer', {
        userName,
        securityAnswer,
      });
      if (response.data.success) {
        // Proceed to send reset link to email
        const emailResponse = await axios.post('http://localhost:8081/jobseeker/forgotPassword', {
          userName,
        });
        if (emailResponse.status === 200) {
          setSuccessMessage('A password reset link has been sent to your email address.');
          setStep(3);
        } else {
          setError('Failed to send reset link');
        }
      } else {
        setError('Security answer is incorrect');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="forgot-password-container">
      {step === 1 && (
        <form onSubmit={handleUserNameSubmit}>
          <h2>Forgot Password</h2>
          <input
            type="text"
            name="userName"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <button type="submit">Next</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleSecurityAnswerSubmit}>
          <h2>Security Question</h2>
          <p>{securityQuestion}</p>
          <input
            type="text"
            name="securityAnswer"
            placeholder="Enter your answer"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
      {step === 3 && (
        <div>
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordComponent;