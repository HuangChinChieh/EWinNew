import React, {
    useState,
    useEffect,
    useContext,
    useRef,
} from "react";
import ReactDOM from 'react-dom';
import "./index.scss";
import { AlertContext } from "provider/alertProvider";
import BigNumber from "bignumber.js";

const AddTip = (props) => {
    const [onChangeChipVal, setChipVal] = useState(0);
    const gameClient = props.gameClient;
    const getTableInfo = props.getTableInfo;
    const orderSequence = useRef();
    orderSequence.current = props.orderData.orderSequence;
    const { alertMsg } = useContext(AlertContext);

    const handleClose = () => {
        props.hideTip();
    };

    const handleClear = () => {
        setChipVal(0);
    };

    const handleOK = () => {
        //加彩動作
        let addChipValue = parseInt(document.querySelector(".v11").textContent);
        let addVal = 0;

        if (addChipValue > 0) {

            switch (props.cashUnit) {
                case 0:
                    addVal = new BigNumber(addChipValue).dividedBy(10000).toNumber();
                    break;
                case 1:
                    addVal = new BigNumber(addChipValue).dividedBy(1000).toNumber();
                    break;
                case 2:
                    addVal = new BigNumber(addChipValue).toNumber();
                    break;
            }

            alertMsg("打賞小費", "確定打賞小費 " + addVal, () => {
                //AddChip game
                handleClose();
                let tableInfo = getTableShoeInfo();
                gameClient.AddTipsType0(
                  props.gameSetID,
                  props.roadMapNumber,
                  tableInfo.shoeNumber,
                  tableInfo.roundNumber,
                  orderSequence.current + 1,
                  addVal,
                  function (success, o) {
                      if (success) {
                          if (o.ResultState == 0) {
                              props.handleQuery(o);
                          } else {
                          }
                      } else {
                          if (o == "Timeout") {
                              alertMsg("錯誤", "網路異常, 請重新操作");
                          } else {
                              if (o != null && o != "") {
                                  alertMsg(o.message);
                              }
                          }
                      }
                  }
              )
            });
        }
    };

    const getTableShoeInfo = () => {
        let tableInfo = getTableInfo();

        let roundInfoArray = tableInfo.RoundInfo.split("-");

        if (roundInfoArray.length > 0) {
            return { shoeNumber: roundInfoArray[0], roundNumber: roundInfoArray[1] };
        } else {
            return { shoeNumber: '', roundNumber: '' };
        }
    };

    const addTipVal = (tipVal) => {
        let addChipValue = parseInt(document.querySelector(".v11").textContent);

        setChipVal(addChipValue + tipVal);
    }

    const doubleTipVal = () => {
        let addChipValue = parseInt(document.querySelector(".v11").textContent);

        setChipVal(addChipValue * 2);
    }

    return (
        <div className="overlay">
            <div className="divAddTip">
                <div className="title">
                    <span>小費金額</span>
                </div>
                <div className="value">
                    <div className="v1">
                        <span className="v11">{onChangeChipVal}</span>
                    </div>
                </div>
                <div className="divBtn">
                    <div className="tipArea">
                        <div className="tipBox">
                            <div key={1}
                                className={`chips-${1}`}
                                onClick={() => addTipVal(25)}>
                                <div>{25}</div>
                            </div>
                            <div className='tipDouble'
                                onClick={() => doubleTipVal()}>
                                <div>X2</div>
                            </div>
                            {/* <span onClick={() => doubleTipVal()} className='tipDouble'>X2</span>  */}
                        </div>
                    </div>
                </div>
                <div className="divBtn">
                    <div className="btn" onClick={handleOK}>
                        確認
                    </div>
                    <div className="btn" onClick={handleClear}>
                        重置
                    </div>
                    <div className="btn" onClick={handleClose}>
                        取消
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AddTip;
