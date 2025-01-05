import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { motion } from "framer-motion";

function LoginPage() {
  const [name, setname] = useState('');
  const [userId, setUserId] = useState('');
  const userType = 'employee';

  const [loading, setLoading] = useState(false); 
  const [showname, setShowname] = useState(false);

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !name) {
      alert('Please enter both User ID and name');
      return;
    }

    setLoading(true); 

    const API_URL = process.env.REACT_APP_API_URL;

    try {
      // Make the login request to the backend
      // const response = await axios.post(`${API_URL}/api/save-employee-details`, { name, userId, userType });
      const response = await axios.post('http://localhost:3000/api/save-employee-details', { name, userId, userType });

      if (response.status === 201) {
        alert(`${userId} added`);
        // navigate('/admin');
      } else {
        alert('Invalid User Id and name! Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred while logging in. Please try again later.');
    } finally {
      setLoading(false); 
    }


  };

  function gohome(){
    navigate('/');
  }
  function goBack() {
    navigate('/AdminLoginPage');
  }

  function goToComparisonFile() {
    window.location.href = 'https://data-comparison-1.onrender.com';
}

  return (
    <div className="App">
      <motion.divBtnNames
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 2.5}}
                >
      <header id='headerFlex'>
      <button onClick={goBack}> <i class="fa-solid fa-backward"></i> Go Back</button>
        <img onClick={gohome} src="../Triangle-IP-Logo.png" ></img>
        <button> <i class="fa-solid fa-house"></i> Home</button>
      </header>
      </motion.divBtnNames>
      <div id='fileDiv'>
        <button onClick={goToComparisonFile}>Files</button>
      </div>
      <h3>Create Employee</h3>
      <main>
        <form onSubmit={handleLogin}>
          <div id="div1">
            <input
              type="text"
              placeholder="Employee Name"
              minLength={5}
              value={name}
                onChange={(e) => setname(e.target.value)}

            />
            <br />
            <div style={{ position: 'relative' }}>
              <input
                type='text'
                placeholder="Enter User Id"
                minLength={8}
                value={userId}
              onChange={(e) => setUserId(e.target.value)}
              />

            </div>
            <br />
            <button id="logBtn" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </main>
      <footer>
        <p>&copy; 2024 Sigvitas. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;