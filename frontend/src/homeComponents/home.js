import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import 'font-awesome/css/font-awesome.min.css';


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
  return (
    <div className="App">
      <header>
      <h2 onClick={gohome}>Si<strong>g</strong>vitas</h2>
      
      </header>
      <main>
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
            
            <button id='logBtn' type="submit" onClick={loginSubmit}>Login</button>
          </div>
        
      </main>
      <footer>
        <p>&copy; 2024 Sigvitas. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage2;