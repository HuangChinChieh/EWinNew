import React, { createContext, useContext, useState, useEffect } from 'react';
import { EWinGameBaccaratClient } from 'signalr/bk/EWinGameBaccaratClient';
import { useLobbyContext } from 'provider/GameLobbyProvider';
const GameBaccaratContext = createContext();
export const useBaccaratContext = () => useContext(GameBaccaratContext);

const GameBaccaratProvider = ({ children }) => {
    // const {
    //     CT,
    //     EWinUrl,
    //     Echo,
    //     GUID,
    //     newInstance
    // } = useLobbyContext();

    // const [isBaccaratLoading, setIsBaccaratLoading] = useState(true);
    // const [newBaccaratInstance, setNewBaccaratInstance] = useState([]);
    // const [userBetlimitList, setUserBetlimitList] = useState([]);


    // useEffect(() => {
    //     const baccaratInstance = EWinGameBaccaratClient.getInstance(CT, EWinUrl);

    //     if (baccaratInstance !== null) {
    //         const handleConnected = () => {
    //             // 監聽連線狀態
    //             baccaratInstance.HeartBeat(Echo);
    //             setIsBaccaratLoading(false);
    //             console.log('EWinGame.Baccarat 連結成功');

    //             baccaratInstance.UserAccountGetBetLimitList(CT, GUID, localStorage.getItem('CurrencyType'), (s, o) => {
    //                 if (s) {
    //                     if (o.ResultCode == 0) {
    //                         //資料處理
    //                         console.log('取得會員個人限紅資料', o);
    //                         setUserBetlimitList(o);

    //                     } else {
    //                         //系統錯誤處理
    //                         console.log('UserAccountGetBetLimitList: 系統錯誤處理');


    //                     }
    //                 } else {
    //                     //傳輸等例外問題處理
    //                     console.log('UserAccountGetBetLimitList: 傳輸等例外問題處理');

    //                 }
    //             });

    //         }
    //         const handleDisconnect = () => {
    //             console.log('EWinHub 連結失效');
    //             setIsBaccaratLoading(true);
    //             window.location.reload();
    //         };

    //         const handleReconnecting = () => {
    //             console.log('重新連結 EWinHub');
    //             setIsBaccaratLoading(true);
    //         };

    //         const handleReconnected = () => {
    //             console.log('已重新連結 EWinHub');
    //             setIsBaccaratLoading(true);
    //         };

    //         baccaratInstance.handleConnected(handleConnected);
    //         baccaratInstance.handleDisconnect(handleDisconnect);
    //         baccaratInstance.handleReconnecting(handleReconnecting);
    //         baccaratInstance.handleReconnected(handleReconnected);

    //         // 初始化連接
    //         baccaratInstance.initializeConnection();
    //         setNewBaccaratInstance(baccaratInstance);
    //     }

    // }, [])

    return (
        <GameBaccaratContext.Provider value={{
            // isBaccaratLoading,
            // newBaccaratInstance,
            // userBetlimitList
        }}>
            {children}
        </GameBaccaratContext.Provider>
    )
}

export default GameBaccaratProvider;