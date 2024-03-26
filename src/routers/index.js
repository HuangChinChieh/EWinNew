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
// import cookie from 'react-cookies';
import { useCookies } from 'react-cookie';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { generateUUIDv4 } from 'utils/guid';

import './index.scss';

const Main = () => {

  const location = useLocation();
  const isGameView = location.pathname.includes('/games/');
  const [getUrl, setGetUrl] = useState('');
  localStorage.setItem('currentUrl', '')

  const history = useHistory();

  const EWinUrl = 'https://ewin.dev.mts.idv.tw';
  localStorage.setItem('EWinUrl', EWinUrl)
  const GUID = generateUUIDv4();
  const Echo = 'Test_Echo';




  useEffect(() => {
    const currentPath = history.location.pathname;
    localStorage.setItem('currentUrl', currentPath);
    setGetUrl(localStorage.getItem('currentUrl'))

  }, [history.location.pathname])

  // SignalR相關
  const [isLoading, setIsLoading] = useState(true);
  const [tiList, setTiList] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [CT, setCT] = useState('');
  const [cookies, setCookie] = useCookies(['CT']);
  const [Favos, setFavos] = useState([]);
  const [newInstance, setNewInstance] = useState([]);

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
        setCookie('CT', newCT);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    const intervalId = setInterval(fetchDataBySeconds, 120000);
    fetchDataBySeconds();
    return () => clearInterval(intervalId);
  }, [])


  useEffect(() => {

    const instance = EWinGameLobbyClient.getInstance(CT, EWinUrl);


    if (instance !== null) {

      setNewInstance(instance);

      const handleConnected = () => {
        console.log('已連結');

        // 監聽連線狀態
        instance.HeartBeat(Echo);

        instance.handleReceiveMsg((Msg) => {
          console.log('處理接收訊息', Msg);
        });

        if (tiList.length === 0 || userInfo === 0) {
          // 獲取使用者資料
          instance.GetUserInfo(CT, GUID, (userInfo) => {
            if (userInfo) {
              setUserInfo(userInfo);
            } else {
              console.log('Failed to get user information.');
            }
          });

          // 獲取LOBBY 頁面的 table list相關資料
          instance.GetTableInfoList(CT, GUID, '', 0, (tabinfo) => {
            if (tabinfo && tabinfo.TableInfoList) {
              setTiList(tabinfo);
              setIsLoading(false);
              // console.log('Table information:', tabinfo);
            } else {
              console.error('tabInfoList is not an array:', tabinfo);
            }
          });


          instance.GetUserAccountProperty(CT, GUID, "EWinGame.Favor", function (o) {
            if (o) {
              if (o.ResultCode == 0) {
                setFavos(JSON.parse(o.PropertyValue));
                // setIsLoading(false)
              }
            }
          });

        } else {
          setIsLoading(false);
        }
      };

      const handleDisconnect = () => {
        console.log('EWinHub 連結失效');
      };

      const handleReconnecting = () => {
        console.log('重新連結 EWinHub');
      };

      const handleReconnected = () => {
        console.log('已重新連結 EWinHub');
      };

      instance.handleConnected(handleConnected);
      instance.handleDisconnect(handleDisconnect);
      instance.handleReconnecting(handleReconnecting);
      instance.handleReconnected(handleReconnected);

      // 初始化連接
      instance.initializeConnection();

    }
  }, [CT, EWinUrl]);


  return (
    <div className="wrap-box">
      {!isGameView
        ? (
          <>
            <Header userInfo={userInfo} />
            <VideoBox url={getUrl} />
            <Footer userInfo={userInfo} />
          </>
        )
        : (
          <GameFooter userInfo={userInfo} />
        )
      }
      <Switch>
        <Route path='/Gamefavorite'>
          <Gamefavorite newInstance={newInstance} CT={CT} GUID={GUID} tiList={tiList} Favos={Favos} userInfo={userInfo} />
        </Route>
        <Route path='/games/:gameId'>
          <GameView
            url={getUrl}
            isLoading={isLoading}
          />
        </Route>
        <Route path='/'>
          <Gamelobby
            tiList={tiList}
            userInfo={userInfo}
            isLoading={isLoading}
          />
        </Route>
      </Switch>
    </div>
  );
};

// 加入判斷剔除不顯示的組件
export default function Routers() {
  return (
    <Router>
      <Tips />
      <Main />
    </Router>
  );
}

