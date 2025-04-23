import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <motion.div 
      className='hero-box'
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} 
    >
      <div className="container d-flex flex-column justify-content-center h-100 align-items-center align-items-md-start text-light">
        <motion.h1 
          className='fw-semibold text-center text-md-start'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Welcome to College of Liberal Arts' Learning Resources Center
        </motion.h1>

        <motion.p 
          className="m-0 fs-4 fw-light text-center text-md-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Want to find academic resources for your next project? Our online catalog makes searching simple and intuitive.
        </motion.p>

        <motion.button 
          className="btn btn-dark fw-medium mt-2 p-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate(`/search?type=advanced search`)}
        >
          ADVANCED SEARCH
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Hero;