import React, { useState, useContext } from 'react';

// 创建一个 Context
export const TipContext = React.createContext();

const TipProvider = ({children}) => {
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
        {children}
        </TipContext.Provider>
    );
};

export default TipProvider;