import React, { createContext, useContext, useState, useEffect } from 'react';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';

// Create two different contexts
const WalletContext = createContext();
const RealNameContext = createContext();
const BetLimitCurrencyContext = createContext();
const FavosContext = createContext();

// 建立一個 Context
const GameLobbyContext = createContext();

// 提供一個 Custom Hook 讓其他元件可以存取 Context 值
export const useLobbyContext = () => useContext(GameLobbyContext);

// Create a Context Provider to provide shared values
const GameLobbyProvider = ({ children }) => {
  const lobbyClient = EWinGameLobbyClient.getInstance();
  const [wallet, setWallet] = useState(null);
  const [favos,setFavos]=useState(null);
  const [realName, setRealName] = useState(null);
  const [betLimitCurrencyType, setBetLimitCurrencyType] = useState(null);
  // const { t } = useLanguage();



  // Game Lobby related useEffect
  useEffect(() => {
    updateRealName();
    updateWallet();
    updateBetLimitCurrencyType();
    updateFavos();
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

  const updateUserAccountProperty = (cb) => {
    lobbyClient.SetUserAccountProperty('EWinGame.Favor',(s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          cb(o);
        }
      }
    });
  };

  const updateFavos = () =>{
    updateUserAccountProperty((o) =>{
      let setObj = {
        RealName: JSON.parse(o.PropertyValue)     
      };
      console.log(setObj)
      setFavos(setObj);
    });
  };

  const updateRealName = () =>{
    updateInfo((userInfo) =>{
      let setObj = {
        RealName: userInfo.RealName        
      };
      setRealName(setObj);
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
  const updateBetLimitCurrencyType = () =>{
    updateInfo((userInfo) =>{
      let setObj = {
        BetLimitCurrencyType: userInfo.BetLimitCurrencyType      
      };
      setBetLimitCurrencyType(setObj);
    });
  };

 

  return (
    <FavosContext.Provider value={{ favos}}>
      <WalletContext.Provider value={{ wallet}}>
        <RealNameContext.Provider value={{ realName }}>
            <BetLimitCurrencyContext.Provider value={betLimitCurrencyType}>
              {children}
            </BetLimitCurrencyContext.Provider>
        </RealNameContext.Provider>
      </WalletContext.Provider>
    </FavosContext.Provider >
  );
};

export default GameLobbyProvider;