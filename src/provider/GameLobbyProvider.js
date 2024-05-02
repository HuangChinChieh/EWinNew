import React, { createContext, useContext, useState, useEffect } from "react";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";

// Create two different contexts
const WalletContext = createContext();
const RealNameContext = createContext();
const BetLimitCurrencyContext = createContext();
const FavorsContext = createContext();
const MusicIsPlayingContext = createContext();

export {
  WalletContext,
  RealNameContext,
  BetLimitCurrencyContext,
  FavorsContext,
  MusicIsPlayingContext,
};
export const useLobbyContext = () => {};

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
  const [betLimitCurrencyType, setBetLimitCurrencyType] = useState("");
  const [musicIsPlaying,setMusicIsPlaying]=useState(false);

  const muteSwitch=(v)=>{
    setMusicIsPlaying(v)
  }

  // Game Lobby related useEffect
  useEffect(() => {
    lobbyClient.GetUserInfo((s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          let wallet = o.Wallet.find((x) => x.CurrencyType === CurrencyType);

          if (wallet) {
            setWallet({
              CurrencyType: wallet.CurrencyType,
              CurrencyName: wallet.CurrencyName,
              Balance: wallet.Balance,
            });
          }

          setRealName(o.RealName);
          setBetLimitCurrencyType(o.BetLimitCurrencyType);
        }
      }
    });

    updateFavors();
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
  const updateBetLimitCurrencyType = () => {
    updateInfo((userInfo) => {
      setBetLimitCurrencyType(userInfo.BetLimitCurrencyType);
    });
  };

  return (
    <MusicIsPlayingContext.Provider value={{ musicIsPlaying, muteSwitch }}>
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
    </MusicIsPlayingContext.Provider>

  );
};

export default GameLobbyProvider;
