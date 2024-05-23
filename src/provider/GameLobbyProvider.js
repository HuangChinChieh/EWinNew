/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useCallback, useState, useEffect } from "react";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";


// Create two different contexts
const WalletContext = createContext();
const RealNameContext = createContext();
const BetLimitContext = createContext();
const FavorsContext = createContext();
const MusicIsPlayingContext = createContext();
const LobbyPersonalContext=createContext();

export {
  WalletContext,
  RealNameContext,
  BetLimitContext,
  FavorsContext,
  MusicIsPlayingContext,
  LobbyPersonalContext
};

// Create a Context Provider to provide shared values
const GameLobbyProvider = (props) => {
  const lobbyClient = EWinGameLobbyClient.getInstance();
  const CurrencyType = props.CurrencyType;
  const CT = props.CT;
  const [wallet, setWallet] = useState({
    CurrencyType: "",
    CurrencyName: "",
    Balance: 0,
  });
  const [favors, setFavors] = useState([]);
  const [realName, setRealName] = useState("");
  const [betLimitCurrencyType, setBetLimitCurrencyType] = useState("");
  const [musicIsPlaying,setMusicIsPlaying]=useState(false);
  const [lobbyPersonal,setLobbyPersonal]=useState(false);

  

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

  const updateInfo = useCallback((cb) => {
    lobbyClient.GetUserInfo((s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          cb(o);
        }
      }
    });
  }, [lobbyClient]);

  const updateFavors = useCallback(() => {
    lobbyClient.GetUserAccountProperty("EWinGame.Favor", (s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          let setObj = [];

          setObj = JSON.parse(o.PropertyValue);
          setFavors(setObj);
        }
      }
    });
  }, [lobbyClient]);

  const updateRealName = useCallback(() => {
    updateInfo((userInfo) => {
      setRealName(userInfo.RealName);
    });
  }, [updateInfo]);

  const updateWallet = useCallback(() => {
    updateInfo((userInfo) => {
      let wallet = userInfo.Wallet.find((x) => x.CurrencyType === CurrencyType);
      let setObj = {
        CurrencyType: wallet.CurrencyType,
        CurrencyName: wallet.CurrencyName,
        Balance: wallet.Balance,
      };
      setWallet(setObj);
    });
  }, [CT, CurrencyType, updateInfo]);

  const updateBetLimit = useCallback((betLimit) => {
    setBetLimit(betLimit);
  }, [CT]);

  const muteChange = useCallback(() => {
    setMusicIsPlaying(!musicIsPlaying)
  }, [CT, musicIsPlaying]);
  
  return (
    <MusicIsPlayingContext.Provider value={{ musicIsPlaying, muteChange }}>
      <LobbyPersonalContext.Provider value={{ lobbyPersonal,setLobbyPersonal }}></LobbyPersonalContext.Provider>
      <FavorsContext.Provider value={{ favors, updateFavors }}>
        <WalletContext.Provider value={{ wallet, updateWallet }}>
          <RealNameContext.Provider value={{ realName, updateRealName }}>
            <BetLimitCurrencyContext.Provider
              value={{ betLimitCurrencyType, updateBetLimitCurrencyType }}
            >
              {props.children}
            </BetLimitCurrencyContext.Provider>
          </RealNameContext.Provider>
        </WalletContext.Provider>
      </FavorsContext.Provider>
      </LobbyPersonalContext.Provider> 
    </MusicIsPlayingContext.Provider>

  );
};

export default GameLobbyProvider;
