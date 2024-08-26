import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { EWinGameBaccaratClient } from 'signalr/bk/EWinGameBaccaratClient';

const NotifyContext = createContext();
const SubscribeContext = createContext();

export {
  NotifyContext,
  SubscribeContext
};

class Notify extends EventTarget {
  on(eventName, callback) {
    this.addEventListener(eventName, callback);
  }

  off(eventName, callback) {
    this.removeEventListener(eventName, callback);
  }

  notify(eventName, data) {
    const event = new CustomEvent(eventName, data);
    this.dispatchEvent(event);
  }
}

//處理訂閱服務來自於Client的推送通知
const GameBaccaratProvider =  (props) => {
  const events = ["HeartBeat", "GreatRoad", "GuestEntry", "GuestLeave", "GameSetChange"];
  const gameClient = useRef(null);
  const tableNumberArray = useRef([]);
  const notify = useRef(new Notify());  
  const [isConnected, setIsConnected] = useState(false);

  const initGameClient = useCallback(() => {   
    // 遊戲大廳  
    let client;  
    gameClient.current = EWinGameBaccaratClient.getInstance(props.CT, props.EWinUrl);
    client = gameClient.current;

    client.handleReceiveMsg((Msg) => {
      console.log(Msg);
      notify.current.notify(Msg.Type, Msg.Args);
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

  const NotifyOn = useCallback((eventName, cb) => {    
    if (events.includes(eventName)) {
      notify.on(eventName, cb);
    }
  }, []);

  const NotifyOff = useCallback((eventName, cb) => {
    if (events.includes(eventName)) {
      notify.off(eventName, cb);
    }
  }, []);

  const AddSubscribe = useCallback((RoadMapNumber, cb) => {    
    tableNumberArray.current.push(RoadMapNumber);

    //訂閱桌台
    gameClient.current.AddSubscribe(tableNumberArray.current.join(""), (s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          if(cb)
            cb(true);
        } else {
          if(cb)
          cb(false);
        }
      } else {
        if(cb)
        cb(false);
      }
    })
  }, []);

  const RemoveSubscribe = useCallback((RoadMapNumber, cb) => {
    tableNumberArray.current = tableNumberArray.current.filter(item => item !== RoadMapNumber);

    //訂閱桌台
    gameClient.current.AddSubscribe(tableNumberArray.current.join(""), (s, o) => {
      if (s) {
        if (o.ResultCode === 0) {
          if(cb)
          cb(true);
        } else{
          if(cb)
          cb(false);
        }
      }else{
        if(cb)
        cb(false);
      }
    })
  }, []);

  const ClearSubscribe = (cb) => {
    gameClient.ClearSubscribe((s, o) => {
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
      <SubscribeContext.Provider value={{
        AddSubscribe, RemoveSubscribe
      }}>
        <NotifyContext.Provider value={{
          NotifyOn, NotifyOff
        }}>
          {props.children}
        </NotifyContext.Provider>
      </SubscribeContext.Provider>
    )
  } else {
    return (<div></div>);
  }
}

// export default React.memo(GameBaccaratProvider,(props)=>{
//   return false;
// });

export default GameBaccaratProvider;