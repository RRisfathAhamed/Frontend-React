import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllJobs.css";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isDuplicated, setIsDuplicated] = useState();
  const [appliedJobs, setAppliedJobs] = useState([]);

  const roleid = localStorage.getItem("roleId");

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8081/job/getAllJob");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

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
    <div className="all-jobs">
      {jobs.map((job) => {
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
              <p>
                <strong>Experience:</strong> {job.jobExperience}
              </p>
              <p>
                <strong>Education:</strong> {job.qualifiedEducation}
              </p>
              <p>
                <strong>Location:</strong> {job.jobLocation}
              </p>
              <p>
                <strong>Posted on:</strong>{" "}
                {new Date(job.jobPostedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="job-skills">
              {job.jobSkills.split(", ").map((skill) => (
                <span key={skill} className="skill">
                  {skill}
                </span>
              ))}
            </div>{" "}
            <button
              className={`apply-button ${applicationStatus ? "applied" : ""}`}
              disabled={applicationStatus}
              onClick={() => handleApply(job.jobId)}
            >
              {applicationStatus ? "Applied" : "Apply Now"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AllJobs;
