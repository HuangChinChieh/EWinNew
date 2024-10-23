import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import "./index.scss";
import { setDefaultClick, setIsAct1 } from "store/actions";

const AlertContext = createContext();
export { AlertContext };

const AlertButton = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const cbRef = useRef(null);

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
    if (cbRef.current) {
      cbRef.current();
    }
  };

  const alertMsg = useCallback(
    (title, message, cb) => {
      setTitle("");
      setMessage("");

      if (title) {
        setTitle(title);
      }
      if (message) {
        setMessage(message);
      }
      if (cb) {
        cbRef.current = cb;
      }
      setShowAlert(true);
    },
    []
  );

  return (
    <AlertContext.Provider value={{ alertMsg }}>
      {showAlert && (
        <div className="overlay">
          <div className="modal">
            <h2>{title}</h2>
            <p>{message}</p>
            <div className="button-group">
              <button onClick={handleOK}>確認</button>
              <button onClick={handleClose}>取消</button>
            </div>
          </div>
        </div>
      )}
      {children}
    </AlertContext.Provider>
  );
};

export default AlertButton;
