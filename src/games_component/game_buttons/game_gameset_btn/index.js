import { useState, useRef, useEffect, useContext } from "react";
import ReactDOM from 'react-dom';
import "./index.scss";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import { AlertContext } from "component/alert";
import alertMsg from "component/alert";
import ChangeTable from "component/changeTable";
import {
    FavorsContext,
    LobbyPersonalContext,
} from "provider/GameLobbyProvider";
import RoadMap from "component/road_map";
import { Link } from "react-router-dom";
import { on } from "stream";

const GameControlButton = (props) => {
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const gameClient = props.gameClient;
    const btnsItem = [
        { index: 1, btnName: "飛牌" },
        { index: 2, btnName: "加彩" },
        { index: 3, btnName: "暫停" },
        { index: 4, btnName: "換靴" },
        { index: 5, btnName: "更換荷官" },
        { index: 6, btnName: "要求換桌" },
        { index: 7, btnName: "請聯繫我" },
        { index: 8, btnName: "完場" },
    ];

    const chipsItem = props.chipItems;

    const [selIndex, setSelIndex] = useState(0);
    const [onAddChip, setAddChip] = useState(false);
    const [onChangeTable, setChangeTable] = useState(false);
    const [refreshTable, setrefreshTable] = useState(false);
    const [onChangeChipVal, setChipVal] = useState(0);
    const { alertMsg } = useContext(AlertContext);
    let baccaratType = props.baccaratType;
    const gameSetID = props.gameSetID;
    const roadMapNumber = props.roadMapNumber;
    const orderSequence = useRef();
    orderSequence.current = props.orderData.orderSequence;
    //const areaCode = props.areaCode;
    const getTableInfo = props.getTableInfo;
    let areaCode = useRef();

    useEffect(() => {
        let tableInfo = getTableInfo();

        console.log('tableInfo', tableInfo);
    }, []);

    const handleSelControl = (event, index) => {
        //props.updateSelChipValue(event, index)
        getTableShoeInfo();
        closePop();
        setSelIndex(index);

        switch (index) {
            case 1: //飛牌
                alertMsg("", "確認飛牌", () => {
                    setRoundCmd("Pass");
                });
                break;
            case 2: //加彩
                setChipVal(0);
                setAddChip(true);
                break;
            case 3: //暫停
                alertMsg("", "確認暫停", () => {
                    setGameSetCmd("Pause");
                });
                break;
            case 4: //換靴
                alertMsg("", "確認換靴", () => {
                    setRoundCmd("NextShoe");
                });
                break;
            case 5: //更換荷官
                alertMsg("", "確認更換荷官", () => {
                    setRoundCmd("ChangeDealer");
                });
                break;
            case 6: //要求換桌
                alertMsg("", "確認要求換桌", () => {
                    setChangeTable(true);
                });
                break;
            case 7: //請聯繫我
                alertMsg("", "請聯繫我", () => {
                    setRoundCmd("ContactMe");
                });
                break;
            case 8: //完場
                alertMsg("", "確認完場", () => {
                    setGameSetCmd("Completed");
                });
                break;
            default:
                break;
        }
    };

    const getTableShoeInfo = () => {
        let tableInfo = getTableInfo();

        areaCode.current = tableInfo.AreaCode;

        let roundInfoArray = tableInfo.RoundInfo.split("-");

        if (roundInfoArray.length > 0) {
            return { shoeNumber: roundInfoArray[0], roundNumber: roundInfoArray[1] };
        } else {
            return { shoeNumber: '', roundNumber: '' };
        }
    };

    const setRoundCmd = (cmd) => {
        if (gameClient.currentState === 1) {
            switch (baccaratType) {
                case 0:
                case 1:
                    // SetBetType0Cmd  game
                    let tableInfo = getTableShoeInfo();

                    gameClient.SetBetType0Cmd(
                        gameSetID,
                        roadMapNumber,
                        tableInfo.shoeNumber,
                        tableInfo.roundNumber,
                        orderSequence.current + 1,
                        cmd,
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
                            setrefreshTable(true);
                        }
                    )

                    break;
                case 2:
                    // 快速
                    break;
                case 3:
                    // 網投
                    break;
                default:
                    break;

            }
        } else {
            alertMsg("錯誤", "伺服器斷線");
        }
    };

    const setGameSetCmd = (cmd) => {
        if (gameClient.currentState == 1) {
            switch (baccaratType) {
                case 0:
                case 1:
                    // SetGameSetCmd game
                    let tableInfo = getTableShoeInfo();
                    gameClient.SetGameSetCmd(
                        gameSetID,
                        roadMapNumber,
                        tableInfo.shoeNumber,
                        tableInfo.roundNumber,
                        cmd,
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
                            setrefreshTable(true);
                        }
                    );

                    break;
                case 2:
                    // 快速
                    break;
                case 3:
                    // 網投
                    break;
            }
        } else {
            alertMsg("錯誤", "伺服器斷線");
        }
    };

    const onAddChipClose = () => {
        setAddChip(false);
    };

    const onChangeTableClose = () => {
        setChangeTable(false);
    };

    const onSetChipVal = (chipsValue) => {
        if (chipsValue <= -1) {
            setChipVal(0);
        } else {
            setChipVal(onChangeChipVal + chipsValue);
        }

        setAddChip(true);
    };

    const closePop = () => {
        setAddChip(false);
        setChangeTable(false);
    };

    return (
        <>
            {onAddChip ? (

                ReactDOM.createPortal(<div className="overlay">
                    <AddChip
                        onAddChipClose={onAddChipClose}
                        onAddChipClear={()=>{setChipVal(0)}}
                        setrefreshTable={setrefreshTable}
                        setChipVal={onChangeChipVal}
                        gameClient={gameClient}
                        roadMapNumber={roadMapNumber}
                        gameSetID={gameSetID}
                        getTableShoeInfo={getTableShoeInfo}
                        alertMsg={alertMsg}
                    />
                    <div className="game-chips-area">
                        <div className="game-chips-box">
                            {chipsItem.map((item) => (
                                <div
                                    key={`chips${item.styleIndex}`}
                                    className={`chips-${item.styleIndex} ${props.selChipIndex === item.styleIndex ? "act" : ""
                                        }`}
                                    onClick={() => onSetChipVal(item.chipValue)}
                                >
                                    <div>{item.chipValue}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body)
            ) : onChangeTable ? (
                <>
                    <ChangeTable
                        onChangeTableClose={onChangeTableClose}
                        areaCode={areaCode}
                        entryRoadMap={props.entryRoadMap}
                    />
                    <div className="game-controls-box">
                        {btnsItem.map((item) => (
                            <div
                                key={`change${item.index}`}
                                className={`controlBtn ${selIndex === item.index ? "act" : ""}`}
                                onClick={(event) => handleSelControl(event, item.index)}
                            >
                                <div>{item.btnName}</div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="game-controls-block">

                    {btnsItem.map((item) => (
                        <div
                            key={`controls${item.index}`}
                            className={`controlBtn ${selIndex === item.index ? "act" : ""} ${item.btnName}`}
                            onClick={(event) => handleSelControl(event, item.index)}
                        >
                            {item.btnName}
                        </div>
                    ))}

                </div>
            )}
        </>
    );
};

const AddChip = (props) => {
    const gameClient = props.gameClient;
    const handleClose = () => {
        if (props.onAddChipClose) {
            props.onAddChipClose();
        }
    };

    const handleClear = () => {
        if (props.onAddChipClear) {
            props.onAddChipClear();
        }
    };

    const handleOK = () => {
        //加彩動作
        let addChipValue = parseInt(document.querySelector(".v11").textContent);

        if (addChipValue > 0) {
            props.alertMsg("加彩", "是否要求加彩 " + addChipValue, () => {
                //AddChip game
                handleClose();
                let tableInfo = props.getTableShoeInfo();
                gameClient.AddChip(
                    props.gameSetID,
                    props.roadMapNumber,
                    tableInfo.shoeNumber,
                    tableInfo.roundNumber,
                    addChipValue,
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
                        props.setrefreshTable(true);
                    }
                );
            });
        }
    };

    return (
        <div className="divAddChip">
            <div className="title">
                <span>加彩金額</span>
            </div>
            <div className="value">
                <div className="v1">
                    <span className="v11">{props.setChipVal}</span>
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
    );
};

//ReactDOM.render(<App />, document.getElementById("root"))
export default GameControlButton;
