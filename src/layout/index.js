import { useState, useEffect } from 'react';
import Routers from 'routers';
import { connect } from 'react-redux';
import {
  actCT,
  actIsGameLobbyLoading,
  actTilist,
  actUserInfo,
  actFavo,
  actShoeResults
} from 'store/gamelobbyActions';

import {
  actIsGameBaccarLoading,
  actUserBetlimitList
} from 'store/gameBaccarActions';

import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { EWinGameBaccaratClient } from 'signalr/bk/EWinGameBaccaratClient';

const Layout = (props) => {

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

        props.actCT(newCT);
        localStorage.setItem('CT', newCT);
        // setCookie('CT', newCT);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const intervalId = setInterval(fetchDataBySeconds, 120000);
    fetchDataBySeconds();
    return () => clearInterval(intervalId);

  }, []);

  // 遊戲大廳
  const gameLobbyClient = EWinGameLobbyClient.getInstance(props.ct, props.ewinurl);

  useEffect(() => {


    if (gameLobbyClient !== null) {

      const handleConnected = () => {

        // 監聽連線狀態
        gameLobbyClient.HeartBeat(props.echo);

        gameLobbyClient.handleReceiveMsg((Msg) => {
          console.log('處理接收訊息', Msg);
        });



        // 獲取使用者資料
        gameLobbyClient.GetUserInfo((s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              //資料處理
              // console.log('UserInfo', o);
              // setUserInfo(o);
              props.actUserInfo(o);
              // 登入後 BetLimitCurrencyType 預設值為 "", 暫時先加這段判斷.
              localStorage.setItem('CurrencyType', o.BetLimitCurrencyType ? o.BetLimitCurrencyType : 'PHP');
            } else {
              //系統錯誤處理
              console.log('GetUserInfo: 系統錯誤處理');
              props.actIsGameLobbyLoading(true);

            }
          } else {
            //傳輸等例外問題處理
            console.log('GetUserInfo: 傳輸等例外問題處理');
            props.actIsGameLobbyLoading(true);
          }
        });



        // 獲取LOBBY 頁面的 table list相關資料

        gameLobbyClient.GetTableInfoList('', 0, (s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              //資料處理
              // console.log('TableList', o);
              // setTiList(o);
              props.actTilist(o);
              // setShoeResults(o.TableInfoList.map(info => info.ShoeResult));
              props.actShoeResults(o.TableInfoList.map(info => info.ShoeResult));
              props.actIsGameLobbyLoading(false);
            } else {
              //系統錯誤處理
              console.log('GetTableInfoList: 系統錯誤處理');
              props.actIsGameLobbyLoading(true);
              window.location.reload();
            }
          } else {
            //傳輸等例外問題處理
            console.log('GetTableInfoList: 傳輸等例外問題處理');
            props.actIsGameLobbyLoading(true);
            window.location.reload();
          }
        });


        gameLobbyClient.GetUserAccountProperty('EWinGame.Favor', (s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              //資料處理
              // console.log('tUserAccountProperty', o);
              // setFavos(JSON.parse(o.PropertyValue));
              props.actFavo(JSON.parse(o.PropertyValue));

            } else {
              //系統錯誤處理
              console.log('GetUserAccountProperty: 系統錯誤處理');
              props.actIsGameLobbyLoading(true);
            }
          } else {
            //傳輸等例外問題處理
            console.log('GetUserAccountProperty: 傳輸等例外問題處理');
            props.actIsGameLobbyLoading(true);
          }
        });


      };

      const handleDisconnect = () => {
        console.log('EWinHub 連結失效');
        props.actIsGameLobbyLoading(true);
        window.location.reload();
      };

      const handleReconnecting = () => {
        console.log('重新連結 EWinHub');
        props.actIsGameLobbyLoading(true);
      };

      const handleReconnected = () => {
        console.log('已重新連結 EWinHub');
        props.actIsGameLobbyLoading(true);
      };

      gameLobbyClient.handleConnected(handleConnected);
      gameLobbyClient.handleDisconnect(handleDisconnect);
      gameLobbyClient.handleReconnecting(handleReconnecting);
      gameLobbyClient.handleReconnected(handleReconnected);

      // 初始化連接
      gameLobbyClient.initializeConnection();
      // props.actGlobalGameLobbyClient(instance);

    }
  }, [props.ct, gameLobbyClient]);


  //百家樂遊戲
  const gameBaccarClient = EWinGameBaccaratClient.getInstance(props.ct, props.ewinurl);

  const getRoadMapNumber = props.roadMapNumber ? props.roadMapNumber : localStorage.getItem('getLocalTableTitle');

  useEffect(() => {

    if (gameBaccarClient !== null) {
      const handleConnected = () => {
        // 監聽連線狀態
        gameBaccarClient.HeartBeat(props.echo);
        props.actIsGameBaccarLoading(false);
        console.log('Layout - EWinGame.Baccarat 連結成功');

        gameBaccarClient.UserAccountGetBetLimitList(props.ct, props.guid, localStorage.getItem('CurrencyType'), (s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              //資料處理
              // console.log('取得會員個人限紅資料', o);
              props.actUserBetlimitList(o);

            } else {
              //系統錯誤處理
              console.log('UserAccountGetBetLimitList: 系統錯誤處理');


            }
          } else {
            //傳輸等例外問題處理
            console.log('UserAccountGetBetLimitList: 傳輸等例外問題處理');

          }
        });

        gameBaccarClient.GetTableInfo(props.ct, props.guid, getRoadMapNumber, 0, (s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              //資料處理
              console.log('取得單一桌台詳細資訊', o);

            } else {
              //系統錯誤處理
              console.log('取得單一桌台詳細資訊: 系統錯誤處理');


            }
          } else {
            //傳輸等例外問題處理
            console.log('取得單一桌台詳細資訊: 傳輸等例外問題處理', o);
          }
        });


      }
      const handleDisconnect = () => {
        console.log('EWinGame.Baccarat 連結失效');
        props.actIsGameBaccarLoading(true);
        window.location.reload();
      };

      const handleReconnecting = () => {
        console.log('重新連結 EWinGame.Baccarat');
        props.actIsGameBaccarLoading(true);
      };

      const handleReconnected = () => {
        console.log('已重新連結 EWinGame.Baccarat');
        props.actIsGameBaccarLoading(true);
      };

      gameBaccarClient.handleConnected(handleConnected);
      gameBaccarClient.handleDisconnect(handleDisconnect);
      gameBaccarClient.handleReconnecting(handleReconnecting);
      gameBaccarClient.handleReconnected(handleReconnected);

      // 初始化連接
      gameBaccarClient.initializeConnection();
      // setNewBaccaratInstance(baccaratInstance);
    }


  }, [props.ct, gameBaccarClient])

  return (
    <Routers />
  )
}

