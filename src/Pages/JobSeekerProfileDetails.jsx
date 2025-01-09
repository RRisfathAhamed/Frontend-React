import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx"
import "./JobSeekerDashboard.css"
import ProfileDetails from "../Components/DashBoardComponentsJobSeeker/ProfileDetails.jsx";
const JobSeekerProfileDetails = () => {
      return (
        <div className="main-layout">
          <SidebarComponent />
          <div className="content">
          <ProfileDetails/>          
          </div>
        </div>
      );
};

export default JobSeekerProfileDetails;
