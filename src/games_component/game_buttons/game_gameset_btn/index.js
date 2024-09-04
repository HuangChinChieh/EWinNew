import { useState, useRef, useEffect, useContext } from 'react';
import { useLanguage } from 'hooks';
import './index.scss';
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import { AlertContext } from 'component/alert';
import { generateUUIDv4 } from 'utils/guid';
import alertMsg from 'component/alert';

const GameControlButton = ((props) => {
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const btnsItem = [
        { index: 1, btnName: "飛牌" },
        { index: 2, btnName: "加彩" },
        { index: 3, btnName: "暫停" },
        { index: 4, btnName: "換靴" },
        { index: 5, btnName: "更換荷官" },
        { index: 6, btnName: "要求換桌" },
        { index: 7, btnName: "請聯繫我" },
        { index: 8, btnName: "完場" }
    ];
 
    const chipsItem = props.chipItems;

    const countryItem = [
        { name: "Korea", value: "KR" },
        { name: "Japan", value: "JP" },
        { name: "Chian", value: "CN" }
    ]

    const [selIndex, setSelIndex] = useState(0);
    const [onAddChip, setAddChip] = useState(false);
    const [onChangeTable, setChangeTable] = useState(false);
    const [refreshTable, setrefreshTable] = useState(false);
    const [onChangeChipVal, setChipVal] = useState(0);
    const { alertMsg } = useContext(AlertContext);
    const isServerConnected = props.isServerConnected;
    const tableType = props.tableType;
    const gameSetID = props.gameSetID;
    const roadMapNumber = props.roadMapNumber;
    const shoeNumber = props.shoeNumber;
    const roundNumber = props.roundNumber;
    const orderSequence = props.orderSequence;
    const areaCode = props.areaCode;

    const handleSelControl = (event, index) => {
        //props.updateSelChipValue(event, index)
        closePop();
        setSelIndex(index);

        switch (index) {
            case 1: //飛牌
                alertMsg('', '確認飛牌', () => {
                    setRoundCmd("Pass");
                });
                break;
            case 2: //加彩
                setChipVal(0);
                setAddChip(true);
                break;
            case 3: //暫停
                alertMsg('', '確認暫停', () => {
                    setGameSetCmd("Pause");
                });
                break;
            case 4: //換靴
                alertMsg('', '確認換靴', () => {
                    setRoundCmd("NextShoe");
                });
                break;
            case 5: //更換荷官
                alertMsg('', '確認更換荷官', () => {
                    setRoundCmd("ChangeDealer");
                });
                break;
            case 6: //要求換桌
                alertMsg('', '確認要求換桌', () => {
                    setChangeTable(true);
                });
                break;
            case 7: //請聯繫我
                alertMsg('', '請聯繫我', () => {
                    setRoundCmd("ContactMe");
                });
                break;
            case 8: //完場
                alertMsg('', '確認完場', () => {
                    setGameSetCmd("Completed");
                });
                break;
        }
    };

    const setRoundCmd = (cmd) => {
        if (isServerConnected == true) {
            switch (tableType) {
                case 0:
                case 1:
                    // 待補 api.SetOrderType0Cmd
                    lobbyClient.SetOrderType0Cmd(generateUUIDv4(), gameSetID, roadMapNumber, shoeNumber, roundNumber, orderSequence + 1, cmd, function (success, o) {
                        if (success) {
                            if (o.ResultState == 0) {

                            } else {

                            }
                        } else {
                            if (o == "Timeout") {
                                alertMsg("錯誤", "網路異常, 請重新操作");
                            }
                            else {
                                if ((o != null) && (o != "")) {
                                    alertMsg(o);
                                }
                            }
                        }
                        setrefreshTable(true);
                    });
                    break;
                case 2:
                    // 快速
                    break;
                case 3:
                    // 網投
                    break;
            }

        }
    }

    const setGameSetCmd = (cmd) => {
        if (isServerConnected == true) {
            switch (tableType) {
                case 0:
                case 1:
                    // 待補 api.setGameSetCmd
                    lobbyClient.SetGameSetCmd(generateUUIDv4(), gameSetID, roadMapNumber, shoeNumber, roundNumber, cmd, function (success, o) {
                        if (success) {
                            if (o.ResultState == 0) {

                            } else {

                            }
                        } else {
                            if (o == "Timeout") {
                                alertMsg("錯誤", "網路異常, 請重新操作");
                            }
                            else {
                                if ((o != null) && (o != "")) {
                                    alertMsg(o);
                                }
                            }
                        }
                        setrefreshTable(true);
                    });


                    break;
                case 2:
                    // 快速
                    break;
                case 3:
                    // 網投
                    break;
            }

        }
    }

    const onAddChipClose = () => {
        setAddChip(false);
    };

    const onChangeTableClose = () => {
        setChangeTable(false);
    };

    const onSetChipVal = (chipsValue) => {
        setChipVal(onChangeChipVal + chipsValue);
        setAddChip(true);
    };

    const closePop = () => {
        setAddChip(false);
        setChangeTable(false);
    }

    //const processResult = (o) => {
        //if (o != null) {
            //Q = o;

            //shoeNumber = Q.ShoeNumber;
            //roundNumber = Q.RoundNumber;
            //tableType = Q.TableType;
            //orderSequence = Q.SelfOrder.OrderSequence;
        //}
    //}

    return (
        <div>
            {
                onAddChip == true ? (
                    <div><AddChip onAddChipClose={onAddChipClose} setrefreshTable={setrefreshTable} setChipVal={onChangeChipVal} />
                        <div className="game-chips-box">
                            {
                                chipsItem.map((item) => (
                                    <div key={item.index}
                                        className={`chips-${item.styleIndex} ${props.selChipIndex === item.styleIndex ? 'act' : ''}`}
                                        onClick={(event) => (onSetChipVal(item.chipsValue))}>
                                        <div>{item.chipsValue}</div>
                                    </div>
                                ))
                            }
                        </div> </div>
                ) : onChangeTable == true ? (
                    <div><ChangeTable onChangeTableClose={onChangeTableClose} countryItem={countryItem} areaCode={areaCode} />
                        <div className="game-controls-box">
                            {
                                btnsItem.map((item) => (
                                    <div key={item.index}
                                        className={`controlBtn ${selIndex === item.index ? 'act' : ''}`}
                                        onClick={(event) => (handleSelControl(event, item.index))}
                                    >
                                        <div>{item.btnName}</div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                ) :
                    (<div className="game-controls-box">
                        {
                            btnsItem.map((item) => (
                                <div key={item.index}
                                    className={`controlBtn ${selIndex === item.index ? 'act' : ''}`}
                                    onClick={(event) => (handleSelControl(event, item.index))}
                                >
                                    <div>{item.btnName}</div>
                                </div>
                            ))
                        }

                    </div>)
            }
        </div>
    )
})

const App = () => {
    return (
        <div>
            <div className="box">
                <h1>The Button has a ref</h1>
                <GameControlButton />
            </div>
        </div>
    );
};

const AddChip = (props) => {
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const handleClose = () => {
        if (props.onAddChipClose) {
            props.onAddChipClose();
        }
    };

    const handleOK = () => {
        //加彩動作
        let addChipValue = parseInt(document.querySelector('.v11').textContent);

        if (addChipValue > 0) {

            alertMsg('加彩', '是否要求加彩 ' + addChipValue, () => {
                lobbyClient.AddChip(generateUUIDv4(), gameSetID, roadMapNumber, shoeNumber, roundNumber, addChipValue, function (success, o) {
                    if (success) {
                        if (o.ResultState == 0) {

                        } else {

                        }
                    } else {
                        if (o == "Timeout") {
                            alertMsg("錯誤", "網路異常, 請重新操作");
                        }
                        else {
                            if ((o != null) && (o != "")) {
                                alertMsg(o);
                            }
                        }

                    }
                    props.setrefreshTable(true);
                });
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
                <div className="btn" onClick={handleOK}>確認</div>
                <div className="btn" onClick={handleClose}>取消</div>
            </div>
        </div>
    );
};

const ChangeTable = (props) => {
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const [tableList, setTableList] = useState([]);
    const [areaCode, setAreaCode] = useState('');

    useEffect(() => {
        refreshTableList(props.areaCode);
    }, []);

    useEffect(() => {
        refreshTableList(areaCode);
    }, [areaCode]);

    const handleClose = () => {
        if (props.onChangeTableClose) {
            props.onChangeTableClose();
        }
    };

    const showSeleCountry = () => {
        if (window.getComputedStyle(document.getElementById('divCountrySel')).display == "none") {
            document.getElementById('divCountrySel').style.display = "block";
        } else {
            document.getElementById('divCountrySel').style.display = "none";
        }
    }

    const seleCountry = (event, value) => {
        alert(value);
        document.getElementById('divCountrySel').style.display = "none";

        setAreaCode(value);
    }

    const refreshTableList = (areaCode) => {
        lobbyClient.GetTableInfoList(areaCode, 0, (success, o) => {
            if (success) {
                if (o.ResultCode === 0) {
                    let array = o.TableInfoList.map((data) => {
                        return {
                            TableNumber: data.TableNumber,
                            Image: data.ImageList.find(image => image.ImageType === 1),
                            CurrencyType: data.CurrencyType,
                            Status: data.Status,
                            ShoeResult: data.ShoeResult
                        };
                    });

                    setTableList(array);
                }
            }
        });
    };

    return (
        <div className="divChangeTable">
            <div className="header">
                <span class="title">要求換桌</span>
                <div class="search" onClick={showSeleCountry}>
                    <div class="location"></div>

                    <div class="place">
                        <span class="place1">地點</span>
                        <div class="Vector"></div>
                        <span class="place2">korea</span>

                    </div>
                    <div class="upper"></div>
                </div>
                <div class="close" onClick={handleClose}>
                    <div class="closeOutline"></div>
                    <div class="closeicon"></div>

                </div>
            </div>
            <div class="country" id="divCountrySel">
                {
                    props.countryItem.map((item) => (
                        <div class="countryItem" onClick={(event) => (seleCountry(event, item.value))}>
                            <div class="location"></div>
                            <div class="place">
                                <span class="place1">{item.name}</span>

                            </div>
                            <div class="check"></div>
                        </div>

                    ))
                }

            </div>
            <div className="section_box">
                {tableList.map((data) => (
                    <SectionLi key={data.TableNumber} tableInfo={data} />
                ))}
            </div>
        </div>
    );
};

//ReactDOM.render(<App />, document.getElementById("root"))
export default GameControlButton;