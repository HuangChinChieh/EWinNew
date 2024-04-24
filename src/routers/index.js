import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";

import Header from 'component/header';
import Gamelobby from 'view/game_lobby';
import Gamefavorite from 'view/game_favorite';
import GameView from 'view/game_views';
import Footer from 'component/footer';
import GameFooter from 'games_component/game_footer';
import Tips from 'component/tips';
import VideoBox from 'component/video';
import GameLobbyProvider from 'provider/GameLobbyProvider';
import GameBaccaratProvider from 'provider/GameBaccaratProvider';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { TipContext } from 'component/tips'; 

import './index.scss';

const Main = () => {
  const EWinUrl = 'https://ewin.dev.mts.idv.tw';
  // const [domain, setDomain] = useState('');
  const [CT, setCT] = useState('');  
  //應該設計一個loading組件管理
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const isGameView = location.pathname.includes('/games/');
  const [getUrl, setGetUrl] = useState('');
  const history = useHistory();

  localStorage.setItem('currentUrl', '');

  
  useEffect(() => {
    // 開發時設定每5分鐘打一次api來獲取有效的 CT
    const fetchDataBySeconds = async () => {
      try {
        const response = await fetch(
          'https://ewin.dev.mts.idv.tw/API/LoginAPI.asmx/UserLoginByCustomValidate?Token=1_0UE5XQQ_ca95cc8bfb4e442118d60c5b92a7af2e&LoginAccount=ddt1&LoginPassword=1234&CompanyCode=demo&UserIP='
        );
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const newCT = xmlDoc.getElementsByTagName('CT')[0].textContent;

        setCT(newCT);
        localStorage.setItem('CT', newCT);
        // setCookie('CT', newCT);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataBySeconds();
  }, []);

// 遊戲大廳
const gameLobbyClient = EWinGameLobbyClient.getInstance(CT, EWinUrl);





useEffect(() => {

  if (gameLobbyClient !== null) {

  

      const handleConnected = () => {

      // 監聽連線狀態
      gameLobbyClient.HeartBeat(Echo);

      gameLobbyClient.handleReceiveMsg((Msg) => {
          console.log('處理接收訊息', Msg);
      });

      // 獲取使用者資料
      
      const handleDisconnect = () => {
      console.log('EWinHub 連結失效');
      setIsLoading(true);
      window.location.reload();
      };

      const handleReconnecting = () => {
      console.log('重新連結 EWinHub');
      setIsLoading(true);
      };

      const handleReconnected = () => {
      console.log('已重新連結 EWinHub');
      setIsLoading(true);
      };


      const KeepSIDIntercal=()=>{
        gameLobbyClient.KeepSID((s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              //資料處理
              console.log('sid is fine', o);
              // 登入後 BetLimitCurrencyType 預設值為 "", 暫時先加這段判斷.
            } else {
              //系統錯誤處理
              console.log('GetUserInfo: 系統錯誤處理');
  
            }
          } else {
            //傳輸等例外問題處理
            console.log('GetUserInfo: 傳輸等例外問題處理');
          }
          
        });
      }

      
      
      gameLobbyClient.handleConnected(handleConnected);
      gameLobbyClient.handleDisconnect(handleDisconnect);
      gameLobbyClient.handleReconnecting(handleReconnecting);
      gameLobbyClient.handleReconnected(handleReconnected);
      
      
      
      // 初始化連接
      gameLobbyClient.initializeConnection();
      
      const intervalId = setInterval(KeepSIDIntercal, 30000);
      KeepSIDIntercal();
      return () => clearInterval(intervalId);





    }
  }
}, [CT, gameLobbyClient]);




useEffect(() => {
  const currentPath = history.location.pathname;
  localStorage.setItem('currentUrl', currentPath);
  setGetUrl(localStorage.getItem('currentUrl'))

}, [history.location.pathname]);


  return (
    <div className="wrap-box">
      {!isGameView
        ? (
          <>
            <Header />
            <VideoBox url={getUrl} />
            <Footer />
          </>
        )
        : (
          <GameFooter />
        )
      }
      <Switch>
        <Route path='/Gamefavorite'>
        <TipContext>
          <Gamefavorite />
        </TipContext>
        </Route>
        <Route path='/games/:gameId'>
          <GameBaccaratProvider>
            <GameView url={getUrl} />
          </GameBaccaratProvider>
        </Route>
        <Route path='/'>
          <Gamelobby />
        </Route>
      </Switch>
    </div>
  );
};

// 加入判斷剔除不顯示的組件
export default function Routers() {
  return (
    <Router>
      <GameLobbyProvider>
        <Tips />
        <Main />
      </GameLobbyProvider>
    </Router>
  );
}

