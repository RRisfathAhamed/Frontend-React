import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx";
import "./JobSeekerDashboard.css";
import AllJobs from "../Components/DashBoardComponentsJobSeeker/AllJobs.jsx";
const JobSeekerAllJobs = () => {
  return (
    <div className="main-layout">
      <SidebarComponent />
      <div className="content">
        <h2>All Jobs</h2>
        <AllJobs />
      </div>
    </div>
  );
};

export default JobSeekerAllJobs;
