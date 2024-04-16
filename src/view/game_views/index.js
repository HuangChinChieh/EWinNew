import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
    actIsGameBaccarLoading,
    actUserBetlimitList
} from 'store/gameBaccarActions';
import { EWinGameBaccaratClient } from 'signalr/bk/EWinGameBaccaratClient';
import GameHeader from 'games_component/game_header';
import GameFooterArea from 'games_component/game_footer_area';
import GameFooterBG from 'games_component/game_footer_bg';
import CountdownCircle from 'games_component/game_count_down_circle';
import GameBettingAction from 'games_component/game_betting_action';
import GameBettingArea from 'games_component/game_betting_area';
import GameChat from 'games_component/game_chat';
import Loading from 'component/loading';
import './index.scss';


const GameView = (props) => {

    const gameBaccarClient = EWinGameBaccaratClient.getInstance(props.ct, props.ewinurl);

    const [seconds, setSeconds] = useState(777);
    const [firstSeconds, setFirstSeconds] = useState(777);



    const numDots = 8;
    const loadingDots = Array.from({ length: numDots }, (_, index) => (
        <div key={index}></div>
    ));
    // 閒 Player,和 Tie, 庄 Bank
    const [bettingAction, setBettingAction] = useState('');


    // 這一塊只是demo作假用,之後可移除,底下判斷 連結websocket後 setIsLoading(false), 才是之後實際用到的
    // useEffect(() => {
    //     // 模擬組件載入完成後的動作
    //     const loadingTimeout = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 2000);

    //     // 清除 timeout
    //     return () => clearTimeout(loadingTimeout);
    // }, []);

    // const [newFavo, setNewFavo] = useState('');
    const getRoadMapNumber = props.roadMapNumber ? props.roadMapNumber : localStorage.getItem('getLocalTableTitle')

    useEffect(() => {

        if (gameBaccarClient != null) {
            const handleConnected = () => {
                // 監聽連線狀態
                gameBaccarClient.HeartBeat(props.echo);
                props.actIsGameBaccarLoading(false);
                console.log('GameView - EWinGame.Baccarat 連結成功');
                // console.log('props.ct, props.ewinurl', props.ct, props.ewinurl, props.guid);
                // console.log('Game View Log', gameBaccarClient);
                // console.log('props.roadMapNumber', props.roadMapNumber);
                // console.log('getRoadMapNumber', getRoadMapNumber);

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
                        console.log('取得單一桌台詳細資訊: 傳輸等例外問題處理');
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
            gameBaccarClient.initializeConnection();


        }
    }, [props.ct])


    useEffect(() => {
        // 實際會有後端資料回傳,抓到回傳秒數後, 再把value 餵給 seconds, 和 firstSeconds 目前先用demo秒數
        if (seconds === 0) {
            setBettingAction('stop-betting');
        } else {
            setBettingAction('betting');
        }

    }, [seconds]);

    useEffect(() => {
        if (seconds > 0) {
            const intervalId = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [seconds]);

    // 實際應該是發牌手有按按鍵時才會開始倒數, 以下兩個 useE`ffect只是demo用
    useEffect(() => {
        const timerLoading = setTimeout(() => {
            setSeconds(777);
            setFirstSeconds(777);
        }, 10000);

        return () => clearTimeout(timerLoading);
    }, [seconds]);

    return (
        <div className="game-view-wrap">
            {props.isGameBaccarLoading ? (
                <Loading />
            ) : (
                <div className='game-view-box'>
                    {/* url={props.url} 這邊可以拿到實際遊戲id 再根據id做相關判斷 可以這樣寫 url={props.url.split('/').pop()} 例如收藏就需要當下id */}
                    <GameHeader url={props.url} newInstance={props.newInstance} Favos={props.Favos} />
                    <div className="game-content">
                        <CountdownCircle seconds={seconds} firstSeconds={firstSeconds} />
                    </div>
                    <GameChat />
                    <GameBettingAction action={bettingAction} />
                    <GameFooterArea />
                    <GameBettingArea seconds={seconds} />
                    <GameFooterBG />
                </div>
            )}
        </div>
    );
};


const mapStateToProps = (state) => {
    // console.log('檢查state', state);
    // console.log('檢查state.favorites', state.root.favorites);
    return {
        ct: state.gameLobby.ct,
        ewinurl: state.gameLobby.ewinurl,
        guid: state.gameLobby.guid,
        isGameBaccarLoading: state.gameBaccar.isGameBaccarLoading,
        userBetlimitList: state.gameBaccar.userBetlimitList,
        roadMapNumber: state.gameBaccar.roadMapNumber
    };
};


const mapDispatchToProps = {
    actIsGameBaccarLoading,
    actUserBetlimitList
};


// const mapDispatchToProps = (dispatch) => ({
//     setSeconds,
//     setFirstSeconds
// });

export default connect(mapStateToProps, mapDispatchToProps)(GameView);