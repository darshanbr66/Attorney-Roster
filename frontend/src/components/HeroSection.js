import React from "react";
import { motion } from "framer-motion";
import "./HeroSection.css";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
    function gohome(){
        navigate('/HomePage');
        // const reqLogin = () => {
        //   alert('plese login!');
        // }
      }
  return (
    <div id="allone">
      <article className="heroSection203">
      <motion.divBtnNames
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2.5}}
          >
      
            <div className="logo23"><img src="../Triangle-IP-Logo.png" ></img>
            </div>
          
            
      </motion.divBtnNames>
      <motion.divBtnNames
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2.5}}
          >
      
      <div className="btnNames23">
              {/* <button className="btnNames1"><i class="fas fa-user-plus"></i>Sign up</button> */}
              <button onClick=  {gohome} className="btnNames22"><i class="fas fa-sign-in-alt"></i>Login</button>
           
            </div>
      </motion.divBtnNames>
      </article>
      
      <div className="heromain1 hero-content">
      <motion.div
        // className="hero-content"
        initial={{ opacity: 0, scale: 0.8}}
        animate={{ opacity: 1, scale: 1}}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to Triangle IP</h1>
        <h3 onClick={(() => alert('plese login!'))}>US Patent Attorney Roster</h3>
      </motion.div>
      
      </div>
    </div>
  
  );
};

export default HeroSection;