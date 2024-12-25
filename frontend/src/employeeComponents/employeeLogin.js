import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './employeeLogin.css';

function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const userType = 'employee';
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert('Please enter both User ID and Password');
      return;
    }

    setLoading(true);

    const API_URL = process.env.REACT_APP_API_URL;
    
    try {
      const response = await axios.post(`${API_URL}/api/check-login`, { userId, password, userType });
      // const response = await axios.post('http://localhost:3000/api/check-login', { userId, password, userType });
      
      if (response.status === 200) {
        alert('Login successful!');
        navigate('/EmployeeDashBoard', { state:{ userId }}); 
      } else {
        alert('Invalid credentials. Please try again.');
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
  return (
    <div className="App">
      <header>
        <h2 onClick={gohome}>Si<strong>g</strong>vitas</h2>
      </header>
      
      <main>
        <h3>Employee Login Page</h3>
        <form onSubmit={handleLogin}>
          <div id='div1'>
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <br />
            <button id='logBtn' type="submit" disabled={loading}>
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