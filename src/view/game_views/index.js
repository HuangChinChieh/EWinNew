/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { EWinGameBaccaratClient } from '../signalr/bk/EWinGameBaccaratClient';
import GameHeader from 'games_component/game_header';
import GameFooterArea from 'games_component/game_footer_area';
import GameFooterBG from 'games_component/game_footer_bg';
import CountdownCircle from 'games_component/game_count_down_circle';
import GameBettingAction from 'games_component/game_betting_action';
import GameBettingArea from 'games_component/game_betting_area';
import GameChat from 'games_component/game_chat';
import { WalletContext } from '../../provider/GameLobbyProvider';
import { SubscribeContext } from '../../provider/GameBaccaratProvider'
import './index.scss';
import { useHistory } from 'react-router-dom';
import { orderReducer, initialOrderData } from './orderData';
import './orderAnimation.scss';
import { animationMoveChip } from './orderAnimation';



const GameView = (props) => {
    const GameType = "BA";
    const tableNumber = props.TableNumber;
    const gameSetID = props.GameSetID;
    const gameClient = EWinGameBaccaratClient.getInstance();
    const tableInfo = useRef(null);
    const [useBetLimit, setUseBetLimit] = useState(null); //目前使用的限紅    
    const [roundInfo, setRoundInfo] = useState('');
    const [refreshStreamType, setRefreshStreamType] = useState(0);//串流種類，0=HD，1=SD 
    const [shoeResult, setShoeResult] = useState('');
    const countdownInfo = useRef({ lastQueryDate: null, tableTimeoutSecond: 60, remainingSecond: 0 });
    const [isCanBet, setIsCanBet] = useState(false);
    const [winAreas, setWinAreas] = useState(["Banker", "Tie"]);
    const [orderData, setOrderData] = useState({
        Tie: {
            totalValue: 0,
            confirmValue: 0,
            unConfirmValue: 0,
            chips: []
        },
        Banker: {
            totalValue: 0,
            confirmValue: 0,
            unConfirmValue: 0,
            chips: [{ styleIndex: 5, chipsValue: 1000, orderUnix: "1721252751" }]
        },
        Player: {
            totalValue: 0,
            confirmValue: 0,
            unConfirmValue: 0,
            chips: []
        },
        PlayerPair: {
            totalValue: 0,
            confirmValue: 0,
            unConfirmValue: 0,
            chips: []
        },
        BankerPair: {
            totalValue: 0,
            confirmValue: 0,
            unConfirmValue: 0,
            chips: []
        }
    });



    const { wallet, updateWallet } = useContext(WalletContext)
    const { AddSubscribe, RemoveSubscribe } = useContext(SubscribeContext)
    const history = useHistory();


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
                        resolve(o);
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
                            resolve(o)
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
            AddSubscribe((addSubscribeSuccess) => {
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
            });
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

        Promise.all(PromiseArray).then((results) => {

            //#region result1 桌台資料相關
            //Set Table Info
            handleTableInfo(results[0]);

            //#endregion

            //#region result2 限紅相關
            //限紅設定完成，設定限紅狀態
            if (gameSetID === 0) {
                //傳統桌台，使用桌台限紅
                //資訊會從GetTableInfo取得
            } else {
                setUseBetLimit(results[1]);
            }
            //#endregion
        }).then(() => {
            intervalIDByTableInfo = setInterval(() => {
                refreshTableInfo();
            }, 5000);
        });



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
    }

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

    //#region 投注相關事件
    //動畫也在這邊做處理，因為有

    const bet = (type, value) => {

    };

    const doubleBet = (e) => {

    }

    const cancelBet = (e) => {

    };



    //#endregion

    const rasieOrderValue = () => {

    };

    const refreshTableInfo = () => {
        gameClient.GetTableInfo(tableNumber, gameSetID, (success, o) => {
            if (success) {
                if (o.ResultCode === 0) {
                    handleTableInfo(o);
                }
            }
        });
    };

    const handleTableInfo = (tableInfo) => {
        tableInfo.current = tableInfo;
        setRoundInfo(tableInfo.RoundInfo);
        setShoeResult(tableInfo.ShoeResult);

        //處理倒數計時相關資料
        countdownInfo.current.lastQueryDate = new Date();
        countdownInfo.current.remainingSecond = tableInfo.RemainingSecond;
        countdownInfo.current.tableTimeoutSecond = tableInfo.TableTimeoutSecond;

        switch (tableInfo.Status) {
            case GameType + ".Close":
                setIsCanBet(false);
                break;
            case GameType + ".NewRound":
                setIsCanBet(false);
                break;
            case GameType + ".OpenBet":
                setIsCanBet(true);
                break;
            case GameType + ".StopBet":
                setIsCanBet(false);
                break;
            case GameType + ".GameResult":
                setIsCanBet(false);
                break;
            case GameType + ".Cancel":
                setIsCanBet(false);
                break;
            case GameType + ".Delete":
                setIsCanBet(false);
                break;
            case GameType + ".Shuffling":
                setIsCanBet(false);
                break;
            case GameType + ".NoService":
                setIsCanBet(false);
                break;
            case GameType + ".AccidentPending":
                setIsCanBet(false);
                break;
            default:
                //視為Close
                break;
        }
    };

    const getCountdownInfo = useCallback(() => {
        return countdownInfo.current;
    }, []);

    const getTableInfo = useCallback(() => {
        return tableInfo.current;
    }, []);

    const setStreamType = 1;


    const memoCountdownCircle = useMemo(() => (
        <div className="game-content">

        </div>
    ), [isCanBet, getCountdownInfo]);

    return (
        <div className="game-view-wrap">
            <div className='game-view-box'>
                <GameHeader tableNumber={props.tableNumber} getTableInfo={getTableInfo} />
                <CountdownCircle isCanBet={isCanBet} getCountdownInfo={getCountdownInfo} />
                <GameChat />
                <GameFooterArea />
                <GameBettingArea isCanBet={isCanBet} />
                <GameFooterBG />
            </div>
        </div>
    );
};

export default GameView;