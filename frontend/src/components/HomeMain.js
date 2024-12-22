import React from "react";
import { motion } from "framer-motion";

// import Header from './Header';
import HeroSection from './HeroSection';
import ServicesSection from "./ServicesSection";
import ContactSection from "./ContactSection";
import Footer from './Footer'

const homeMain = () => {
  return (
    <div className="mainDiv">
    <motion.header>
        {/* <Header /> */}
        <HeroSection />
        {/* <ServicesSection />
        <ContactSection /> */}
        <Footer />
    </motion.header>
    </div>
  );
};

export default homeMain;
