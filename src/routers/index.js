import React, { useState, useEffect, useRef } from "react";
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
import TipProvider from 'component/tips';
import VideoBox from 'component/video';
import GameLobbyProvider from 'provider/GameLobbyProvider';
import GameBaccaratProvider from 'provider/GameTableProvider';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import AlertButton from 'component/alert';

import './index.scss';

const Main = () => {
    const EWinUrl = 'https://ewin.dev.mts.idv.tw';
    const intervalIDRef = useRef(0);
    const params = new URLSearchParams(window.location.search);
    const currencyTypeRef = useRef('CNY');
    const [CT, setCT] = useState('');
    const [isServerConneted, setIsServerConneted] = useState(false);

    const location = useLocation();
    const isGameView = location.pathname.includes('/games/');
    const [getUrl, setGetUrl] = useState('');
    const history = useHistory();

    useEffect(() => {
        const CT = params['CT'];
        const CurrencyType = params['CurrencyType'];

        if (CurrencyType) {
            currencyTypeRef.current = CurrencyType;
        } else {
            currencyTypeRef.current = 'CNY';
        }

        if (CT) {
            initLobbyClient(CT);
        } else {
            // 開發時設定每5分鐘打一次api來獲取有效的 CT
            const fetchDataBySeconds = async () => {
                const postData = {
                    Token: '1_0UE5XQQ_ca95cc8bfb4e442118d60c5b92a7af2e',
                    LoginAccount: 'ddt1',
                    LoginPassword: '1234',
                    CompanyCode: 'demo',
                    UserIP: ''
                };
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                };


                const response = await fetch(
                    'https://ewin.dev.mts.idv.tw/API/LoginAPI.asmx/UserLoginByCustomValidate'
                    , requestOptions
                );
                const jsonReturn = await response.json();

                sessionStorage.setItem('CT', jsonReturn.d.CT);
                // setCookie('CT', newCT);
                initLobbyClient(jsonReturn.d.CT);
            };
            fetchDataBySeconds();
        }

    return clearInterval(intervalIDRef.current);
  }, []);


  const initLobbyClient = (CT) => {
    // 遊戲大廳     
    const lobbyClient = EWinGameLobbyClient.getInstance(CT, EWinUrl);
   
    lobbyClient.handleReceiveMsg((Msg) => {
      console.log('處理接收訊息', Msg);
    });

        lobbyClient.handleConnected(() => {

            intervalIDRef.current = setInterval(() => {
                const currentTime = new Date().toLocaleString();
                lobbyClient.KeepSID((s, o) => {
                    console.log("KeepSIDs:" + s);
                    console.log("KeepSID:" + JSON.stringify(o));
                    console.log("Current Time:", currentTime);
                });
            }, 30000);

            setCT(CT);
            setIsServerConneted(true);
        });

        lobbyClient.handleReconnected((Msg) => {

        });


        lobbyClient.handleReconnecting(() => {

        });

        lobbyClient.handleDisconnect(() => {

    });
    
    if(lobbyClient.state() !== 1){
      lobbyClient.initializeConnection();
    }   
  };

    useEffect(() => {
        const currentPath = history.location.pathname;
        localStorage.setItem('currentUrl', currentPath);
        setGetUrl(localStorage.getItem('currentUrl'))

    }, [history.location.pathname]);

    if (!isServerConneted) {
        return (<div></div>)
    } else {
        return (
            <div className="wrap-box">
                <GameLobbyProvider CT={CT} CurrencyType={currencyTypeRef.current}>
                    {!isGameView
                        ? (
                            <>
                                <Header />
                                {/*<VideoBox url={getUrl} />*/}
                                <Footer />
                            </>
                        )
                        : (
                            <GameFooter />
                        )
                    }
                    <Switch>
                        <Route path='/Gamefavorite'>
                            <Gamefavorite></Gamefavorite>
                        </Route>
                        <Route path='/games/:gameId'>
                            <GameBaccaratProvider>
                                <GameView url={getUrl} />
                            </GameBaccaratProvider>
                        </Route>
                        <Route path='/' component={Gamelobby}></Route>
                    </Switch>
                </GameLobbyProvider>
            </div>
        );
    }
};

// 加入判斷剔除不顯示的組件
export default function Routers() {
    return (
        <Router>
            <AlertButton>
                <TipProvider>
                    <Main />
                </TipProvider>
            </AlertButton>
        </Router>
    );
}


