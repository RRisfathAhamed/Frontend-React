// SignUpJobProviderComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignupJobSeeker.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SignUpImage from "../Resources/Images/Personal site-amico.png";

const SignUpJobProviderComponent = () => {
  const navigate = useNavigate();
  const securityQuestions = [
    'What is your mother\'s maiden name?',
    'What was the name of your first pet?',
    'What was the name of your first school?',
    'What is your favorite book?',
    'In what city were you born?'
  ];

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    setErrors({ ...errors, [name]: '' });

    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrors({ ...errors, email: 'Please enter a valid email address' });
      }
    }

    if (name === 'password') {
      if (!validatePassword(value)) {
        setErrors({ ...errors, password: 'Password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!formData.securityQuestion) {
      newErrors.securityQuestion = 'Please select a security question';
    }

    if (!formData.securityAnswer) {
      newErrors.securityAnswer = 'Please provide an answer to the security question';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/create', {
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
          navigate('/login/jobProvider');
        }, 2000);
      }
    } catch (err) {
      setErrors({ ...errors, general: 'An error occurred. Please try again.' });
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
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

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
          {errors.password && <p className="error-message">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

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
          {errors.securityQuestion && <p className="error-message">{errors.securityQuestion}</p>}

          <input
            type="text"
            name="securityAnswer"
            placeholder="Security Answer"
            value={formData.securityAnswer}
            onChange={handleChange}
            required
          />
          {errors.securityAnswer && <p className="error-message">{errors.securityAnswer}</p>}

          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
        {errors.general && <p className="error-message">{errors.general}</p>}
        <p className="login-link">
          Already have an account? <a href="/login/jobProvider">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpJobProviderComponent;