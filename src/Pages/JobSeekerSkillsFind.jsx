import React from 'react';
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar";
import FindJob from "../Components/DashBoardComponentsJobSeeker/FindJobs";
import FindJobSkills from "../Components/DashBoardComponentsJobSeeker/FindJobSkills";

const JobSeekerSkillsFind = () => {
    return (
        <div className="main-layout">
            <SidebarComponent/>
            <div className="content">
                <FindJobSkills/>
            </div>
        </div>
    );
};

export default JobSeekerSkillsFind;