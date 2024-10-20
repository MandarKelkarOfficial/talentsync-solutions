import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "axios";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postalCode, setpostalCode] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [usernameError, setUsernameError] = useState(""); // New state for username error
  const [emailError, setEmailError] = useState(""); // New state for email error

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Temporarily store user data
    const userData = {
      username,
      email,
      password,
      firstName,
      lastName,
      age,
      dob,
      address,
      about,
      phoneNumber,
      postalCode,
    };

    try {
      // First check for duplicate username or email
      const duplicateCheck = await axios.post(
        "http://localhost:5000/api/check-duplicate",
        { username, email }
      );

      if (!duplicateCheck.data.success) {
        if (duplicateCheck.data.message.includes("username")) {
          setUsernameError(duplicateCheck.data.message); // Display username error
        } else if (duplicateCheck.data.message.includes("email")) {
          setEmailError(duplicateCheck.data.message); // Display email error
        }
        return;
      }

      // If no duplicate, send OTP to the user's email
      const otpResponse = await axios.post(
        "http://localhost:5000/api/send-email",
        { email }
      );

      if (otpResponse.data.success) {
        // Store userData in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userData));

        // Navigate to OTP verification page
        navigate("/otp-verification", { state: { email } });
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      // Handle 409 Conflict error for duplicate username or email
      if (error.response && error.response.status === 409) {
        const message = error.response.data.message;
        if (message.includes("Username")) {
          setUsernameError(message); // Display username error
        } else if (message.includes("Email")) {
          setEmailError(message); // Display email error
        }
      } else {
        console.error("Error during registration process:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <MDBContainer
      fluid
      className="p-4 background-radial-gradient overflow-hidden d-flex justify-content-center align-items-center "
    >
      <MDBCol md="6">
        <MDBCard className="my-5 bg-glass">
          <h3
            className="display-3 fw-bold ls-tight px-1 text-center mt-3"
            style={{ color: "hsl(218, 81%, 95%)" }}
          >
            <span style={{ color: "#ad1fff" }}>REGISTER</span>
          </h3>
          <MDBCardBody className="p-5">
            <form onSubmit={handleSubmit}>
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </MDBCol>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol col="6">
                  {/* {usernameError && <span className="text-danger mt-0">{usernameError}</span>} Username error */}
                  <MDBInput
                    wrapperClass="mb-4"
                    label={
                      usernameError ? (
                        <>
                          {" "}
                          <span className="text-danger">{usernameError}</span>
                        </>
                      ) : (
                        "Username"
                      )
                    }
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={usernameError ? "is-invalid" : ""}
                  />
                </MDBCol>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label={
                      emailError ? (
                        <>
                          {" "}
                          <span className="text-danger">{emailError}</span>
                        </>
                      ) : (
                        "Email"
                      )
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={emailError ? "is-invalid" : ""}
                  />
                  {/* {emailError && <div className="text-danger">{emailError}</div>} Email error */}
                </MDBCol>

                <MDBCol col="2">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Postal Code" // New Phone Number Field
                    value={postalCode}
                    onChange={(e) => setpostalCode(e.target.value)}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </MDBCol>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    type="date"
                    required
                  />
                </MDBCol>

                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Phone Number" // New Phone Number Field
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
                wrapperClass="mb-4"
                label="About (50 characters)"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Confirm Password"
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={passwordError ? "is-invalid" : ""}
              />
              {/* Show error message if passwords do not match */}
              {passwordError && (
                <div className="text-danger mb-3">{passwordError}</div>
              )}
              <MDBBtn type="submit" className="w-100 mb-4" size="md">
                Sign Up
              </MDBBtn>
            </form>
            <Link to="/login">
              <MDBBtn className="w-100 mb-4" size="md">
                Login
              </MDBBtn>
            </Link>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBContainer>
  );
}

export default Register;
