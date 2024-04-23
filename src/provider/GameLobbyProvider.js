import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from 'hooks';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';

// Create two different contexts
const WalletContext = createContext();
const RealNameContext = createContext();
const LanguageContext = createContext();
const BetLimitCurrencyContext = createContext();

// 建立一個 Context
const GameLobbyContext = createContext();

// 提供一個 Custom Hook 讓其他元件可以存取 Context 值
export const useLobbyContext = () => useContext(GameLobbyContext);

// Create a Context Provider to provide shared values
const GameLobbyProvider = ({ children }) => {
  const lobbyClient = EWinGameLobbyClient.getInstance();
  const [wallet, setWallet] = useState(null);
  const [realName, setRealName] = useState('');
  const [betLimitCurrencyType, setBetLimitCurrencyType] = useState('');

  // Game Lobby related useEffect
  useEffect(() => {
    if (lobbyClient !== null) {
      const handleConnected = () => {
        // Get user info
        lobbyClient.GetUserInfo((s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              console.log('UserInfo', o);
              setWallet(o.Wallet);
              setRealName(o.RealName);
              setBetLimitCurrencyType(o.BetLimitCurrencyType);
              localStorage.setItem('CurrencyType', o.BetLimitCurrencyType ? o.BetLimitCurrencyType : 'PHP');
            } else {
              console.log('GetUserInfo: 系統錯誤處理');
            }
          } else {
            console.log('GetUserInfo: 傳輸等例外問題處理');
          }
        });
      };
    }
  }, []);

  const updateInfo = (cb) => {
    lobbyClient.GetUserInfo((s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          cb(o);
        }
      }
    });
  };

  const updateWallet = () =>{
    updateInfo((userInfo) =>{
      let wallet = userInfo.Wallet.find(x => x.CurrencyType === "CNY");
      let setObj = {
        CurrencyType: wallet.CurrencyType,
        CurrencyName: wallet.CurrencyName,
        Balance: wallet.Balance        
      };
      setWallet(setObj);
    });
  };

 

  return (
    <WalletContext.Provider value={{ wallet, updateWallet }}>
      <RealNameContext.Provider value={{ realName, setRealName }}>
        <LanguageContext.Provider value={t}>
          <BetLimitCurrencyContext.Provider value={betLimitCurrencyType}>
            {children}
          </BetLimitCurrencyContext.Provider>
        </LanguageContext.Provider>
      </RealNameContext.Provider>
    </WalletContext.Provider>
  );
};

export default GameLobbyProvider;