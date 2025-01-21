const express = require("express");
const LoginModel = require("../models/Login");
const bcrypt = require('bcrypt');

const router = express.Router();

// Login Route
router.post("/check-login", async (req, res) => {
  console.log("Inside check-login route");

  const { userId, password, userType } = req.body;

  try {
    const user = await LoginModel.findOne({ userId, password, userType });

    if (user) {
      res.status(200).json({ message: "Login successful", user });
    } else {
      console.log("Inside check-login route 401");
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "An error occurred", details: err });
  }
});
function generatePassword() {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

//For saving new employees 
router.post('/save-employee-details', async (req, res) => {
  const { name, userId, userType } = req.body;
  const autoPassword = generatePassword();
  const hashPassword = await bcrypt.hash(autoPassword, 10);
  console.log(autoPassword);
  console.log(hashPassword);

  if (!name || !userId || !userType) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newEmployee = new LoginModel({ name, userId, password:hashPassword, userType });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee saved successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'UserId already exists.' });
    } else {
      console.error('Error saving employee:', err);
      res.status(500).json({ message: 'An error occurred while saving the employee.' });
    }
  }
});

module.exports = router;