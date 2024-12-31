import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import './index.scss';
import { GameSetListContext } from 'provider/GameLobbyProvider';
import { AlertContext } from "provider/alertProvider";
import { useHistory } from "react-router-dom";
//import Tooltip from "component/tooltip";
import { ToolTipContext } from "provider/tooltipProvider";


const GameSetListButton = () => {
    const { alertMsg } = useContext(AlertContext);
    const { gameSetList, updateGameSetList, hasNewGameSet, setHasNewGameSet } = useContext(GameSetListContext);
    const [active, setActive] = useState(false);
    const popRef = useRef(null);  
    const history = useHistory();
    const { showTooltip, hideTooltip } = useContext(ToolTipContext);

    const entryTable = (gameSetID, gameSetNumber, tableNumber) => {
        history.replace("/games/" + tableNumber + "?gameSetID=" + gameSetID + "&gameSetNumber=" + gameSetNumber);
    };

    const showGameSetList = useCallback((event) => {
        if(!active){    
            if (gameSetList.length > 0) {
                setActive(true);
             
            } else {
                alertMsg("提醒", "目前暫無工單", () => {
    
                });
            }  
            
            setHasNewGameSet(false);
        } 
    }, [alertMsg, gameSetList, setHasNewGameSet, active]);

    const hideGameSetList = () => {
        popRef.current.classList.add('hide');
        setTimeout(() => {
            setActive(false);
        }, 400);
    }

    // const handleDocumentClick = () => {
    //    // hideGameSetList();
    // };

    // 判斷是否繼續播放
    useEffect(() => {
        let canAlertNewGameSet = true;
        const canAlertNewGameSetStr = window.sessionStorage.getItem('canAlertNewGameSet');

        if (canAlertNewGameSetStr) {
            canAlertNewGameSet = canAlertNewGameSetStr === true;
        }


        if (hasNewGameSet && gameSetList.length > 0) {
            if (canAlertNewGameSet) {
                alertMsg("提醒", "您有新的工單，是否點擊確認新工單\n(可在設定關閉提醒)", () => {
                    showGameSetList();
                });
            }
        }

    }, [gameSetList, hasNewGameSet, alertMsg, showGameSetList]);

    useEffect(() => {
        const handleDocumentClick_GameSetListButton = (e) => {          
            if (popRef.current && !popRef.current.contains(e.target)) {
                
                // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
                popRef.current.classList.add('hide');
                setTimeout(() => {
                    setActive(false);
                }, 400);
            }
        };

        if (active) {
            //避免因為同一個事件流產生問題;
            setTimeout(() => {
                document.addEventListener("click", handleDocumentClick_GameSetListButton)    
            }, 100);            
        }

        return (() => { document.removeEventListener("click", handleDocumentClick_GameSetListButton); });
    }, [active])


    return (
        <div className='gameSetList-box'>
            <div className='gameSetList-box-content'
                onClick={(event) => {                 
                    showGameSetList(event);                 
                }}
                onMouseEnter={(event) => {
                    showTooltip(event.currentTarget, "工單列表")
                }}
                onMouseLeave={() => { hideTooltip() }}>
                <div className={hasNewGameSet ? "gameSetList-box-icon new" : "gameSetList-box-icon"}></div>
                <div className='gameSetList-box-title'>無</div>
                <div className='gameSetList-box-icon-arrow'></div>
            </div>
            {active && <>
                <div className='gameSetList-box-options' ref={popRef}>                  
                    <div className='gameSetList-box-options-header'>
                        工單列表
                    </div>
                    {gameSetList.length > 0 && gameSetList.map((item, index) =>
                        <div className='gameSetList-box-option' key={"gameSetBtn_" + item.GameSetID} onClick={() => { entryTable(item.GameSetID, item.GameSetNumber, item.RoadMapNumber) }}>
                            <div className='gameSetList-box-no'>{index + 1}.</div>
                            <div className='gameSetList-box-title'>{item.GameSetNumber}</div>
                        </div>)}
                    <div className='gameSetList-box-options-footer'><div className='gameSetList-box-options-close' onClick={()=>{hideGameSetList();}}><i></i>關閉</div></div>
                </div>
            </>}
        </div>
    );
};




export default GameSetListButton;