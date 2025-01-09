// LoginJobProvider.js
import React, { useState } from 'react';
import axios from 'axios';
import './LoginComponent.css';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../Resources/Images/LoginImage.png';
import { toast, ToastContainer } from 'react-toastify';

const LoginJobProvider = () => {
  const [currentStep, setCurrentStep] = useState('login'); // Possible values: 'login', 'forgotPassword', 'securityQuestion', 'emailSent'
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/login', {
        userName,
        password
      });

      if (response.data.loginSuccess) {
        const { token } = response.data;
        localStorage.setItem('token', token);

        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('userName', payload.userName);
        localStorage.setItem('role', payload.role);
        localStorage.setItem('loginSuccess', response.data.loginSuccess);
        localStorage.setItem('roleId', payload.jobProviderId);

        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        navigate('/profiledetails/jobprovider');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  const handleForgotPasswordClick = () => {
    setCurrentStep('forgotPassword');
    setError('');
    setSuccessMessage('');
    setUserName('');
    setSecurityQuestion('');
    setSecurityAnswer('');
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/get-security-question', { userName });
      if (response.data.success) {
        setSecurityQuestion(response.data.securityQuestion);
        setCurrentStep('securityQuestion');
      } else {
        setError('User not found.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  const handleSecurityAnswerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/validate-security-answer', {
        userName,
        securityAnswer,
      });
      if (response.data.success) {
        // Proceed to send reset link to email
        const emailResponse = await axios.post('http://localhost:8081/jobprovider/forgotPassword', {
          userName,
        });
        if (emailResponse.status === 200) {
          setSuccessMessage('A password reset link has been sent to your email address.');
          setCurrentStep('emailSent');
        } else {
          setError('Failed to send reset link. Please try again.');
        }
      } else {
        setError('Incorrect security answer.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-image">
        <img src={LoginImage} alt="Login illustration" />
      </div>
      <div className="login-form">
        {currentStep === 'login' && (
          <>
            <h2>Welcome Back..!</h2>
            <h3 className="tagline">Find Your Ideal Candidates with AI-Powered Precision.</h3>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter User Name Here"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Enter Password Here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <button type="button" className="forgot-password-button" onClick={handleForgotPasswordClick}>
                  Forgot Password
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-button">Login</button>
            </form>
            <div className="create-account">
              <a href="/signup/jobProvider">Create New Account</a>
            </div>
          </>
        )}

        {currentStep === 'forgotPassword' && (
          <>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter User Name Here"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-button">
                Next
              </button>
            </form>
            <button type="button" className="back-button" onClick={() => setCurrentStep('login')}>
              Back to Login
            </button>
          </>
        )}

        {currentStep === 'securityQuestion' && (
          <>
            <h2>Security Question</h2>
            <p>{securityQuestion}</p>
            <form onSubmit={handleSecurityAnswerSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Enter Security Answer Here"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-button">
                Submit Answer
              </button>
            </form>
            <button type="button" className="back-button" onClick={() => setCurrentStep('forgotPassword')}>
              Back
            </button>
          </>
        )}

        {currentStep === 'emailSent' && (
          <>
            <h2>Password Reset Email Sent</h2>
            <p>{successMessage}</p>
            <button type="button" className="login-button" onClick={() => setCurrentStep('login')}>
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginJobProvider;