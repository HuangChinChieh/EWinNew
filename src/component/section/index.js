import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';

import RoadMap from 'component/road_map';
import './index.scss';
import { FavorsContext,LobbyPersonalContext } from 'provider/GameLobbyProvider';


const SectionLiFavor2 = (props) => {
    const { favors, updateFavors } = useContext(FavorsContext);

    const tableNumber = props.tableNumber;

    const handleClick = () => {
        const lobbyClient = EWinGameLobbyClient.getInstance();
        const index = favors.indexOf(tableNumber);
        
        //觸發收藏or取消收藏     
        if (index === -1) {
            //沒找到，新增收藏
            favors.push(tableNumber);
            lobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(favors), (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        updateFavors();
                    }
                }
            });
        } else {
            //有找到，移除收藏
            favors.splice(index, 1);
            lobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(favors), (success, o) => {
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
    return (<span className={`${favors.includes(props.tableNumber) ? 'has-favorites' : ''}`}/>);
}

const SectionLi = (props) => {
    const [moreScale, setMoreScale] = useState('');
    const [hoveredItem, setHoveredItem] = useState(null);
    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale('');
    }

    return (<li key={props.tableInfo.TableNumber}
        onMouseEnter={() => setHoveredItem(props.tableInfo.TableNumber)}
        onMouseLeave={mouseleave}
        className='li-box'
    >
        <SectionLiFavor1 tableNumber={props.tableInfo.TableNumber}/>
        <div className={`games`}>
            {props.tableInfo.Image && (<img src={props.tableInfo.Image.ImageUrl} alt="Table Image" />)}
            <RoadMap shoeResult={props.tableInfo.ShoeResult} roaMapType={0} />
        </div>
        <p className='game-title'>
            {props.tableInfo.TableNumber}
        </p>
        <p className='game-wallet'>
            <span>{"CNY(暫)"}</span>
            <span>
                {/* {wallet && wallet.map((i, index) => (
                    props.tableInfo.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{Math.floor(props.tableInfo.Balance)}</span> : ''
                ))} */}
            </span>
        </p>

        <div className={`hover-box ${hoveredItem === props.tableInfo.TableNumber ? 'visible' : ''} ${moreScale}`}>
            <span className='close-hover-box' onClick={() => { setHoveredItem(null) }}></span>
            <div className={`games`}>
                {props.tableInfo.Image && (<img src={props.tableInfo.Image.ImageUrl} alt="Table Image" />)}
            </div>
            <div className='info-box'>
                <p className='game-title'>
                    {props.tableInfo.TableNumber}
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
                    <Link to={`/games/${props.tableInfo.TableNumber}`}>{"開始遊戲"}</Link>
                </div>
                <div className='game-table-wrap'>
                    <RoadMap shoeResult={props.tableInfo.ShoeResult} roaMapType={1} />
                </div>
                <p className='game-dis'>
                    {/* {props.tableInfo.Status} */}
                </p>
                
                {/* 相似遊戲相關
                {moreScale === 'more-scale'
                    ?
                    <div className='show-similar-games forpc'>
                        <p>Global.similar_ganes</p>
                        <SimilarGames />
                    </div>
                    : ''
                } */}

                <div className='favorites-box'>
                    <SectionLiFavor2 tableNumber={props.tableInfo.TableNumber}></SectionLiFavor2>
                </div>
            </div>
            {/* 相似遊戲相關
            <div className='more forpc' onClick={() => { setMoreScale('more-scale') }} /> */}
        </div>
    </li>);
}


const Section = (props) => {
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const [tableList, setTableList] = useState([]);
    const { favors } = useContext(FavorsContext);
    const { lobbyPersonal } = useContext(LobbyPersonalContext);


    useEffect(()=>{
        refreshTableList()
    },[lobbyPersonal])

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

                    // 根據是否開啟個人化來排序
                    if(lobbyPersonal){
                            array.sort((a, b) => {
                                 //判斷是否為收藏
                                const isAFavorited = favors.includes(a.TableNumber);
                                const isBFavorited = favors.includes(b.TableNumber);
        
                                if (isAFavorited && !isBFavorited) {
                                    //返回 -1：表示 a 應該排在 b 之前
                                    return -1;
                                } else if (!isAFavorited && isBFavorited) {
                                    //返回 1：表示 b 應該排在 a 之前。
                                    return 1;
                                } else {
                                    //返回 0：表示保持原始順序，即 a 和 b 的相對位置不變。
                                    return 0;
                                }
                            });
                    }

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