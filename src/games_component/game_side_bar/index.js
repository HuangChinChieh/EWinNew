import React, { useEffect, useState, useRef } from 'react';
import './index.scss';
import MiniTableMultiBet from '../game_miniTable_multiBet'
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import ReactDOM from 'react-dom';

const GameSideBar = (props) => {
    const [selectAction, setSelectAction] = useState(props.directSelectAction); //0=沒選擇, 1=好路通知, 2=多台投注
    const [isSideHighlight, setIsSideHighlight] = useState(false);
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);
    const lobbyClient = EWinGameLobbyClient.getInstance();
    const [multiTableList, setMultiTableList] = useState([]);
    const lastQueryDateRef = useRef(null);
    const intervalIDRef = useRef(0);
    const sideBarRef = useRef(null);

    const getTableJSX = () => {
        let ret = (<div className='gameSideBar-loading'>
            <svg fill="#F3F3F3FF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><rect x="11" y="1" width="2" height="5" opacity=".14" /><rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29" /><rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43" /><rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57" /><rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71" /><rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86" /><rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" /><animateTransform attributeName="transform" type="rotate" calcMode="discrete" dur="0.75s" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" repeatCount="indefinite" /></g></svg>
        </div>);

        switch (selectAction) {
            case 0:
                ret = <></>;
                break;
            case 1:
                ret = <></>;
                break;
            case 2:


                if (multiTableList.length !== 0) {
                    // ret = multiTableList.filter(data =>  ["Shuffling", "NoService", "AccidentPending"].includes(data.status) ).map((data) => {
                    //     return (<MiniTableMultiBet
                    //         key={data.TableNumber}
                    //         tableName={data.TableNumber}
                    //         roundInfo={data.RoundInfo}
                    //         remainingSecond={data.RemainingSecond}
                    //         lastQueryDate={lastQueryDateRef.current}
                    //         tableTimeoutSecond={data.TableTimeoutSecond}
                    //         status={data.Status}
                    //         betLimit={(data.BetLimit.length > 0 ? data.BetLimit[0] : null)}
                    //         shoeResult={data.ShoeResult}
                    //     ></MiniTableMultiBet>);
                    // });
                
                    ret = multiTableList.filter((data)=> (data.TableType === "BA.2" || data.TableType === "BA.3")).map((data) => {
                        return (<MiniTableMultiBet
                            key={data.TableNumber}
                            tableName={data.TableNumber}
                            roundInfo={data.RoundInfo}
                            remainingSecond={data.RemainingSecond}
                            lastQueryDate={lastQueryDateRef.current}
                            tableTimeoutSecond={data.TableTimeoutSecond}
                            status={data.Status}
                            betLimit={(data.BetLimit.length > 0 ? data.BetLimit[0] : null)}
                            shoeResult={data.ShoeResult}
                        ></MiniTableMultiBet>);
                    });
                }

                break;
            default:
                ret = <></>;
                break;
        }


        return ret;
    };




    const refreshMultiTable = () => {
        lobbyClient.GetTableInfoList('', 0, (success, o) => {
            if (success) {
                if (o.ResultCode === 0) {
                    lastQueryDateRef.current = new Date();
                    setMultiTableList(o.TableInfoList);
                }
            }
        });
    };

    const closeSideBar = () => {
        sideBarRef.current.classList.add("closing");

        setTimeout(() => {
            setSelectAction(0);
            if (props.notifyClose) {
                props.notifyClose();
            }


        }, (1000));
    };

    useEffect(() => {
        if (selectAction === 2) {
            intervalIDRef.current = setInterval(() => {
                refreshMultiTable();
            }, 5000);
        }

        return () => {
            clearInterval(intervalIDRef.current);
        };
    }, [selectAction]);


    return (
        <>
            <div ref={sideBarRef} className={`gameSideBar ${selectAction !== 0 ? "active" : "closing"}`}>
                <div className='gameSideBar-sideControl'>
                    <div className='gameSideBar-sideControl-buttons'>
                        {/* <div className={`gameSideBar-sideControl-buttons-goodRoad ${selectAction === 1 ? "selected" : ""}`} onMouseEnter={() => { setIsSideHighlight(true); }} onMouseLeave={() => { setIsSideHighlight(false); }} onClick={() => { setSelectAction(1) }}>
                        <div className='gameSideBar-side-icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 36" fill="none">
                                <path d="M16.0045 0.246338C14.7946 0.246338 13.817 1.22388 13.817 2.43384V3.74634C8.82682 4.75806 5.06705 9.17407 5.06705 14.4651V15.7502C5.06705 18.9631 3.88443 22.0667 1.75162 24.4729L1.24576 25.0403C0.671543 25.6829 0.534824 26.6057 0.883457 27.3918C1.23209 28.178 2.01822 28.6838 2.87955 28.6838H29.1296C29.9909 28.6838 30.7702 28.178 31.1256 27.3918C31.4811 26.6057 31.3376 25.6829 30.7633 25.0403L30.2575 24.4729C28.1247 22.0667 26.9421 18.97 26.9421 15.7502V14.4651C26.9421 9.17407 23.1823 4.75806 18.1921 3.74634V2.43384C18.1921 1.22388 17.2145 0.246338 16.0045 0.246338ZM19.1012 33.968C19.9215 33.1477 20.3796 32.0334 20.3796 30.8713H16.0045H11.6295C11.6295 32.0334 12.0876 33.1477 12.9079 33.968C13.7282 34.7883 14.8424 35.2463 16.0045 35.2463C17.1667 35.2463 18.2809 34.7883 19.1012 33.968Z" fill="#8D8D9F" />
                            </svg>
                        </div>
                        <div className='gameSideBar-side-text'>好路通知</div>
                    </div> */}

                        <div className={`gameSideBar-sideControl-buttons-multiTable ${selectAction === 2 ? "selected" : ""}`} onMouseEnter={() => { setIsSideHighlight(true); }} onMouseLeave={() => { setIsSideHighlight(false); }} onClick={() => { closeSideBar() }}>
                            <div className='gameSideBar-side-icon' >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 36" fill="none">
                                    <path d="M35 5.71509C35 6.94556 34.0225 8.08032 32.375 8.99634C30.3857 10.0969 27.4189 10.8762 24.0146 11.1086C23.7617 10.9856 23.5088 10.8694 23.2422 10.7668C20.5488 9.63892 16.9668 8.99634 13.125 8.99634C12.5576 8.99634 12.0039 9.01001 11.4502 9.03735L11.375 8.99634C9.72754 8.08032 8.75 6.94556 8.75 5.71509C8.75 2.6936 14.6289 0.246338 21.875 0.246338C29.1211 0.246338 35 2.6936 35 5.71509ZM10.9854 11.259C11.6826 11.2112 12.4004 11.1838 13.125 11.1838C17.377 11.1838 21.1504 12.0247 23.5498 13.3303C25.2451 14.2532 26.25 15.4016 26.25 16.6526C26.25 16.926 26.2021 17.1926 26.1064 17.4524C25.792 18.3547 24.9443 19.1819 23.7139 19.8792C23.707 19.886 23.6934 19.886 23.6865 19.8928C23.666 19.9065 23.6455 19.9133 23.625 19.927C21.2324 21.2532 17.418 22.1145 13.125 22.1145C9.05078 22.1145 5.40723 21.342 2.99414 20.1252C2.86426 20.0637 2.74121 19.9954 2.61816 19.927C0.977539 19.0178 0 17.8831 0 16.6526C0 14.2737 3.65039 12.2434 8.75 11.4983C9.46777 11.3958 10.2129 11.3137 10.9854 11.259ZM28.4375 16.6526C28.4375 15.1555 27.7129 13.925 26.79 13.0022C28.7246 12.7014 30.4951 12.2229 31.999 11.6008C33.1133 11.136 34.1523 10.5618 35 9.85767V12.2776C35 13.5969 33.8721 14.8137 32.0059 15.7571C31.0078 16.2629 29.791 16.6936 28.4238 17.0217C28.4307 16.8987 28.4375 16.7825 28.4375 16.6594V16.6526ZM26.25 23.2151C26.25 24.4456 25.2725 25.5803 23.625 26.4963C23.502 26.5647 23.3789 26.6262 23.249 26.6946C20.8428 27.9114 17.1992 28.6838 13.125 28.6838C8.83203 28.6838 5.01758 27.8225 2.625 26.4963C0.977539 25.5803 0 24.4456 0 23.2151V20.7952C0.854492 21.4993 1.88672 22.0735 3.00098 22.5383C5.70117 23.6663 9.2832 24.3088 13.125 24.3088C16.9668 24.3088 20.5488 23.6663 23.249 22.5383C23.7822 22.3196 24.2949 22.0667 24.7803 21.7932C25.1973 21.5608 25.5869 21.301 25.9561 21.0276C26.0586 20.9524 26.1543 20.8704 26.25 20.7952V21.0276V21.4172V23.2151ZM28.4375 23.2151V21.0276V19.2571C29.7363 18.97 30.9326 18.6077 31.999 18.1633C33.1133 17.6985 34.1523 17.1243 35 16.4202V18.8401C35 19.5579 34.6582 20.2756 33.9814 20.9524C32.8672 22.0667 30.9053 22.9827 28.4238 23.5774C28.4307 23.4612 28.4375 23.3381 28.4375 23.2151ZM13.125 30.8713C16.9668 30.8713 20.5488 30.2288 23.249 29.1008C24.3633 28.636 25.4023 28.0618 26.25 27.3577V29.7776C26.25 32.7991 20.3711 35.2463 13.125 35.2463C5.87891 35.2463 0 32.7991 0 29.7776V27.3577C0.854492 28.0618 1.88672 28.636 3.00098 29.1008C5.70117 30.2288 9.2832 30.8713 13.125 30.8713Z" fill="#8D8D9F" />
                                </svg>
                            </div>
                            <div className='gameSideBar-side-text'>多台投注</div>
                            <div className='gameSideBar-side-icon2' >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 12H20M20 12L16 8M20 12L16 16" stroke="#8D8D9F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={`gameSideBar-sideControl-line ${(isSideHighlight || selectAction !== 0) ? "isHighlight" : ""}`}></div>
                </div>

                <div className={`gameSideBar-content ${selectAction !== 0 ? "active" : ""}`}>
                    <div className={`gameSideBar-content-title ${isHeaderHovered ? "isHover" : ""}`}>
                        <div className='gameSideBar-content-title-text' onMouseEnter={() => { setIsHeaderHovered(true); }} onMouseLeave={() => { setIsHeaderHovered(false); }} onClick={() => { closeSideBar() }}>
                            {
                                selectAction === 1 ? "好路通知" :
                                    (selectAction === 2) ? "多台投注" : ""
                            }
                        </div>
                    </div>
                    <div className='gameSideBar-content-tables'>
                        {/* {getTableJSX()} */}
                        {/* <MiniTableGoodRoad></MiniTableGoodRoad> */}
                        {getTableJSX()}
                    </div>
                </div>
            </div>
            {(selectAction !== 0) ? (ReactDOM.createPortal(
                <>
                    <div className="gameSideBar-mask1" onClick={() => { closeSideBar(); }}></div>
                    <div className="gameSideBar-mask2"></div>
                    <div className="gameSideBar-mask3"></div>
                </>, document.querySelector(".game-view-box"))) : (<></>)}
        </>
    );
};




export default GameSideBar;
