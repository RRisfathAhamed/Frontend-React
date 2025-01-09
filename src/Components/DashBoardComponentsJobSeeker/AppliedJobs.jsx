import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppliedJobs.css';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const roleid = localStorage.getItem("roleId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/application/jobs/${roleid}`);
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [roleid]);

  const handleDeleteClick = (jobId) => {
    setJobToDelete(jobId);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8081/application/deletebyjobidandjobseekerid`, {
        data: {
          jobSeekerId: roleid,
          jobId: jobToDelete,
        },
      });
      setJobs(jobs.filter(job => job.jobId !== jobToDelete));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
    setShowModal(false);
  };

  return (
    <div className="applied-jobs-container">
      {jobs.map((job) => (
        <div key={job.jobId} className="job-card">
          <div className={`status-badge ${job.isHired ? 'hired' : 'not-hired'}`}>
            {job.isHired ? 'Hired' : 'Not Hired'}
          </div>
          <h2 className='h2'>{job.jobTitle}</h2>
          <p>{job.jobDescription}</p>
          <p><strong>Experience:</strong> {job.jobExperience}</p>
          <p><strong>Education:</strong> {job.qualifiedEducation}</p>
          <p><strong>Location:</strong> {job.jobLocation}</p>
          <p><strong>Posted on:</strong> {new Date(job.jobPostedDate).toLocaleDateString()}</p>
          <div className="skills">
            {job.jobSkills.split(', ').map((skill, skillIndex) => (
              <span key={skillIndex} className="skill-tag">{skill}</span>
            ))}
          </div>
          <div className="action-buttons1">
            <button className="applied-button" disabled>Applied</button>
            <button className="delete-button" onClick={() => handleDeleteClick(job.jobId)}>Withdraw</button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to withdraw your application for this job?</h2>
            <div className="modal-buttons">
              <button className="modal-button yes-button" onClick={handleDeleteConfirm}>YES</button>
              <button className="modal-button" onClick={() => setShowModal(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
