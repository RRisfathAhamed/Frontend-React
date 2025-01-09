import React from 'react';
import "./JobProviderDashpoardPage.css";
import SidebarComponent from '../Components/DashBoardComponentJobProvider/SideBar.jsx';
const JobProviderDashBoardPage = () => {
    return ( <div>
                <div className="layout">
          <div className="sidebar">
            <h2>Quick Access</h2>
           <SidebarComponent/>
            {/* Add sidebar content here */}
          </div>
          <div className="content">
            <h2>Dashboard Section</h2>
            {/* Add main content here */}
          </div>
        </div>
        
    </div> );
}
 
export default JobProviderDashBoardPage;