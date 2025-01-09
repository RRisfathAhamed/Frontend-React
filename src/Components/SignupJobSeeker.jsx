// SignUpJobSeekerComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignupJobSeeker.css';
import SignUpImage from "../Resources/Images/Personal site-amico.png";

const SignUpJobSeekerComponent = () => {
  const securityQuestions = [
    'What is your mother\'s maiden name?',
    'What was the name of your first pet?',
    'What was the name of your first school?',
    'What is your favorite book?',
    'In what city were you born?'
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  const [error, setError] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must include at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must include at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must include at least one number';
    }
    if (!hasSpecialChars) {
      return 'Password must include at least one special character';
    }
    return '';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') {
      if (!validateEmail(e.target.value)) {
        setError({ ...error, email: 'Invalid email format' });
      } else {
        setError({ ...error, email: '' });
      }
    }
    if (e.target.name === 'password') {
      const passwordError = validatePassword(e.target.value);
      setError({ ...error, password: passwordError });
    }
    if (e.target.name === 'confirmPassword') {
      if (e.target.value !== formData.password) {
        setError({ ...error, confirmPassword: "Passwords don't match" });
      } else {
        setError({ ...error, confirmPassword: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: '', password: '', confirmPassword: '' });

    if (!validateEmail(formData.email)) {
      setError({ ...error, email: 'Invalid email format' });
      return;
    }
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError({ ...error, password: passwordError });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError({ ...error, confirmPassword: "Passwords don't match" });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/jobseeker/create', {
        ...formData,
        registeredDate: new Date().toISOString().split('T')[0]
      });
      if (response.data.isDuplicated) {
        console.log('User Not created:', response.data);
        toast.error('User Name Already Exists');
      } else {
        console.log('User created:', response.data);
        toast.success('Account created successfully!');
        setTimeout(() => {
          navigate('/login/jobSeeker');
        }, 2000);
      }
    } catch (err) {
      setError({ ...error, general: 'An error occurred. Please try again.' });
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <div className="signup-image">
        <img src={SignUpImage} alt="Login illustration" />
      </div>
      <div className="signup-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {error.email && <p className="error-message">{error.email}</p>}
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error.password && <p className="error-message">{error.password}</p>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {error.confirmPassword && <p className="error-message">{error.confirmPassword}</p>}
          <select
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
          >
            <option value="">Select a security question</option>
            {securityQuestions.map((question, index) => (
              <option key={index} value={question}>{question}</option>
            ))}
          </select>
          <input
            type="text"
            name="securityAnswer"
            placeholder="Security Answer"
            value={formData.securityAnswer}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
        {error.general && <p className="error-message">{error.general}</p>}
        <p className="login-link">
          Already have an account? <a href="/login/jobSeeker">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpJobSeekerComponent;
