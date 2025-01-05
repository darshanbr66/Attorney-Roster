import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { motion } from "framer-motion";

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const userType = 'admin';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert('Please enter both User ID and Password');
      return;
    }

    setLoading(true);

    const API_URL = process.env.REACT_APP_API_URL;

    try {
      // const response = await axios.post(`${API_URL}/api/check-login`, { userId, password, userType });
      const response = await axios.post('http://localhost:3000/api/check-login', { userId, password, userType });

      // console.log("Login Response:", response);

      if (response.status === 200) {
        // Save token or user info to localStorage
        localStorage.setItem('authToken', response.data.token); // Assuming a token is returned
        console.log('User saved to localStorage:', response.data.user);

        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          // Redirect to login page if no user data is found
          navigate('/AdminLoginPage');
        }
        console.log(user);
        alert(`Welcome, ${response.data.user.name}`);
        navigate('/AdminDashboard');
      } else {
        alert('Invalid User ID and Password! Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred while logging in. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  function gohome() {
    navigate('/');
  }
  function goBack() {
    navigate('/HomePage');
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
      <main>
      <h3>Admin Login</h3>
        <form onSubmit={handleLogin}>
          <div id="div1">
            <input
              type="text"
              placeholder="Enter User ID"
              minLength={8}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <br />
            <div style={{ position: 'relative' }}>
              <input id='in2'
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2rem' }} // Create space for the icon
              />
              <span id='toggle'
                onClick={togglePasswordVisibility}
                className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}

              />
            </div>
            <br />
            <button id="logBtn" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
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