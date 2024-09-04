/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, useRef, useCallback, useMemo, useReducer, createContext } from 'react';
import { Notify } from 'utils/Notify';
import CountdownCircle from 'games_component/game_count_down_circle';
import { WalletContext, CashUnitContext, UserInfoContext } from '../../provider/GameLobbyProvider';
import { BaccaratSubscribeContext } from '../../provider/GameBaccaratProvider'
import './index.scss';
import { useHistory, useParams } from 'react-router-dom';
//import { animationMoveChip } from './orderAnimation';
import GameFooterArea from 'games_component/game_footer_area';
import GameChipsButton from 'games_component/game_buttons/game_chips_btn';
import GameBettingArea from 'games_component/game_betting_area_new';
import GameRoadMap from 'games_component/game_road_map';
import GameVideo from 'games_component/game_video';
import { EWinGameBaccaratClient } from 'signalr/bk/EWinGameBaccaratClient';
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import { orderReducer, initialOrderData } from './orderData';
import { forEach } from 'lodash';
import { generateUUIDv4 } from 'utils/guid';
import { AlertContext } from '../../component/alert';

const BaccaratTableNotifyContext = createContext();

const GameView = (props) => {
    //常數，props，plugin
    const GameType = "BA";
    //const tableNumber = useParams().gameId;
    const tableNumber = props.TableNumber;
    const gameSetID = props.GameSetID;    
    let isTableRefreshing = false;
    let isGameQuerying = false;
    const history = useHistory();
    const { AddSubscribe, RemoveSubscribe, GetGameClient } = useContext(BaccaratSubscribeContext);
    const { wallet, updateWallet } = useContext(WalletContext)
    const tableNotify = useRef(null);
    const notifyEvents = ["HeartBeat", "GreatRoad", "GuestEntry", "GuestLeave",
        "GameSetChange", "BetChange", "TableChange", "PeekingCard", "FirstDrawing", "RoundDrawCard"
    ];
    const { alertMsg } = useContext(AlertContext)


    //table相關
    const gameSetID = props.GameSetID;
    const gameClient = EWinGameBaccaratClient.getInstance();
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const tableInfo = useRef(null);
    const queryInfo = useRef(null);
    const [useBetLimit, setUseBetLimit] = useState(null); //目前使用的限紅    
    const [roundNumber, setRoundNumber] = useState('');
    const [shoeNumber, setShoeNumber] = useState('');
    const [refreshStreamType, setRefreshStreamType] = useState(0);//串流種類，0=HD，1=SD 
    const [shoeResult, setShoeResult] = useState('');
    const countdownInfo = useRef({ lastQueryDate: null, tableTimeoutSecond: 60, remainingSecond: 0 });

    //電投相關資訊
    const    [PADAvailable, setPADAvailable] = useState(false);
    const    [onlineUserCount, setOnlineUserCount] = useState(false);
    const { cashUnit, setCashUnit } = useContext(CashUnitContext);
    const { userInfo, setUserInfoProperty, updateUserInfo } = useContext(UserInfoContext);

    //投注相關
    const [isCanBet, setIsCanBet] = useState(false);
    const [winAreas, setWinAreas] = useState(["Banker", "Tie"]);    
    const [orderData, dispatchOrderData] = useReducer(orderReducer, initialOrderData);
    const [selChipData, setSelChipData] = useState(null);

    //視頻相關
    const [videoResolutionType, setVideoResolutionType] = useState(0);
    const [streamName, setStreamName] = useState("");
    const [videoSourceList, setVideoSourceList] = useState([]);
    const [vpDomain, setVpDomain] = useState("");
    const [GameSetPoint, setGameSetPoint] = useState(0)
    //0=std/1=HD

    const chipsItems = [
        { styleIndex: 1, chipValue: 25 },
        { styleIndex: 2, chipValue: 50 },
        { styleIndex: 3, chipValue: 100 },
        { styleIndex: 4, chipValue: 500 },
        { styleIndex: 5, chipValue: 1000 },
        { styleIndex: 6, chipValue: 1250 },
        { styleIndex: 7, chipValue: 5000 },
        { styleIndex: 8, chipValue: 10000 }
    ];


    const gameClient = GetGameClient();
    const orderSequence = 0;

    useEffect(() => {
        //初次載入，撈取桌台資料
        const PromiseArray = [];
        let intervalIDByRefreshSubscribe = -1;
        let intervalIDByTableInfo = -1;

        //promise1 取得桌台資料
        PromiseArray.push(new Promise((resolve, reject) => {
            gameClient.GetTableInfo(tableNumber, gameSetID, (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        resolve({ name: "GetTableInfo", value: o });
                    } else {
                        reject("GetTableInfoError");
                    }
                } else {
                    reject("GetTableInfoError");
                }
            });
        }));

        //#region promise2 設定限紅
        if (gameSetID === 0) {
            //傳統桌台，使用桌台限紅
            //資訊會從GetTableInfo取得
        } else {
            //非傳統，使用個人限紅
            PromiseArray.push(new Promise((resolve, reject) => {
                gameClient.UserAccountGetBetLimitListByRoadMap(tableNumber, gameSetID, (success, o) => {
                    if (success) {
                        if (o.ResultCode === 0) {
                            resolve({ name: "SetBetLimit", value: o });
                        } else {
                            reject("GetBetLimitError");
                        }
                    } else {
                        reject("GetBetLimitError");
                    }
                })
            }).then((o) => {
                return new Promise((resolve, reject) => {
                    //#region 限紅設定                
                    const selBetLimit = JSON.parse(localStorage.getItem("SelBetLimit"));
                    let distance = -1;
                    let directSetBetLimit = null;

                    if (o.BetLimitList && o.BetLimitList.length > 0) {
                        const betLimitList = o.BetLimitList;

                        if (betLimitList.length === 1) {
                            //只有一組限紅，直接設定
                            if (betLimitList[0].CurrencyType === wallet.CurrencyType) {
                                //幣別必須要相等
                                directSetBetLimit = betLimitList[0];
                            }
                        } else if (betLimitList.length > 1) {
                            //多組限紅，尋找跟上次選取差距最接近之限紅
                            for (const betLimit of betLimitList) {
                                if (selBetLimit.BetLimitID === betLimit.BetLimitID) {
                                    directSetBetLimit = betLimit;
                                    break;
                                } else if (betLimit.CurrencyType === wallet.CurrencyType) {
                                    const tempDistance = Math.abs(betLimit.MinBetPlayer - selBetLimit.MinBetPlayer) + Math.abs(selBetLimit.MaxBet - betLimit.MaxBet);

                                    if (distance !== -1) {
                                        if (tempDistance < distance) {
                                            distance = tempDistance;
                                            directSetBetLimit = betLimit;
                                        }
                                    } else {
                                        distance = tempDistance;
                                        directSetBetLimit = betLimit;
                                    }
                                }
                            }
                        }
                    }
debugger;
                    if (directSetBetLimit !== null) {
                        setBetLimit(tableNumber, gameSetID, directSetBetLimit, (success) => {
                            if (success) {
                                resolve(directSetBetLimit);
                            } else {
                                reject("SetBetLimitError");
                            }
                        });
                    } else {
                        clearBetLimit(tableNumber, (success) => {
                            if (success) {
                                resolve(null);
                            } else {
                                reject("ClearBetLimitError");
                            }
                        });
                    }
                    //#endregion
                });
            }));
        }
        //#endregion

        //promise3 訂閱桌台資訊
        //#region promise3 訂閱桌台資訊
        //由於沒有回傳要處理state，從promise array移出
        //PromiseArray.push();

        new Promise((resolve, reject) => {

            //訂閱桌台
            AddSubscribe(tableNumber, (addSubscribeSuccess) => {
                if (addSubscribeSuccess) {
                    //刷新並取得桌台資訊
                    gameClient.RefreshSubscribe(gameSetID, tableNumber, refreshStreamType, (s, o) => {
                        if (s) {
                            if (o.ResultCode === 0) {
                                resolve(o);
                            } else {
                                reject("RefreshSubscribeError");
                            }
                        } else {
                            reject("RefreshSubscribeError");
                        }
                    });
                } else {
                    reject("AddSubscribeError");
                }
            }, handleNotify);
        }).then(() => {
            intervalIDByRefreshSubscribe = setInterval(() => {
                gameClient.RefreshSubscribe(gameSetID, tableNumber, refreshStreamType, (s, o) => {
                    if (s) {
                        if (o.ResultCode === 0) {

                        } else {
                            clearInterval(intervalIDByRefreshSubscribe);
                            history.replace("");
                        }
                    }
                });
            }, 10000);
        });

        //#endregion

        //promise4 取得視頻列表清單

        //#region 取得視頻列表清單
        PromiseArray.push(
            new Promise((resolve, reject) => {
                getVideoSourceList((success, o) => {
                    if (success) {
                        resolve({ name: "GetVideoSourceList", value: o });
                    } else {
                        reject(o);
                    }
                });
            })
        );
        //#endregion

        Promise.all(PromiseArray).then((results) => {
            for (let result of results) {
                switch (result.name) {
                    case "GetTableInfo":
                        //Set Table Info
                        handleTableInfo(result.value);
                        break;
                    case "SetBetLimit":
                        //#region result2 限紅相關
                        //限紅設定完成，設定限紅狀態
                        if (gameSetID === 0) {
                            //傳統桌台，使用桌台限紅
                            //資訊會從GetTableInfo取得
                        } else {
                            debugger;
                            setUseBetLimit(result.value);
                        }
                        //#endregion
                        break;
                    case "GetVideoSourceList":
                        //#region 視頻清單資料                
                        setVideoSourceList(result.value.Source);

                        if (vpDomain === "") {
                            if (result.value.Source.length > 0) {
                                setVpDomain(result.value.Source[0].Server);
                            }
                        }

                        //#endregion
                        break;
                    default:
                        break;
                }
            }
        }).then(() => {
            intervalIDByTableInfo = setInterval(() => {
                refreshTableInfo();
            }, 5000);
        });


        setSelChipData({ ...chipsItems[0], index: 0 });


        resize();
        window.addEventListener('resize', resize);
        tableNotify.current = new Notify();

        return () => {
            clearInterval(intervalIDByRefreshSubscribe);
            //取消訂閱桌台
            clearInterval(intervalIDByTableInfo);
            RemoveSubscribe(tableNumber);
        };
    }, [tableNumber, gameSetID]);


    //#region 限紅相關事件

    const setBetLimit = (tableNumber, gameSetID, selBetLimit, cb) => {

        if (selBetLimit && selBetLimit.BetLimitID !== 0) {
            gameClient.UserAccountSetBetLimit(tableNumber, wallet.CurrencyType, gameSetID, selBetLimit, (s, o) => {
                if (s) {
                    if (o.ResultCode === 0) {
                        localStorage.setItem("SelBetLimit", JSON.stringify(selBetLimit));
                        cb(true);
                    } else {
                        cb(false);
                    }
                } else {
                    cb(false);
                }
            });
        } else {
            cb(false);
        }
    };

    const clearBetLimit = (cb) => {

        gameClient.UserAccountClearBetLimit((s, o) => {
            if (s) {
                if (o.ResultCode === 0) {
                    localStorage.removeItem("SelBetLimit");
                    cb(true);
                } else {
                    cb(false);
                }
            } else {
                cb(false);
            }
        });
    };

    //#endregion

    //#region 視頻相關
    const handleStreamArray = (streamArray) => {
        let ret;
        //streamArray最多為兩個

        if (streamArray.length === 0) {
            ret = "";
        } else if (streamArray.length === 1) {
            ret = streamArray[0].StreamName.toUpperCase();
        } else {
            if (videoResolutionType != null) {
                if (videoResolutionType === 0) {
                    // std
                    ret = streamArray[1].StreamName.toUpperCase();
                } else {
                    // HD
                    ret = streamArray[0].StreamName.toUpperCase();
                }
            } else {
                ret = streamArray[0].StreamName.toUpperCase();
            }
        }


        return ret;
    };


    const getVideoSourceList = (cb) => {
        fetch('https://ewin.dev.mts.idv.tw/GetVideoSource.aspx?CT=' + window.encodeURIComponent(props.CT), {
            method: 'GET' // 请求方法// 将 JavaScript 对象转换为 JSON 字符串
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 解析响应中的 JSON 数据
        }).then((o) => {
            cb(true, o);
        }).catch(() => {
            cb(false, null);
        });
    };


    const selectVideoSource = (s, r) => {
        window.localStorage.setItem("VideoSourceDomain", s);
        window.localStorage.setItem("VideoResolutionType", r);

        setVpDomain(s);
        setVideoResolutionType(r);
    };

    //#endregion

    //#region 主資訊刷新
    const refreshTableInfo = () => {
        if (isTableRefreshing === false) {
            gameClient.GetTableInfo(tableNumber, gameSetID, (success, o) => {
                isTableRefreshing = false;

                if (success) {
                    if (o.ResultCode === 0) {
                        handleTableInfo(o);
                    }
                }
            });

            isTableRefreshing = true;
        }
    };

    const queryGame = () => {
        if (isGameQuerying === false) {
            gameClient.Query(gameSetID, tableNumber, (success, o) => {
                isGameQuerying = false;

                if (success) {
                    if (o.ResultCode === 0) {
                        handleTableInfo(o);
                    }
                }
            });

            isGameQuerying = true;
        }
    };

    const handleTableInfo = (tableInfoData) => {
        //1.要求出碼
        //2.


        let prevStatus = tableInfo.current != null ? tableInfo.current.Status : "";
        //let prevRoundInfo = tableInfo.current != null ? {roundNumber:roundNumber, shoeNumber:shoeNumber} : {roundNumber:0, shoeNumber:0};
        let countdownSecond;        
        let roundInfoArray = tableInfoData.RoundInfo.split('-');

        tableInfo.current = tableInfoData;

        if(roundInfoArray.length > 0){
            setShoeNumber(roundInfoArray[0]);
            setRoundNumber(roundInfoArray[1]);
        }
        
        setShoeResult(tableInfoData.ShoeResult);
        //setBaccaratType(tableInfoData.BaccaratType)

        //處理倒數計時相關資料
        countdownInfo.current.lastQueryDate = new Date();
        countdownInfo.current.remainingSecond = tableInfoData.RemainingSecond;
        countdownInfo.current.tableTimeoutSecond = tableInfoData.TableTimeoutSecond;

        countdownSecond = countdownInfo.current.remainingSecond * 1000 - (new Date() - countdownInfo.current.lastQueryDate);
        //設定視頻串流
        setStreamName(handleStreamArray(tableInfoData.Stream));

        switch (tableInfoData.Status) {
            case GameType + ".Close":
            
                break;
            case GameType + ".NewRound":
            
                break;
            case GameType + ".OpenBet":
            
                break;
            case GameType + ".StopBet":
            
                break;
            case GameType + ".GameResult":
            
                break;
            case GameType + ".Cancel":
            
                break;
            case GameType + ".Delete":
            
                break;
            case GameType + ".Shuffling":
            
                break;
            case GameType + ".NoService":
            
                break;
            case GameType + ".AccidentPending":
            
                break;
            default:
                //視為Close
                break;
        }

        
        //#region 可以投注，資料判斷
        //1.投注時間檢查
    
        // if (Math.ceil(countdownSecond / 1000) <= 0) 
        //     nextIsCanBet = false;           
        

        // if (tableInfo.current.Status !== (GameType + ".OpenBet")) {

        // }
            
    

        // if(wallet.Balance + orderData.totalValue < 0)
        //     nextIsCanBet = false;  
        
        // if(baccaratType === 0 || baccaratType === 1)


        // //#endregion



        // if (Math.ceil(countdownSecond / 1000) <= 0) {
        //     nextIsCanBet = false;           
        // }

        // if (tableInfo.current.Status !== (GameType + ".OpenBet")) {
        //     nextIsCanBet = false;           
        // }

      
        
        // setIsCanBet(nextIsCanBet);
        if (tableInfo.current.Status === (GameType + ".OpenBet")) {
            tableInfo.current.Status = GameType + ".StopBet";
        }


        if (prevStatus !== tableInfo.current.Status) {
            const statusText = tableInfo.current.Status.split('.')[1];
            tableNotify.current.notify("TableChange", { tableStatus: statusText });
        }
                
    };

    const handleQuery = (Q) => {
        let wallet = Q.UserInfo.Wallet.find((x) => x.CurrencyType === wallet.CurrencyType);
        queryInfo.current = Q;
        
        updateUserInfo({
            LoginAccount:Q.UserInfo.LoginAccount,
            RealName:Q.UserInfo.RealName,
            IsGuestAccount:Q.UserInfo,
            UserCountry:Q.UserInfo            
        });

        updateWallet({
        CurrencyType:wallet.CurrencyType,
        CurrencyName:wallet.CurrencyName,
        Balance:wallet.CurrencyBalanceType
        });

        setCashUnit(Q.cashUnit);
        setGameSetPoint(Q.GameSetOrder.TotalUserChip);


        checkIsCanBet();
    };

 

    const checkIsCanBet = () =>{
        const Q = queryInfo.current;
        const T =  tableInfo.current;
        let ret = false;
        let checkGameAvail = false;

        // if(Q.AllowOrder && queryInfo.current.AllowBet){}

        if (T.Status !== (GameType + ".OpenBet")) {
            if(T.BaccaratType === 0 || T.BaccaratType ===1){
                //傳統
                if(gameSetID == null || gameSetID === 0){
                    //alertMsg("尚未出碼, 點擊要求出碼",)
                }else{
                    checkGameAvail = true;
                }
            }else if(T.BaccaratType === 2 || T.BaccaratType === 3){
                //快速電投，網投
                if((wallet.Balance + orderData.totalValue) > 0){
                    checkGameAvail = true;
                }
            }
        } 

        if(checkGameAvail){
            if(Q.GameSetOrder.GameSetRoadMapNumber == null || (tableNumber === Q.GameSetOrder.GameSetRoadMapNumber))
            {
                if(Q.UserInfo.AllowBet){
                    if ((Q.PADAvailable === true) || (T.BaccaratType === 3)) {

                    }else{

                    }
                }else{
                    setIsCanBet(false);

                    if (Q.UserInfo.UserAccountType === 0)
                        alertMsg(4, ("您的帳戶無法投注"));
                    else
                    alertMsg(4, ("股東或代理帳戶無法投注, 請使用一般帳戶進行遊戲"));
                }
            }else{
                setIsCanBet(false);
                alertMsg("", "桌號已更換, 請點選切換到新桌號", ()=>{});
            }
        }
    };

    //#endregion





    //#region notify相關
    const handleNotify = (type, args) => {
        if (notifyEvents.includes(type)) {
            if (type === "TableChange") {
                //如果是桌台狀態改變，重新撈取桌台資訊確認最新的桌台狀態
                if (args.Action !== "") {
                    refreshTableInfo();
                }
            } else {
                tableNotify.current.notify(type, args);
            }
        }
    };

    const NotifyOn = useCallback((eventName, cb) => {
        //debugger
        if (notifyEvents.includes(eventName)) {
            tableNotify.current.on(eventName, cb);
        }
    }, []);


    const NotifyOff = useCallback((eventName, cb) => {
        if (notifyEvents.includes(eventName)) {
            tableNotify.current.off(eventName, cb);
        }
    }, []);
    //#endregion 

    //#region 投注相關

    const AddBet = (areaType) =>{

    };

    const confirmBet = (tableType) => {
        let methodName;

        switch (tableType) {
            case 0:
                methodName = "AddBetType0";
                break;
            case 1:
                methodName = "AddBetType1";
                break;
            case 2:
                methodName = "AddBetType2";
                break;
            default:
                methodName = "AddBetType2";
                break;
        }

        if(orderData.unConfirmValue > 0){
            gameClient[methodName](wallet.CurrencyType, tableNumber, shoeNumber, roundNumber, );
        }                
    };

