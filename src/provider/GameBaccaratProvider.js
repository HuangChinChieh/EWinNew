import React, { createContext, useContext, useState, useEffect } from 'react';
import { EWinGameBaccaratClient } from 'signalr/bk/EWinGameBaccaratClient';
import { useLobbyContext } from 'provider/GameLobbyProvider';


const GameBaccaratContext = createContext();

export const useBaccaratContext = () => useContext(GameBaccaratContext);

const GameBaccaratProvider = ({ children }) => {

    const {
        CT,
        EWinUrl,
        Echo,
        newInstance
    } = useLobbyContext();

    const [isBaccaratLoading, setIsBaccaratLoading] = useState(true);
    const [newBaccaratInstance, setNewBaccaratInstance] = useState([]);

    useEffect(() => {
        const baccaratInstance = EWinGameBaccaratClient.getInstance(CT, EWinUrl);

        if (baccaratInstance) {
            const handleConnected = () => {
                // 監聽連線狀態
                baccaratInstance.HeartBeat(Echo);
                setIsBaccaratLoading(false);

            }
            const handleDisconnect = () => {
                console.log('EWinHub 連結失效');
                setIsBaccaratLoading(true);
                window.location.reload();
            };

            const handleReconnecting = () => {
                console.log('重新連結 EWinHub');
                setIsBaccaratLoading(true);
            };

            const handleReconnected = () => {
                console.log('已重新連結 EWinHub');
                setIsBaccaratLoading(true);
            };

            baccaratInstance.handleConnected(handleConnected);
            baccaratInstance.handleDisconnect(handleDisconnect);
            baccaratInstance.handleReconnecting(handleReconnecting);
            baccaratInstance.handleReconnected(handleReconnected);

            // 初始化連接
            baccaratInstance.initializeConnection();
            setNewBaccaratInstance(baccaratInstance);
        }

    }, [newInstance])
    return (
        <GameBaccaratContext.Provider value={{
            isBaccaratLoading,
            newBaccaratInstance
        }}>
            {children}
        </GameBaccaratContext.Provider>
    )
}

export default GameBaccaratProvider;