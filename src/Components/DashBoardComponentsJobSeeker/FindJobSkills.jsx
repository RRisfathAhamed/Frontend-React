import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./AllJobs.css";
import { Link } from "react-router-dom";

const FindJobSkills = () => {
    const roleid = localStorage.getItem("roleId");
    const [highly, setHighly] = useState([]);
    const [strong, setStrong] = useState([]);
    const [considerable, setConsiderable] = useState([]);
    const [recomment, setRecomment] = useState([]);
    const [applications, setApplications] = useState([]);
    const [isDuplicated, setIsDuplicated] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/job/find-by-skills/${roleid}`);
                // Ensure data structure before setting state
                setHighly(Array.isArray(response.data['Highly recommend']) ? response.data['Highly recommend'] : []);
                setStrong(Array.isArray(response.data['Strongly recommend']) ? response.data['Strongly recommend'] : []);
                setConsiderable(Array.isArray(response.data['Considerable']) ? response.data['Considerable'] : []);
                setRecomment(Array.isArray(response.data['Recommend']) ? response.data['Recommend'] : []);
            } catch (err) {
                console.error("Error fetching job recommendations:", err);
            }
        };
        fetchData();
    }, [roleid]);

    useEffect(() => {
        fetchApplications();
        fetchAppliedJobs();
    }, []);

    const fetchAppliedJobs = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/application/jobs/${roleid}`);
            setAppliedJobs(response.data || []);
        } catch (error) {
            console.error("Error fetching applied jobs:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await axios.get("http://localhost:8081/application/all");
            setApplications(response.data || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const getApplicationStatus = (jobId) => {
        return appliedJobs.some((app) => app.jobId === jobId);
    };

    const handleApply = async (jobId) => {
        try {
            const response = await axios.post("http://localhost:8081/application/create", {
                applicationStatus: true,
                jobAppliedDate: new Date().toISOString(),
                jobSeekerId: roleid,
                jobId: jobId,
            });
            setIsDuplicated(response.data.isDuplicated);

            // Update appliedJobs state immediately
            setAppliedJobs((prevAppliedJobs) => [...prevAppliedJobs, { jobId: jobId }]);
            fetchApplications();
        } catch (error) {
            console.error("Error applying for job:", error);
        }
    };

    const isAnyJobAvailable =
        (Array.isArray(highly) && highly.length > 0) ||
        (Array.isArray(strong) && strong.length > 0) ||
        (Array.isArray(considerable) && considerable.length > 0) ||
        (Array.isArray(recomment) && recomment.length > 0);

    return (
        <div>
            <h1>Job Recommendations</h1>
            {!isAnyJobAvailable ? (
                <div className="skills-no">
                    <h2>No recommendations available at the moment. For More Details Chat With AI Powered Chat Bot</h2>
                    <Link to="/chat/jobseeker" className="chat-link-button">
                        Chat with AI Bot
                    </Link>
                </div>
            ) : (
                <>
                    {Array.isArray(highly) && highly.length > 0 && (
                        <section>
                            <h3>Highly Recommend</h3>
                            <div className="all-jobs">
                                {highly.map((job) => (
                                    <JobCard
                                        key={job.jobId}
                                        job={job}
                                        applicationStatus={getApplicationStatus(job.jobId)}
                                        handleApply={handleApply}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {Array.isArray(strong) && strong.length > 0 && (
                        <section>
                            <h3>Strongly Recommend</h3>
                            <div className="all-jobs">
                                {strong.map((job) => (
                                    <JobCard
                                        key={job.jobId}
                                        job={job}
                                        applicationStatus={getApplicationStatus(job.jobId)}
                                        handleApply={handleApply}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {Array.isArray(recomment) && recomment.length > 0 && (
                        <section>
                            <h3>Recommend</h3>
                            <div className="all-jobs">
                                {recomment.map((job) => (
                                    <JobCard
                                        key={job.jobId}
                                        job={job}
                                        applicationStatus={getApplicationStatus(job.jobId)}
                                        handleApply={handleApply}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {Array.isArray(considerable) && considerable.length > 0 && (
                        <section>
                            <h3>Considerable</h3>
                            <div className="all-jobs">
                                {considerable.map((job) => (
                                    <JobCard
                                        key={job.jobId}
                                        job={job}
                                        applicationStatus={getApplicationStatus(job.jobId)}
                                        handleApply={handleApply}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

const JobCard = ({ job, applicationStatus, handleApply }) => (
    <div className="job-card">
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
            <p><strong>Percentage of Matching:</strong> {job.matchPercentage}%</p>
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

export default FindJobSkills;
