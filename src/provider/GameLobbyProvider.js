import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useLanguage } from 'hooks';
import { generateUUIDv4 } from 'utils/guid';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';

// 建立一個 Context
const GameLobbyContext = createContext();

// 提供一個 Custom Hook 讓其他元件可以存取 Context 值
export const useLobbyContext = () => useContext(GameLobbyContext);

// 最上層的元件，設置各初始值
const GameLobbyProvider = ({ children }) => {
    const { t } = useLanguage();

    const EWinUrl = 'https://ewin.dev.mts.idv.tw';
    const [isLoading, setIsLoading] = useState(true);
    const [CT, setCT] = useState('');
    const [cookies, setCookie] = useCookies(['CT']);
    const GUID = generateUUIDv4();
    const Echo = 'Test_Echo';
    const [Favos, setFavos] = useState([]);

    // Lobby 相關資料

    const [newInstance, setNewInstance] = useState([]);

    // 列表資料
    const [tiList, setTiList] = useState([]);
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
                setCookie('CT', newCT);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const intervalId = setInterval(fetchDataBySeconds, 120000);
        fetchDataBySeconds();
        return () => clearInterval(intervalId);

    }, []);

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
                            console.log('Table information:', tabinfo);
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
        <GameLobbyContext.Provider value={{
            t,
            EWinUrl,
            isLoading,
            CT,
            cookies,
            GUID,
            Echo,
            newInstance,
            Favos,
            setFavos,
            tiList,
            userInfo

        }}>
            {children}
        </GameLobbyContext.Provider>
    );
};

export default GameLobbyProvider;
