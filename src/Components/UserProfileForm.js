import React, { useState, useEffect } from 'react';
import { MDBInput, MDBRow, MDBCol, MDBBtn, MDBContainer, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    aboutMe: '',
    profileImage: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from backend on load
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const data = await response.json();

        // Ensure fetched data is structured correctly
        const userProfile = {
          username: data.username || '',
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          postalCode: data.postalCode || '',
          aboutMe: data.aboutMe || '',
          profileImage: data.profileImage || null,
        };

        setFormData(userProfile);

        if (userProfile.profileImage) {
          setImagePreview(`http://localhost:5000/uploads/${userProfile.profileImage}`);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profileImage: file,
    }));
    setImagePreview(URL.createObjectURL(file)); // Image preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSubmit.append(key, formData[key]);
    });
  
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        body: formDataToSubmit,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      if (result.success) {
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile.');
    }
  };

  if (loading) {
    return <div>Loading profile...</div>; // Show loading while fetching profile
  }

  return (
    <MDBContainer>
      <MDBCard className="mt-5">
        <MDBCardBody>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h4 className="mb-4">User Information</h4>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput label="Username" name="username" value={formData.username} onChange={handleChange} disabled />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} disabled />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </MDBCol>
            </MDBRow>

            <h4 className="mt-4 mb-3">Contact Information</h4>
            <MDBRow>
              <MDBCol md="12">
                <MDBInput label="Address" name="address" value={formData.address} onChange={handleChange} />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput label="City" name="city" value={formData.city} onChange={handleChange} />
              </MDBCol>
              <MDBCol md="3">
                <MDBInput label="Country" name="country" value={formData.country} onChange={handleChange} />
              </MDBCol>
              <MDBCol md="3">
                <MDBInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
              </MDBCol>
            </MDBRow>

            <h4 className="mt-4 mb-3">About Me</h4>
            <MDBInput type="textarea" label="About Me" rows="4" name="aboutMe" value={formData.aboutMe} onChange={handleChange} />

            <h4 className="mt-4 mb-3">Profile Image</h4>
            <MDBInput type="file" onChange={handleImageUpload} />
            {imagePreview && <img src={imagePreview} alt="Profile" className="img-thumbnail mt-3" style={{ width: '150px', height: '150px' }} />}

            <MDBBtn type="submit" className="mt-4">
              Save Profile
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default UserProfileForm;
