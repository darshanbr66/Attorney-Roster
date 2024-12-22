import React from "react";
import { motion } from "framer-motion";
import "./ServicesSection.css";

const services = [
  { title: "Patent Management", description: "Simplify your patent workflow.", icon: "🔍" },
  { title: "Collaboration", description: "Seamlessly collaborate with your team.", icon: "🤝" },
  { title: "Analytics", description: "Gain insights into your IP portfolio.", icon: "📊" },
];

const ServicesSection = () => {
  return (
    <section className="services" id="services">
      <h2>Our Services</h2>
      <div className="service-grid">
        {services.map((service, index) => (
          <motion.div
            className="service-card"
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
