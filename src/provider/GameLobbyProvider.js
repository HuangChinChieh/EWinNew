import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useCookies } from 'react-cookie';
import { useLanguage } from 'hooks';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import {  generateUUIDv4} from "../utils/guid";
// 建立一個 Context
const GameLobbyContext = createContext();

// 提供一個 Custom Hook 讓其他元件可以存取 Context 值
export const useLobbyContext = () => useContext(GameLobbyContext);

// 最上層的元件，設置各初始值
const GameLobbyProvider = ({ children }) => {
    const GUID=generateUUIDv4();
    const { t } = useLanguage();
    const EWinUrl = 'https://ewin.dev.mts.idv.tw';
    const [CT, setCT] = useState('');
    const [wallet,setWallect]=useState([]);
    const [realName,setRealName]=useState('');
    const [showMessage,setShowMessage]=useState('');
    
    const [betLimitCurrencyType,setBetLimitCurrencyType]=useState('');
    const Echo = 'Test_Echo';
    // const [domain, setDomain] = useState('');
    // const [Favos, setFavos] = useState([]);
    // const [shoeResults, setShoeResults] = useState('');
    // const [isFavorited, setIsFavorited] = useState(false);
    // const [isTradition,setIsTradition]=useState(false);

    // Lobby 相關資料

    const [isLoading, setIsLoading] = useState(false);
    const [newInstance, setNewInstance] = useState([]);

    // 列表資料
    // const [tiList, setTiList] = useState([]);
    // 使用者資料
    const [userInfo, setUserInfo] = useState([]);


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
    
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        const intervalId = setInterval(fetchDataBySeconds, 120000);
        fetchDataBySeconds();
        return () => clearInterval(intervalId);
    
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
        gameLobbyClient.GetUserInfo((s, o) => {
            if (s) {
            if (o.ResultCode === 0) {
                //資料處理
                console.log('UserInfo', o);
                setUserInfo(o);
                setWallect(o.Wallet);
                setBetLimitCurrencyType(o.BetLimitCurrencyType);
                setRealName(o.RealName);
                // 登入後 BetLimitCurrencyType 預設值為 "", 暫時先加這段判斷.
                localStorage.setItem('CurrencyType', o.BetLimitCurrencyType ? o.BetLimitCurrencyType : 'PHP');
            } else {
                //系統錯誤處理
                console.log('GetUserInfo: 系統錯誤處理');
                setIsLoading(true);

            }
            } else {
            //傳輸等例外問題處理
            console.log('GetUserInfo: 傳輸等例外問題處理');
            setIsLoading(true);
            }
        });
        
        gameLobbyClient.GetUserInfo((s, o) => {
            if (s) {
            if (o.ResultCode === 0) {
                //資料處理
                console.log('UserInfo', o);
                setUserInfo(o);
                setWallect(o.Wallet);
                setBetLimitCurrencyType(o.BetLimitCurrencyType);
                setRealName(o.RealName);
                // 登入後 BetLimitCurrencyType 預設值為 "", 暫時先加這段判斷.
                localStorage.setItem('CurrencyType', o.BetLimitCurrencyType ? o.BetLimitCurrencyType : 'PHP');
            } else {
                //系統錯誤處理
                console.log('GetUserInfo: 系統錯誤處理');
                setIsLoading(true);

            }
            } else {
            //傳輸等例外問題處理
            console.log('GetUserInfo: 傳輸等例外問題處理');
            setIsLoading(true);
            }
        });

        };

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

        gameLobbyClient.handleConnected(handleConnected);
        gameLobbyClient.handleDisconnect(handleDisconnect);
        gameLobbyClient.handleReconnecting(handleReconnecting);
        gameLobbyClient.handleReconnected(handleReconnected);

        // 初始化連接
        gameLobbyClient.initializeConnection();
        // props.actGlobalGameLobbyClient(instance);

    }
    }, [CT, gameLobbyClient]);



    return (
        <GameLobbyContext.Provider value={{
            t,
            CT,
            wallet,
            realName,
            betLimitCurrencyType,
            showMessage,
            setShowMessage,
            // userInfo,
            // newInstance,
            // EWinUrl,
            // domain,
            // isLoading,
            // GUID,
            // Echo,
            // Favos,
            // tiList,
            // shoeResults,
            // isFavorited,
            // setIsFavorited,
            // setShoeResults,
            // setFavos

        }}>
            {children}
        </GameLobbyContext.Provider>
    );
};

export default GameLobbyProvider;
