/* eslint-disable react-hooks/exhaustive-deps */
import { set } from "lodash";
import React, { createContext, useCallback, useState, useEffect, useRef } from "react";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";


// Create two different contexts
const WalletContext = createContext();
const BetLimitContext = createContext();
const FavorsContext = createContext();
const MusicIsPlayingContext = createContext();
const LobbyPersonalContext = createContext();
const CashUnitContext = createContext();
const UserInfoContext = createContext();
const GameSetListContext = createContext();
const RefreshUserInfoContext = createContext();


export {
  WalletContext,
  BetLimitContext,
  FavorsContext,
  MusicIsPlayingContext,
  LobbyPersonalContext,
  CashUnitContext,
  UserInfoContext,
  GameSetListContext,
  RefreshUserInfoContext
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
    AllowBetType: 0,
    UserCountry: "",
    UserLevel: 0
  });
  const [favors, setFavors] = useState([]);
  const [useBetLimit, setUseBetLimit] = useState(null);
  const [musicIsPlaying, setMusicIsPlaying] = useState(false);
  const [lobbyPersonal, setLobbyPersonal] = useState(false);
  const [cashUnit, setCashUnit] = useState("");
  const [gameSetList, setGameSetList] = useState([]);
  const [hasNewGameSet, setHasNewGameSet] = useState(false);
  const intervalIDRef = useRef(0);
  const isRefreshing = useRef(false);


  const deepEqual = (obj1, obj2) =>{
   
      if (obj1 === obj2) return true; // 如果是同一物件或值一樣則返回 true
  
      if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
          return false; // 如果其中一個不是物件或是 null，返回 false
      }
  
      // 獲取兩個物件的屬性列表
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
  
      // 比較屬性數量是否一致
      if (keys1.length !== keys2.length) return false;
  
      // 遍歷屬性並進行遞迴比較
      for (let key of keys1) {
          if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
              return false;
          }
      }
  
      return true;  
  };


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
    const setFun = (setObj) => {
      setUserInfo((prevObj) => {
        let checkChange = false;
        let newObj = { ...prevObj };

        for (const key in prevObj) {
          if (prevObj[key] !== setObj[key]) {
            checkChange = true;
            newObj[key] = setObj[key];
          }
        }

        if (checkChange) {
          return newObj;
        } else {
          return prevObj;
        }
      });
    };

    if (obj) {
      setFun(obj);
    } else {
      updateInfo((userInfo) => {
        setFun(userInfo);
      });
    }
  }, [updateInfo]);

  const setUserInfoProperty = useCallback((key, value) => {
    setUserInfo((prevUser) => {
      if (key in prevUser) {
        let newUser = { ...prevUser };
        newUser[key] = value;
        return newUser;
      } else {
        return prevUser;
      }
    });
  }, [updateInfo]);


  const updateWallet = useCallback((obj) => {
    const setFun = (setObj) => {
      setWallet((prevObj) => {
        let checkChange = false;
        let newObj = { ...prevObj };

        for (const key in prevObj) {
          if (prevObj[key] !== setObj[key]) {
            checkChange = true;
            newObj[key] = setObj[key];
          }
        }

        if (checkChange) {
          return newObj;
        } else {
          return prevObj;
        }
      });
    };

    if (obj) {
      setFun(obj);
    } else {
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

  const updateGameSetList = useCallback((listArray) => {
    const setFun = (setArray) => {
      setGameSetList((prevArray) => {
        let checkChange = false;
        let newArray = prevArray.filter(item => {
          if (setArray.some(oldItem => oldItem.GameSetID === item.GameSetID)) {
            return true;
          } else {
            checkChange = true; // 如果有移除的元素，設置標記
            return false;
          }
        });

        setArray.forEach(item => {
          if (!prevArray.some(oldItem => oldItem.GameSetID === item.GameSetID)) {
            newArray.push(item);
            checkChange = true; // 如果有新增的元素，設置標記
            setHasNewGameSet(true);
          }
        });

        if (checkChange) {
          return newArray;
        } else {
          return prevArray;
        }
      });
    };

    if (listArray) {
      setFun(listArray);
    } else {
      updateInfo((userInfo) => {
        if (userInfo.GameSetList != null) {
          setFun(userInfo.GameSetList);
        } else {
          setFun([]);
        }
      });
    }

  }, [CT, CurrencyType, updateInfo]);


  const updateUseBetLimit = (obj) => {
    const setFun = (setObj) => {
      setUseBetLimit((prevObj) => {
        let isEqual = false;
        let newObj = setObj;
        isEqual = deepEqual(prevObj, newObj);
        
        if (isEqual) {
          return prevObj;
        } else {
          return newObj;
        }
      });
    };

    if (obj) {
      setFun(obj);
    } else {
      updateInfo((userInfo) => {
        let _betLimit = userInfo.BetLimit;
        setFun(_betLimit);
      });
    }
  };



  const muteChange = useCallback(() => {
    setMusicIsPlaying(!musicIsPlaying)
  }, [CT, musicIsPlaying]);



  const refreshUserInfo = useCallback(() => {
    if(isRefreshing.current){
      isRefreshing.current = true;

      lobbyClient.GetUserInfo((s, o) => {
        isRefreshing.current = false;

        if (s) {
          if (o.ResultCode === 0) {

            const _userInfo = o;
            let _wallet = _userInfo.Wallet.find((x) => x.CurrencyType === CurrencyType);
  
            if (_wallet) {
              updateWallet({
                CurrencyType: _wallet.CurrencyType,
                CurrencyName: _wallet.CurrencyName,
                Balance: _wallet.Balance,
              });
            }
  
            if (_userInfo.GameSetList != null) {
              updateGameSetList(_userInfo.GameSetList);
            } else {
              updateGameSetList([]);
            }
  

            if (_userInfo.BetLimit != null) {
              updateUseBetLimit(_userInfo.BetLimit);
            } else {
              updateGameSetList(null);
            }

            updateUserInfo({
              LoginAccount: _userInfo.LoginAccount,
              RealName: _userInfo.RealName,
              IsGuestAccount: _userInfo.IsGuestAccount,
              UserAccountType: _userInfo.UserAccountType,
              AllowBetType: _userInfo.AllowBetType,
              UserCountry: _userInfo.UserCountry,
              UserLevel: _userInfo.UserLevel
            });
  
            if (_userInfo.GameSetList != null) {
              setGameSetList(_userInfo.GameSetList);
            }
  
            setCashUnit(_userInfo.Company.CashUnit);
          }
        }
      });
    }   
  }, [lobbyClient]);


  // Game Lobby related useEffect
  useEffect(() => {
    const PromiseArray = [];
    //UserInfo
    PromiseArray.push(new Promise(
      (resolve) => {
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
      (resolve) => {
        lobbyClient.GetUserAccountProperty("EWinGame.Favor", (s, o) => {
          if (s) {
            if (o.ResultCode === 0 || o.Message === "NoExist") {
              resolve(o);
            }
          }
        });
      }
    ));

    Promise.all(PromiseArray).then(([_userInfo, favorsProp]) => {
      let wallet = _userInfo.Wallet.find((x) => x.CurrencyType === CurrencyType);
      let favorsObj = JSON.parse(favorsProp.PropertyValue)

      if (wallet) {
        setWallet({
          CurrencyType: wallet.CurrencyType,
          CurrencyName: wallet.CurrencyName,
          Balance: wallet.Balance,
        });
      }
      
      if (_userInfo.GameSetList != null) {
        setGameSetList(_userInfo.GameSetList);
      }

      if (_userInfo.BetLimit != null) {
        updateUseBetLimit(_userInfo.BetLimit);
      } else {
        updateUseBetLimit(null);
      }


      setUserInfo({
        LoginAccount: _userInfo.LoginAccount,
        RealName: _userInfo.RealName,
        IsGuestAccount: _userInfo.IsGuestAccount,
        UserAccountType: _userInfo.UserAccountType,
        AllowBetType: _userInfo.AllowBetType,
        UserCountry: _userInfo.UserCountry,
        UserLevel: _userInfo.UserLevel
      });

      if(favorsObj === null){
        setFavors([]);
      } else {
        setFavors(favorsObj);
      }
      setCashUnit(_userInfo.Company.CashUnit);      
    }).then(() => {
      intervalIDRef.current = setInterval(() => {
        refreshUserInfo();
      }, 5000);
    });

    return ()=>{
      clearInterval(intervalIDRef.current);
    };
  }, []);

  return (
    <MusicIsPlayingContext.Provider value={{ musicIsPlaying, muteChange }}>
      <LobbyPersonalContext.Provider value={{ lobbyPersonal, setLobbyPersonal }}>
        <FavorsContext.Provider value={{ favors, updateFavors }}>
          <WalletContext.Provider value={{ wallet, updateWallet, setWallet }}>
            <UserInfoContext.Provider value={{ userInfo, updateUserInfo, setUserInfoProperty }}>
              <CashUnitContext.Provider value={{ cashUnit, setCashUnit }}>
                <BetLimitContext.Provider value={{ useBetLimit }}>
                  <GameSetListContext.Provider value={{ gameSetList, updateGameSetList, hasNewGameSet, setHasNewGameSet }}>
                    <RefreshUserInfoContext.Provider value={{ refreshUserInfo }}>
                      {props.children}
                    </RefreshUserInfoContext.Provider>
                  </GameSetListContext.Provider>
                </BetLimitContext.Provider>
              </CashUnitContext.Provider>
            </UserInfoContext.Provider>
          </WalletContext.Provider>
        </FavorsContext.Provider>
      </LobbyPersonalContext.Provider>
    </MusicIsPlayingContext.Provider>

  );
};

export default GameLobbyProvider;
