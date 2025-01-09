import React from 'react';
import ResumeUpload from '../Components/DashBoardComponentsJobSeeker/UploadCV';
import SidebarComponent from '../Components/DashBoardComponentsJobSeeker/SideBar';
const UploadCVPage = () => {
      return (
        <div className="main-layout">
          <SidebarComponent />
          <div className="content">
          <ResumeUpload/>         
          </div>
        </div>
      );
}
 
export default UploadCVPage;