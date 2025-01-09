import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import './UploadCV.css';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const roleid = localStorage.getItem('roleId');
  const [data, setData] = useState(null);
  const [uploadClick, setUploadClick] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    handleFileSelection(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleFileSelection = (selectedFile) => {
    const type = selectedFile.type;
    if (type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileUrl(URL.createObjectURL(selectedFile));
    } else {
      toast.error('Please select a PDF file.');
    }
  };

  // Handle file upload and processing
  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!roleid) {
      toast.error('User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const response = await axios.post(
          `http://127.0.0.1:5001/upload-cv`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
      );

      if (response.status === 200) {

        setData(response.data);
        setExperience(response.data.sections.experience);
        setSkills(response.data.sections.skills);
        setEducation(response.data.sections.education);
        toast.success('File uploaded successfully!');

        const springResponse = await axios.post(`http://localhost:8081/jobseeker/upload-cv-img/${roleid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (springResponse.status === 200) {
        console.log(springResponse.data.message || 'File uploaded to Spring Boot successfully!');}
        else{
            console.log(springResponse.data.message || 'Failed to upload file.');
        }

      } else {
        toast.error(response.data.message || 'Failed to upload file.');
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file. Please try again.');

    } finally {
      setUploading(false);
      setUploadClick(true);
    }
  };

  // Handle file cancel
  const handleCancel = () => {
    setFile(null);
    setFileName('');
    setFileUrl(null);
    setUploadClick(false);
  };

  // Function to remove commas from school names in education
  const removeCommasFromEducation = (educationData) => {
    return educationData.map((edu) => ({
      ...edu,
      institution: edu.institution ? edu.institution.replace(/,/g, '') : '', // Ensure institution is valid
    }));
  };

  //Save Skills, Experience, Education
  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!roleid) {
      toast.error('User not logged in');
      return;
    }


    const experienceString = (experience || [])
        .map(
            (exp) =>
                `${exp.company || 'Unknown Company'} [${exp.dates || 'No Dates'}] ${
                    exp.responsibilities?.length > 0 ? exp.responsibilities.join(', ') : 'No responsibilities listed'
                }`
        )
        .join('\n');


    const educationString = (education || [])
        .map(
            (edu) =>
                `${edu.institution || 'Unknown Institution'} [${edu.degree || 'No Degree'}]`
        )
        .join('\n');

    const payload = {
      skills: skills.join(', '), // Convert array to comma-separated string
      experience: experienceString,
      education: educationString,
    };
    try {
      const response = await axios.put(
          `http://localhost:8081/jobseeker/update_skills/${roleid}`,
          payload
      );

      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        navigate('/profiledetails/jobseeker');
      } else {
        toast.error(response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(
          error.response?.data?.message ||
          'Error occurred while updating the profile.'
      );
    }
  };



  return (
      <div className="resume-upload">
        <h2>Upload Resume</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop the files here ...</p> : <p>Drag and drop your resume or click to select files</p>}
              {fileName && <p className="file-name">Selected file: {fileName}</p>}
            </div>
          </div>
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="save-btn" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>

        {fileUrl && uploadClick && (
            <div className="skills-details">
              <h1>Your Profile</h1>
              <form onSubmit={handleOnSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="skills">Skills</label>
                    <textarea
                        id="skills"
                        name="skills"
                        value={skills.join(', ')}
                        onChange={(e) => setEducation(e.target.value)}
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <textarea
                        id="education"
                        name="education"
                        value={
                          removeCommasFromEducation(education || []) // Ensure education is not null
                              .map((edu) => `${edu.institution || 'Unknown Institution'} [ ${edu.degree || 'No Degree'} ]`)
                              .join('\n\n') // Two line breaks between each education entry
                        }
                        onChange={(e) => setEducation(e.target.value || '')}
                        required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="experience">Experience</label>
                    <textarea
                        id="experience"
                        name="experience"
                        value={
                          (experience || []) // Ensure experience is not null
                              .map((exp) =>
                                  `${exp.company || 'Unknown Company'} [ ${exp.dates || 'No Dates'} ] ${
                                      exp.responsibilities?.length > 0 ? exp.responsibilities.join(', ') : 'No responsibilities listed'
                                  }`
                              )
                              .join('\n\n') // Two line breaks between each experience entry
                        }
                        onChange={(e) => setExperience(e.target.value || '')}
                        required
                    />
                  </div>

                </div>
                <div className="button-group">
                  <button type="submit" className="save-btn">Save</button>
                </div>
              </form>
            </div>
        )}
      </div>
  );
};

export default ResumeUpload;
