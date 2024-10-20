import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    const fetchedUserName = username; // Replace this with actual fetched data
    setUsername(fetchedUserName);

    if (data.success) {
      navigate("/dashboard", { state: { userName: fetchedUserName } }); // Redirect on success
    } else {
      setError(data.message); // Set error message
    }
  };

  return (
    <MDBContainer
      fluid
      className="p-4  background-radial-gradient overflow-hidden"
    >
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h2
            className="my-5 display-3 fw-bold ls-tight px-3"
            style={{ color: "hsl(218, 81%, 95%)" }}
          >
           Smart Competency Diagnostic and 
            <br />
            <span style={{ color: "hsl(218, 81%, 75%)" }}>Candidate Profile Score Calculator</span>
          </h2>

          <p className="px-3" style={{ color: "hsl(218, 81%, 85%)" }}>
            The <strong>Smart Competency Diagnostic and Candidate Profile Score
            Calculator</strong> is an AI-driven tool that evaluates candidates'
            profiles by analyzing skills, experience, and qualifications against
            job requirements. It diagnoses strengths and gaps, providing
            personalized feedback and suggestions for improvement. The system
            generates a profile score based on ATS-friendly criteria, ensuring
            relevance in the job market. Additionally, it recommends courses to
            enhance key competencies. This solution helps candidates optimize
            their profiles and aids recruiters in making informed decisions,
            improving overall job matching efficiency.
          </p>
        </MDBCol>

        <MDBCol md="6" className="position-relative">
          <MDBCard className="my-5 bg-glass">
            <h3
              className="display-3 fw-bold ls-tight px-1 text-center mt-3"
              style={{ color: "hsl(218, 81%, 95%)" }}
            >
              <span style={{ color: "#ad1fff" }}>LOGIN</span>
            </h3>

            <MDBCardBody className="p-5">
              {error && <p style={{ color: "red" }}>{error}</p>}{" "}
              {/* Display error message */}
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBBtn className="w-100 mb-4" size="md" onClick={handleLogin}>
                Login
              </MDBBtn>
              <Link to="/">
                <MDBBtn className="w-100 mb-4" size="md">
                  Register
                </MDBBtn>
              </Link>
              <div className="text-cente r">
                <p className="text-dark">or sign up with:</p>
                <MDBIcon
                  fab
                  icon="facebook-f"
                  size="sm"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                />
                <MDBIcon
                  fab
                  icon="twitter"
                  size="sm"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                />
                <MDBIcon
                  fab
                  icon="google"
                  size="sm"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                />
                <MDBIcon
                  fab
                  icon="github"
                  size="sm"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
