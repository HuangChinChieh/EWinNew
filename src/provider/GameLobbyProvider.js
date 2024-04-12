import React, { createContext, useContext } from 'react';
import { useLanguage } from 'hooks';

// 建立一個 Context
const GameLobbyContext = createContext();

// 提供一個 Custom Hook 讓其他元件可以存取 Context 值
export const useLobbyContext = () => useContext(GameLobbyContext);

// 最上層的元件，設置各初始值
const GameLobbyProvider = ({ children }) => {
    const { t } = useLanguage();

    return (
        <GameLobbyContext.Provider value={{
            t
        }}>
            {children}
        </GameLobbyContext.Provider>
    );
};

export default GameLobbyProvider;
