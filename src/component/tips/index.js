//import { useEffect, useState } from 'react';
//import './index.scss';
//import { useLobbyContext } from 'provider/GameLobbyProvider';

//const Tips = (props) => {
//    const [showTips, setShowTips] = useState('hiddenTips');
//    const {
//        showMessage
//    } = useLobbyContext();



//    useEffect(() => {
//        if (showMessage) {
//            setShowTips('showTips');

//            const timerId = setTimeout(() => {
//                setShowTips('hiddenTips');
//            }, 2000);

//            return () => clearTimeout(timerId);
//        }
//    }, [showMessage]);

//    return (
//        <div className={`tips-box ${showTips}`}>
//            <p>
//                {showMessage}
//            </p>
//        </div>
//    )
//}

//export default Tips;


import React, { useState, useContext } from 'react';

// 创建一个 Context
export const TipContext = React.createContext();

const TipProvider = () => {
    const [showTips, setShowTips] = useState(false);
    const [tipText, setTipText] = useState('');

    const showTip = (text) => {
        setTipText(text);
        setShowTips(true);
        setTimeout(() => {
            setShowTips(false);
        }, 2000);
    };

    return (
        <TipContext.Provider value={{ showTip }}>
            <div className={`tips-box ${showTips ? 'showTips' : 'hiddenTips'}`}>
            <p>
                {tipText}
            </p>
        </div>
        </TipContext.Provider>
    );
};

export default TipProvider;