import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { EWinGameBaccaratClient } from 'signalr/bk/EWinGameBaccaratClient';

const BaccaratSubscribeContext = createContext();

export {
  BaccaratSubscribeContext
};



//處理訂閱服務來自於Client的推送通知
const GameBaccaratProvider = (props) => {
  
  const events = ["HeartBeat", "GreatRoad", "GuestEntry", "GuestLeave", "GameSetChange", "BetChange", "TableChange", "PeekingCard", "FirstDrawing", "RoundDrawCard"];
  const gameClient = useRef(null);
  const tableNumberArray = useRef([]);
  const notifyDictionary = useRef({});
  const [isConnected, setIsConnected] = useState(false);
  const gameSetData = useRef({
    GameSetID: 0,
    GameSetNumber: "",
    TableNumber: ""
  });

  const resetData = () => {
    EWinGameBaccaratClient.destroyInstance();
    gameClient.current = null;
    setIsConnected(false);
    tableNumberArray.current = [];
    notifyDictionary.current = {};
    gameSetData.current = {
      GameSetID: 0,
      GameSetNumber: "",
      TableNumber: ""
    };
  };

  const initGameClient = useCallback(() => {
    // 遊戲大廳  
    let client;
    gameClient.current = EWinGameBaccaratClient.getInstance(props.CT, props.EWinUrl);
    client = gameClient.current;

    client.handleReceiveMsg((Msg) => {
      console.log(JSON.stringify(Msg));
      if ("Type" in Msg) {
        if (events.includes(Msg.Type)) {
          if (Msg.Type === "GreatRoad") {

          } else if (Msg.Type === "GameSetChange") {
            if(Msg.Args.GameSetID === gameSetData.current.GameSetID){
              notifyDictionary.current[gameSetData.current.TableNumber](Msg.Type, Msg.Args);
            }          
          } else {
            if(Msg.Args.TableNumber in tableNumberArray.current){
              notifyDictionary.current[Msg.Args.TableNumber](Msg.Type, Msg.Args);
            }            
          }
        }
      }
    });

    client.handleConnected(() => {
      setIsConnected(true);
    });

    client.handleReconnected((Msg) => {

    });


    client.handleReconnecting(() => {

    });

    client.handleDisconnect(() => {

    });

    if (client.state() === 1) {
      setIsConnected(true);
    } else {
      client.initializeConnection();
    }
  }, [props.CT, props.EWinUrl]);


  const AddSubscribe = useCallback((GameSetID, GameSetNumber, RoadMapNumber, cb, handleNotify) => {
    if (gameClient.current != null && gameClient.current.currentState === 1) {
      tableNumberArray.current.push(RoadMapNumber);
      notifyDictionary.current[RoadMapNumber] = handleNotify;

      if (GameSetID !== 0) {
        gameSetData.current.GameSetID = GameSetID;
        gameSetData.current.GameSetNumber = GameSetNumber;
        gameSetData.current.TableNumber = RoadMapNumber;
      }

      //訂閱桌台
      gameClient.current.AddSubscribe(GameSetNumber, tableNumberArray.current.join(""), (s, o) => {
        if (s) {
          if (o.ResultCode === 0) {
            if (cb)
              cb(true);
          } else {
            if (cb)
              cb(false);
          }
        } else {
          if (cb)
            cb(false);
        }
      })
    }
  }, []);

  const RemoveSubscribe = useCallback((GameSetNumber, RoadMapNumber, cb) => {
    if (gameClient.current != null && gameClient.current.currentState === 1) {
      //確認桌台號是否已經訂閱，並移除
      tableNumberArray.current = tableNumberArray.current.filter(item => item !== RoadMapNumber);

      if (RoadMapNumber in notifyDictionary.current) {
        delete notifyDictionary.current[RoadMapNumber];
      }

      //確認工單號是否正在訂閱，並移除
      if (gameSetData.current.GameSetNumber === GameSetNumber) {
        gameSetData.current.GameSetID = 0;
        gameSetData.current.GameSetNumber = "";
        gameSetData.current.TableNumber = "";
      }


      //訂閱桌台
      gameClient.current.AddSubscribe(gameSetData.current.GameSetNumber, tableNumberArray.current.join(""), (s, o) => {
        if (s) {
          if (o.ResultCode === 0) {
            if (cb)
              cb(true);
          } else {
            if (cb)
              cb(false);
          }
        } else {
          if (cb)
            cb(false);
        }
      })
    }
  }, []);

  const ClearSubscribe = (cb) => {
    if (gameClient.current != null && gameClient.current.currentState === 1) {
      gameClient.current.ClearSubscribe((s, o) => {
        if (s) {
          if (o.ResultCode === 0) {
            if (cb) {
              cb(true);
            }
          } else {
            if (cb) {
              cb(false);
            }
          }
        } else {
          if (cb) {
            cb(false);
          }
        }
      })
    }  
  };

  const GetGameClient = useCallback(() => {
    return gameClient.current;
  }, [])




  useEffect(() => {
    //尚未初始化，執行初始化
    if (!gameClient.current) {
      initGameClient();
    }

    return () => {
      //每次離開時destroy client
      if (gameClient.current.currentState === 1) {
        ClearSubscribe();
        resetData();
      } else {
        gameClient.current = null;
      }
    };
  }, [initGameClient, props.CT]);

  useEffect(() => {
    //尚未初始化，執行初始化
    console.log("test entry");


    return (() => {
      //每次離開時destroy client
      console.log("test leave");
    });
  }, []);

  if (isConnected) {
    return (
      <BaccaratSubscribeContext.Provider value={{
        AddSubscribe, RemoveSubscribe, GetGameClient, isConnected
      }}>
        {props.children}
      </BaccaratSubscribeContext.Provider>
    )
  } else {
    return (<div></div>);
  }
}

// export default React.memo(GameBaccaratProvider,(props)=>{
//   return false;
// });

export default GameBaccaratProvider;