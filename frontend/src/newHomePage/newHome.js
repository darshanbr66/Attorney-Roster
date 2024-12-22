import React from "react";
import { useNavigate } from "react-router-dom";
import "./newHome.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


function HomePage1() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
     <header className="header1">
         <div className="headerdiv1"><h2>Si<strong>g</strong>vitas</h2></div>

         <div className="headerdiv2">
         <h2>Si<strong>g</strong>vitas</h2>
              <nav className='navBar'>
              </nav>
         </div>

     </header>   

     <main className="main1"></main>

     <footer className='footer1'></footer>
    </>
  );
}

export default HomePage1;
