// RoleSelectionComponent.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelectionComponent.css";

const RoleSelectionComponent = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // localStorage.setItem("selectedRole", role);
    navigate(`/login/${role}`);
  };
  const handleRoleSelectionSignUp = (role) => {
    // localStorage.setItem('selectedRole', role);
    navigate(`/signup/${role}`);
  };

  return (
    <div className="role-selection-container" id='join'>
      <h1>Welcome to AI-based Job Recommendation System</h1>
      <p>Choose how you'd like to use our platform:</p>

      <div className="role-options">
        <div className="role-option">
          <span className="icon">🏢</span>
          <h2>I'm a Job Provider</h2>
          <p>Post jobs and find top talent</p>
          <button
            className="login-account-btn"
            onClick={() => handleRoleSelection("jobProvider")}
          >
            Login
          </button>
          <br />
          <button
            className="create-account-btn"
            onClick={() => handleRoleSelectionSignUp("jobProvider")}
          >
            Create New Account
          </button>
        </div>

        <div className="role-option">
          <span className="icon">👤</span>
          <h2>I'm a Job Seeker</h2>
          <p>Discover opportunities tailored for you</p>
          <button
            className="login-account-btn"
            onClick={() => handleRoleSelection("jobSeeker")}
          >
            Login
          </button>
          <br />
          <button
            className="create-account-btn"
            onClick={() => handleRoleSelectionSignUp("jobSeeker")}
          >
            Create New Account
          </button>
        </div>
      </div>

      <div className="illustration">
        {/* Add your illustration or image here */}
      </div>
    </div>
  );
};

export default RoleSelectionComponent;
