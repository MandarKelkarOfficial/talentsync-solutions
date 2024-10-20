const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON data
app.use(bodyParser.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/sihDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure unique usernames
  email: { type: String, required: true, unique: true }, // Ensure unique emails
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNumber:{ type:String, required: true},
  about: { type: String },
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },
  profileImage: { type: String },
});

// Create User model
const User = mongoose.model("User", userSchema);

// Register route
app.post("/api/register", async (req, res) => {
  const { username, email, password, firstName, lastName, age, dob, address, about,phoneNumber,postalCode } = req.body;

  // Validate input
  // eslint-disable-next-line no-undef
  if (!username || !email || !password || !firstName || !lastName || !age || !dob || !address|| !phoneNumber || !postalCode) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      dob,
      address,
      about,
      phoneNumber,
      postalCode,
    });

    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving user:", error);
    if (error.code === 11000) {
      // Duplicate key error (username or email)
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Simulate session or token (for now)
    res.json({ success: true, userId: user._id, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get user data route
app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Exclude the password field from the response
    const { password, ...userData } = user._doc; // _doc gives you access to the actual document
    res.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Temporary storage for OTP (in a production app, consider a more persistent storage)
let otpStorage = {}; // e.g., { userEmail: generatedOtp }

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sdbcontactme@gmail.com",
    pass: "fywacjgevdugsgtz",
  },
});

// Email sending route (after user registration)
app.post("/api/send-email", async (req, res) => {
  const { email } = req.body;

  // Check if OTP already exists for the email
  if (otpStorage[email]) {
    return res.status(200).json({
      success: true,
      message: "OTP already sent. Please check your email.",
    });
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
    from: "sdbcontactme@gmail.com", // Sender address
    to: email, // List of receivers
    subject: "OTP Verification for TalentSync Sol", // Subject line
    text: `Your OTP for verification is: ${otp}`, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    // Save OTP to temporary storage
    otpStorage[email] = otp;
    res.status(200).json({ success: true, message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// OTP Verification route
app.post("/api/verify-otp", (req, res) => {
  const { email, enteredOtp } = req.body; // Get email and entered OTP from the request

  if (otpStorage[email] && otpStorage[email] === enteredOtp) {
    delete otpStorage[email]; // Clear OTP after verification
    res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP, please try again." });
  }
});



// server.js or routes/user.js
app.post('/api/check-duplicate', async (req, res) => {
  const { username, email } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ success: false, message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error checking duplicates:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// Start the server
const PORT = process.env.PORT || 5000; // Allow port to be set by environment variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
