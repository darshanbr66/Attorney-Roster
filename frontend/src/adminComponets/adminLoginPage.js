import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminDashboard.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import { motion } from "framer-motion";
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';

function AdminDashboard() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [patentData, setPatentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null); // State to track the active card
  const [manipulatedData, setManipulatedData] = useState([]); // State to track manipulated data
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId || !name) {
      alert('Please enter both User ID and name');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/save-employee-details`, { name, userId, email, userType: 'employee' });
            // const response = await axios.post('http://localhost:3001/api/save-employee-details', { name, userId, email, userType: 'employee' });
      alert(`${userId} added successfully.`);
      setUsers([...users, { userId, name }]);
      setName('');
      setUserId('');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Displays 'User ID already exists...' error
      } else {
        console.error('Error:', err);
        alert('An error occurred while adding the user. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleUsers = async () => {
    if (!users.length) {
      try {
        const response = await axios.get(`${API_URL}/api/all-users`);

        // const response = await axios.get('http://localhost:3001/api/all-users');
        if (response.status === 200) {
          setUsers(response.data.data);
        } else {
          alert('Failed to fetch users.');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        alert('An error occurred while fetching users. Please try again later.');
      }
    }
  };

  const togglePatentData = async () => {
    if (!patentData.length) {
      try {
        // const response = await axios.get('http://localhost:3001/api/all-users-data');
// 
        const response = await axios.get(`${API_URL}/api/all-users-data`);
        if (response.status === 200) {
          setPatentData(response.data.data);
        } else {
          alert('Failed to fetch patent data.');
        }
      } catch (err) {
        console.error('Error fetching patent data:', err);
        alert('An error occurred while fetching patent data. Please try again later.');
      }
    }
  };
  const togglePatentDataForManipulation = async () => {
    if (!patentData.length) {
      try {
        // const response = await axios.get('http://localhost:3001/api/all-users-data');
        const response = await axios.get(`${API_URL}/api/all-users-data`);

        if (response.status === 200) {
          setPatentData(response.data.data);
        } else {
          alert('Failed to fetch patent data.');
        }
      } catch (err) {
        console.error('Error fetching patent data:', err);
        alert('An error occurred while fetching patent data. Please try again later.');
      }
    }
  };
  const manipulateData = () => {
    // Assuming you want to manipulate patent data (or users' data) here
    const manipulated = patentData.map(item => ({
      ...item,
      name: item.name.toUpperCase(), // Example manipulation: converting names to uppercase
      updatedPhoneNumber: item.updatedPhoneNumber || 'Not Available', // Default value if phone number is missing
    }));
    setManipulatedData(manipulated);
  };
  function gohome() {
    const userConfirmed = window.confirm('Do you want to exit?');
    if (userConfirmed) {
          navigate('/');
    } else {
      console.log('User chose to stay on the page.');
    }
  }
  
  const goBack = () => navigate('/AdminLoginPage');

  const handleCardClick = (card) => {
    if (activeCard === card) {
      setActiveCard(null); // Hide the card if it's already active
    } else {
      setActiveCard(card); // Show the selected card
  
      // Fetch data for Users or Patent Data if not already fetched
      if (card === 'users') {
        toggleUsers(); // Fetch users data if not already fetched
      } else if (card === 'patentData') {
        togglePatentData(); // Fetch patent data if not already fetched
      }else{
        togglePatentDataForManipulation();
      }
    }
  };

  return (
    <div className="App1234">
      <motion.div
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
      </motion.div>

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
            <div className="card" onClick={() => handleCardClick('users')}>
              <i className="fas fa-laptop-code"></i>
              <h3>Users</h3>
              <p>Find all data Users here</p>
            </div>
            <div className="card" onClick={() => handleCardClick('patentData')}>
              <i className="fas fa-cloud"></i>
              <h3>Attorney Data</h3>
              <p>Find all data here</p>
            </div>
            <div className="card" onClick={() => handleCardClick('dataManipulation')}>
              <i className="fas fa-tools"></i>
              <h3>Manipulate Data</h3>
              <p>Manipulate the data in well-formatted manner</p>
            </div>
          </div>
        </section>

        {/* Show users data if the 'users' card is active */}
        {activeCard === 'users' && (
          <section className="usersSection" >
            <h2>All Users</h2>
            <table className="user-table" style={{background:'white'}}>
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>User ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Show patent data if the 'patentData' card is active */}
        {activeCard === 'patentData' && (
          <section className="patentDataSection">
            <h2>All Patent Data</h2>
            <table className="user-table" style={{background:'white', textWrap:'wrap',}}>
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Address Line 1</th>
                  <th>Address Line 2</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Zipcode</th>
                  <th>Phone Number</th>
                  <th>Reg Code</th>
                  <th>Attorney</th>
                  <th>Date of Patent</th>
                  <th>Agent Licensed</th>
                  <th>Firm or Organization</th>
                  <th>Updated Phone Number</th>
                  <th>Email Address</th>
                  <th>Updated Organization/Law Firm Name</th>
                  <th>Firm/Organization URL</th>
                  <th>Updated Address</th>
                  <th>Updated City</th>
                  <th>Updated State</th>
                  <th>Updated Country</th>
                  <th>Updated Zipcode</th>
                  <th>LinkedIn Profile URL</th>
                  <th>Notes</th>
                  <th>Initials</th>
                  <th>Data Updated as on</th>
                </tr>
              </thead>
              <tbody>
                {patentData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.organization}</td>
                    <td>{data.addressLine1}</td>
                    <td>{data.addressLine2}</td>
                    <td>{data.city}</td>
                    <td>{data.state}</td>
                    <td>{data.country}</td>
                    <td>{data.zipcode}</td>
                    <td>{data.phoneNumber}</td>
                    <td>{data.regCode}</td>
                    <td>{data.agentAttorney}</td>
                    <td>{data.dateOfPatent}</td>
                    <td>{data.agentLicensed}</td>
                    <td>{data.firmOrOrganization}</td>
                    <td>{data.updatedPhoneNumber}</td>
                    <td>{data.email}</td>
                    <td>{data.updatedOrgName}</td>
                    <td>{data.firmOrgUrl}</td>
                    <td>{data.updatedAddress}</td>
                    <td>{data.updatedCity}</td>
                    <td>{data.updatedState}</td>
                    <td>{data.updatedCountry}</td>
                    <td>{data.updatedZipcode}</td>
                    <td>{data.linkedIn}</td>
                    <td>{data.notes}</td>
                    <td>{data.initials}</td>
                    <td>{data.dataUpdatedAsOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Show manipulated data if the 'dataManipulation' card is active */}
        {activeCard === 'dataManipulation' && (
          <section className="manipulatedDataSection">
            <h2>Manipulated Data</h2>
           
            <table className="user-table" style={{background:'white', textWrap:'wrap',}}>
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Address Line 1</th>
                  <th>Address Line 2</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Country</th>
                  <th>Zipcode</th>
                  <th>Phone Number</th>
                  <th>Reg Code</th>
                  <th>Attorney</th>
                  <th>Date of Patent</th>
                  <th>Agent Licensed</th>
                  <th>Firm or Organization</th>
                  <th>Updated Phone Number</th>
                  <th>Email Address</th>
                  <th>Updated Organization/Law Firm Name</th>
                  <th>Firm/Organization URL</th>
                  <th>Updated Address</th>
                  <th>Updated City</th>
                  <th>Updated State</th>
                  <th>Updated Country</th>
                  <th>Updated Zipcode</th>
                  <th>LinkedIn Profile URL</th>
                  <th>Notes</th>
                  <th>Initials</th>
                  <th>Data Updated as on</th>
                </tr>
              </thead>
              <tbody>
                {patentData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.organization}</td>
                    <td>{data.addressLine1}</td>
                    <td>{data.addressLine2}</td>
                    <td>{data.city}</td>
                    <td>{data.state}</td>
                    <td>{data.country}</td>
                    <td>{data.zipcode}</td>
                    <td>{data.phoneNumber}</td>
                    <td>{data.regCode}</td>
                    <td>{data.agentAttorney}</td>
                    <td>{data.dateOfPatent}</td>
                    <td>{data.agentLicensed}</td>
                    <td>{data.firmOrOrganization}</td>
                    <td>{data.updatedPhoneNumber}</td>
                    <td>{data.email}</td>
                    <td>{data.updatedOrgName}</td>
                    <td>{data.firmOrgUrl}</td>
                    <td>{data.updatedAddress}</td>
                    <td>{data.updatedCity}</td>
                    <td>{data.updatedState}</td>
                    <td>{data.updatedCountry}</td>
                    <td>{data.updatedZipcode}</td>
                    <td>{data.linkedIn}</td>
                    <td>{data.notes}</td>
                    <td>{data.initials}</td>
                    <td>{data.dataUpdatedAsOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
         <section className="cta">
          <h2>Add Users</h2>
          <button className="saveButtondashboard1" onClick={toggleForm}>
            {showForm ? 'Hide' : 'Click here'}
          </button>
        </section>

        {showForm && (
          <div className="split-screen">
            <div className="left-section">
              <div className='makeSectionBorder'><h2>Create User</h2>
              <form className="userForm" onSubmit={handleLogin}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    placeholder='Enter Name'
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>User ID:</label>
                  <input
                    type="text"
                    value={userId}
                    placeholder='Enter User ID'
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>email:</label>
                  <input
                    type="email"
                    value={email}
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button className='saveButtondashboard1' type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </form>
              </div>
            </div>
            <div className="right-section">
              <h2>All Users</h2>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Remove User</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{user.userId}</td>
                      <td>{user.name}</td>
                      <td><button className='removeButton'>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;