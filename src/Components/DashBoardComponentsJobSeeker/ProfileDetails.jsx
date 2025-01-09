import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileDetails.css';
import { toast } from 'react-toastify';

const ProfileDetails = () => {
    const roleid = localStorage.getItem('roleId');

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        registeredDate: '',
        skills: '',
        education: '',
        experience: ''
    });

    const [cvData, setCvData] = useState({ cvBase64: '', fileType: '' });
    const [cvUrl, setCvUrl] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchCV();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/jobseeker/get/${roleid}`);
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchCV = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/jobseeker/get-cv/${roleid}`);
            if (response.data && response.data.cvFile) {
                setCvData({
                    cvBase64: response.data.cvFile,
                    fileType: response.data.fileName.split('.').pop().toLowerCase()
                });
            } else {
                console.error('No CV file found in the response');
            }
        } catch (error) {
            console.error('Error fetching CV file:', error);
        }
    };

    const deleteCV = async () => {
        try {
            await axios.delete(`http://localhost:8081/jobseeker/delete-cv/${roleid}`);
            setCvData({ cvBase64: '', fileType: '' });
            setCvUrl('');
            toast.success('CV Deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error deleting CV:', error);
            toast.error('CV deletion failed!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    useEffect(() => {
        if (cvData.cvBase64) {
            const byteCharacters = atob(cvData.cvBase64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: `application/${cvData.fileType}` });
            const url = URL.createObjectURL(blob);
            setCvUrl(url);
        }
    }, [cvData]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(profile).some(value => value === '')) {
            alert('All fields must be filled');
            return;
        }
        try {
            await axios.put(`http://localhost:8081/jobseeker/update/${roleid}`, profile);
            toast.success('Profile Updated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Profile update failed!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const renderCV = () => {
        if (cvData.fileType === 'pdf') {
            return <iframe src={cvUrl} title="CV Viewer" style={{ width: '100%', height: '500px' }} />;
        } else if (['doc', 'docx'].includes(cvData.fileType)) {
            return <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cvUrl)}`} title="CV Viewer" style={{ width: '100%', height: '500px' }} />;
        } else if (['jpg', 'jpeg', 'png'].includes(cvData.fileType)) {
            return <img src={cvUrl} alt="CV" style={{ maxWidth: '100%' }} />;
        } else {
            return <p>Unsupported file type</p>;
        }
    };

    return (
        <div className="profile-details">
            <h2>Profile Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Contact Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={profile.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <input
                            type="text"
                            id="gender"
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="registeredDate">Registered Date</label>
                    <input
                        type="date"
                        id="registeredDate"
                        name="registeredDate"
                        value={profile.registeredDate}
                        readOnly          
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="skills">Skills</label>
                    <textarea
                        id="skills"
                        name="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <textarea
                        id="education"
                        name="education"
                        value={profile.education}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="experience">Experience</label>
                    <textarea
                        id="experience"
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cv">Resume</label>
                    {cvUrl ? (
                        <div>
                            {renderCV()}
                            <button type="button" className="delete-btn" onClick={deleteCV}>Delete CV</button>
                        </div>
                    ) : (
                        <p>No Resume uploaded.</p>
                    )}
                </div>
                <div className="button-group">
                    <button type="button" className="cancel-btn">Cancel</button>
                    <button type="submit" className="save-btn">Save</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileDetails;