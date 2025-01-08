
import React, { useState } from 'react';
import './index.scss';

const GameOpenGameSetAction = (props) => {
    const [showCloseBtn, setshowCloseBtn] = useState(false); //true 關閉供單按鈕
    const statusDisabled = props.statusDisabled //false = 啟用按鈕, true = 停用按鈕

    const handleButtonClick = () => {
        // 你可以傳遞你想要設定的值
        if(!statusDisabled){
            if (showCloseBtn) {
                props.updateMiddleBtnType("Chip");
            } else {
                props.updateMiddleBtnType("GameSet");
            }
    
            setshowCloseBtn(!showCloseBtn);
        }
    };

    return (
        <div className='game-open-gameSetAction-box' onClick={handleButtonClick} style={statusDisabled?{backgroundColor:"#DEDEDE"}:{}}>
            <span className='icon-box'>{showCloseBtn ? "關閉-桌檯功能列表" : "開啟-桌檯功能列表"}</span>
        </div>
    )
}

export default GameOpenGameSetAction;