/* eslint-disable react-hooks/exhaustive-deps */
import { set } from "lodash";
import React, { createContext, useCallback, useState, useEffect } from "react";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";


// Create two different contexts
const WalletContext = createContext();
const BetLimitContext = createContext();
const FavorsContext = createContext();
const MusicIsPlayingContext = createContext();
const LobbyPersonalContext=createContext();
const CashUnitContext = createContext();
const UserInfoContext = createContext();


export {
  WalletContext,  
  BetLimitContext,
  FavorsContext,
  MusicIsPlayingContext,
  LobbyPersonalContext,
  CashUnitContext,
  UserInfoContext
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
  const [userInfo, setUserInfo] = useState({
    LoginAccount: "",
    RealName: "",
    IsGuestAccount: false,
    UserAccountType: 0,
    AllowBetType: true,
    UserCountry: "",
    UserLevel: 0
  });
  const [favors, setFavors] = useState([]);  
  const [betLimit, setBetLimit] = useState("");
  const [musicIsPlaying,setMusicIsPlaying]=useState(false);
  const [lobbyPersonal,setLobbyPersonal]=useState(false);
  const [cashUnit, setCashUnit] = useState("");
  const [userGameSetList, setUserGameSetList] = useState([]);
  

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

      setUserInfo({
        LoginAccount: userInfo.LoginAccount,
        RealName: userInfo.RealName,
        IsGuestAccount: userInfo.IsGuestAccount,
        UserAccountType: userInfo.UserAccountType,
        AllowBetType: userInfo.AllowBetType,
        UserCountry: userInfo.UserCountry,
        UserLevel: userInfo.UserLevel
      });      
      setFavors(favorsObj);
      setCashUnit(userInfo.Company.CashUnit);
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

  const updateUserInfo = useCallback((obj) => {
    const setFun = (setObj)=>{
      setUserInfo((prevObj) => {
        let checkChange = false;
        let newObj = {...prevObj};
  
        for (const key in prevObj){
          if(prevObj[key] !==  setObj[key]){
            checkChange = true;
            newObj[key] = setObj[key];
          }          
        }
  
        if(checkChange){
          return newObj;
        }else{
          return prevObj;
        }
      });
    };
    
    if(obj){
      setFun(obj);
    }else{
      updateInfo((userInfo) => {
        setFun(userInfo);  
          let checkChange = false;
          let newUser = {...prevUser};
  
          for (const key in prevUser){
            if(prevUser[key] !==  userInfo[key]){
              checkChange = true;
              newUser[key] = userInfo[key];
            }          
          }
  
          if(checkChange){
            return newUser;
          }else{
            return prevUser;
          }  
      });
    }       
  }, [updateInfo]);

  const setUserInfoProperty = useCallback((key, value) => {
    setUserInfo((prevUser) => {   
      if(key in prevUser){
        let newUser = {...prevUser};
        newUser[key] =  value;
        return newUser;
      }else{
        return prevUser;
      }
    });
  }, [updateInfo]);


  const updateWallet = useCallback((obj) => {
    const setFun = (setObj)=>{
      setWallet((prevObj) => {
        let checkChange = false;
        let newObj = {...prevObj};

        for (const key in prevObj){
          if(prevObj[key] !==  setObj[key]){
            checkChange = true;
            newObj[key] = setObj[key];
          }          
        }

        if(checkChange){
          return newObj;
        }else{
          return prevObj;
        }
      });
    };

    if(obj){
      setFun(obj);
    }else{
      updateInfo((userInfo) => {
        let wallet = userInfo.Wallet.find((x) => x.CurrencyType === CurrencyType);
        // let setObj = {
        //   CurrencyType: wallet.CurrencyType,
        //   CurrencyName: wallet.CurrencyName,
        //   Balance: wallet.Balance,
        // };
        setFun(wallet);
      });
    }       
    
  }, [CT, CurrencyType, updateInfo]);

  const updateBetLimit = useCallback((betLimit) => {
    setBetLimit(betLimit);
  }, [CT]);

  const muteChange = useCallback(() => {
    setMusicIsPlaying(!musicIsPlaying)
  }, [CT, musicIsPlaying]);
  
  return (
    <MusicIsPlayingContext.Provider value={{ musicIsPlaying, muteChange }}>
      <LobbyPersonalContext.Provider value={{ lobbyPersonal,setLobbyPersonal }}>
      <FavorsContext.Provider value={{ favors, updateFavors }}>
        <WalletContext.Provider value={{ wallet, updateWallet, setWallet}}>
          <UserInfoContext.Provider value={{ userInfo, updateUserInfo, setUserInfoProperty }}>
          <CashUnitContext value={{ cashUnit, setCashUnit }}>
            <BetLimitContext.Provider
              value={{ betLimit, updateBetLimit }}
            >
              {props.children}
            </BetLimitContext.Provider>
            </CashUnitContext>
          </UserInfoContext.Provider>
        </WalletContext.Provider>
      </FavorsContext.Provider>
      </LobbyPersonalContext.Provider> 
    </MusicIsPlayingContext.Provider>

  );
};

export default GameLobbyProvider;
