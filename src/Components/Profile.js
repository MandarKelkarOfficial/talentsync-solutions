import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../Profile.css";
import Header from "./Header/Header";
import FullscreenImage from "./FullscreenImage/FullscreenImage";
import ProfileForm from "./ProfileForm/ProfileForm";

const Profile = () => {
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [userData, setUserData] = useState(null); // State to hold user data
  const [isEditable, setIsEditable] = useState(false); // State for edit/view mode

  const imageUrl = require("./Assets/team-4-800x800.jpg");
  const location = useLocation();
  const userName = location.state?.userName || "User"; // Default to 'User' if no name is passed

  // Function to fetch user data from the API
  const fetchUserData = async () => {
    // Replace with the actual logged-in username
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/${userName}`
      ); // Use the server URL and the endpoint
      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        console.error("Error fetching user data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  const handleImageClick = () => {
    setIsImageFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsImageFullscreen(false);
  };

  const toggleEditMode = () => {
    setIsEditable(!isEditable); // Toggle the editable mode
  };

  return (
    <div className="profile-container">
      <Header isEditable={isEditable} toggleEditMode={toggleEditMode} />
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-header">
            <img
              className="profile-image"
              alt="Profile"
              src={imageUrl}
              onClick={handleImageClick}
            />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="profile-buttons">
              <button className="connect-button">Connect</button>
              <button className="message-button">Message</button>
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-heading">22</span>
                <span className="stat-description"> Connections</span>
              </div>
              <div className="stat">
                <span className="stat-heading">10</span>
                <span className="stat-description"> Certificates</span>
              </div>
              <div className="stat">
                <span className="stat-heading">89</span>
                <span className="stat-description"> Jobs Applied</span>
              </div>
            </div>
          </div>
          {userData && (
            <div className="profile-details">
              <h3 className="profile-name">{`${userData.firstName} ${userData.lastName}, ${userData.age}`}</h3>
              {/* <p className="profile-location">{userData.address}</p> */}
              <br />
              <hr />
              <p className="profile-job">{userData.about}</p>
              <hr />
              {/* <p className="profile-bio">{userData.bio}</p> */}
            </div>
          )}
        </div>
        {/* 
        <div className="account-info">
          <h6>User Information</h6>
          <div className="user-info-card">
            <div className="form-group">
              <label>Username:</label>
              <p>{userData?.username}</p>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => (e.target.value)}
                readOnly // Always read-only
              />
            </div>
            <div className="form-group">
              <label>Email address:</label>
              <p>{userData?.email}</p>
            </div>
            <div className="form-group">
              <label>First name:</label>
              <p>{userData?.firstName}</p>
            </div>
            <div className="form-group">
              <label>Last name:</label>
              <p>{userData?.lastName}</p>
            </div>
            <div className="form-group">
              <label>Address:</label>
              <p>{userData?.address}</p>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City:</label>
                <p>{userData?.city}</p>
              </div>
              <div className="form-group">
                <label>Country:</label>
                <p>{userData?.country}</p>
              </div>
              <div className="form-group">
                <label>Postal code:</label>
                <p>{userData?.postalCode}</p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="account-info">
          <h6>Personal Information</h6>
          <form>
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={userData?.username}
                  onChange={(e) => e.target.value}
                  readOnly // Always read-only
                />
              </div>

              <div className="form-group">
                <label>First name</label>
                <input
                  type="text"
                  value={userData?.firstName}
                  onChange={(e) => e.target.value}
                  readOnly={!isEditable} // Toggle read-only mode
                />
              </div>

              <div className="form-group">
                <label>Last name</label>
                <input
                  type="text"
                  value={userData?.lastName}
                  onChange={(e) => e.target.value}
                  readOnly={!isEditable} // Toggle read-only mode
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  value={userData?.email}
                  onChange={(e) => e.target.value}
                  readOnly // Always read-only
                />
              </div>

              <div className="form-group">
                <label>DOB</label>
                <input
                  type="text"
                  value={userData?.dob.slice(0, 10)}
                  onChange={(e) => e.target.value}
                  readOnly={!isEditable} // Toggle read-only mode
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Postal code</label>
                <input
                  value={userData?.postalCode}
                  onChange={(e) => e.target.value}
                  readOnly={!isEditable} // Toggle read-only mode
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={userData?.phoneNumber}
                  onChange={(e) => e.target.value}
                  readOnly // Always read-only
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={userData?.address}
                onChange={(e) => e.target.value}
                readOnly={!isEditable} // Toggle read-only mode
              />
            </div>
          </form>
        </div>
      </div>
      <ProfileForm />
      {isImageFullscreen && (
        <FullscreenImage imageUrl={imageUrl} onClose={handleCloseFullscreen} />
      )}
    </div>
  );
};

export default Profile;
