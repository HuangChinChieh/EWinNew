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
import { useLobbyContext } from 'provider/GameLobbyProvider';
import RoadMap from 'component/road_map';
import SimilarGames from 'component/similar_games';
import './index.scss';
import { use } from 'i18next';


const Section = (props) => {
    const[favo,setFavo]=useState([]);
    const {
        t,wallet,betLimitCurrencyType,CT,setShowMessage
    } = useLobbyContext();
    const EWinUrl = 'https://ewin.dev.mts.idv.tw';
    const listItems = props.listItems || [];
    const [hoveredItem, setHoveredItem] = useState(null);
    const [moreScale, setMoreScale] = useState('');

    const instance = EWinGameLobbyClient.getInstance(CT, EWinUrl);

    const history = useHistory();

    const handleClick = async (TableNumber) => {
        // await props.toggleFavorite(TableNumber);

        if (favo.includes(TableNumber)) {
            var index = favo.indexOf(TableNumber);
            const updatedFavos = favo.filter(num => num !== TableNumber);
            // props.showMessage(`移除收藏 ${TableNumber}`);
            setShowMessage(`移除收藏 ${TableNumber}`);
            setFavo(updatedFavos);
            console.log(showMessage);

            if (index > -1) {
                favo.splice(index, 1);
            }
        } else {
            var index = favo.indexOf(TableNumber);
            setFavo([...favo, TableNumber]);
            // props.showMessage(`新增收藏 ${TableNumber}`);
            setShowMessage(`新增收藏 ${TableNumber}`);
            console.log(showMessage);

            if (index == -1) {
                favo.push(TableNumber);
            }
        }


        if (instance !== null) {
            instance.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(favo), function (success, o) {
                if (success) {
                    console.log("SetUserAccountProperty", o);
                }
            });
        }


    };

    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale('');
    }



    useEffect(() => {
        if (instance !== null) {
            instance.GetUserAccountProperty("EWinGame.Favor", function (s, o) {
                if (s) {
                    if (o.ResultCode == 0) {
                        // setstrFavo(o.PropertyValue);
                        setFavo(JSON.parse(o.PropertyValue));
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


    const getGameName = (TableNumber) => () => {
        localStorage.setItem('gameTitle', TableNumber);
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
                        <span className={`${favo && favo.includes(i.TableNumber) ? 'has-favorites' : ''}`} />
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
                            <span>{betLimitCurrencyType}</span>
                            <span>
                                {props.userInfo && wallet && wallet.map((i, index) => (
                                    i.CurrencyType === betLimitCurrencyType ? <span className='without-mr' key={index}>{Math.floor(i.Balance)}</span> : ''
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
                                    <span>{betLimitCurrencyType}</span>
                                    <span>
                                        {props.userInfo && wallet && wallet.map((i, index) => (
                                            i.CurrencyType === betLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
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
        guid: state.gameLobby.guid,
        globalEWinGameLobbyClient: state.gameLobby.globalEWinGameLobbyClient,
        tiList: state.gameLobby.tiList,
        userInfo: state.gameLobby.userInfo,
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
    actRoadMapNumber
};

export default connect(mapStateToProps, mapDispatchToProps)(Section);
