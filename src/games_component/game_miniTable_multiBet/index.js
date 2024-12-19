import React, { useState, useRef, useReducer, useContext, useEffect } from 'react';
import GameRoadMapMultiBet from '../game_road_map_multiBet'
import CountdownLittleCircle from '../game_count_down_circle_little'
import { orderReducer, initialOrderData } from "../../view/game_views/orderData";
import './index.scss'
import { CashUnitContext, BetLimitContext } from "provider/GameLobbyProvider";
import { ToolTipContext } from "provider/tooltipProvider";
import {
    BaccaratGameContext
} from "view/game_views";
import {
    WalletContext
} from "provider/GameLobbyProvider";

const MiniTableMultiBet = ({ tableName,
    roundInfo,
    remainingSecond,
    lastQueryDate,
    tableTimeoutSecond,
    status,
    betLimit,
    shoeResult
}) => {


    const [orderData, dispatchOrderData] = useReducer(
        orderReducer,
        initialOrderData
    );

    const orderDataInfoRef = useRef(orderData);

    const { numberTranslate } = useContext(CashUnitContext);
    const { getBetLimitMaxMin } = useContext(BetLimitContext);
    const minMaxObj = getBetLimitMaxMin(betLimit);
    const [isCanBet, setIsCanBet] = useState(false);
    const [tipText, setTipText] = useState("");
    const { getSelChipData, gameClient, getIsSendCheck} = useContext(BaccaratGameContext);
    const { wallet, updateWallet } = useContext(WalletContext);
    const {showTooltip, hideTooltip} = useContext(ToolTipContext);


    const addChip = (betArea)=>{
        debugger;
        if(isCanBet){
            let selChipData = getSelChipData();

            if (orderDataInfoRef.current.unConfirmValue + selChipData.chipValue <= wallet.Balance || true) {
                dispatchOrderData({
                    type: "addBet",
                    payload: {
                        areaType: betArea,
                        selChipData: selChipData,
                    },
                });
            }            
        }
    };

    const cancelChip = ()=>{
        if(isCanBet){
            let selChipData = getSelChipData();

            // if (orderDataInfoRef.current.unConfirmValue + selChipData.chipValue <= wallet.Balance) {
            //     dispatchOrderData({
            //         type: "addBet",
            //         payload: {
            //             areaType: ,
            //             selChipData: selChipData,
            //         },
            //     });
            // }            
        }
    };


    useEffect(()=>{
        orderDataInfoRef.current = orderData;
    },[orderData]);


    useEffect(() => {
        if ( ["NoService", "AccidentPending"].includes(status)) {
            setIsCanBet(false);
            setTipText("暫停服務");
        } else {
            if (status === "Shuffling") {
                setIsCanBet(false);
                setTipText("洗牌中");
            } else {         
                if (["NewRound"].includes(status)) {
                    setIsCanBet(false);
                    setTipText("停止下注");
                    dispatchOrderData({ type: "clearBet" });
                } else if (["StopBet"].includes(status) ) {
                    setIsCanBet(false);
                    setTipText("停止下注");
                } else if (["GameResult"].includes(status) ) {
                    setIsCanBet(false);
                    setTipText("開牌中");
                } else if (["Cancel", "Delete"].includes(status)  ) {
                    setIsCanBet(false);
                    setTipText("本局取消");
                } else if (["OpenBet"].includes(status)  ) {
                    setIsCanBet(true);
                    setTipText("");
                } else {
                    setIsCanBet(false);
                    setTipText("暫停服務");
                }
            }
        }
    }, [status]);

    useEffect(() => {
       //roundInfo有異動
       dispatchOrderData({ type: "clearBet" });
    }, [roundInfo]);



    return (
        <div className={`miniTableMultiBet`}>
            <div className={`rowCount-1`}>
                <div className='miniTableMultiBet-tableData'>
                    <div className='miniTableMultiBet-tableInfo' onMouseEnter={(event)=>{showTooltip(event.currentTarget, "進入桌台", "black")}} onMouseLeave={()=>hideTooltip()}>
                        <div className='miniTableMultiBet-tableName'>{tableName}</div>
                        <div className='miniTableMultiBet-roundInfo'>{roundInfo}</div>
                    </div>
                    <div className="miniTableMultiBet-betLimit">{numberTranslate(minMaxObj.MinValue) + " - " + numberTranslate(minMaxObj.MaxValue)}</div>
                    <div className="miniTableMultiBet-countDown">
                        <CountdownLittleCircle isCanBet={isCanBet}
                            setIsCanBet={setIsCanBet}
                            countdownData={{
                                tableTimeoutSecond: tableTimeoutSecond,
                                lastQueryDate: lastQueryDate,
                                remainingSecond: remainingSecond,
                            }}></CountdownLittleCircle>
                    </div>
                </div>
                <div className='miniTableMultiBet-roadMap'>
                    <GameRoadMapMultiBet shoeResult={shoeResult}></GameRoadMapMultiBet>
                </div>
                <div className={`miniTableMultiBet-betArea ${isCanBet ? "can-bet" : " stop-bet"}`}>
                    <div className="miniTableMultiBet-betArea-playerPair  miniTableMultiBet-betArea-bet" onClick={()=>{addChip("PlayerPair")}}>
                        <div className='miniTableMultiBet-betArea-bet-text'>閒對</div>
                        <div className='miniTableMultiBet-betArea-bet-value'>{orderData.PlayerPair.totalValue}</div>
                    </div>
                    <div className="miniTableMultiBet-betArea-player miniTableMultiBet-betArea-bet" onClick={()=>{addChip("Player")}}>
                        <div className='miniTableMultiBet-betArea-bet-text'>閒</div>
                        <div className='miniTableMultiBet-betArea-bet-value'>{orderData.Player.totalValue}</div>
                    </div>
                    <div className="miniTableMultiBet-betArea-tie miniTableMultiBet-betArea-bet" onClick={()=>{addChip("Tie")}}>
                        <div className='miniTableMultiBet-betArea-bet-text'>和</div>
                        <div className='miniTableMultiBet-betArea-bet-value'>{orderData.Tie.totalValue}</div>
                    </div>
                    <div className="miniTableMultiBet-betArea-banker miniTableMultiBet-betArea-bet" onClick={()=>{addChip("Banker")}}>
                        <div className='miniTableMultiBet-betArea-bet-text'>庄</div>
                        <div className='miniTableMultiBet-betArea-bet-value'>{orderData.Banker.totalValue}</div>
                    </div>
                    <div className="miniTableMultiBet-betArea-bankerPair miniTableMultiBet-betArea-bet" onClick={()=>{addChip("BankerPair")}}>
                        <div className='miniTableMultiBet-betArea-bet-text'>庄對</div>
                        <div className='miniTableMultiBet-betArea-bet-value'>{orderData.BankerPair.totalValue}</div>
                    </div>
                    <div className="miniTableMultiBet-betArea-checkArea">
                        <div className="miniTableMultiBet-betArea-checkArea-cancel">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                <path d="M15.7765 2.77646C16.4112 2.1417 16.4112 1.11084 15.7765 0.476074C15.1417 -0.158691 14.1108 -0.158691 13.4761 0.476074L8.12881 5.82842L2.77646 0.481152C2.1417 -0.153613 1.11084 -0.153613 0.476074 0.481152C-0.158691 1.11592 -0.158691 2.14678 0.476074 2.78154L5.82842 8.12881L0.481152 13.4812C-0.153613 14.1159 -0.153613 15.1468 0.481152 15.7815C1.11592 16.4163 2.14678 16.4163 2.78154 15.7815L8.12881 10.4292L13.4812 15.7765C14.1159 16.4112 15.1468 16.4112 15.7815 15.7765C16.4163 15.1417 16.4163 14.1108 15.7815 13.4761L10.4292 8.12881L15.7765 2.77646Z" />
                            </svg>
                        </div>
                        <div className="miniTableMultiBet-betArea-checkArea-confirm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
                                <path d="M22.8976 1.35229C23.5323 1.98706 23.5323 3.01792 22.8976 3.65269L9.89756 16.6527C9.26279 17.2875 8.23193 17.2875 7.59717 16.6527L1.09717 10.1527C0.462402 9.51792 0.462402 8.48706 1.09717 7.85229C1.73193 7.21753 2.76279 7.21753 3.39756 7.85229L8.7499 13.1996L20.6022 1.35229C21.237 0.717529 22.2679 0.717529 22.9026 1.35229H22.8976Z" />
                            </svg>
                        </div>
                    </div>

                    <div className="miniTableMultiBet-betArea-mask">
                        <div className="miniTableMultiBet-betArea-checkArea-mask-tip">
                            <span>{tipText}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};




export default MiniTableMultiBet;