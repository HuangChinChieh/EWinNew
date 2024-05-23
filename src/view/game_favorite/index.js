import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./index.scss";
import RoadMap from "component/road_map";
import { TipContext } from "component/tips";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import { FavorsContext } from "provider/GameLobbyProvider";

const GamefavoriteLi = (props) => {
    const { showTip } = useContext(TipContext);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [moreScale, setMoreScale] = useState("");
    const lobbyClient = EWinGameLobbyClient.getInstance();


    const mouseleave = () => {
        setHoveredItem(null);
        setMoreScale("");
    };

    const handleClick = (TableNumber) => {
        //const newFavors = [...props.favors];
        const index = props.favors.indexOf(TableNumber);
        if (index !== -1) {
            props.favors.splice(index, 1);
            showTip(`移除收藏 ${TableNumber}`);
            if (lobbyClient !== null) {
                lobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(props.favors), function (success, o) {
                    if (success) {
                        // console.log("SetUserAccountProperty", o);
                        props.setFavors();
                    }
                });
            }
        }
    };

    return (
        <div className="favorite_box">
            <div>
                {props.favors.length === 0 ? (
                    <div className="without_favorite">
                        <h2>{"Global.without_favorite"}</h2>
                    </div>
                ) : (
                    <ul>
                        <li
                            key={props.tableInfo.TableNumber}
                            onMouseEnter={() => setHoveredItem(props.tableInfo.TableNumber)}
                            onMouseLeave={mouseleave}
                            className="li-box"
                            style={{ width: "100%" }}
                        >
                            <span className="has-favorites" />
                            <div className={`games`}>
                                    {props.tableInfo.Image
                                        ? <img src={props.tableInfo.Image.ImageUrl} alt="Table Image" />
                                        : <img src="http://bm.dev.mts.idv.tw/images/JINBEI1.png" alt="Default Table Image" />
                                    }
                                <RoadMap
                                    shoeResult={props.tableInfo.ShoeResult}
                                    roaMapType={0}
                                />
                            </div>
                            <p className="game-title">{props.tableInfo.TableNumber}</p>
                            <p className="game-wallet">
                                <span>{/* {props.userInfo.BetLimitCurrencyType} */}</span>
                                <span>
                                    {/* {walletArray.map((i, index) => (
                                // i.CurrencyType === props.userInfo.BetLimitCurrencyType ? 
                                <span className='without-mr' key={index}>{Math.floor(i.Balance)}</span>
                                //  : ''
                            ))} */}
                                </span>
                            </p>

                            <div
                                className={`hover-box ${hoveredItem === props.tableInfo.TableNumber ? "visible" : ""
                                    } ${moreScale}`}
                            >
                                <span
                                    className="close-hover-box"
                                    onClick={() => {
                                        setHoveredItem(null);
                                    }}
                                ></span>
                                <div className={`games ${props.tableInfo.TableNumber}`}>
                                        {props.tableInfo.Image
                                            ? <img src={props.tableInfo.Image.ImageUrl} alt="Table Image" />
                                            : <img src="http://bm.dev.mts.idv.tw/images/JINBEI1.png" alt="Default Table Image" />
                                        }
                                </div>
                                <div className="info-box">
                                    <p className="game-title">{props.tableInfo.TableNumber}</p>
                                    <p className="game-wallet">
                                        <span>{/* {props.userInfo.BetLimitCurrencyType} */}</span>
                                        <span>
                                            {/* {walletArray.map((i, index) => (
                                        // i.CurrencyType === props.userInfo.BetLimitCurrencyType ? 
                                        <span className='without-mr' key={index}>{i.Balance}</span> 
                                        // : ''
                                    ))} */}
                                        </span>
                                    </p>
                                    <div className="game-start">
                                        <Link to={`/games/${props.tableInfo.TableNumber}`}>
                                            {"開始遊戲"}
                                        </Link>
                                    </div>
                                    <div className="game-table-wrap">
                                        <RoadMap
                                            shoeResult={props.tableInfo.ShoeResult}
                                            roaMapType={1}
                                        />
                                    </div>
                                    <p className="game-dis">{/* {i.Status} */}</p>

                                    {/* {moreScale === 'more-scale'
                                ?
                                <div className='show-similar-games forpc'>
                                    <p>{"Global.similar_ganes"}</p>
                                    <SimilarGames />
                                </div>
                                : ''
                            } */}

                                    {/* <div className='show-similar-games formb'>
                                <p>{"Global.similar_ganes"}</p>
                                <SimilarGames />
                            </div> */}
                                    <div className="favorites-box">
                                        {/* <span onClick={() => toggleMute(props.tableInfo.TableNumber)} className={`video-control ${props.mutes.includes(props.tableInfo.TableNumber) ? 'video-unmute' : 'video-mute'}`} />  */}
                                        <span
                                            onClick={() => handleClick(props.tableInfo.TableNumber)}
                                            className="remove-to-favorites"
                                        />
                                    </div>
                                </div>
                                {/* <div className='more forpc' onClick={() => { setMoreScale('more-scale') }} /> */}
                            </div>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

const Gamefavorite = (props) => {
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const [tableList, setTableList] = useState([]);
    const { favors, updateFavors } = useContext(FavorsContext);

    const refreshTableList = () => {
        if (favors.length > 0) {
            lobbyClient.GetTableInfoList("", 0, (success, o) => {
                if (success) {
                    if (o.ResultCode === 0) {
                        let array = [];

                        for (let i = 0; i < favors.length; i++) {
                            for (let j = 0; j < o.TableInfoList.length; j++) {
                                let data = o.TableInfoList[j];

                                if (data.TableNumber == favors[i]) {
                                    array.push({
                                        TableNumber: data.TableNumber,
                                        Image: data.ImageList.find(
                                            (image) => image.ImageType === 1
                                        ),
                                        CurrencyType: data.CurrencyType,
                                        Status: data.Status,
                                        ShoeResult: data.ShoeResult,
                                    });
                                    break;
                                }
                            }
                        }

                        setTableList(array);
                    }
                }
            });
        }
    };

    useEffect(() => {
        refreshTableList();
    }, [favors]);

    return (
        <div className="section_box">
            <ul>
                {tableList.map((data) => (
                    <GamefavoriteLi
                        key={data.TableNumber}
                        tableInfo={data}
                        favors={favors}
                        setFavors={updateFavors}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Gamefavorite;
