import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeMain from './components/HeroSection.js';
import HomePage from './homeComponents/home.js';
import AdminLoginPage from './adminComponets/adminLoginPage.js';
import AdminDashboard from './adminComponets/adminDashboard.js';
import EmployeeLoginPage from './employeeComponents/employeeLogin.js';
import EmployeeDashboard from './workComponets/EmployeeDashboard.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeMain />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/AdminLoginPage" element={<AdminLoginPage />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />

        <Route path="/EmployeeLoginPage" element={<EmployeeLoginPage />} /> 
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;