import React from 'react';
import "./JobProviderDashpoardPage.css";
import SidebarComponent from '../Components/DashBoardComponentJobProvider/SideBar.jsx';
import CreateJob from '../Components/DashBoardComponentJobProvider/CreateJob.jsx';
const JobProviderCreateJob = () => {
      return (
        <div className="main-layout">
          <SidebarComponent />
          <div className="content">
          <CreateJob/>
          </div>
        </div>
      );
}
 
export default JobProviderCreateJob;


