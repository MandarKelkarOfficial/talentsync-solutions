// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   MDBBtn,
//   MDBContainer,
//   MDBCol,
//   MDBCard,
//   MDBCardBody,
//   MDBInput,
//   MDBIcon,
// } from "mdb-react-ui-kit";
// import "mdb-react-ui-kit/dist/css/mdb.min.css";

// function OtpVerification() {
//   const [enteredOtp, setEnteredOtp] = useState("");
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [error, setError] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email; // Get email from the registration process

//   // Effect to send OTP when the component mounts
//   useEffect(() => {
//     const sendOtp = async () => {
//       try {
//         const response = await axios.post(
//           "http://localhost:5000/api/send-email",
//           { email }
//         );
//         if (response.data.success) {
//           console.log(`Generated OTP sent to email: ${email}`);
//         } else {
//           setError("Failed to send OTP. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error sending OTP:", error);
//         setError("Failed to send OTP. Please try again.");
//       }
//     };

//     if (email) {
//       sendOtp();
//     }
//   }, [email]);

//   // Handle OTP input and verification
//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5000/api/verify-otp", {
//         email,
//         enteredOtp,
//       });
//       if (response.data.success) {
//         setOtpVerified(true);
//         setError("");
//         // Navigate to success page or handle successful OTP verification
//         console.log("OTP verified successfully!");
//         // Save user data to MongoDB here after successful OTP verification
//         navigate("/login"); // For example, navigate to success page
//       } else {
//         setError("Invalid OTP, please try again.");
//         setOtpVerified(false);
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError("Failed to verify OTP. Please try again.");
//     }
//   };

//   return (
//     <MDBContainer
//       fluid
//       className="p-4 d-flex align-items-center justify-content-center"
//       style={{
//         minHeight: "100vh",
//         backgroundImage:
//           "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <MDBCol md="6">
//         <MDBCard
//           className="bg-glass"
//           style={{
//             borderRadius: "1rem",
//             backgroundColor: "rgba(255,255,255,0.9)",
//           }}
//         >
//           <MDBCardBody className="p-5">
//             <div className="text-center mb-4">
//               <MDBIcon icon="lock" size="3x" style={{ color: "#ad1fff" }} />
//               <h3 className="mt-3">OTP Verification</h3>
//               <p>Enter the OTP sent to your email to verify your identity</p>
//             </div>
//             <form onSubmit={handleOtpSubmit}>
//               <MDBInput
//                 wrapperClass="mb-4"
//                 label="Enter OTP"
//                 color="purple"
//                 value={enteredOtp}
//                 onChange={(e) => setEnteredOtp(e.target.value)}
//                 required
//               />
//               {error && <div className="text-danger mb-3">{error}</div>}
//               <MDBBtn type="submit" color="purple" className="w-100 mb-4" size="md">
//                 Verify OTP
//               </MDBBtn>
//             </form>
//             {otpVerified && <div className="text-success">OTP Verified Successfully!</div>}
//           </MDBCardBody>
//         </MDBCard>
//       </MDBCol>
//     </MDBContainer>
//   );
// }

// export default OtpVerification;




import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

function OtpVerification() {
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Get email from the registration process
  const registrationData = JSON.parse(sessionStorage.getItem("userData"));

  // Effect to send OTP when the component mounts
  useEffect(() => {
    const sendOtp = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/send-email",
          { email }
        );
        if (response.data.success) {
          console.log(`Generated OTP sent to email: ${email}`);
        } else {
          setError("Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        setError("Failed to send OTP. Please try again.");
      }
    };

    if (email) {
      sendOtp();
    }
  }, [email]);

  // Handle OTP input and verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        enteredOtp,
      });
      if (response.data.success) {
        setOtpVerified(true);
        setError("");

        // Now that OTP is verified, save the registration data
        await saveRegistrationData();

        // Navigate to success page or handle successful OTP verification
        console.log("OTP verified and registration data saved!");
        navigate("/login"); // For example, navigate to success page
      } else {
        setError("Invalid OTP, please try again.");
        setOtpVerified(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  // Function to save registration data to MongoDB after OTP verification
  const saveRegistrationData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        ...registrationData, // All registration data to be saved
        email, // Include the email as well
      });
      if (response.data.success) {
        console.log("Registration data saved to MongoDB.");
      } else {
        console.error("Failed to save registration data:", response.data.message);
        setError("Failed to save registration data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving registration data:", error);
      setError("Failed to save registration data. Please try again.");
    }
  };

  return (
    <MDBContainer
      fluid
      className="p-4 d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <MDBCol md="6">
        <MDBCard
          className="bg-glass"
          style={{
            borderRadius: "1rem",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <MDBCardBody className="p-5">
            <div className="text-center mb-4">
              <MDBIcon icon="lock" size="3x" style={{ color: "#ad1fff" }} />
              <h3 className="mt-3">OTP Verification</h3>
              <p className="text-dark text-center">Enter the OTP sent to your email to verify your identity</p>
            </div>
            <form onSubmit={handleOtpSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                label="Enter OTP"
                color="purple"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                required
              />
              {error && <div className="text-danger mb-3">{error}</div>}
              <MDBBtn type="submit" color="purple" className="w-100 mb-4" size="md">
                Verify OTP
              </MDBBtn>
            </form>
            {otpVerified && <div className="text-success">OTP Verified Successfully!</div>}
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBContainer>
  );
}

export default OtpVerification;
