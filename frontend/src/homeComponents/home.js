import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import 'font-awesome/css/font-awesome.min.css';
import { motion } from "framer-motion";


function HomePage2() {
const navigate = useNavigate();
const[label, setlabel] = useState('');

function loginSubmit(){
  console.log(label);

  if (label === 'Admin')
  {
    navigate('/AdminLoginPage');
  }
  else{
    if (label === 'Employee')
      {
        navigate('/EmployeeLoginPage');
      }
  }

}
function gohome(){
  navigate('/');
}
function goBack() {
  navigate('/');
}
  return (
    <div className="App2">
      <motion.divBtnNames
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 2.5}}
                      >
            <header id='headerFlex1123'>
            <button className='button1123' onClick={goBack}> <i class="fa-solid fa-backward"></i> Go Back</button>
              <img onClick={gohome} src="../Triangle-IP-Logo.png" ></img>
              <button className='button1123' onClick={gohome}> <i class="fa-solid fa-house"></i> Home</button>
            </header>
            </motion.divBtnNames>
      <main>
      <motion.div
        className="hero-content2"
        initial={{ opacity: 0, scale: 1}}
        animate={{ opacity: 1, scale: 1}}
        transition={{ duration: 1 }}
        >
        <div id='div11'>
          <h1>US Patent Atorny Roster Data</h1>
        </div>
          <div id='div22'>
            <h3>User Type</h3>
                <label >
                  <input type='radio' name='value' value='Admin' 
                  onChange={(e) => setlabel(e.target.value)} />Admin
                  </label>       
                  <label >
                  <input type='radio' name='value' value='Employee' 
                  onChange={(e) => setlabel(e.target.value)} />Patent Data Analyst
                  </label>

         <br />

            <button id='logBtnn71' type="submit" onClick={loginSubmit}>Login</button>
          </div>
          </motion.div>
      </main>

      <footer>
        <p>&copy; 2024 Sigvitas. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage2;