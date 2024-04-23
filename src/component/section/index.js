import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';

import { useLobbyContext } from 'provider/GameLobbyProvider';
import RoadMap from 'component/road_map';
import SimilarGames from 'component/similar_games';
import './index.scss';


const SectionLiFavor2 = (props) => {
    const { favors, updateFavors } = useContext(useLobbyContext);
    const tableNumber = props.TableNumber;

    const handleClick = () => {
        const lobbyClient = EWinGameLobbyClient.getInstance();
        const index = favors.indexOf(tableNumber);
        //觸發收藏or取消收藏     
        if (index === -1) {
            //沒找到，新增收藏
            lobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(favors.push(tableNumber)), (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        updateFavors();
                    }
                }
            });
        } else {
            //有找到，移除收藏
            lobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(favors.splice(index, 1)), (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        updateFavors();
                    }
                }
            });
        }
    };


    return (<span onClick={() => handleClick()} className={`${favors.includes(props.tableNumber) ? 'remove-to-favorites' : 'add-to-favorites'}`} />);
}

const SectionLiFavor1 = (props) => {
    const { favors } = useContext(useLobbyContext);
    return (<span className={`${favors.includes(props.tableNumber) ? 'has-favorites' : ''}`} />);
}

const SectionLi = (props) => {
    const [moreScale, setMoreScale] = useState('');
    const [hoveredItem, setHoveredItem] = useState(null);
    const { userInfo } = useContext(useLobbyContext);
    const { wallet } = useContext(useLobbyContext);
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
        <SectionLiFavor1 />
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
                        <SimilarGames tableNumber={props.tableInfo.TableNumber} />
                    </div>
                    : ''
                }

                <div className='show-similar-games formb'>
                    <p>Global.similar_ganes</p>
                    <SimilarGames />
                </div>
                <div className='favorites-box'>
                    <SectionLiFavor2 tableNumber={props.tableInfo.TableNumber}></SectionLiFavor2>
                </div>
            </div>
            <div className='more forpc' onClick={() => { setMoreScale('more-scale') }} />
        </div>
    </li>);
}


const Section = (props) => {
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const [tableList, setTableList] = useState([]);
    const refreshTableList = () => {
        lobbyClient.GetTableInfoList("", 0, (success, o) => {
            if (success) {
                if (o.ResultCode === 0) {
                    let array = o.TableInfoList.map((data) => {
                        return {
                            TableNumber:data.TableNumber,
                            Image:data.ImageList.find(image => image.ImageType === 1),
                            CurrencyType:data.CurrencyType,
                            Status:data.Status                            
                        };
                    });

                    setTableList(array);
                }
            }
        });
    };

    useEffect(() => {
        refreshTableList();
    }, []);




    return (
        <div className="section_box">
            <ul>
                {tableList.map((data) => (
                    <SectionLi key={data.TableNumber} tableInfo={data} />
                ))}
            </ul>
        </div>
    );
};



export default (Section);