// export default Layout;

const mapStateToProps = (state) => {
  // console.log('檢查state', state);
  // console.log('檢查state.globalEWinGameLobbyClient', state.gameLobby.globalEWinGameLobbyClient);
  // console.log('檢查state.ewinurl', state.gameLobby.ewinurl);
  // console.log('檢查state.ct', state.gameLobby.ct);
  // console.log('檢查state.guid', state.gameLobby.guid);
  // console.log('檢查state.echo', state.gameLobby.echo);
  // console.log('檢查state.tilist', state.gameLobby.tilist);
  // console.log('檢查state.userInfo', state.gameLobby.userInfo);
  return {
    // GameLobby
    ewinurl: state.gameLobby.ewinurl,
    ct: state.gameLobby.ct,
    guid: state.gameLobby.guid,
    echo: state.gameLobby.echo,
    isGameLobbyLoading: state.gameLobby.isGameLobbyLoading,
    tiList: state.gameLobby.tiList,
    userInfo: state.gameLobby.userInfo,
    favo: state.gameLobby.favo,
    shoeResults: state.gameLobby.shoeResults,
    // GameBaccar
    isGameBaccarLoading: state.gameBaccar.isGameBaccarLoading,
    userBetlimitList: state.gameBaccar.userBetlimitList
  };
};

const mapDispatchToProps = {
  // GameLobby
  actCT,
  actIsGameLobbyLoading,
  actTilist,
  actUserInfo,
  actFavo,
  actShoeResults,
  // GameBaccar
  actIsGameBaccarLoading,
  actUserBetlimitList
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);