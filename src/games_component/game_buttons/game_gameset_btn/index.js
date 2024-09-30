import { useState, useRef, useEffect, useContext, useCallback } from "react";
import "./index.scss";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import { AlertContext } from "component/alert";
import alertMsg from "component/alert";
import {
    FavorsContext,
    LobbyPersonalContext,
} from "provider/GameLobbyProvider";
import RoadMap from "component/road_map";
import { Link } from "react-router-dom";

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

    const countryItem = [
        { name: "Korea", value: "KR" },
        { name: "Japan", value: "JP" },
        { name: "Chian", value: "CN" },
    ];

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
    const areaCode = "";

    useEffect(() => {
        console.log(props.orderData);
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

    const setRoundCmd = (cmd) => {
        if (gameClient.currentState == 1) {
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
                                console.log('up',o);
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
        setChipVal(onChangeChipVal + chipsValue);
        setAddChip(true);
    };

    const closePop = () => {
        setAddChip(false);
        setChangeTable(false);
    };

    return (
        <>
            {onAddChip ? (
                <div className="overlay">
                    <AddChip
                        onAddChipClose={onAddChipClose}
                        setrefreshTable={setrefreshTable}
                        setChipVal={onChangeChipVal}
                        gameClient={gameClient}
                        roadMapNumber={roadMapNumber}
                        gameSetID={gameSetID}
                        getTableShoeInfo={getTableShoeInfo}
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
                </div>
            ) : onChangeTable ? (
                <div className="gamesetChangeTable">
                    <ChangeTable
                        onChangeTableClose={onChangeTableClose}
                        countryItem={countryItem}
                        areaCode={areaCode}
                        lobbyClient={lobbyClient}
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
                </div>
            ) : (
                <div className="game-controls-block">
                    <div className="game-controls-box">
                        {btnsItem.map((item) => (
                            <div
                                key={`controls${item.index}`}
                                className={`controlBtn ${selIndex === item.index ? "act" : ""}`}
                                onClick={(event) => handleSelControl(event, item.index)}
                            >
                                <div>{item.btnName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

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
    const gameClient = props.gameClient;
    const handleClose = () => {
        if (props.onAddChipClose) {
            props.onAddChipClose();
        }
    };

    const handleOK = () => {
        //加彩動作
        let addChipValue = parseInt(document.querySelector(".v11").textContent);

        if (addChipValue > 0) {
            alertMsg("加彩", "是否要求加彩 " + addChipValue, () => {
                //AddChip game
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
                <div className="btn" onClick={handleClose}>
                    取消
                </div>
            </div>
        </div>
    );
};

const ChangeTable = (props) => {
    const lobbyClient = props.lobbyClient;
    const [tableList, setTableList] = useState([]);
    const [areaCode, setAreaCode] = useState("");

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
        if (
            window.getComputedStyle(document.getElementById("divCountrySel"))
                .display == "none"
        ) {
            document.getElementById("divCountrySel").style.display = "block";
        } else {
            document.getElementById("divCountrySel").style.display = "none";
        }
    };

    const seleCountry = (event, value) => {
        alert(value);
        document.getElementById("divCountrySel").style.display = "none";

        setAreaCode(value);
    };

    const refreshTableList = (areaCode) => {
        //GetTableInfoList lobby
        lobbyClient.GetTableInfoList(areaCode, 0, (success, o) => {
            if (success) {
                if (o.ResultCode === 0) {
                    let array = o.TableInfoList.map((data) => {
                        return {
                            TableNumber: data.TableNumber,
                            Image: data.ImageList.find((image) => image.ImageType === 1),
                            CurrencyType: data.CurrencyType,
                            Status: data.Status,
                            ShoeResult: data.ShoeResult,
                        };
                    });

                    setTableList(array);
                }
            }
        });
    };

    const SectionLiFavor2 = (props) => {
        const { favors, updateFavors } = useContext(FavorsContext);

        const tableNumber = props.tableNumber;

        const handleClick = () => {
            const lobbyClient = EWinGameLobbyClient.getInstance();
            const index = favors.indexOf(tableNumber);

            //觸發收藏or取消收藏
            if (index === -1) {
                //沒找到，新增收藏
                favors.push(tableNumber);
                lobbyClient.SetUserAccountProperty(
                    "EWinGame.Favor",
                    JSON.stringify(favors),
                    (success, o) => {
                        if (success) {
                            if (o.ResultCode === 0) {
                                updateFavors();
                            }
                        }
                    }
                );
            } else {
                //有找到，移除收藏
                favors.splice(index, 1);
                lobbyClient.SetUserAccountProperty(
                    "EWinGame.Favor",
                    JSON.stringify(favors),
                    (success, o) => {
                        if (success) {
                            if (o.ResultCode === 0) {
                                updateFavors();
                            }
                        }
                    }
                );
            }
        };

        //
        return (
            <span
                onClick={() => handleClick()}
                className={`${favors.includes(props.tableNumber)
                        ? "remove-to-favorites"
                        : "add-to-favorites"
                    }`}
            />
        );
    };

    const SectionLiFavor1 = (props) => {
        const { favors } = useContext(FavorsContext);
        return (
            <span
                className={`${favors.includes(props.tableNumber) ? "has-favorites" : ""
                    }`}
            />
        );
    };

    const SectionLi = (props) => {
        const [moreScale, setMoreScale] = useState("");
        const [hoveredItem, setHoveredItem] = useState(null);
        const mouseleave = () => {
            setHoveredItem(null);
            setMoreScale("");
        };

        return (
            <li
                key={props.tableInfo.TableNumber}
                onMouseEnter={() => setHoveredItem(props.tableInfo.TableNumber)}
                onMouseLeave={mouseleave}
                className="li-box"
            >
                <SectionLiFavor1 tableNumber={props.tableInfo.TableNumber} />
                <div className={`games`}>
                    {props.tableInfo.Image ? (
                        <img src={props.tableInfo.Image.ImageUrl} alt="Table Image" />
                    ) : (
                        <img
                            src="http://bm.dev.mts.idv.tw/images/JINBEI1.png"
                            alt="Default Table Image"
                        />
                    )}
                    <RoadMap shoeResult={props.tableInfo.ShoeResult} roaMapType={0} />
                </div>
                <p className="game-title">{props.tableInfo.TableNumber}</p>
                <p className="game-wallet">
                    <span>{"CNY(暫)"}</span>
                    <span></span>
                </p>

                <div
                    className={`hover-box ${hoveredItem === props.tableInfo.TableNumber ? "visible" : ""
                        } ${moreScale}`}
                >
                    <span
                        className="close-hover-box"
                        onClick={() => {
                            setHoveredItem(null);
                        }}
                    ></span>
                    <div className={`games`}>
                        {props.tableInfo.Image && (
                            <img src={props.tableInfo.Image.ImageUrl} alt="Table" />
                        )}
                    </div>
                    <div className="info-box">
                        <p className="game-title">{props.tableInfo.TableNumber}</p>
                        <p className="game-wallet">
                            <span>{"CNY(暫)"}</span>
                            <span></span>
                        </p>
                        <div className="game-start">
                            <Link to={`/games/${props.tableInfo.TableNumber}`}>
                                {"開始遊戲"}
                            </Link>
                        </div>
                        <div className="game-table-wrap">
                            <RoadMap shoeResult={props.tableInfo.ShoeResult} roaMapType={1} />
                        </div>
                        <p className="game-dis">{/* {props.tableInfo.Status} */}</p>

                        <div className="favorites-box">
                            <SectionLiFavor2
                                tableNumber={props.tableInfo.TableNumber}
                            ></SectionLiFavor2>
                        </div>
                    </div>
                </div>
            </li>
        );
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
                {props.countryItem.map((item) => (
                    <div
                        class="countryItem"
                        onClick={(event) => seleCountry(event, item.value)}
                    >
                        <div class="location"></div>
                        <div class="place">
                            <span class="place1">{item.name}</span>
                        </div>
                        <div class="check"></div>
                    </div>
                ))}
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
