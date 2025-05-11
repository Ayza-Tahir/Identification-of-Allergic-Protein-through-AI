import React, { useState } from 'react';
import './HomePage.css';
import { FaUpload } from 'react-icons/fa';

const HomePage = () => {
  const [fileName, setFileName] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setShowResult(true); 
    }
  };

  const handleShowResult = () => {
  
    alert('Showing result for: ' + fileName);
  };

  return (
    <div className="homepage-container">
      <div className="homepage-overlay-box">
        <h2>Identification of Allergic Protein Through AI</h2>
        <div className="upload-section">
          <label htmlFor="file-upload" className="upload-label">
            <FaUpload className="upload-icon" />
            <span>Upload File</span>
          </label>
          <input
            type="file"
            id="file-upload"
            className="upload-input"
            onChange={handleFileUpload}
          />
          {fileName && <div className="file-name">File: {fileName}</div>}
          {showResult && (
            <button className="result-button" onClick={handleShowResult}>
              Show Result
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
