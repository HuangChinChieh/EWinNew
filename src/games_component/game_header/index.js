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
import ChannelLineButton from 'games_component/game_buttons/game_channels_btn';
import GameBetLimitsButton from 'games_component/game_buttons/game_betLimits_btn';
import GameMultiButton from 'games_component/game_buttons/game_multiGame_btn';
import { useHistory } from 'react-router-dom';
import GameIntro from "component/alertPop/popExample/gameIntro";
// import Tooltip from "component/tooltip";
import './index.scss';
import { ToolTipContext } from "provider/tooltipProvider";

const GameHeader = (props) => {
    const { tableNumber, roundInfo, useBetLimit, currencyType, gameSetID, baccaratType, setBetLimitBySel } = props;
    const { userInfo } = useContext(UserInfoContext);
    const [isShowGameIntro, setIsShowGameIntro] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { favors, updateFavors } = useContext(FavorsContext);
    const { showTooltip, hideTooltip } = useContext(ToolTipContext);

    const toggleHamburger = () => {
        setIsOpen(!isOpen);
    };
    const history = useHistory();

    const handleAddFavor = () => {
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
                    {/*<div className='tool-back' onMouseEnter={(event) => { showTooltip(event.currentTarget, "返回大廳") }} onMouseLeave={() => { hideTooltip() }} onClick={() => { history.replace("");}} >*/}
                    {/*    */}{/* <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000">*/}{/*
                    */}{/*            <g id="SVGRepo_iconCarrier">*/}{/*
                    */}{/*                <path fillRule="evenodd" d="M4.297105,3.29289 L0.59,7 L4.297105,10.7071 C4.687635,11.0976 5.320795,11.0976 5.711315,10.7071 C6.101845,10.3166 6.101845,9.68342 5.711315,9.29289 L4.418425,8 L11.504215,8 C12.332615,8 13.004215,8.67157 13.004215,9.5 C13.004215,10.3284 12.332615,11 11.504215,11 L10.004215,11 C9.451935,11 9.004215,11.4477 9.004215,12 C9.004215,12.5523 9.451935,13 10.004215,13 L11.504215,13 C13.437215,13 15.004215,11.433 15.004215,9.5 C15.004215,7.567 13.437215,6 11.504215,6 L4.418425,6 L5.711315,4.70711 C6.101845,4.31658 6.101845,3.68342 5.711315,3.29289 C5.320795,2.90237 4.687635,2.90237 4.297105,3.29289 Z"></path>*/}{/*
                    */}{/*            </g>*/}{/*
                    */}{/*        </svg> */}
                    {/*    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="26" viewBox="0 0 15 26" fill="none">*/}
                    {/*        <path d="M0.543903 11.6888C-0.181301 12.414 -0.181301 13.5918 0.543903 14.317L11.683 25.4561C12.4082 26.1813 13.586 26.1813 14.3112 25.4561C15.0364 24.7309 15.0364 23.5532 14.3112 22.828L4.48321 13L14.3054 3.17204C15.0306 2.44684 15.0306 1.26911 14.3054 0.543903C13.5802 -0.181301 12.4024 -0.181301 11.6772 0.543903L0.538101 11.683L0.543903 11.6888Z" fill="white" />*/}
                    {/*    </svg>*/}
                    {/*</div>*/}
                    <div className='tool-tableInfo'>
                        <span className='user-tableName'>{tableNumber}</span>
                        <span className='user-roundInfo'>{`-${roundInfo}`}</span>
                    </div>
                    <div className='tool-box-left'>

                        {props.children}
                        <span className='user-icon' onMouseEnter={(event) => { showTooltip(event.currentTarget, "用戶名稱") }} onMouseLeave={() => { hideTooltip() }}>
                            <span className='tool-icon' />{(userInfo.RealName != null && userInfo.RealName !== '') ? userInfo.RealName : userInfo.LoginAccount}
                            
                        </span>
                        <span className='user-instruction can-click'>
                            <GameIntro isShow={isShowGameIntro} handleOK={() => { setIsShowGameIntro(false); }}></GameIntro>
                            <span className='tool-icon' onClick={() => { setIsShowGameIntro(true); }} onMouseEnter={(event) => { showTooltip(event.currentTarget, "玩法說明") }} onMouseLeave={() => { hideTooltip() }}>
                              
                            </span>
                        </span>
                        <span className={favors.includes(tableNumber) ? "user-favorite liked can-click" : "user-favorite can-click"} >
                            <span className='tool-icon' onClick={() => { handleAddFavor(); }} onMouseEnter={(event) => { showTooltip(event.currentTarget, favors.includes(tableNumber) ? "取消收藏" : "收藏") }} onMouseLeave={() => { hideTooltip() }}>
                              
                            </span>
                        </span>
                        <GameBetLimitsButton baccaratType={baccaratType} tableNumber={tableNumber} currencyType={currencyType} gameSetID={gameSetID} useBetLimit={useBetLimit} setBetLimitBySel={setBetLimitBySel}></GameBetLimitsButton>
                        <GameSetListButton></GameSetListButton>
                    </div>
                </div>

                <div className="toolbar">
                    <GameMultiButton />
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
