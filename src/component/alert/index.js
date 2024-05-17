import React, { createContext, useState, useEffect } from 'react';
import './index.scss';

const AlertContext = createContext();
export {
    AlertContext
};

const AlertButton = ({ children }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [cb, setCB] = useState(null);

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
        if (cb) {
            cb();
        }
    };

    const alertMsg = (title, message, cb) => {
        if (title) {
            setTitle(title);
        }
        if (message) {
            setMessage(message);
        }
        if (cb) {
            setCB(() => cb);
        }
    }

    return (
        <AlertContext.Provider value={{ alertMsg }}>
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
            {children}
        </AlertContext.Provider>
    );
};

export default AlertButton;