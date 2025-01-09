import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        localStorage.removeItem('roleId');
        localStorage.setItem('loginSuccess', 'false');

        // Show success toast
        toast.success('Logged out successfully', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        // Redirect to home page
        navigate('/home');
    }, [navigate]);

    return null; // This component doesn't render anything
};

export default Logout;