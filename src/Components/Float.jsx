import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Float.css";
import FloatImage from '../Resources/Images/floatImage.jpg';

const FloatContent = () => {
    const navigate = useNavigate();
    const loginSuccess = JSON.parse(localStorage.getItem("loginSuccess"));
    const role = localStorage.getItem("role");

    const handleDashboardClick = () => {
        if (role === "JobProvider") {
            navigate("/postedjobs/jobprovider");
        } else if (role === "JobSeeker") {
            navigate("/alljobs/jobseeker");
        }
    };

    return (
        <React.Fragment>
            <div className='container-landing'>
                <div className="left">
                    <div className='IntroText'>
                        Your Career Compass, Powered by AI.
                    </div>
                    <div className="SubText">
                        AI-Powered Job Matching: Where Talent Meets Opportunity.
                    </div>
                    {loginSuccess ? (
                        <div className="button_join" onClick={handleDashboardClick}>
                            Go to Dashboard
                        </div>
                    ) : (
                        <a href="#join" className="page-scroll">
                            <div className="button_join">
                            Join to Explore Careers
                            </div>
                        </a>
                    )}
                </div>
                <div className="right">
                    <img src={FloatImage} className='ImgFormat' />
                </div>
            </div>
        </React.Fragment>
    );
}

export default FloatContent;
