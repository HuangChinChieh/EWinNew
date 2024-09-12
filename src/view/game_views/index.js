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
import { orderReducer, initialOrderData } from './orderData';
import { AlertContext } from '../../component/alert';
import { moveChipAnimation } from 'games_component/animation/betAnimation/baccaratBasicAnimation'
import 'games_component/animation/betAnimation/orderAnimation.scss';
import BigNumber from 'bignumber.js';


const BaccaratTableNotifyContext = createContext();

const GameView = (props) => {
    //常數，props，plugin
    const GameType = "BA";
    //const tableNumber = useParams().gameId;
    const tableNumber = props.TableNumber;
    const gameSetID = props.GameSetID;
    const sendCheck = useRef({
        isTableRefreshing: false,
        isGameQuerying: false,
        isSendBetData: false
    });

    const history = useHistory();
    const { AddSubscribe, RemoveSubscribe, GetGameClient, isConnected } = useContext(BaccaratSubscribeContext);
    const { wallet, updateWallet } = useContext(WalletContext)
    const tableNotify = useRef(null);
    const notifyEvents = ["HeartBeat", "GreatRoad", "GuestEntry", "GuestLeave",
        "GameSetChange", "BetChange", "TableChange", "PeekingCard", "FirstDrawing", "RoundDrawCard"
    ];
    const { alertMsg } = useContext(AlertContext)


    //table相關
    const tableInfo = useRef(null);
    const queryInfo = useRef(null);
    const [useBetLimit, setUseBetLimit] = useState(null); //目前使用的限紅    
    const [roundNumber, setRoundNumber] = useState('');
    const [shoeNumber, setShoeNumber] = useState('');
    const [refreshStreamType, setRefreshStreamType] = useState(0);//串流種類，0=HD，1=SD 
    const [shoeResult, setShoeResult] = useState('');
    const countdownInfo = useRef({ lastQueryDate: null, tableTimeoutSecond: 60, remainingSecond: 0 });

    //電投相關資訊
    const [PADAvailable, setPADAvailable] = useState(false);
    const [onlineUserCount, setOnlineUserCount] = useState(false);
    const { cashUnit, setCashUnit } = useContext(CashUnitContext);
    const { userInfo, setUserInfoProperty, updateUserInfo } = useContext(UserInfoContext);

    //投注相關
    const [isCanBet, setIsCanBet] = useState(false);
    const [winAreas, setWinAreas] = useState(["Banker", "Tie"]);
    const [orderData, dispatchOrderData] = useReducer(orderReducer, initialOrderData);
    const [selChipData, setSelChipData] = useState(null);
    const [emptyOrderCount, setEmptyOrderCount] = useState(0);

    //視頻相關
    const [videoResolutionType, setVideoResolutionType] = useState(0);
    const [streamName, setStreamName] = useState("");
    const [videoSourceList, setVideoSourceList] = useState([]);
    const [vpDomain, setVpDomain] = useState("");
    const [userPoint, setUserPoint] = useState(0);
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

    useEffect(() => {
        //初次載入，撈取桌台資料
        let initPromise;
        const PromiseArray = [];
        let intervalIDByRefreshSubscribe = -1;
        let intervalIDByTableInfo = -1;
        let intervalIDByQueryGame = -1

        //initPromise
        initPromise = new Promise((resolve, reject) => {
            gameClient.EntryRoadMap(gameSetID, props.CurrencyType, tableNumber, (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        resolve({ name: "EntryRoadMap", value: null });
                    } else {
                        reject("EntryRoadMapError");
                    }
                } else {
                    reject("EntryRoadMapError");
                }
            })
        });

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
        if (gameSetID !== 0) {
            //傳統桌台，使用桌台限紅
            //資訊會從GetTableInfo取得
        } else {
            //非傳統，使用個人限紅
            PromiseArray.push(new Promise((resolve, reject) => {
                gameClient.UserAccountGetBetLimitListByRoadMap(tableNumber, props.CurrencyType, gameSetID, (success, o) => {
                    if (success) {
                        if (o.ResultCode === 0) {
                            resolve(o);
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
                            if (betLimitList[0].CurrencyType === props.CurrencyType) {
                                //幣別必須要相等
                                directSetBetLimit = betLimitList[0];
                            }
                        } else if (betLimitList.length > 1) {
                            //多組限紅，尋找跟上次選取差距最接近之限紅
                            for (const betLimit of betLimitList) {
                                if (selBetLimit.BetLimitID === betLimit.BetLimitID) {
                                    directSetBetLimit = betLimit;
                                    break;
                                } else if (betLimit.CurrencyType === props.CurrencyType) {
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

                    if (directSetBetLimit !== null) {
                        setBetLimit(tableNumber, gameSetID, directSetBetLimit, (success) => {
                            if (success) {
                                resolve({ name: "SetBetLimit", value: directSetBetLimit });
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

        //promise4 訂閱桌台資訊
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

        //#region4 取得視頻列表清單
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

        //#region5 取得查詢資料
        PromiseArray.push(
            new Promise((resolve, reject) => {
                gameClient.Query(gameSetID, tableNumber, (success, o) => {
                    if (success) {
                        if (o.ResultCode === 0) {
                            resolve({ name: "Query", value: o });
                        } else {
                            reject("QueryError");
                        }
                    } else {
                        reject("QueryError");
                    }
                });
            })
        );
        //#endregion

        initPromise.then(() => Promise.all(PromiseArray))
            .then((results) => {
                for (let result of results) {
                    switch (result.name) {
                        case "GetTableInfo":
                            //Set Table Info
                            handleTableInfo(result.value);
                            break;
                        case "SetBetLimit":
                            //#region result2 限紅相關
                            //限紅設定完成，設定限紅狀態                            
                            if (gameSetID !== 0) {
                                //傳統桌台，使用桌台限紅
                                //資訊會從GetTableInfo取得
                            } else {
                                debugger
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
                        case "Query":
                            handleQuery(result.value);
                            break;
                        default:
                            break;
                    }
                }
            })
            .then(() => {
                intervalIDByTableInfo = setInterval(() => {
                    refreshTableInfo();
                }, 5000);

                intervalIDByQueryGame = setInterval(() => {
                    refreshQueryGame();
                }, 5000);
            });


        setSelChipData({ ...chipsItems[0], index: 0 });


        resize();
        window.addEventListener('resize', resize);
        tableNotify.current = new Notify();

        return () => {
            //取消訂閱桌台
            clearInterval(intervalIDByRefreshSubscribe);
            clearInterval(intervalIDByTableInfo);
            clearInterval(intervalIDByQueryGame);
            RemoveSubscribe(tableNumber);
        };
    }, [tableNumber, gameSetID]);


    //#region 限紅相關事件

    const setBetLimit = (tableNumber, gameSetID, selBetLimit, cb) => {
        if (selBetLimit && selBetLimit.BetLimitID !== '') {
            gameClient.UserAccountSetBetLimit(tableNumber, props.CurrencyType, gameSetID, selBetLimit.BetLimitID, (s, o) => {
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
        if (sendCheck.current.isTableRefreshing === false) {
            gameClient.GetTableInfo(tableNumber, gameSetID, (success, o) => {
                sendCheck.current.isTableRefreshing = false;

                if (success) {
                    if (o.ResultCode === 0) {
                        handleTableInfo(o);
                    }
                }
            });

            sendCheck.current.isTableRefreshing = true;
        }
    };

    const refreshQueryGame = () => {
        if (sendCheck.current.isGameQuerying === false) {
            gameClient.Query(gameSetID, tableNumber, (success, o) => {
                sendCheck.current.isGameQuerying = false;

                if (success) {
                    if (o.ResultCode === 0) {
                        handleQuery(o);
                    }
                }
            });

            sendCheck.current.isGameQuerying = true;
        }
    };

    const handleTableInfo = (tableInfoData) => {
        //1.要求出碼
        //2.


        let prevStatus = tableInfo.current != null ? tableInfo.current.Status : "";
        //let prevRoundInfo = tableInfo.current != null ? {roundNumber:roundNumber, shoeNumber:shoeNumber} : {roundNumber:0, shoeNumber:0};        
        let roundInfoArray = tableInfoData.RoundInfo.split('-');

        tableInfo.current = tableInfoData;

        if (roundInfoArray.length > 0) {
            setShoeNumber(roundInfoArray[0]);
            setRoundNumber(roundInfoArray[1]);
        }

        setShoeResult(tableInfoData.ShoeResult);
        //setBaccaratType(tableInfoData.BaccaratType)

        //設定視頻串流
        setStreamName(handleStreamArray(tableInfoData.Stream));
        //處理倒數計時相關資料
        countdownInfo.current.lastQueryDate = new Date();
        countdownInfo.current.remainingSecond = tableInfoData.RemainingSecond;
        countdownInfo.current.tableTimeoutSecond = tableInfoData.TableTimeoutSecond;

        if (gameSetID === 0) {

        }

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

        checkIsCanBetAndCheckGameSet();

        if (prevStatus !== tableInfo.current.Status) {
            const statusText = tableInfo.current.Status.split('.')[1];
            tableNotify.current.notify("TableChange", { tableStatus: statusText });
        }
    };

    const handleQuery = (Q) => {
        let walletByQ = Q.UserInfo.Wallet.find((x) => x.CurrencyType === props.CurrencyType);
        //let roundInfoArray = Q.TableInfo.split('-');

        queryInfo.current = Q;

        // if (roundInfoArray.length > 0) {
        //     setShoeNumber(roundInfoArray[1]);
        //     setRoundNumber(roundInfoArray[2]);
        // }

        updateUserInfo({
            LoginAccount: Q.UserInfo.LoginAccount,
            RealName: Q.UserInfo.RealName,
            IsGuestAccount: Q.UserInfo.IsGuestAccount,
            UserCountry: Q.UserInfo.UserCountry
        });

        updateWallet({
            CurrencyType: walletByQ.CurrencyType,
            CurrencyName: walletByQ.CurrencyName,
            Balance: walletByQ.Balance
        });

        setCashUnit(Q.cashUnit);

        if (gameSetID === 0) {
            setUserPoint(wallet.Balance);
        } else {
            setUserPoint(Q.GameSetOrder.TotalUserChip + Q.GameSetOrder);
        }




        checkIsCanBetAndCheckGameSet();
    };

    const checkIsCanBetAndCheckGameSet = () => {
        if (queryInfo.current == null || tableInfo.current == null) {
            return;
        }

        const Q = queryInfo.current;
        const T = tableInfo.current;

        let countdownSecond = Math.ceil(countdownInfo.current.remainingSecond * 1000 - (new Date() - countdownInfo.current.lastQueryDate));
        // if(Q.AllowOrder && queryInfo.current.AllowBet){}

        //table資訊檢查
        // if (T.Status !== (GameType + ".OpenBet")) {
        //     if (T.BaccaratType === 0 || T.BaccaratType === 1) {
        //         //傳統
        //         if (gameSetID == null || gameSetID === 0) {
        //             //alertMsg("尚未出碼, 點擊要求出碼",)
        //         } else {
        //             checkGameAvail = true;
        //         }
        //     } else if (T.BaccaratType === 2 || T.BaccaratType === 3) {
        //         //快速電投，網投
        //         if ((wallet.Balance + orderData.totalValue) > 0) {
        //             checkGameAvail = true;
        //         }
        //     }
        // }

        //query資訊檢查

        let tableInfoList = Q.TableInfo.split('-');

        if (!Q.GameSetOrder.GameSetRoadMapNumber || (tableNumber === Q.GameSetOrder.GameSetRoadMapNumber)) {
            if (Q.UserInfo.AllowBet) {
                if ((Q.PADAvailable === true) || (T.BaccaratType === 3)) {
                    if (Q.GameSetOrder.GameSetState === 0 || Q.GameSetOrder.GameSetState === 1) {
                        if (!Q.GameSetOrder.Cmd) {
                            if (tableInfoList[2] !== 0) {
                                if (T.Status === (GameType + ".OpenBet")) {
                                    switch ((T.BaccaratType)) {
                                        case 0:
                                            //電投，檢查是否有已經存在的指令
                                            if (Q.SelfOrder.OrderCmd) {
                                                let cmdText = "";

                                                switch (Q.SelfOrder.OrderCmd.toUpperCase()) {
                                                    case "Pass".toUpperCase():
                                                        cmdText = "飛牌";
                                                        break;
                                                    case "NextShoe".toUpperCase():
                                                        cmdText = "換靴";
                                                        break;
                                                    case "ChangeDealer".toUpperCase():
                                                        cmdText = "更換荷官";
                                                        break;
                                                    case "ContactMe".toUpperCase():
                                                        cmdText = "請聯繫我";
                                                        break;
                                                    default:
                                                        break;
                                                }

                                                checkRealStopBet(false);


                                            } else if (orderData.confirmValue !== 0) {
                                                checkRealStopBet(false);

                                                // if (Q.AllowCancelOrder == 1) {
                                                //     showMessageMask(5, mlp.getLanguageKey("下注成功, 等待現場開牌, 點選畫面可取消投注..."), function () {
                                                //         showMessage(mlp.getLanguageKey("取消投注"), mlp.getLanguageKey("是否確認要取消投注?"), function () {
                                                //             clearOrder();
                                                //         });
                                                //     });
                                                // } else {
                                                //     showMessageMask(5, mlp.getLanguageKey("下注成功, 等待現場開牌..."));
                                                // }
                                            } else {
                                                //允許下注

                                                if (countdownSecond > 0 || (countdownInfo.current.tableTimeoutSecond === 0)) {
                                                    setIsCanBet(true);

                                                    var minBetValue = 0;

                                                    // if (betLimit != null) {
                                                    //     // 判斷最低檯紅
                                                    //     minBetValue = Math.min(betLimit.MinBetBanker, betLimit.MinBetPlayer, betLimit.MinBetTie, betLimit.MinBetPair);
                                                    // }

                                                    // enableOrderButton();

                                                    // if ((new BigNumber(Q.GameSetOrder.TotalUserChip).plus(Q.GameSetOrder.TotalRewardValue)).toNumber() > minBetValue) {
                                                    //     hideMessageMask();
                                                    // } else {
                                                    //     showMessageMask(4, mlp.getLanguageKey("檯面數已低於檯紅, 請加彩繼續遊戲"));
                                                    // }
                                                } else {
                                                    checkRealStopBet(false);
                                                }
                                            }
                                            break;
                                        case 1:
                                            if (Q.SelfOrder.OrderCmd) {
                                                let cmdText = "";

                                                switch (Q.SelfOrder.OrderCmd.toUpperCase()) {
                                                    case "Pass".toUpperCase():
                                                        cmdText = "飛牌";
                                                        break;
                                                    case "NextShoe".toUpperCase():
                                                        cmdText = "換靴";
                                                        break;
                                                    case "ChangeDealer".toUpperCase():
                                                        cmdText = "更換荷官";
                                                        break;
                                                    case "ContactMe".toUpperCase():
                                                        cmdText = "請聯繫我";
                                                        break;
                                                    default:
                                                        break;
                                                }

                                                checkRealStopBet(false);


                                            } else if (orderData.confirmValue !== 0) {
                                                checkRealStopBet(false);

                                                // if (Q.AllowCancelOrder == 1) {
                                                //     showMessageMask(5, mlp.getLanguageKey("下注成功, 等待現場開牌, 點選畫面可取消投注..."), function () {
                                                //         showMessage(mlp.getLanguageKey("取消投注"), mlp.getLanguageKey("是否確認要取消投注?"), function () {
                                                //             clearOrder();
                                                //         });
                                                //     });
                                                // } else {
                                                //     showMessageMask(5, mlp.getLanguageKey("下注成功, 等待現場開牌..."));
                                                // }
                                            } else {
                                                //允許下注

                                                if (countdownSecond > 0 || (countdownInfo.current.tableTimeoutSecond === 0)) {
                                                    setIsCanBet(true);

                                                    var minBetValue = 0;

                                                    // if (betLimit != null) {
                                                    //     // 判斷最低檯紅
                                                    //     minBetValue = Math.min(betLimit.MinBetBanker, betLimit.MinBetPlayer, betLimit.MinBetTie, betLimit.MinBetPair);
                                                    // }

                                                    // enableOrderButton();

                                                    // if ((new BigNumber(Q.GameSetOrder.TotalUserChip).plus(Q.GameSetOrder.TotalRewardValue)).toNumber() > minBetValue) {
                                                    //     hideMessageMask();
                                                    // } else {
                                                    //     showMessageMask(4, mlp.getLanguageKey("檯面數已低於檯紅, 請加彩繼續遊戲"));
                                                    // }
                                                } else {
                                                    checkRealStopBet(false);
                                                }
                                            }
                                            break;
                                        case 2:
                                            if (countdownSecond > 0) {
                                                setIsCanBet(true);

                                                var minBetValue = 0;

                                                // if (betLimit != null) {
                                                //     // 判斷最低檯紅
                                                //     minBetValue = Math.min(betLimit.MinBetBanker, betLimit.MinBetPlayer, betLimit.MinBetTie, betLimit.MinBetPair);
                                                // }

                                                // enableOrderButton();

                                                // if ((new BigNumber(Q.GameSetOrder.TotalUserChip).plus(Q.GameSetOrder.TotalRewardValue)).toNumber() > minBetValue) {
                                                //     hideMessageMask();
                                                // } else {
                                                //     showMessageMask(4, mlp.getLanguageKey("檯面數已低於檯紅, 請加彩繼續遊戲"));
                                                // }
                                            } else {
                                                checkRealStopBet(false);
                                            }
                                            break;
                                        case 3:
                                            if (countdownSecond > 0) {
                                                setIsCanBet(true);

                                                var minBetValue = 0;

                                                // if (betLimit != null) {
                                                //     // 判斷最低檯紅
                                                //     minBetValue = Math.min(betLimit.MinBetBanker, betLimit.MinBetPlayer, betLimit.MinBetTie, betLimit.MinBetPair);
                                                // }

                                                // enableOrderButton();

                                                // if ((new BigNumber(Q.GameSetOrder.TotalUserChip).plus(Q.GameSetOrder.TotalRewardValue)).toNumber() > minBetValue) {
                                                //     hideMessageMask();
                                                // } else {
                                                //     showMessageMask(4, mlp.getLanguageKey("檯面數已低於檯紅, 請加彩繼續遊戲"));
                                                // }
                                            } else {
                                                checkRealStopBet(false);
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                } else {
                                    setIsCanBet(false);
                                }
                            } else {
                                setIsCanBet(false);
                            }
                        } else {
                            setIsCanBet(false);
                        }
                    } else {
                        setIsCanBet(false);
                    }
                } else {
                    setIsCanBet(false);
                }
            } else {
                setIsCanBet(false);
            }
        } else {
            setIsCanBet(false);
        }

    };

    const checkRealStopBet = (nextIsCanBet) => {
        setIsCanBet((prev) => {
            if (prev === true && nextIsCanBet === false) {
                tableNotify.current.notify("TableChange", { tableStatus: "RealStopBet" });
            }
        });
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
            } else if (type === "GameSetChange") {
                if (args.GameSetID === gameSetID) {
                    refreshQueryGame();
                }
            } else {
                tableNotify.current.notify(type, args);
            }
        }
    };

    const NotifyOn = useCallback((eventName, cb) => {
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
    const handleBet = useCallback((action, args, cb) => {
        switch (action) {
            case "addBet":
                // args => beforeSetChipCb, finishCb
                if (isCanBet) {
                    if (orderData.unConfirmValue + selChipData.chipValue <= userPoint) {
                        if ("areaType" in args) {
                            moveChipAnimation(args.areaType, () => {
                                dispatchOrderData({
                                    type: "addBet",
                                    payload: {
                                        areaType: args.areaType,
                                        selChipData: selChipData
                                    }
                                });

                                if (cb) {
                                    cb();
                                }
                            });
                        }
                    } else {
                        alertMsg("錯誤", "餘額不足", null);
                    }
                }

                break;
            case "doubleBet":
                const promiseArray = [];
                if (isCanBet) {
                    if (orderData.unConfirmValue + orderData.totalValue <= userPoint) {
                        for (let areaType in orderData) {
                            if (orderData[areaType].totalValue > 0) {
                                promiseArray.push(new Promise((resolve, reject) => {
                                    moveChipAnimation(areaType, () => { resolve() });
                                }));
                            }
                        }

                        if (promiseArray.length > 0) {
                            Promise.all(promiseArray).then(() => {
                                dispatchOrderData({ type: "doubleBet" });
                                if (cb) {
                                    cb();
                                }
                            });
                        }

                    }

                }

                break;
            case "confirmBet":
                if (isCanBet) {
                    if (orderData.unConfirmValue <= userPoint) {
                        //checkBetLimit

                        if (isConnected) {
                            //gameClient.

                            if (checkOrderByBetlimit(orderData, useBetLimit)) {
                                //playSound("OrderAccept");
                                if (!sendCheck.current.isSendBetData) {
                                    sendCheck.current.isSendBetData = true;

                                    if (tableInfo.current.BaccaratType === 0 || tableInfo.current.BaccaratType === 1) {
                                        gameClient.AddBetType0(gameSetID, tableNumber, shoeNumber, roundNumber, orderData.orderSequence + 1
                                            , orderData.Banker.unConfirmValue, orderData.Player.unConfirmValue, orderData.Tie.unConfirmValue, orderData.BankerPair.unConfirmValue, orderData.PlayerPair.unConfirmValue
                                            , (s, o) => {
                                                sendCheck.current.isSendBetData = false;

                                                if (s) {
                                                    if (o.ResultState === 0) {
                                                        dispatchOrderData({ type: "confirmBet" });
                                                        setEmptyOrderCount(0);
                                                        handleQuery(o);
                                                    } else {
                                                        alertMsg(o.Message);
                                                        setTimeout(() => {
                                                            refreshQueryGame();
                                                        }, 3000);
                                                    }
                                                } else {
                                                    if (o === "Timeout")
                                                        alertMsg("網路異常, 請重新操作");
                                                    else
                                                        if ((o != null) && (o !== ""))
                                                            alertMsg(o);

                                                    refreshQueryGame();
                                                }
                                            });
                                    } else if (tableInfo.current.BaccaratType === 2) {
                                        gameClient.AddBetType1(props.CurrencyType, tableNumber, shoeNumber, roundNumber, orderData.orderSequence + 1
                                            , orderData.Banker.unConfirmValue, orderData.Player.unConfirmValue, orderData.Tie.unConfirmValue, orderData.BankerPair.unConfirmValue, orderData.PlayerPair.unConfirmValue
                                            , (s, o) => {
                                                sendCheck.current.isSendBetData = false;

                                                if (s) {
                                                    if (o.ResultState === 0) {
                                                        dispatchOrderData({ type: "confirmBet" });
                                                        setEmptyOrderCount(0);
                                                        handleQuery(o);
                                                    } else {
                                                        alertMsg(o.Message);
                                                        setTimeout(() => {
                                                            refreshQueryGame();
                                                        }, 3000);
                                                    }
                                                } else {
                                                    if (o === "Timeout")
                                                        alertMsg("網路異常, 請重新操作");
                                                    else
                                                        if ((o != null) && (o !== ""))
                                                            alertMsg(o);

                                                    refreshQueryGame();
                                                }
                                            });
                                    } else if (tableInfo.current.BaccaratType === 3) {
                                        gameClient.AddBetType2(props.CurrencyType, tableNumber, shoeNumber, roundNumber, orderData.orderSequence + 1
                                            , orderData.Banker.unConfirmValue, orderData.Player.unConfirmValue, orderData.Tie.unConfirmValue, orderData.BankerPair.unConfirmValue, orderData.PlayerPair.unConfirmValue
                                            , (s, o) => {
                                                sendCheck.current.isSendBetData = false;

                                                if (s) {
                                                    if (o.ResultState === 0) {
                                                        dispatchOrderData({ type: "confirmBet" });
                                                        setEmptyOrderCount(0);
                                                        handleQuery(o);
                                                    } else {
                                                        alertMsg(o.Message);
                                                        setTimeout(() => {
                                                            refreshQueryGame();
                                                        }, 3000);
                                                    }
                                                } else {
                                                    if (o === "Timeout")
                                                        alertMsg("網路異常, 請重新操作");
                                                    else
                                                        if ((o != null) && (o !== ""))
                                                            alertMsg(o);

                                                    refreshQueryGame();
                                                }
                                            });
                                    }


                                }
                            } else {
                                dispatchOrderData({ type: "cancelConfirmBet" });
                            }
                        } else {
                            dispatchOrderData({ type: "cancelConfirmBet" });
                            alertMsg("錯誤", "伺服器斷線", null);
                        }
                    } else {
                        dispatchOrderData({ type: "cancelConfirmBet" });
                        alertMsg("錯誤", "餘額不足", null);
                    }
                }


                dispatchOrderData({ type: "confirmBet" })
                break;
            case "cancelBet":
                if (queryInfo.current.AllowCancelOrder) {
                    if (isConnected) {
                        //playSound("OrderCancel");

                        if (!sendCheck.current.isSendBetData) {
                            sendCheck.current.isSendBetData = true;

                            if (tableInfo.current.BaccaratType === 0 || tableInfo.current.BaccaratType === 1) {
                                gameClient.ClearBetType0(props.gameSetID, tableNumber, shoeNumber, roundNumber, orderData.orderSequence + 1, (s, o) => {
                                    if (s) {
                                        if (o.ResultState === 0) {
                                            dispatchOrderData({ type: "clearBet" });
                                            handleQuery(o);
                                        } else {
                                            alertMsg("取消下注失敗" + o.Message);
                                            setTimeout(() => {
                                                refreshQueryGame();
                                            }, 3000);
                                        }
                                    } else {
                                        if (o === "Timeout")
                                            alertMsg("網路異常, 請重新操作");
                                        else
                                            if ((o != null) && (o !== ""))
                                                alertMsg(o);

                                        refreshQueryGame();
                                    }
                                });
                            } else if (tableInfo.current.BaccaratType === 2) {
                                gameClient.ClearBetType1( tableNumber, shoeNumber, roundNumber, orderData.orderSequence + 1, (s, o) => {
                                    if (s) {
                                        if (o.ResultState === 0) {
                                            dispatchOrderData({ type: "clearBet" });
                                            handleQuery(o);
                                        } else {
                                            alertMsg("取消下注失敗" + o.Message);
                                            setTimeout(() => {
                                                refreshQueryGame();
                                            }, 3000);
                                        }
                                    } else {
                                        if (o === "Timeout")
                                            alertMsg("網路異常, 請重新操作");
                                        else
                                            if ((o != null) && (o !== ""))
                                                alertMsg(o);

                                        refreshQueryGame();
                                    }
                                });
                            } else if (tableInfo.current.BaccaratType === 3) {
                                gameClient.ClearBetType2( tableNumber, shoeNumber, roundNumber, orderData.orderSequence + 1, (s, o) => {
                                    if (s) {
                                        if (o.ResultState === 0) {
                                            dispatchOrderData({ type: "clearBet" });
                                            handleQuery(o);
                                        } else {
                                            alertMsg("取消下注失敗" + o.Message);
                                            setTimeout(() => {
                                                refreshQueryGame();
                                            }, 3000);
                                        }
                                    } else {
                                        if (o === "Timeout")
                                            alertMsg("網路異常, 請重新操作");
                                        else
                                            if ((o != null) && (o !== ""))
                                                alertMsg(o);

                                        refreshQueryGame();
                                    }
                                });
                            }
                        }
                    } else {
                        alertMsg("錯誤", "伺服器斷線", null);
                    }
                } else {
                    alertMsg("錯誤", "不允許投注後取消", null);
                }                
                break;
            default:
                break;
        }
    }, []);

    const checkOrderByBetlimit = (_orderData, _betLimit) => {
        let sumPair = new BigNumber(_orderData.PlayerPair.totalBetValue).plus(_orderData.BankerPair.totalBetValue).toNumber();
        if (_orderData.Banker.totalBetValue > 0) {
            if (_orderData.Banker.totalBetValue >= _betLimit.Banker.Min) {
                if (_orderData.Banker.totalBetValue <= _betLimit.Banker.Max) {
                    if (_betLimit.BetBaseBanker !== 0) {
                        if (new BigNumber(_orderData.Banker.totalBetValue).modulo(_betLimit.BetBaseBanker).toNumber() !== 0) {
                            alertMsg("提醒", "下注失敗, 庄注碼必須是 " + _betLimit.BetBaseBanker + " 的倍數");
                            return false;
                        }
                    }
                } else {
                    alertMsg("提醒", "下注失敗, 庄注碼最高投注" + _betLimit.Banker.Max + getDisplayUnit().text);
                    return false;
                }
            } else {
                alertMsg("提醒", "下注失敗, 庄注碼最低投注" + _betLimit.Banker.Min + getDisplayUnit().text);
                return false;
            }

            if (_orderData.Player.totalBetValue >= _betLimit.Player.Min) {
                if (_orderData.Player.totalBetValue <= _betLimit.Player.Max) {

                } else {
                    alertMsg("提醒", "下注失敗, 閒注碼最高投注" + _betLimit.Player.Max + getDisplayUnit().text);
                    return false;
                }
            } else {
                alertMsg("提醒", "下注失敗, 閒注碼最低投注" + _betLimit.Player.Min + getDisplayUnit().text);
                return false;
            }

            if (_orderData.Tie.totalBetValue >= _betLimit.Tie.Min) {
                if (_orderData.Tie.totalBetValue <= _betLimit.Tie.Max) {

                } else {
                    alertMsg("提醒", "下注失敗, 和注碼最高投注" + _betLimit.Tie.Max + getDisplayUnit().text);
                    return false;
                }
            } else {
                alertMsg("提醒", "下注失敗, 和注碼最低投注" + _betLimit.Tie.Min + getDisplayUnit().text);
                return false;
            }

            if (sumPair >= _betLimit.Pair.Min) {
                if (sumPair <= _betLimit.Pair.Max) {

                } else {
                    alertMsg("提醒", "下注失敗, 對子注碼最高投注" + _betLimit.Pair.Max + getDisplayUnit().text);
                    return false;
                }
            } else {
                alertMsg("提醒", "下注失敗, 對子注碼最低投注" + _betLimit.Pair.Min + getDisplayUnit().text);
                return false;
            }


            if ((_orderData.Player.totalBetValue !== 0) && (_orderData.Player.totalBetValue !== 0) && (queryInfo.current.AllowBPType === 0)) {
                alertMsg("提醒", "下注失敗, 對子注碼最低投注" + _betLimit.Pair.Min + getDisplayUnit().text);
                return false;
            }

            return true;
        }
    };

    //#endregion


    const getCountdownInfo = useCallback(() => {
        return countdownInfo.current;
    }, []);

    const getTableInfo = useCallback((isRefresh, cb) => {
        return tableInfo.current;
    }, []);

    const getDisplayUnit = () => {
        let Ret = {
            text: "元",
            value: 1
        };

        switch (cashUnit) {
            case 0:
                Ret.text = "萬";
                Ret.value = 10000;
                break;
            case 1:
                Ret.text = "千";
                Ret.value = 1000;
                break;
            case 2:
                Ret.text = "元";
                Ret.value = 1;
                break;
            default:
                break;
        }

        return Ret;
    };

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
                            <GameVideo CT={props.CT} vpDomain={vpDomain} tableNumber={tableNumber} streamName={streamName}></GameVideo>
                            <GameRoadMap shoeResult={shoeResult}></GameRoadMap>
                            <GameBettingArea isCanBet={isCanBet}
                                winAreas={winAreas}
                                orderData={orderData}
                                handleBet={handleBet}
                            ></GameBettingArea>
                            <GameFooterArea totalBetValue={orderData.totalBetValue} chipItems={chipsItems}>
                                <GameChipsButton chipsItems={chipsItems}
                                    isCanBet={isCanBet}
                                    selChipData={selChipData}
                                    setSelChipData={setSelChipData}
                                    orderData={orderData}
                                    handleBet={handleBet}></GameChipsButton>
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