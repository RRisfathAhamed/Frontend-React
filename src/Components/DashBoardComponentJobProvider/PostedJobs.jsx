// PostedJobs.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PostedJobs.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-posted-jobs">
      <div className="modal-content-posted-jobs">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this job?</p>
        <div className="modal-buttons-posted-jobs">
          <button className="cancel-btn-posted-jobs" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn-posted-jobs" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const ApplicantsModal = ({ isOpen, onClose, jobSeekers }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-posted-jobs">
      <div className="modal-content-posted-jobs">
        <h2>Job Seekers</h2>
        <div className="job-seekers-list">
          {jobSeekers.length === 0 ? (
            <p>No Applicants Applied for this Job</p>
          ) : (
            jobSeekers.map((seeker) => (
              <div key={seeker.jobSeekerId} className="job-seeker">
                <p><strong>ID:</strong> {seeker.jobSeekerId}</p>
                <p><strong>Username:</strong> {seeker.userName}</p>
                <p><strong>Email:</strong> {seeker.email}</p>
                <p><strong>Address:</strong> {seeker.address}</p>
                <p><strong>Phone:</strong> {seeker.phoneNumber}</p>
                <p><strong>Education:</strong> {seeker.education}</p>
                <p><strong>Experience:</strong> {seeker.experience}</p>
                <p><strong>Skills:</strong> {seeker.skills}</p>
              </div>
            ))
          )}
        </div>
        <div className="modal-buttons-posted-jobs">
          <button className="cancel-btn-posted-jobs" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job, applicantCount, onDelete, onShowApplicants }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const hiredStatus = job.isHired ? "Hired" : "Not Hired";
  const statusColor = job.isHired ? "red" : "green";
  const skills = job.jobSkills ? job.jobSkills.split(", ") : [];

  const handleEdit = () => {
    navigate(`/editjobs/jobprovider/${job.jobId}`);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8081/job/delete/${job.jobId}`);
      onDelete(job.jobId);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="job-card-posted-jobs">
      <div className="job-header-posted-jobs">
        <h2>{job.jobTitle}</h2>
        <span className={`status-badge ${statusColor}`}>{hiredStatus}</span>
      </div>
      <p>{job.jobDescription}</p>
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
      <div className="job-skills">
        {job.jobSkills.split(", ").map((skill) => (
          <span key={skill} className="skill">
            {skill}
          </span>
        ))}
      </div>
      <div className="button-group-posted-jobs">
        <button
          className="applicants-btn-posted-jobs"
          onClick={() => onShowApplicants(job.jobId)}
        >
          {applicantCount} Applicants
        </button>
        <button className="edit-btn-posted-jobs" onClick={handleEdit}>
          Edit
        </button>
        <button className="delete-btn-posted-jobs" onClick={handleDeleteClick}>
          Delete
        </button>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

const PostedJobs = () => {
  const roleId = localStorage.getItem("roleId");
  const [jobs, setJobs] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [jobSeekers, setJobSeekers] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/jobprovider/${roleId}/jobs`
      );
      setJobs(response.data);

      const counts = await Promise.all(
        response.data.map((job) =>
          axios
            .get(`http://localhost:8081/application/count/${job.jobId}`)
            .then((res) => ({ [job.jobId]: res.data }))
        )
      );
      setApplicantCounts(Object.assign({}, ...counts));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchJobSeekers = async (jobId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/application/job-seeker/${jobId}`
      );
      setJobSeekers(response.data);
      setIsApplicantsModalOpen(true);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter((job) => job.jobId !== jobId));
  };

  const handleShowApplicants = (jobId) => {
    fetchJobSeekers(jobId);
  };

  return (
    <div className="posted-jobs-container-posted-jobs">
      <div className="job-grid-posted-jobs">
        {jobs.map((job) => (
          <JobCard
            key={job.jobId}
            job={job}
            applicantCount={applicantCounts[job.jobId] || 0}
            onDelete={handleDeleteJob}
            onShowApplicants={handleShowApplicants}
          />
        ))}
      </div>
      <ApplicantsModal
        isOpen={isApplicantsModalOpen}
        onClose={() => setIsApplicantsModalOpen(false)}
        jobSeekers={jobSeekers}
      />
    </div>
  );
};

export default PostedJobs;
