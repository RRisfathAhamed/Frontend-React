import React from "react";
import "./JobProviderDashpoardPage.css";
import SidebarComponent from "../Components/DashBoardComponentJobProvider/SideBar.jsx";
import CompanyDetails from "../Components/DashBoardComponentJobProvider/ProfileDetails.jsx";
const JobProviderProfileDetails = () => {
  return (
    <div className="main-layout">
      <SidebarComponent />
      <div className="content">
      <CompanyDetails/>
      </div>
    </div>
  );
};

export default JobProviderProfileDetails;
