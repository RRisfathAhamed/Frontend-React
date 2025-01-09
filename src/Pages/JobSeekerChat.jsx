import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx";
import "./JobSeekerDashboard.css";
import ChatInterface from "../Components/DashBoardComponentsJobSeeker/Chat.jsx";
const ChatPageJobSeeker = () => {
  return (
    <div className="main-layout">
      <SidebarComponent />
      <div className="content">
      <h2>AI Chat</h2>
      <ChatInterface/>      </div>
    </div>
  );
};

export default ChatPageJobSeeker;
