import React, { useState } from 'react';
import './ProfileForm.css';
import '../../Profile.css'
// import '../ProfileForm'

const ProfileForm = () => {
  const [mobile, setMobile] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('male'); // Default to male
  const [married, setMarried] = useState('no'); // Default to no
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [year, setYear] = useState('select'); // Default option for year
  const [message, setMessage] = useState('');

  const handleClear = () => {
    setMobile('');
    setEnrollment('');
    setInstitution('');
    setDepartment('');
    setBirthDate('');
    setGender('male'); // Reset to default
    setMarried('no');  // Reset to default
    setAge('');
    setState('');
    setDistrict('');
    setSubDistrict('');
    setYear('select'); // Reset to default
    setMessage('');
  };

  // Restrict the calendar to start from 2006
  const maxDate = '2006-12-31'; // Maximum date allowed for DOB

  // Function to calculate age based on DOB
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birth month hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setBirthDate(selectedDate);
    
    // Calculate and set age
    if (selectedDate) {
      const calculatedAge = calculateAge(selectedDate);
      setAge(calculatedAge);
    } else {
      setAge(''); // Clear age if no DOB is selected
    }
  };

  return (
    <div className="profile-c">
      <h6>E-Data Entry Page</h6>
      <form>
        <div className="form-group">
          <label>Mobile</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Enrollment</label>
          <input
            type="text"
            value={enrollment}
            onChange={(e) => setEnrollment(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Institution</label>
          <input
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={handleDateChange}
              max={maxDate}  // Set maximum date for DOB
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Married</label>
            <select
              value={married}
              onChange={(e) => setMarried(e.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={age}
              readOnly // Age will be auto-calculated and not editable
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Sub-District</label>
            <input
              type="text"
              value={subDistrict}
              onChange={(e) => setSubDistrict(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="select">Select Year</option>
            <option value="1st">1st Year</option>
            <option value="2nd">2nd Year</option>
            <option value="3rd">3rd Year</option>
            <option value="4th">4th Year</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="profile-buttons centerbtn">
          <button className="connect-button b" type="submit">Submit</button>
          <button 
            className="message-button c" 
            type="button" 
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
