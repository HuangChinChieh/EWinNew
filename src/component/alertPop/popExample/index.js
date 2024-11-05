import AlertPop from "component/alertPop";
import "./index.scss";



const PopGameIntro = (props) => {
  const { isShow, handleOK } = props;
  const [title, setTitle]

  return (
   <AlertPop isShow={isShow} title={} handleOK={handleOK}></AlertPop>
  );
};

export default AlertPop;
