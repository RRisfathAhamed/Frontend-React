import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllJobs.css";
import "./FindJobs.css"
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";



const FindJob = () => {
    const roleid = localStorage.getItem("roleId");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [newSkills, setNewSkills] = useState(null);
    const [newExperience, setNewExperience] = useState(null);
    const [newEducation, setNewEducation] = useState(null);
    const [predictedJob, setPredictedJob] = useState("");
    const [searchedJobs, setSearchedJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isDuplicated, setIsDuplicated] = useState();
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/jobseeker/get/${roleid}`);
                setData(response.data);
                setNewSkills(response.data.skills);
                setNewExperience(response.data.experience);
                setNewEducation(response.data.education);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to fetch user details.");
            }
        };

        fetchData();
    }, [roleid]);

    const resumeText = `Skills: ${newSkills}, Education: ${newEducation}, Experience: ${newExperience}`;

    useEffect(() => {
        const predictJob = async () => {
            if (resumeText) {
                try {
                    const response = await axios.post("http://127.0.0.1:5001/predict", { resumeText });
                    setPredictedJob(response.data.predicted_job);
                } catch (err) {
                    console.error("Error predicting job:", err);
                    toast.error("Failed to predict the job!");
                }
            }
        };

        predictJob();
    }, [resumeText]);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/job/find-by-title/${predictedJob}`);
            setSearchedJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to find jobs!");
        } finally {
            setIsLoading(false);
            setIsClicked(true);
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchAppliedJobs();
    }, []);

    const fetchAppliedJobs = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/application/jobs/${roleid}`
            );
            setAppliedJobs(response.data);
        } catch (error) {
            console.error("Error fetching applied jobs:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await axios.get("http://localhost:8081/application/all");
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const getApplicationStatus = (jobId) => {
        return appliedJobs.some((app) => app.jobId === jobId);
    };

    const handleApply = async (jobId) => {
        try {
            const response = await axios.post(
                "http://localhost:8081/application/create",
                {
                    applicationStatus: true,
                    jobAppliedDate: new Date().toISOString(),
                    jobSeekerId: roleid,
                    jobId: jobId,
                }
            );
            setIsDuplicated(response.data.isDuplicated);

            // Update appliedJobs state immediately
            setAppliedJobs((prevAppliedJobs) => [
                ...prevAppliedJobs,
                { jobId: jobId },
            ]);

            // Optionally, you can also update the applications state
            fetchApplications();
        } catch (error) {
            console.error("Error applying for job:", error);
        }
    };


    return (
        <div className="find-job-container">
            <div className="predicted-job-header">
                <h1 className="main-title">🌟 Predicted Job For You Using AI 🌟</h1>
                <h2 className="predicted-job-title">
                    {predictedJob ? predictedJob : "🔍 Analyzing your resume..."}
                </h2>
            </div>

            <div className="button-container">
                <button className="find-button" onClick={handleSearch} disabled={isLoading || !predictedJob}>
                    {isLoading ? "Searching..." : "Find Jobs"}
                </button>
            </div>

            {isClicked && (
                <div className="all-jobs">
                    {searchedJobs.length > 0 ? (
                        searchedJobs.map((job) => {
                            const applicationStatus = getApplicationStatus(job.jobId);
                            return (
                                <div key={job.jobId} className="job-card">
                                    <div className="job-header-alljobs">
                                        <h2 className="h2">{job.jobTitle}</h2>
                                        <span className={`status ${job.isHired ? "hired" : "not-hired"}`}>
                                        {job.isHired ? "Hired" : "Not Hired"}
                                    </span>
                                    </div>
                                    <p>{job.jobDescription}</p>
                                    <div className="job-details">
                                        <p><strong>Experience:</strong> {job.jobExperience}</p>
                                        <p><strong>Education:</strong> {job.qualifiedEducation}</p>
                                        <p><strong>Location:</strong> {job.jobLocation}</p>
                                        <p><strong>Posted on:</strong> {new Date(job.jobPostedDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="job-skills">
                                        {job.jobSkills.split(", ").map((skill) => (
                                            <span key={skill} className="skill">{skill}</span>
                                        ))}
                                    </div>
                                    <button
                                        className={`apply-button ${applicationStatus ? "applied" : ""}`}
                                        disabled={applicationStatus}
                                        onClick={() => handleApply(job.jobId)}
                                    >
                                        {applicationStatus ? "Applied" : "Apply Now"}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-jobs-found">
                            <h1>No {predictedJob} jobs found</h1>
                            <Link to="/chat/jobseeker" className="chat-link-button">
                                Chat with AI Bot
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000}/>
        </div>
    );

};

export default FindJob;
