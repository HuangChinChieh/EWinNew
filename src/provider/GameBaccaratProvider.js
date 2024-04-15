import React, { createContext, useContext } from 'react';
const GameBaccaratContext = createContext();
export const useBaccaratContext = () => useContext(GameBaccaratContext);

const GameBaccaratProvider = ({ children }) => {
    return (
        <GameBaccaratContext.Provider value={{

        }}>
            {children}
        </GameBaccaratContext.Provider>
    )
}

export default GameBaccaratProvider;