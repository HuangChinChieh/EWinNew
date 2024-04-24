import { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
 import {
     toggleFavorite,
     showMessage,
     toggleMute,
     getGameTitle
 } from 'store/actions';
 import {
     actFavo
 } from 'store/gamelobbyActions';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import RoadMap from 'component/road_map';
import SimilarGames from 'component/similar_games';
import Loading from 'component/loading';
import './index.scss';
import { TipContext } from 'component/tips'; 

function Gamefavorite(props) {
    const { t } = useLobbyContext();
    const instance = EWinGameLobbyClient.getInstance(props.ct, props.ewinurl);
    const { showTip } = useContext(TipContext);

    const [hoveredItem, setHoveredItem] = useState(null);
    const [moreScale, setMoreScale] = useState('');

    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale('');
    }

    const getGameName = (TableNumber, TableTimeoutSecond) => () => {
        props.getGameTitle(TableNumber);
        localStorage.setItem('getLocalTableTitle', TableNumber);
    };


    const handleClick = async (TableNumber) => {
        showTip("test");

        //let newFavo = [...props.favo];
        //const index = newFavo.indexOf(TableNumber);
        //if (index !== -1) {
        //    newFavo.splice(index, 1);
        //    props.actFavo(newFavo);
        //    props.showMessage(`移除收藏 ${TableNumber}`);
        //    if (instance !== null) {
        //        instance.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(newFavo), function (success, o) {
        //            if (success) {
        //                // console.log("SetUserAccountProperty", o);
        //            }
        //        });
        //    }
        //}

    };



    return (
        <div className='favorite_box'>
            <div className="section_box" style={{ width: '100%' }}>
                {props.isGameLobbyLoading ? (<Loading />) : (
                    <div>
                        {props.favo && props.favo.length === 0 ? (
                            <div className='without_favorite'>
                                <h2>{t("Global.without_favorite")}</h2>
                            </div>
                        ) : (
                            <ul>
                                {props.tiList && props.tiList.TableInfoList && props.tiList.TableInfoList.map((i, index) => {
                                    if (props.favo && props.favo.includes(i.TableNumber)) {
                                        return (
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
                                                             <span onClick={() => toggleMute(i.TableNumber)} className={`video-control ${props.mutes.includes(i.TableNumber) ? 'video-unmute' : 'video-mute'}`} /> 
                                                            <span onClick={() => handleClick(i.TableNumber)} className={props.favo && props.favo.includes(i.TableNumber) ? 'remove-to-favorites' : 'add-to-favorites'} />

                                                        </div>
                                                    </div>
                                                    <div className='more forpc' onClick={() => { setMoreScale('more-scale') }} />
                                                </div>
                                            </li>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}

                            </ul>
                        )}
                    </div>
                )}

            </div>
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        favorites: state.root.favorites || [],
        mutes: state.root.mutes || [],
        message: state.root.message,
        ct: state.gameLobby.ct,
        guid: state.gameLobby.guid,
        echo: state.gameLobby.echo,
        ewinurl: state.gameLobby.ewinurl,
        isGameLobbyLoading: state.gameLobby.isGameLobbyLoading,
        tiList: state.gameLobby.tiList,
        userInfo: state.gameLobby.userInfo,
        favo: state.gameLobby.favo
    };
};

const mapDispatchToProps = {
    toggleFavorite,
    showMessage,
    toggleMute,
    getGameTitle,
    actFavo
};

export default connect(mapStateToProps, mapDispatchToProps)(Gamefavorite);