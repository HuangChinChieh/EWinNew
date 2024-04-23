import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import {
    toggleFavorite,
    showMessage,    
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


const SectionLiFavo2 = (props) => {
    const favos = useContext(useLobbyContext);


    const handleClick = async (TableNumber) => {
        // await props.toggleFavorite(TableNumber);

        // if (props.favo.includes(TableNumber)) {
        //     var index = props.favo.indexOf(TableNumber);
        //     const updatedFavos = props.favo.filter(num => num !== TableNumber);
        //     props.showMessage(`移除收藏 ${TableNumber}`);
        //     props.actFavo(updatedFavos);


        //     if (index > -1) {
        //         props.favo.splice(index, 1);
        //     }
        // } else {
        //     var index = props.favo.indexOf(TableNumber);
        //     props.actFavo([...props.favo, TableNumber]);
        //     props.showMessage(`新增收藏 ${TableNumber}`);
        //     if (index == -1) {
        //         props.favo.push(TableNumber);
        //     }
        // }


        // if (instance !== null) {
        //     instance.SetUserAccountProperty(props.ct, props.guid, "EWinGame.Favor", JSON.stringify(props.favo), function (success, o) {
        //         if (success) {
        //             console.log("SetUserAccountProperty", o);
        //         }
        //     });
        // }





        // console.log("Favos", props.favo);

        // props.showMessage();
    };


    return (<span onClick={() => handleClick(props.tableInfo.TableNumber)} className={`${props.favo && props.favo.includes(props.tableInfo.TableNumber) ? 'remove-to-favorites' : 'add-to-favorites'}`} />);
}

const SectionLiFavo1 = (props) => {
    const favos = useContext(useLobbyContext);
    return (<span className={`${favos.includes(props.TableNumber) ? 'has-favorites' : ''}`} />);
}

const Section_li = (props) => {
    const [moreScale, setMoreScale] = useState('');
    const [hoveredItem, setHoveredItem] = useState(null);
    const history = useHistory();
    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale('');
    }
    const getGameName = (TableNumber, TableTimeoutSecond) => () => {
        props.getGameTitle(TableNumber);
        localStorage.setItem('getLocalTableTitle', TableNumber);
        props.actRoadMapNumber(TableNumber);
        // console.log('TableTimeoutSecond', TableTimeoutSecond);
        // props.setSeconds(TableTimeoutSecond);
        // props.setFirstSeconds(TableTimeoutSecond);
    };

    return (<li key={props.tableInfo.TableNumber}
        onMouseEnter={() => setHoveredItem(props.tableInfo.TableNumber)}
        onMouseLeave={mouseleave}
        className='li-box'
    >
        <SectionLiFavo1 />
        <div className={`games ${props.tableInfo.TableNumber}`}>
            {/* 獲取ImageType為1的ImageUrl */}
            {props.tableInfo.ImageList && props.tableInfo.ImageList.find(image => image.ImageType === 1) && (
                <img src={props.tableInfo.ImageList.find(image => image.ImageType === 1).ImageUrl} alt="Table Image" />
            )}
            <RoadMap />
        </div>
        <p className='game-title'>
            {props.tableInfo.TableNumber}
        </p>
        <p className='game-wallet'>
            <span>{props.userInfo.BetLimitCurrencyType}</span>
            <span>
                {props.userInfo && props.userInfo.Wallet && props.userInfo.Wallet.map((i, index) => (
                    props.tableInfo.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{Math.floor(props.tableInfo.Balance)}</span> : ''
                ))}
            </span>
        </p>

        <div className={`hover-box ${hoveredItem === props.tableInfo.TableNumber ? 'visible' : ''} ${moreScale}`}>
            <span className='close-hover-box' onClick={() => { setHoveredItem(null) }}></span>
            <div className={`games ${props.tableInfo.TableNumber}`}>
                {/* 獲取ImageType為1的ImageUrl */}
                {props.tableInfo.ImageList && props.tableInfo.ImageList.find(image => image.ImageType === 1) && (
                    <img src={props.tableInfo.ImageList.find(image => image.ImageType === 1).ImageUrl} alt="Table Image" />
                )}
            </div>
            <div className='info-box'>
                <p className='game-title'>
                    {props.tableInfo.TableNumber}
                </p>
                <p className='game-wallet'>
                    <span>{props.userInfo.BetLimitCurrencyType}</span>
                    <span>
                        {props.userInfo && props.userInfo.Wallet && props.userInfo.Wallet.map((i, index) => (
                            props.tableInfo.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{props.tableInfo.Balance}</span> : ''
                        ))}
                    </span>
                </p>
                <div className='game-start' >
                    {/* <a href='/'> {props.tableInfo.TableTimeoutSecond} </a> */}
                    <Link to={`/games/${props.tableInfo.TableNumber}`} onClick={getGameName(props.tableInfo.TableNumber, props.tableInfo.TableTimeoutSecond)}>{"Global.start_games"}</Link>
                </div>
                <div className='game-table-wrap'>
                    <RoadMap />
                </div>
                <p className='game-dis'>
                    {props.tableInfo.Status}
                </p>

                {moreScale === 'more-scale'
                    ?
                    <div className='show-similar-games forpc'>
                        <p>Global.similar_ganes</p>
                        <SimilarGames />
                    </div>
                    : ''
                }

                <div className='show-similar-games formb'>
                    <p>Global.similar_ganes</p>
                    <SimilarGames />
                </div>
                <div className='favorites-box'>                                     
                    <SectionLiFavo2></SectionLiFavo2>
                </div>
            </div>
            <div className='more forpc' onClick={() => { setMoreScale('more-scale') }} />
        </div>
    </li>);
}


const Section = (props) => {
    const {
        t
    } = useLobbyContext();    

    const instance = EWinGameLobbyClient.getInstance(props.ct, props.ewinurl);



useEffect(() => {
        if (instance !== null) {
            instance.GetUserAccountProperty("EWinGame.Favor", function (s, o) {
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


    return (
        <div className="section_box">
            <ul>
                {props.tiList && props.tiList.TableInfoList && props.tiList.TableInfoList.map((i, index) => (
                    <Section_li />
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
    getGameTitle,
    setSeconds,
    setFirstSeconds,
    actFavo,
    actRoadMapNumber
};

export default connect(mapStateToProps, mapDispatchToProps)(Section);
