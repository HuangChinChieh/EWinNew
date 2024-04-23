import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from 'hooks';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';

// Create two different contexts
const WalletContext = createContext();
const RealNameContext = createContext();
const LanguageContext = createContext();
const BetLimitCurrencyContext = createContext();
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


// Create a Context Provider to provide shared values
const GameLobbyProvider  = ({ children }) => {
  const { t } = useLanguage();
  const gameLobbyClient = EWinGameLobbyClient.getInstance();
  const [wallet, setWallet] = useState([]);
  const [realName, setRealName] = useState('');
  const [betLimitCurrencyType, setBetLimitCurrencyType] = useState('');
  
  // Game Lobby related useEffect
  useEffect(() => {
    if (gameLobbyClient !== null) {
      const handleConnected = () => {
        // Get user info
        gameLobbyClient.GetUserInfo((s, o) => {
          if (s) {
            if (o.ResultCode === 0) {
              console.log('UserInfo', o);
              setWallet(o.Wallet);
              setRealName(o.RealName);
              setBetLimitCurrencyType(o.BetLimitCurrencyType);
              localStorage.setItem('CurrencyType', o.BetLimitCurrencyType ? o.BetLimitCurrencyType : 'PHP');
            } else {
              console.log('GetUserInfo: 系統錯誤處理');
            }
          } else {
            console.log('GetUserInfo: 傳輸等例外問題處理');
          }
        });
      };
    }
  }, [gameLobbyClient]);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      <RealNameContext.Provider value={{ realName, setRealName }}>
        <LanguageContext.Provider value={t}>
          <BetLimitCurrencyContext.Provider value={betLimitCurrencyType}>
            {children}
          </BetLimitCurrencyContext.Provider>
        </LanguageContext.Provider>
      </RealNameContext.Provider>
    </WalletContext.Provider>
  );
};

export default GameLobbyProvider ;