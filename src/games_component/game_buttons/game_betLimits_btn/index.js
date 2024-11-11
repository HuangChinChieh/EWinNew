import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import './index.scss';
import { AlertContext } from "component/alert";
import { BaccaratSubscribeContext } from "provider/GameBaccaratProvider";
import Tooltip from "component/tooltip";
import { CashUnitContext, BetLimitContext } from "provider/GameLobbyProvider";
import { constant } from 'lodash';

const BetLimitInfo = (props) => {
    const [isShow, setIsShow] = useState(false);
    const betLimitData = props.betLimitData;
    const moveDirection = props.moveDirection; //初始化動畫方向，0=上到下，1=左到右
    const needShowInfo = props.needShowInfo
    const { numberTranslate } = useContext(CashUnitContext);
    const isHoverRef = useRef(false);


    const show = () => {
        isHoverRef.current = true;
        setTimeout(() => {
            if (isHoverRef.current === false) {
                setIsShow(true);
            }
        }, 50);
    };
    const hide = () => {
        isHoverRef.current = false;
        setTimeout(() => {
            if (isHoverRef.current === false) {
                setIsShow(false);
            }
        }, 50);
    };

    useEffect(() => {

        // if(needShowInfo === true){
        //     if (isHoverRef.current === false) {
        //         setIsShow(true);
        //     }


        // }else{
        //     setTimeout(() => {
        //         if (isHoverRef.current === false) {
        //             setIsShow(false);
        //         } 
        //     }, 50);            
        // }



        setTimeout(() => {
            if (isHoverRef.current === false) {
                setIsShow(needShowInfo);
            }
        }, 50);
    }, [needShowInfo])


    return (
        isShow ?
            <div className={`betLimitInfo-box ${moveDirection === 0 ? "left-to-right" : "top-to-bottom"}`} onMouseEnter={show} onMouseLeave={hide}>
                <div className='betLimitInfo-header'>限紅詳情</div>
                <div className='betLimitInfo-content'>
                    <div className='betLimitInfo-option'>
                        <div className='betLimitInfo-option-title'>庄</div>
                        <div className='betLimitInfo-option-content'>
                            <div>{numberTranslate(betLimitData.Banker.Min)}</div>
                            <div>-</div>
                            <div>{numberTranslate(betLimitData.Banker.Max)}</div>
                        </div>
                    </div>
                    <div className='betLimitInfo-option'>
                        <div className='betLimitInfo-option-title'>閒</div>
                        <div className='betLimitInfo-option-content'>
                            <div>{numberTranslate(betLimitData.Player.Min)}</div>
                            <div>-</div>
                            <div>{numberTranslate(betLimitData.Player.Max)}</div>
                        </div>
                    </div>
                    <div className='betLimitInfo-option'>
                        <div className='betLimitInfo-option-title'>對子</div>
                        <div className='betLimitInfo-option-content'>
                            <div>{numberTranslate(betLimitData.Pair.Min)}</div>
                            <div>-</div>
                            <div>{numberTranslate(betLimitData.Pair.Max)}</div>
                        </div>
                    </div>
                    <div className='betLimitInfo-option'>
                        <div className='betLimitInfo-option-title'>和</div>
                        <div className='betLimitInfo-option-content'>
                            <div>{numberTranslate(betLimitData.Tie.Min)}</div>
                            <div>-</div>
                            <div>{numberTranslate(betLimitData.Tie.Max)}</div>
                        </div>
                    </div></div>
            </div>
            :
            <></>
    );
};

const GameBetLimitOption = (props) => {
    const { index, betLimit, selectBetLimit, isSelected } = props;
    const [isNeedShowInfo, setIsNeedShowInfo] = useState(false);
    const { numberTranslate } = useContext(CashUnitContext);
    const { getBetLimitMaxMin } = useContext(BetLimitContext);
    const minMaxObj = getBetLimitMaxMin(betLimit);

    const showInfo = () => {
        setIsNeedShowInfo(true)
    };
    const hideInfo = () => { setIsNeedShowInfo(false) };

    return (
        <>
            <BetLimitInfo betLimitData={betLimit} moveDirection={0} needShowInfo={isNeedShowInfo} ></BetLimitInfo>
            <div className={isSelected ? 'gameBetLimit-box-option  selected' : 'gameBetLimit-box-option'} onClick={() => { selectBetLimit(betLimit) }} onMouseEnter={showInfo} onMouseLeave={hideInfo}>
                <div className="gameBetLimit-box-icon"></div>
                <div className='gameBetLimit-box-no'>{index + 1}.</div>
                <div className='gameBetLimit-box-title'>
                    <div>{numberTranslate(minMaxObj.MinValue)}</div>
                    <div>-</div>
                    <div>{numberTranslate(minMaxObj.MaxValue)}</div>
                </div>
            </div>
        </>
    );
};

