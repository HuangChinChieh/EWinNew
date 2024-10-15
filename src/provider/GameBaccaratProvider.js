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


  const initGameClient = useCallback(() => {
    // 遊戲大廳  
    let client;
    gameClient.current = EWinGameBaccaratClient.getInstance(props.CT, props.EWinUrl);
    client = gameClient.current;

    client.handleReceiveMsg((Msg) => {
      console.log(JSON.stringify(Msg));
      if ("Type" in Msg) {
        if (events.includes(Msg.Type)) {
          if(Msg.Type === "GreatRoad"){

          } else if (Msg.Type === "GameSetChange"){
            notifyDictionary.current[Msg.Args.GameSetID](Msg.Type, Msg.Args);
          } else {
            notifyDictionary.current[Msg.Args.TableNumber](Msg.Type, Msg.Args);
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

    if (client.state() !== 1) {
      client.initializeConnection();
    }
  }, [props.CT, props.EWinUrl]);


  const AddSubscribe = useCallback((gameSetID ,GameSetNumber ,RoadMapNumber, cb, handleNotify) => {
    tableNumberArray.current.push(RoadMapNumber);
    console.log("handleNotify",handleNotify);
    notifyDictionary.current[RoadMapNumber] = handleNotify;
    notifyDictionary.current[gameSetID] = handleNotify;
    
    //訂閱桌台
    gameClient.current.AddSubscribe(GameSetNumber ,tableNumberArray.current.join(""), (s, o) => {
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
  }, []);

  const RemoveSubscribe = useCallback((GameSetNumber ,RoadMapNumber, cb) => {
    tableNumberArray.current = tableNumberArray.current.filter(item => item !== RoadMapNumber);
    
    if(RoadMapNumber in notifyDictionary.current){
      delete notifyDictionary.current[RoadMapNumber];
    }
    //訂閱桌台
    gameClient.current.AddSubscribe(GameSetNumber ,tableNumberArray.current.join(""), (s, o) => {
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
  }, []);

  const ClearSubscribe = (cb) => {
    gameClient.current.ClearSubscribe((s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          cb(true);
        } else {
          cb(false);
        }
      } else {
        cb(false);
      }
    })
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
        ClearSubscribe((s) => {
          gameClient.current = null;
          EWinGameBaccaratClient.destroyInstance();
        });
      } else {
        gameClient.current = null;
        EWinGameBaccaratClient.destroyInstance();
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