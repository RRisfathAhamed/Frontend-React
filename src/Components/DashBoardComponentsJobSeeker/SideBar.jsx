import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Sidebar.css';
import { FaHome, FaBriefcase, FaClipboardList, FaSearch, FaUser, FaTrashAlt, FaSignOutAlt, FaFileUpload, FaBars, FaTimes, FaPaintRoller, FaBook } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

const SidebarComponent = () => {
    const roleid = localStorage.getItem('roleId');
    const [showPopup, setShowPopup] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeleteClick = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const handleCancelDelete = () => {
        setShowPopup(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/jobseeker/delete/${roleid}`);
            toast.success('Account deleted successfully');
            setShowPopup(false);
            // Redirect to home page or login page after successful deletion
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('role');
            localStorage.setItem('loginSuccess', 'false');
            localStorage.removeItem('roleId');
            navigate('/home');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account. Please try again.');
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="container">
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <NavLink to="/home" className="sidebar-item" activeClassName="active">
                    <FaHome className="sidebar-icon" />
                    Home
                </NavLink>
                <NavLink to="/alljobs/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaBriefcase className="sidebar-icon" />
                    All Jobs
                </NavLink>
                <NavLink to="/appliedjobs/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaClipboardList className="sidebar-icon" />
                    Applied Jobs
                </NavLink>
                <NavLink to="/findjobs/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaSearch className="sidebar-icon" />
                    Find Jobs By AI
                </NavLink>
                <NavLink to="/findjobsbyskills/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaSearch className="sidebar-icon" />
                    Find Jobs By Skills
                </NavLink>
                <NavLink to="/profiledetails/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaUser className="sidebar-icon" />
                    Profile Details
                </NavLink>
                <NavLink to="/resumeupload/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaFileUpload className="sidebar-icon" />
                    Upload Resume
                </NavLink>
                <NavLink to="/chat/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaMessage className="sidebar-icon" />
                    Chat
                </NavLink>
                <NavLink to="/feedback/jobseeker" className="sidebar-item" activeClassName="active">
                    <FaBook className="sidebar-icon" />
                    FeedBack
                </NavLink>
                <NavLink to="#" className="sidebar-item1" onClick={handleDeleteClick}>
                    <FaTrashAlt className="sidebar-icon" />
                    Delete Account
                </NavLink>
                <NavLink to="/logout" className="sidebar-item" activeClassName="active">
                    <FaSignOutAlt className="sidebar-icon" />
                    Logout
                </NavLink>
            </div>

            <div className="hamburger-menu" onClick={toggleSidebar}>
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>Are you sure you want to delete your account?</p>
                        <div className="popup-buttons">
                            <button className="cancel-btn-delete" onClick={handleCancelDelete}>Cancel</button>
                            <button className="confirm-btn" onClick={handleConfirmDelete}>DELETE</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default SidebarComponent;
