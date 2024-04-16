import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import {
    toggleFavorite,
    showMessage,
    toggleMute,
    getGameTitle,
    setSeconds,
    setFirstSeconds
} from 'store/actions';
import {
    actRoadMapNumber
} from 'store/gameBaccarActions';
import { actFavo } from 'store/gamelobbyActions';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import RoadMap from 'component/road_map';
import SimilarGames from 'component/similar_games';
import './index.scss';


const Section = (props) => {
    const {
        t
    } = useLobbyContext();
    const listItems = props.listItems || [];
    const [hoveredItem, setHoveredItem] = useState(null);
    const [moreScale, setMoreScale] = useState('');

    const instance = EWinGameLobbyClient.getInstance(props.ct, props.ewinurl);

    const history = useHistory();

    const handleClick = async (TableNumber) => {
        // await props.toggleFavorite(TableNumber);

        if (props.favo.includes(TableNumber)) {
            var index = props.favo.indexOf(TableNumber);
            const updatedFavos = props.favo.filter(num => num !== TableNumber);
            props.showMessage(`移除收藏 ${TableNumber}`);
            props.actFavo(updatedFavos);


            if (index > -1) {
                props.favo.splice(index, 1);
            }
        } else {
            var index = props.favo.indexOf(TableNumber);
            props.actFavo([...props.favo, TableNumber]);
            props.showMessage(`新增收藏 ${TableNumber}`);
            if (index == -1) {
                props.favo.push(TableNumber);
            }
        }


        if (instance !== null) {
            instance.SetUserAccountProperty(props.ct, props.guid, "EWinGame.Favor", JSON.stringify(props.favo), function (success, o) {
                if (success) {
                    console.log("SetUserAccountProperty", o);
                }
            });
        }





        // console.log("Favos", props.favo);

        // props.showMessage();
    };

    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale('');
    }



    useEffect(() => {
        if (instance !== null) {
            instance.GetUserAccountProperty(props.ct, props.guid, "EWinGame.Favor", function (s, o) {
                if (s) {
                    if (o.ResultCode == 0) {
                        // setstrFavo(o.PropertyValue);
                        props.actFavo(JSON.parse(o.PropertyValue));
                        // props.toggleFavorite(JSON.parse(o.PropertyValue));
                    } else {
                        //系統錯誤處理
                        console.log('GetUserAccountProperty: 系統錯誤處理');
                    }
                } else {
                    //傳輸等例外問題處理
                    console.log('GetUserAccountProperty: 傳輸等例外問題處理');
                }
            });
            // eWinGameLobbyClient.handleConnected(() => {
            // })
        }
    }, []);



    const toggleMute = async (TableNumber) => {
        await props.toggleMute(TableNumber);
        // props.showMuteMessage();
    };


    const getGameName = (TableNumber, TableTimeoutSecond) => () => {
        props.getGameTitle(TableNumber);
        localStorage.setItem('getLocalTableTitle', TableNumber);
        props.actRoadMapNumber(TableNumber);
        // console.log('TableTimeoutSecond', TableTimeoutSecond);
        // props.setSeconds(TableTimeoutSecond);
        // props.setFirstSeconds(TableTimeoutSecond);
    };

    return (
        <div className="section_box">
            <ul>
                {props.tiList && props.tiList.TableInfoList && props.tiList.TableInfoList.map((i, index) => (
                    <li key={index}
                        onMouseEnter={() => setHoveredItem(i.TableNumber)}
                        onMouseLeave={mouseleave}
                        className='li-box'
                    >
                        <span className={`${props.favo && props.favo.includes(i.TableNumber) ? 'has-favorites' : ''}`} />
                        <div className={`games ${i.TableNumber}`}>
                            {/* 獲取ImageType為1的ImageUrl */}
                            {i.ImageList && i.ImageList.find(image => image.ImageType === 1) && (
                                <img src={i.ImageList.find(image => image.ImageType === 1).ImageUrl} alt="Table Image" />
                            )}
                            <RoadMap />
                        </div>
                        <p className='game-title'>
                            {i.TableNumber}
                        </p>
                        <p className='game-wallet'>
                            <span>{props.userInfo.BetLimitCurrencyType}</span>
                            <span>
                                {props.userInfo && props.userInfo.Wallet && props.userInfo.Wallet.map((i, index) => (
                                    i.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{Math.floor(i.Balance)}</span> : ''
                                ))}
                            </span>
                        </p>

                        <div className={`hover-box ${hoveredItem === i.TableNumber ? 'visible' : ''} ${moreScale}`}>
                            <span className='close-hover-box' onClick={() => { setHoveredItem(null) }}></span>
                            <div className={`games ${i.TableNumber}`}>
                                {/* 獲取ImageType為1的ImageUrl */}
                                {i.ImageList && i.ImageList.find(image => image.ImageType === 1) && (
                                    <img src={i.ImageList.find(image => image.ImageType === 1).ImageUrl} alt="Table Image" />
                                )}
                            </div>
                            <div className='info-box'>
                                <p className='game-title'>
                                    {i.TableNumber}
                                </p>
                                <p className='game-wallet'>
                                    <span>{props.userInfo.BetLimitCurrencyType}</span>
                                    <span>
                                        {props.userInfo && props.userInfo.Wallet && props.userInfo.Wallet.map((i, index) => (
                                            i.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                                        ))}
                                    </span>
                                </p>
                                <div className='game-start' >
                                    {/* <a href='/'> {i.TableTimeoutSecond} </a> */}
                                    <Link to={`/games/${i.TableNumber}`} onClick={getGameName(i.TableNumber, i.TableTimeoutSecond)}>{t("Global.start_games")}</Link>
                                </div>
                                <div className='game-table-wrap'>
                                    <RoadMap />
                                </div>
                                <p className='game-dis'>
                                    {i.Status}
                                </p>

                                {moreScale === 'more-scale'
                                    ?
                                    <div className='show-similar-games forpc'>
                                        <p>{t("Global.similar_ganes")}</p>
                                        <SimilarGames />
                                    </div>
                                    : ''
                                }

                                <div className='show-similar-games formb'>
                                    <p>{t("Global.similar_ganes")}</p>
                                    <SimilarGames />
                                </div>
                                <div className='favorites-box'>
                                    {/* <span onClick={() => toggleMute(i.TableNumber)} className={`video-control ${props.mutes.includes(i.TableNumber) ? 'video-unmute' : 'video-mute'}`} /> */}
                                    <span onClick={() => handleClick(i.TableNumber)} className={`${props.favo && props.favo.includes(i.TableNumber) ? 'remove-to-favorites' : 'add-to-favorites'}`} />

                                </div>
                            </div>
                            <div className='more forpc' onClick={() => { setMoreScale('more-scale') }} />
                        </div>
                    </li>
                ))}
                {/* hardcode使用 */}
                {/* {listItems.map((item, k) => (
                    <li key={k}
                        onMouseEnter={() => setHoveredItem(item.gameid)}
                        onMouseLeave={mouseleave}
                        className='li-box'>
                        {item.ishot === '0' &&
                            <span className='ishot'></span>
                        }
                        <span className={`${props.favorites.includes(item.gameid) ? 'has-favorites' : ''}`} />
                        <div className={`games ${item.gameid}`}>
                            <img src={require(`../../img/gamelobby/${item.gameid}.png`)} alt={item.gameid} />
                            <RoadMap />
                        </div>
                        <p className='game-title'>
                            {item.gametitle}
                        </p>
                        <p className='game-wallet'>
                            <span>{item.walletstate}</span>
                            <span>{item.wallet}</span>
                        </p>

                        <div className={`hover-box ${hoveredItem === item.gameid ? 'visible' : ''} ${moreScale}`}>
                            <span className='close-hover-box' onClick={() => { setHoveredItem(null) }}></span>
                            <div className={`games ${item.gameid}`}>
                                <img src={require(`../../img/gamelobby/${item.gameid}.png`)} alt={item.gameid} />
                            </div>
                            <div className='info-box'>
                                <p className='game-title'>
                                    {item.gametitle}
                                </p>
                                <p className='game-wallet'>
                                    <span>{item.walletstate}</span>
                                    <span>{item.wallet}</span>
                                </p>
                                <div className='game-start' >
                                    <Link to={`/games/${item.gameid}`} onClick={getGameName(item.gametitle)}>{t("Global.start_games")}</Link>
                                </div>
                                <div className='game-table-wrap'>
                                    <RoadMap />
                                </div>
                                <p className='game-dis'>
                                    {item.dis}
                                </p>

                                {moreScale === 'more-scale'
                                    ?
                                    <div className='show-similar-games forpc'>
                                        <p>{t("Global.similar_ganes")}</p>
                                        <SimilarGames />
                                    </div>
                                    : ''
                                }

                                <div className='show-similar-games formb'>
                                    <p>{t("Global.similar_ganes")}</p>
                                    <SimilarGames />
                                </div>

                                <div className='favorites-box'>
                                    <span onClick={() => toggleMute(item.gameid)} className={`video-control ${props.mutes.includes(item.gameid) ? 'video-unmute' : 'video-mute'}`} />
                                    <span onClick={() => handleClick(item.gameid)} className={props.favorites.includes(item.gameid) ? 'remove-to-favorites' : 'add-to-favorites'} />

                                </div>
                            </div>
                            <div className='more forpc' onClick={() => { setMoreScale('more-scale') }} />
                        </div>
                    </li>
                ))} */}
            </ul>
        </div>
    );
};

const mapStateToProps = (state) => {
    // console.log('檢查state', state);
    // console.log('檢查state.favorites', state.root.favorites);
    return {
        favorites: state.root.favorites || [],
        mutes: state.root.mutes || [],
        seconds: state.root.seconds,
        firstSeconds: state.root.firstSeconds,
        message: state.root.message,
        ct: state.gameLobby.ct,
        guid: state.gameLobby.guid,
        globalEWinGameLobbyClient: state.gameLobby.globalEWinGameLobbyClient,
        tiList: state.gameLobby.tiList,
        userInfo: state.gameLobby.userInfo,
        favo: state.gameLobby.favo,
        roadMapNumber: state.gameBaccar.roadMapNumber
    };
};

const mapDispatchToProps = {
    toggleFavorite,
    showMessage,
    toggleMute,
    getGameTitle,
    setSeconds,
    setFirstSeconds,
    actFavo,
    actRoadMapNumber
};

export default connect(mapStateToProps, mapDispatchToProps)(Section);
