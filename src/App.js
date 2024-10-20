// ScrapeCourses.js

import React from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
// import Scrper from './Components/Scrper'
import Register from './Components/Register'
import OtpVerification from './Components/OtpVerification'
import Login from './Components/Login'
import UserProfileForm from './Components/UserProfileForm'
import Profile from './Components/Profile'

export default function App() {
  return (

<Router>
      <Routes>
      
        <Route path="/" element={<Register/>} />

     
        <Route path="/login" element={<Login />} />

        <Route path="/otp-verification" element={<OtpVerification/>} />

        <Route path="/dashboard" element={<Profile/>} />

        <Route path="/userprofileform" element={<UserProfileForm/>} />
      </Routes>
    </Router>
  )
}


