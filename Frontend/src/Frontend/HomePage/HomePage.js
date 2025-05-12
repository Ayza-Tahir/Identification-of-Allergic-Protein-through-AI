import React, { useState } from 'react';
import './HomePage.css';
import { FaUpload } from 'react-icons/fa';

const HomePage = () => {
  const [fileName, setFileName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setShowResult(true); 

      const formData = new FormData();
      formData.append('file', file);

      try{
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log("Prediction result:", data);

        if (data.prediction!==undefined && data.probability !== undefined) {
          setPrediction(data.prediction); 
          setProbability(data.probability);
          console.log(prediction);
        } else {
          console.error('No Prediction in response');
        }
      } catch (error) {
        console.error('Error in prediction: ', error);
      }
    }
  };

  const handleShowResult = () => {
    setModalVisible(true); 
  };

  const handleCloseModal = () => {
    setModalVisible(false); 
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

      {/* Modal - Results */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Result for: {fileName}</h3>
            {prediction !== null ? (
              <div className="prediction-result">
                <p><strong>Prediction:</strong> {prediction === 0 ? "Allergen" : "Not Allergen"}</p>
                <p><strong>Probability of being Allergen:</strong> {probability.toFixed(2)}%</p>
              </div>
            ) : (
              <p>Loading prediction...</p>  // Display loading message if no prediction yet
            )}
            <button className="close-modal" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
