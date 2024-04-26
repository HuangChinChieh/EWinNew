import React, { createContext, useContext, useState, useEffect } from "react";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";

// Create two different contexts
const WalletContext = createContext();
const RealNameContext = createContext();
const BetLimitContext = createContext();
const FavorsContext = createContext();


export {
  WalletContext,
  RealNameContext,
  BetLimitContext,
  FavorsContext,
};

// Create a Context Provider to provide shared values
const GameLobbyProvider = (props) => {
  const lobbyClient = EWinGameLobbyClient.getInstance();
  const CurrencyType = props.CurrencyType;
  const [wallet, setWallet] = useState({
    CurrencyType: "",
    CurrencyName: "",
    Balance: 0,
  });
  const [favors, setFavors] = useState([]);
  const [realName, setRealName] = useState("");
  const [betLimit, setBetLimit] = useState(null);

  // Game Lobby related useEffect
  useEffect(() => {
    const PromiseArray = [];
    
    //UserInfo
    PromiseArray.push(new Promise(
      (resolve) =>{
        lobbyClient.GetUserInfo((s, o) => {          
          if (s) {
            if (o.ResultCode === 0) {
              resolve(o);
            }
          }
        });
      }
    ));

    //限紅部分不做設定，會隨著進入桌台而影響，這邊只做管理動作，不去做request
    // PromiseArray.push(new Promise(
    //   (resolve) =>{
    //     lobbyClient.GetUserInfo((s, o) => {          
    //       if (s) {
    //         if (o.ResultCode === 0) {
    //           resolve(o);
    //         }
    //       }
    //     });
    //   }
    // ));


    PromiseArray.push(new Promise(
      (resolve) =>{
        lobbyClient.GetUserAccountProperty("EWinGame.Favor", (s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              resolve(o);
            }
          }
        });
      }
    ));

    Promise.all(PromiseArray).then(([userInfo, favorsProp])=> {
      let wallet = userInfo.Wallet.find((x) => x.CurrencyType === CurrencyType);
      let favorsObj = JSON.parse(favorsProp.PropertyValue)
      
      if (wallet) {
        setWallet({
          CurrencyType: wallet.CurrencyType,
          CurrencyName: wallet.CurrencyName,
          Balance: wallet.Balance,
        });
      }

      setRealName(userInfo.RealName);      
      setFavors(favorsObj);
    });   
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

  const updateFavors = () => {
    lobbyClient.GetUserAccountProperty("EWinGame.Favor", (s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          let setObj = [];

          setObj = JSON.parse(o.PropertyValue);

          console.log(setObj);
          setFavors(setObj);
        }
      }
    });
  };

  const updateRealName = () => {
    updateInfo((userInfo) => {
      setRealName(userInfo.RealName);
    });
  };

  const updateWallet = () => {
    updateInfo((userInfo) => {
      let wallet = userInfo.Wallet.find((x) => x.CurrencyType === CurrencyType);
      let setObj = {
        CurrencyType: wallet.CurrencyType,
        CurrencyName: wallet.CurrencyName,
        Balance: wallet.Balance,
      };
      setWallet(setObj);
    });
  };
  const updateBetLimit = (betLimit) => {
    setBetLimit(betLimit);
  };

  return (
    <FavorsContext.Provider value={{ favors, updateFavors }}>
      <WalletContext.Provider value={{ wallet, updateWallet }}>
        <RealNameContext.Provider value={{ realName, updateRealName }}>
          <BetLimitContext.Provider
            value={{ betLimit, updateBetLimit }}
          >
            {props.children}
          </BetLimitContext.Provider>
        </RealNameContext.Provider>
      </WalletContext.Provider>
    </FavorsContext.Provider>
  );
};

export default GameLobbyProvider;
