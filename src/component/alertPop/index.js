import ReactDOM from 'react-dom';
import "./index.scss";



const AlertPop = (props) => {
  const { isShow, title, message, handleOK } = props;


  return (
    isShow ? ReactDOM.createPortal(
      <div className="alert-pop overlay">
        <div className="alert-pop-modal">
          <h2>{title}</h2>
          <p>{message}</p>
          <div className="button-group">
            <button onClick={handleOK}>確認</button>
          </div>
        </div>
      </div>, document.body) : <></>
  );
};

export default AlertPop;