const GameBetLimitsButton = (props) => {
    const { useBetLimit, tableNumber, currencyType, gameSetID, baccaratType, setBetLimitBySel } = props;

    const { alertMsg } = useContext(AlertContext);
    const { getBetLimitMaxMin } = useContext(BetLimitContext);
    const [listActive, setListActive] = useState(false);
    const [tipActive, setTipActive] = useState(false);
    const [betLimitList, setBetLimitList] = useState([]);
    const minMaxObj = getBetLimitMaxMin(useBetLimit.BetLimitData);
    const listPopRef = useRef(null);
    const tipPopRef = useRef(null);
    const { GetGameClient } = useContext(BaccaratSubscribeContext);
    const gameClient = GetGameClient();



    // const showGameSetList = useCallback(() => {
    //     if (gameSetList.length > 0) {
    //         setActive(true);
    //     } else {
    //         alertMsg("提醒", "目前暫無工單", () => {

    //         });
    //     }

    //     setHasNewGameSet(false);
    // }, [alertMsg, gameSetList, setHasNewGameSet]);

    // const hideGameSetList = () => {
    //     popRef.current.classList.add('hide');
    //     setTimeout(() => {
    //         setActive(false);
    //     }, 400);
    // }



    const showBetLimitList = () => {

        if (baccaratType === 2 || baccaratType === 3) {
            gameClient.UserAccountGetBetLimitListByRoadMap(tableNumber, currencyType, gameSetID, (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        //const selBetLimit = JSON.parse(localStorage.getItem("SelBetLimit"));
                        if (o.BetLimitList && o.BetLimitList.length > 0) {
                            setListActive(true);
                            setBetLimitList(o.BetLimitList);
                        } else {
                            alertMsg("提醒", "無可用限紅，請聯繫客服");
                        }
                    } else {
                        //console.log("GetBetLimitError");
                    }
                } else {
                    //console.log("GetBetLimitError");
                }
            });
        }
    };

    const selectBetLimit = useCallback((betLimit) => {
        alertMsg("提醒", "是否提換新的限紅", () => {
            setBetLimitBySel(tableNumber, gameSetID, betLimit);
        });
    }, [alertMsg, setBetLimitBySel, tableNumber, gameSetID]);


    useEffect(() => {


    }, []);


    return (
        <div className='gameBetLimit-box'>
            {/* <div className='gameBetLimit-box-content' onClick={showGameSetList}>             */}

            <div className='gameBetLimit-box-content' >
                <div className='gameBetLimit-box-main' onClick={() => { showBetLimitList() }}>
                    <div className="gameBetLimit-box-icon"></div>
                    <div className={(baccaratType === 2 || baccaratType === 3) ? "gameBetLimit-box-title show-list" : "gameBetLimit-box-title"}>{minMaxObj.MinValue + " - " + minMaxObj.MaxValue}</div>
                    <Tooltip text={'目前限紅'} />
                </div>
                <div className='gameBetLimit-box-icon-arrow'>
                    <Tooltip text={'限紅詳情'} />
                </div>
            </div>

            {listActive &&
                <div className='gameBetLimit-box-options' ref={listPopRef}>

                    <div className='gameBetLimit-box-options-header'>
                        可選限紅列表
                    </div>

                    {betLimitList.length > 0 &&
                        betLimitList.filter(x => x.CurrencyType === props.currencyType).map(
                            (item, index) => (<GameBetLimitOption key={item.BetLimitID}
                                isSelected={item.BetLimitID === useBetLimit.BetLimitID}
                                index={index}
                                betLimit={item}
                                selectBetLimit={selectBetLimit}></GameBetLimitOption>))}



                    <div className='gameBetLimit-box-options-footer'><div className='gameBetLimit-box-options-close' onClick={() => {
                        listPopRef.current.classList.add('hide');
                        setTimeout(() => {
                            setListActive(false);
                        }, 400)

                    }}><i></i>關閉</div></div>
                </div>
            }

            {
                (listActive === false && tipActive === true) && 
                <BetLimitInfo betLimitData={useBetLimit.BetLimitData} moveDirection={1} needShowInfo={tipActive} ></BetLimitInfo>
            }
        </div>
    );
};

export default GameBetLimitsButton;