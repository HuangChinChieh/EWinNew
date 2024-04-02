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

import './index.scss';

const Main = () => {

  const location = useLocation();
  const isGameView = location.pathname.includes('/games/');
  const [getUrl, setGetUrl] = useState('');
  const history = useHistory();

  localStorage.setItem('currentUrl', '')


  useEffect(() => {
    const currentPath = history.location.pathname;
    localStorage.setItem('currentUrl', currentPath);
    setGetUrl(localStorage.getItem('currentUrl'))

  }, [history.location.pathname])

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
          <Gamefavorite />
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

