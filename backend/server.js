const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('Mongo URI:', process.env.MONGO_URI);

const loginRoutes = require('./routes/login');
const employeeRoutes = require('./routes/employee');

const app = express();

// CORS setup to allow requests from the frontend
app.use(cors({
  origin: '*',  // Allow both frontend and local development
}));

app.use(express.json());  // Parse JSON requests

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  // Exit the process if the connection fails
  });

console.log('inside server');

// Routes
app.use('/api', loginRoutes); 
app.use('/api', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});