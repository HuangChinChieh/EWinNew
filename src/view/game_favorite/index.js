import { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import {
    toggleFavorite,
    showMessage,
    toggleMute,
    getGameTitle
} from 'store/actions';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import RoadMap from 'component/road_map';
import SimilarGames from 'component/similar_games';
import Loading from 'component/loading';
import './index.scss';

function Gamefavorite(props) {
    const { t, isLoading, userInfo, tiList, newInstance, Favos, CT, GUID } = useLobbyContext();

    const [hoveredItem, setHoveredItem] = useState(null);
    const [moreScale, setMoreScale] = useState('');

    const [shoeResults, setShoeResults] = useState('');

    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale('');
    }

    const getGameName = (TableNumber, TableTimeoutSecond) => () => {
        props.getGameTitle(TableNumber);
        localStorage.setItem('getLocalTableTitle', TableNumber);
    };

    const handleClick = async (TableNumber) => {

        if (Favos.includes(TableNumber)) {
            var index = Favos.indexOf(TableNumber);
            props.showMessage(`移除收藏 ${TableNumber}`);


            if (index > -1) {
                Favos.splice(index, 1);
            }
        }

        newInstance.SetUserAccountProperty(CT, GUID, "EWinGame.Favor", JSON.stringify(Favos), function (success, o) {
            if (success) {
                // console.log("SetUserAccountProperty", o);
            }
        });

    };

    return (
        <div className='favorite_box'>
            <div className="section_box" style={{ width: '100%' }}>
                {isLoading ? (<Loading />) : (
                    <div>
                        {Favos.length === 0 ? (
                            <div className='without_favorite'>
                                <h2>{t("Global.without_favorite")}</h2>
                            </div>
                        ) : (
                            <ul>
                                {tiList && tiList.TableInfoList && tiList.TableInfoList.map((i, index) => {
                                    if (Favos.includes(i.TableNumber)) {
                                        return (
                                            <li key={index}
                                                onMouseEnter={() => setHoveredItem(i.TableNumber)}
                                                onMouseLeave={mouseleave}
                                                className='li-box'
                                            >
                                                <span className={`${Favos.includes(i.TableNumber) ? 'has-favorites' : ''}`} />
                                                <div className={`games ${i.TableNumber}`}>
                                                    {/* 獲取ImageType為1的ImageUrl */}
                                                    {i.ImageList && i.ImageList.find(image => image.ImageType === 1) && (
                                                        <img src={i.ImageList.find(image => image.ImageType === 1).ImageUrl} alt="Table Image" />
                                                    )}
                                                    <RoadMap shoeResults={shoeResults} />
                                                </div>
                                                <p className='game-title'>
                                                    {i.TableNumber}
                                                </p>
                                                <p className='game-wallet'>
                                                    <span>{userInfo.BetLimitCurrencyType}</span>
                                                    <span>
                                                        {userInfo && userInfo.Wallet && userInfo.Wallet.map((i, index) => (
                                                            i.CurrencyType === userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{Math.floor(i.Balance)}</span> : ''
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
                                                            <span>{userInfo.BetLimitCurrencyType}</span>
                                                            <span>
                                                                {userInfo && userInfo.Wallet && userInfo.Wallet.map((i, index) => (
                                                                    i.CurrencyType === userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                                                                ))}
                                                            </span>
                                                        </p>
                                                        <div className='game-start' >
                                                            <Link to={`/games/${i.TableNumber}`} onClick={getGameName(i.TableNumber, i.TableTimeoutSecond)}>{t("Global.start_games")}</Link>
                                                        </div>
                                                        <div className='game-table-wrap'>
                                                            <RoadMap shoeResults={shoeResults} />
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
                                                            <span onClick={() => handleClick(i.TableNumber)} className={Favos.includes(i.TableNumber) ? 'remove-to-favorites' : 'add-to-favorites'} />

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
        message: state.root.message
    };
};

const mapDispatchToProps = {
    toggleFavorite,
    showMessage,
    toggleMute,
    getGameTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Gamefavorite);