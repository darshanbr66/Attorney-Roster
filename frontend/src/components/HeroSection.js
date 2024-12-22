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
    <section className="heroSection" id="hero">
      <motion.divBtnNames
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2.5}}
          >
      <div className="divBtnNames">
            <div className="logo">Si<strong>g</strong>vitas</div>
          
          <div className="btnNames">
            {/* <button className="btnNames1"><i class="fas fa-user-plus"></i>Sign up</button> */}
            <button onClick=  {gohome} className="btnNames2"><i class="fas fa-sign-in-alt"></i>Login</button>
          </div>
      </div>
      </motion.divBtnNames>
      <div className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, scale: 0.8}}
        animate={{ opacity: 1, scale: 1}}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to Sigvitas & Company</h1>
        <h3 onClick={(() => alert('plese login!'))}>US Patent Attorney Roster</h3>
      </motion.div>
      
      </div>
    </section>
  );
};

export default HeroSection;
