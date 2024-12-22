import React, { useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    
    <motion.header
      className="header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="logo">Si<strong>g</strong>vitas</div>
      <nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={menuOpen ? "nav-list open" : "nav-list"}>
          <li>
            <Link to="hero" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="services" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>
              Services
            </Link>
          </li>
          <li>
            <Link to="contact" smooth={true} duration={500} onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      
    </motion.header>
    
  );
};

export default Header;
