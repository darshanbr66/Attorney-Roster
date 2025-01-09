import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminDashboard.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { motion } from "framer-motion";

function LoginPage() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]); // State to store users
  const [showForm, setShowForm] = useState(false); // Toggles form display
  const [showUsers, setShowUsers] = useState(false); // Toggles users list display
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !name) {
      alert('Please enter both User ID and name');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/save-employee-details', { name, userId, userType: 'employee' });

      if (response.status === 201) {
        alert(`${userId} added`);
        setUsers([...users, { userId, name }]); // Update user list
        setName('');
        setUserId('');
      } else {
        alert('Invalid User ID and name! Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while adding the user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm); // Toggle form visibility
  };

  const toggleUsers = async () => {
    if (!showUsers) {
      try {
        const response = await axios.get('http://localhost:3001/api/all-users');
        console.log("Response data:", response.data); // Check if data is correct
        if (response.status === 200) {
          setUsers(response.data.data); // Correctly access the 'data' array
          console.log("Updated users state:", response.data.data); // Log updated state
        } else {
          alert('Failed to fetch users.');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        alert('An error occurred while fetching users. Please try again later.');
      }
    }
    setShowUsers(!showUsers); // Toggle users list visibility
  };
  
  const gohome = () => navigate('/');
  const goBack = () => navigate('/AdminLoginPage');

  return (
    <div className="App1234">
      <motion.divBtnNames
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.5 }}
      >
        <header id="headerFlex123">
          <button className="button123" onClick={goBack}>
            <i className="fa-solid fa-backward"></i> Go Back
          </button>
          <img onClick={gohome} src="../Triangle-IP-Logo.png" alt="Logo" />
          <button className="button123" onClick={gohome}>
            <i className="fa-solid fa-house"></i> Home
          </button>
        </header>
      </motion.divBtnNames>

      <main id="main1234">
        <section className="heroAdmin1234">
          <h1>Dashboard</h1>
          <p>
            Delivering innovative and reliable software solutions to help you achieve your business goals.
          </p>
        </section>

        <section className="content1234">
          <h2>Our Services</h2>
          <div className="grid">
            <div className="card" onClick={toggleUsers}>
              <i className="fas fa-laptop-code"></i>
              <h3>Users</h3>
              <p>Find all data Users here</p>
            </div>
            <div className="card">
              <i className="fas fa-cloud"></i>
              <h3>Patent Data</h3>
              <p>Find all data here</p>
            </div>
            <div className="card">
              <i className="fas fa-tools"></i>
              <h3>Manipulate Data</h3>
              <p>Manipulate the data in well-formatted manner</p>
            </div>
          </div>
        </section>

        {showUsers && (
  <section className="usersSection">
    <h2>All Users</h2>
    {users.length > 0 ? (
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <strong>Name:</strong> {user.name}, <strong>User ID:</strong> {user.userId}
          </li>
        ))}
      </ul>
    ) : (
      <p>No users found.</p>
    )}
  </section>
)}

        <section className="cta">
          <h2>Add Users</h2>
          <button className="btn" onClick={toggleForm}>
            {showForm ? 'Hide' : 'Click here'}
          </button>
        </section>

        {showForm && (
          <div className="split-screen">
            <div className="left-section">
              <h2>Create User</h2>
              <form className="userForm" onSubmit={handleLogin}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>User ID:</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <footer id="bottom1234">
        <p>&copy; 2025 Triangle IP. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
