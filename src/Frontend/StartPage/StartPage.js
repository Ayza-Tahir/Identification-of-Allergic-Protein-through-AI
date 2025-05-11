import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/HomePage');
    }, 5000); 
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="startpage-container">
      <h1 className="fade-in-text">Identification of Allergic Protein Through AI</h1>
    </div>
  );
};

export default StartPage;
