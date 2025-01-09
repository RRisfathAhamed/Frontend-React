import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx"
import "./JobSeekerDashboard.css"
import FindJob from "../Components/DashBoardComponentsJobSeeker/FindJobs.jsx";
const JobSeekerFindJobs = () => {
      return (
        <div className="main-layout">
          <SidebarComponent />
          <div className="content">
          <FindJob/>
          </div>
        </div>
      );
};

export default JobSeekerFindJobs;
