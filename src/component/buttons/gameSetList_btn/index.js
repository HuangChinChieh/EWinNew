import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import './index.scss';
import { GameSetListContext } from 'provider/GameLobbyProvider';
import { AlertContext } from "component/alert";
import { useHistory } from "react-router-dom";


const GameSetListButton = () => {
    const { alertMsg } = useContext(AlertContext);
    const { gameSetList, updateGameSetList, hasNewGameSet, setHasNewGameSet } = useContext(GameSetListContext);
    const [active, setActive] = useState(false);
    const popRef = useRef(null);
    const history = useHistory();

    const entryTable = (gameSetID, gameSetNumber, tableNumber) => {
        history.replace("/games/" + tableNumber + "?gameSetID=" + gameSetID + "&gameSetNumber=" + gameSetNumber);
    };

    const showGameSetList = useCallback(() => {
        if (gameSetList.length > 0) {
            setActive(true);
        } else {
            alertMsg("提醒", "目前暫無工單", () => {

            });
        }

        setHasNewGameSet(false);
    }, [alertMsg, gameSetList, setHasNewGameSet]);

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
                alertMsg("提醒", "您有新的工單，是否點擊確認新工單<p>(可在設定關閉提醒)</p>", () => {
                    showGameSetList();
                });
            }
        }

    }, [gameSetList, hasNewGameSet, alertMsg, showGameSetList]);

    useEffect(() => {
        updateGameSetList([
            {
                GameSetID: 1,
                GameSetNumber: "工單1",
                RoadMapNumber: "test01"
            }, {
                GameSetID: 2,
                GameSetNumber: "工單2",
                RoadMapNumber: "test02"
            }
        ]);
    }, [])

    // useEffect(() => {
    //     // 在 component mount 時加入 click 事件監聽器
    //     document.addEventListener('click', handleDocumentClick);
    //     // 在 component unmount 時移除 click 事件監聽器
    //     return () => {
    //         document.removeEventListener('click', handleDocumentClick);
    //     };

    // }, []);


    return (
        <div className='gameSetList-box'>
            <div className='gameSetList-box-content' onClick={showGameSetList}>
                <div className='gameSetList-box-icon'></div>
                <div className='gameSetList-box-title'>無</div>
                <div className='gameSetList-box-icon-arrow'></div>
            </div>
            {active && <>
                <div className='gameSetList-box-options' ref={popRef}>
                    <div className='gameSetList-box-options-header'>
                        工單列表
                    </div>
                    {gameSetList.length > 0 && gameSetList.map((item, index) =>
                        <div className='gameSetList-box-option' onClick={() => { entryTable(item.GameSetID, item.GameSetNumber, item.RoadMapNumber) }}>
                            <div className='gameSetList-box-no'>{index}.</div>
                            <div className='gameSetList-box-title'>{item.GameSetNumber}</div>
                        </div>)}
                    <div className='gameSetList-box-options-footer'><div className='gameSetList-box-options-close' onClick={hideGameSetList}><i></i>關閉</div></div>
                </div>
            </>}
        </div>
    );
}

export default GameSetListButton;