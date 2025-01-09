import React from "react";
import "./JobProviderDashpoardPage.css";
import SidebarComponent from "../Components/DashBoardComponentJobProvider/SideBar.jsx";
import PostedJobs from "../Components/DashBoardComponentJobProvider/PostedJobs.jsx";
const JobProviderPostedJobs = () => {
  return (
    <div className="main-layout">
      <SidebarComponent />
      <div className="content">
        <h2>Posted Jobs</h2>
        <PostedJobs />
      </div>
    </div>
  );
};

export default JobProviderPostedJobs;
