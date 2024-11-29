import React, { useState, useEffect, useContext } from 'react';
import Logo from 'component/logo';
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import { FavorsContext, WalletContext, UserInfoContext } from 'provider/GameLobbyProvider';
import FullscreenButton from 'component/buttons/fs_btn';
import MuteButton from 'component/buttons/mute_btn';
import SettingButton from 'component/buttons/setting_btn';
import BettingHistory from 'component/buttons/betting_history_btn';
import GoodTrendNotice from 'component/buttons/good_trend_notice_btn';
import GameSetListButton from 'component/buttons/gameSetList_btn';
import GameBetLimitsButton from 'games_component/game_buttons/game_betLimits_btn';
import { useHistory } from 'react-router-dom';
import GameIntro from "component/alertPop/popExample/gameIntro";
import Tooltip from "component/tooltip";
import './index.scss';

const GameHeader = (props) => {
    const { tableNumber, useBetLimit, currencyType, gameSetID, baccaratType, setBetLimitBySel } = props;
    const { userInfo } = useContext(UserInfoContext);
    const [isShowGameIntro, setIsShowGameIntro] = useState(false);    
    const [isOpen, setIsOpen] = useState(false);
    const { favors, updateFavors } = useContext(FavorsContext);


    const toggleHamburger = () => {
        setIsOpen(!isOpen);
    };
    const history = useHistory();

    const handleAddFavor = () => {
        debugger;
        const lobbyClient = EWinGameLobbyClient.getInstance();
        const index = favors.indexOf(tableNumber);
        const tempFavors = [...favors];

        //觸發收藏or取消收藏     
        if (index === -1) {
            //沒找到，新增收藏
            tempFavors.push(tableNumber);
            lobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(tempFavors), (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        updateFavors();
                    }
                }
            });
        } else {
            //有找到，移除收藏
            tempFavors.splice(index, 1);
            lobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(tempFavors), (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        updateFavors();
                    }
                }
            });
        }

    };


    return (
        <div className='game-aniHeader'>
            <div className="header-box">
               
                <div className='nav-box'>
                    {/* 之後傳接api再處理判斷, 有可能不再這邊做登入處理 在父層登入 */}
                    <div className='tool-box-left'>
                        <span className='user-icon'>
                            <span className='tool-icon' />{(userInfo.RealName != null && userInfo.RealName !== '') ? userInfo.RealName : userInfo.LoginAccount}
                            <Tooltip text={"用戶名稱"}></Tooltip>
                        </span>
                        <span className='user-instruction can-click'>
                            <GameIntro isShow={isShowGameIntro} handleOK={() => { setIsShowGameIntro(false); }}></GameIntro>
                            <span className='tool-icon' onClick={() => { setIsShowGameIntro(true); }}>
                                <Tooltip text={"玩法說明"}></Tooltip>
                            </span>
                        </span>
                        <span className={favors.includes(tableNumber) ? "user-favorite liked can-click" : "user-favorite can-click"} >
                            <span className='tool-icon' onClick={() => { handleAddFavor(); }}>
                                <Tooltip text={favors.includes(tableNumber) ? "取消收藏" : "收藏"}></Tooltip>
                            </span>
                        </span>
                        <GameSetListButton></GameSetListButton>
                        <GameBetLimitsButton baccaratType={baccaratType} tableNumber={tableNumber} currencyType={currencyType} gameSetID={gameSetID} useBetLimit={useBetLimit} setBetLimitBySel={setBetLimitBySel}></GameBetLimitsButton>
                    </div>
                </div>
               
                <div className="toolbar">
                    <FullscreenButton />
                    <MuteButton />
                   <BettingHistory />
                    <GoodTrendNotice />
                    <SettingButton />
                </div>
            </div>
            {isOpen &&
                <div>
                    <div className={`lightbox-box ${isOpen ? 'open' : ''}`} onClick={toggleHamburger} />
                    <div className='mb-footer-box'>
                        <h4>選單</h4>
                        <FullscreenButton />
                        <SettingButton />
                        <span className='close' onClick={() => setIsOpen(false)} />
                    </div>
                </div>
            }
        </div>
    );
};




export default GameHeader;
