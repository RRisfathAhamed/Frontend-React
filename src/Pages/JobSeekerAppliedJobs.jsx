import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx";
import "./JobSeekerDashboard.css";
import AppliedJobs from "../Components/DashBoardComponentsJobSeeker/AppliedJobs.jsx";
const JobSeekerAppliedJobs = () => {
  return (
    <div className="main-layout">
      <SidebarComponent />
      <div className="content">
      <h2>Applied Jobs Section</h2>
      <AppliedJobs />
      </div>
    </div>
  );
};

export default JobSeekerAppliedJobs;
