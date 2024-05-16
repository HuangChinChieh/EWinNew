import React, { useState, useEffect } from 'react';
import './index.scss';

const AlertButton = ({ title, message, onAlert }) => {
    const [showAlert, setShowAlert] = useState(false);
  
    useEffect(() => {
      if (message) {
        setShowAlert(true);
      }
    }, [message]);
  
    const handleClose = () => {
      setShowAlert(false);
    };
  
    const handleOK = () => {
      setShowAlert(false);
      if (onAlert) {
        onAlert();
      }
    };
  
    return (
      <>
        {showAlert && (
          <div className="overlay">
            <div className="modal">
              <h2>{title}</h2>
              <p>{message}</p>
              <button onClick={handleOK}>OK</button>
              <button onClick={handleClose}>关闭</button>
            </div>
          </div>
        )}
      </>
    );
  };

  export default AlertButton;