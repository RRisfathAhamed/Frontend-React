import React from 'react';
import FeedBackUI from '../Components/DashBoardComponentsJobSeeker/FeedBack';
import SidebarComponent from '../Components/DashBoardComponentsJobSeeker/SideBar';
const FeedBackGenerationPage = () => {
    return ( 
    <div className="main-layout">
    <SidebarComponent/>
      <div className="content">
      <h2>FeedBack</h2>
      <FeedBackUI/>  
      </div>
    </div>
     );
}
 
export default FeedBackGenerationPage;