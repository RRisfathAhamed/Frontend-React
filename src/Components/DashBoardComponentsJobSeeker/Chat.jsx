import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatInterface.css";

const ChatInterface = () => {
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [details, setDetails] = useState(null);
  const [isBotStarted, setIsBotStarted] = useState(false);

  const fetchDetails = async (roleId) => {
    try {
      const response = await axios.get(`http://localhost:8081/jobseeker/get/${roleId}`);
      const filteredDetails = {
        education: response.data.education,
        experience: response.data.experience,
        skills: response.data.skills,
      };
      setDetails(filteredDetails);
      return filteredDetails;
    } catch (error) {
      console.error("Error fetching details:", error);
      return null;
    }
  };

  const generateCustomPrompt = (details) => {
    return `I have education "${details.education}", skills "${details.skills}", and experience "${details.experience}". What kind of job matches me? What skills do I need to improve, and how can I improve those skills?`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { type: "user", content: inputText };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post("http://127.0.0.1:5001/chat", {
        messages: [{ role: "user", content: inputText }],
      });
      const botMessage = { type: "bot", content: response.data.response };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { type: "bot", content: "Error fetching response. Please try again." };
      setChatMessages((prev) => [...prev, errorMessage]);
    }

    setInputText("");
  };

  const handleStartBot = async () => {
    const roleId = localStorage.getItem("roleId");
    if (!roleId) {
      alert("Role ID not found. Please log in.");
      return;
    }

    let detailsData = details;

    if (!detailsData) {
      detailsData = await fetchDetails(roleId);
    }

    if (detailsData) {
      const customPrompt = generateCustomPrompt(detailsData);
      const newMessage = { type: "user", content: customPrompt };
      setChatMessages((prev) => [...prev, newMessage]);

      try {
        const response = await axios.post("http://127.0.0.1:5001/chat", {
          messages: [{ role: "user", content: customPrompt }],
        });
        const botMessage = { type: "bot", content: response.data.response };
        setChatMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error fetching response:", error);
        const errorMessage = { type: "bot", content: "Error fetching response. Please try again." };
        setChatMessages((prev) => [...prev, errorMessage]);
      }
    }

    setIsBotStarted(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputText.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}
        </div>
      </div>

      {!isBotStarted && (
        <div className="input-container">
          <button onClick={handleStartBot}>Start Bot</button>
        </div>
      )}

      {isBotStarted && (
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question here"
            onKeyPress={handleKeyPress} // Listen for Enter key
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