const roadMapNumber='';
const shoeNumber='';
const roundNumber='';

    //#region 工單
    const SetBetType0Cmd = useCallback((cmd, cb) => {
        orderSequence = orderSequence + 1;
        gameClient.SetBetType0Cmd(generateUUIDv4(), gameSetID, roadMapNumber, shoeNumber, roundNumber, orderSequence , cmd,(s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              cb(o);
            }
          }
        });
      }, [gameClient]);

      const SetGameSetCmd = useCallback((cmd, cb) => {
          gameClient.SetGameSetCmd(generateUUIDv4(), gameSetID, roadMapNumber, shoeNumber, roundNumber, cmd, (s, o) => {
            if (s) {
              if (o.ResultCode === 0) {
                cb(o);
              }
            }
          });
        }, [gameClient]);

        const AddChip = useCallback((addChipValue, cb) => {
            gameClient.AddChip(generateUUIDv4(), gameSetID, roadMapNumber, shoeNumber, roundNumber, addChipValue, (s, o) => {
              if (s) {
                if (o.ResultCode === 0) {
                  cb(o);
                }
              }
            });
          }, [gameClient]);

          const GetTableInfoList = useCallback((areaCode, cb) => {
            lobbyClient.GetTableInfoList(areaCode, gameSetID,(s, o) => {
                if (s) {
                  if (o.ResultCode === 0) {
                    cb(o);
                  }
                }
              });
            }, [lobbyClient]);
    //#endregion


    const getCountdownInfo = useCallback(() => {
        return countdownInfo.current;
    }, []);

    const getTableInfo = useCallback((isRefresh, cb) => {
        if (isRefresh) {
            refreshTableInfo(cb);
        } else {
            cb(tableInfo.current);
        }
    }, []);

    const resize = () => {
        // 设计稿的宽度和高度
        const designWidth = 1920;
        const designHeight = 1080;

        // 获取当前窗口的宽度和高度
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;

        // 根据窗口的宽度或高度计算比例
        const widthRatio = currentWidth / designWidth;
        const heightRatio = currentHeight / designHeight;

        // 使用最小比例来保证适应屏幕而不超出
        const scaleRatio = Math.min(widthRatio, heightRatio);

        // 计算新的 font-size，基于 16px 的设计基础大小
        const newFontSize = 16 * scaleRatio;

        // 设置根元素的 font-size
        document.documentElement.style.fontSize = `${newFontSize}px`;
    };



    return (
        <BaccaratTableNotifyContext.Provider value={{ NotifyOn, NotifyOff }}>
            <div className="game-view-wrap">

                {/* <GameHeader tableNumber={props.tableNumber} getTableInfo={getTableInfo} />
    <CountdownCircle isCanBet={isCanBet} getCountdownInfo={getCountdownInfo} />
    <GameChat />
    <GameFooterArea />
    <GameBettingArea isCanBet={isCanBet} /> 
    */
                    roundNumber === "" ? (<div></div>) : (
                        <div className='game-view-box' >
                            <CountdownCircle isCanBet={isCanBet} getCountdownInfo={getCountdownInfo} setIsCanBet={setIsCanBet}></CountdownCircle>
                            <GameVideo CT={props.CT} vpDomain={vpDomain} tableNumber={tableNumber} streamName={streamName} getTableInfo={getTableInfo}></GameVideo>
                            <GameRoadMap shoeResult={shoeResult}></GameRoadMap>
                            <GameBettingArea isCanBet={isCanBet}
                                winAreas={winAreas}
                                selChipData={selChipData}
                                orderData={orderData}
                                dispatchOrderData={dispatchOrderData}
                            ></GameBettingArea>
                            <GameFooterArea totalBetValue={totalBetValue} chipItems={chipsItems}
                                chipItems={chipsItems}
                                SetBetType0Cmd={SetBetType0Cmd}
                                SetGameSetCmd={SetGameSetCmd}
                                AddChip={AddChip}
                                GetTableInfoList={GetTableInfoList}>
                                <GameChipsButton chipsItems={chipsItems}
                                    isCanBet={isCanBet}
                                    selChipData={selChipData}
                                    setSelChipData={setSelChipData}
                                    orderData={orderData}
                                    dispatchOrderData={dispatchOrderData}></GameChipsButton>
                            </GameFooterArea>
                        </div>

                    )
                }

            </div>
        </BaccaratTableNotifyContext.Provider>
    );
};

export default GameView;
export { BaccaratTableNotifyContext };