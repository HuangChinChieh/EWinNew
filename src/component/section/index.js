import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';

import RoadMap from 'component/road_map';
import SimilarGames from 'component/similar_games';
import './index.scss';
import { FavorsContext } from 'provider/GameLobbyProvider';


const SectionLiFavor2 = (props) => {
    const { favors, updateFavors } = useContext(FavorsContext);
    const tableNumber = props.TableNumber;
debugger
    const handleClick = () => {
        const lobbyClient = EWinGameLobbyClient.getInstance();
        const index = favors.indexOf(tableNumber);
        console.log("favors",favors);
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

// 
    return (<span onClick={() => handleClick()} className={`${favors.includes(props.tableNumber) ? 'remove-to-favorites' : 'add-to-favorites'}`} />);
}

const SectionLiFavor1 = (props) => {
    const { favors } = useContext(FavorsContext);
  debugger
    return (<span className={`${favors.includes(props.tableNumber) ? 'has-favorites' : ''}`}/>);
}

const SectionLi = (props) => {
    const [moreScale, setMoreScale] = useState('');
    const [hoveredItem, setHoveredItem] = useState(null);
    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale('');
    }

    return (<li key={props.tableInfo.tableNumber}
        onMouseEnter={() => setHoveredItem(props.tableInfo.tableNumber)}
        onMouseLeave={mouseleave}
        className='li-box'
    >
        <SectionLiFavor1 tableNumber={props.tableInfo.tableNumber}/>
        <div className={`games ${props.tableInfo.tableNumber}`}>
            {/* 獲取ImageType為1的ImageUrl */}
            {props.tableInfo.ImageList && props.tableInfo.ImageList.find(image => image.ImageType === 1) && (
                <img src={props.tableInfo.ImageList.find(image => image.ImageType === 1).ImageUrl} alt="Table Image" />
            )}
            <RoadMap shoeResult={props.tableInfo.ShoeResult} />
        </div>
        <p className='game-title'>
            {props.tableInfo.tableNumber}
        </p>
        <p className='game-wallet'>
            <span>{"CNY(暫)"}</span>
            <span>
                {/* {wallet && wallet.map((i, index) => (
                    props.tableInfo.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{Math.floor(props.tableInfo.Balance)}</span> : ''
                ))} */}
            </span>
        </p>

        <div className={`hover-box ${hoveredItem === props.tableInfo.tableNumber ? 'visible' : ''} ${moreScale}`}>
            <span className='close-hover-box' onClick={() => { setHoveredItem(null) }}></span>
            <div className={`games ${props.tableInfo.tableNumber}`}>
                {/* 獲取ImageType為1的ImageUrl */}
                {props.tableInfo.ImageList && props.tableInfo.ImageList.find(image => image.ImageType === 1) && (
                    <img src={props.tableInfo.ImageList.find(image => image.ImageType === 1).ImageUrl} alt="Table Image" />
                )}
            </div>
            <div className='info-box'>
                <p className='game-title'>
                    {props.tableInfo.tableNumber}
                </p>
                <p className='game-wallet'>
                    <span>{"CNY(暫)"}</span>
                    <span>
                        {/* {wallet && wallet.map((i, index) => (
                            props.tableInfo.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{props.tableInfo.Balance}</span> : ''
                        ))} */}
                    </span>
                </p>
                <div className='game-start' >
                    <Link to={`/games/${props.tableInfo.tableNumber}`}>{"Global.start_games"}</Link>
                </div>
                <div className='game-table-wrap'>
                    <RoadMap shoeResult={props.tableInfo.ShoeResult} />
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
                    <SectionLiFavor2 tableNumber={props.tableInfo.tableNumber}></SectionLiFavor2>
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
                            Status:data.Status, 
                            ShoeResult:data.ShoeResult                           
                        };
                    });
console.log("tableList",array);
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