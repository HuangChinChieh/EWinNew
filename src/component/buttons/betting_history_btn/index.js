import { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import './index.scss';

import { useLobbyContext } from "provider/GameLobbyProvider";

const BettingHistory = (props) => {

    
    const tableHeaders = [
        "Global.date",
        "Global.currency",
        "Global.type",
        'Global.win_lose',
        'Global.rolling',
        "Global.details"
    ];
    
    const detailTableHeaders = [
        "Global.order_id",
        "Global.round_info",
        'Global.currency',
        'Global.bet',
        'Global.card_info',
        'Global.win_lose',
        'Global.rolling',
        'Global.lend_chip_tax',
        'Global.add_chip',
        'Global.tips_value',
        'Global.table_chip',
        "Global.snap_shot_name"
    ];
    
    const EWinUrl = 'https://ewin.dev.mts.idv.tw';
    const gameLobbyClient = EWinGameLobbyClient.getInstance();
    const [hoveredItem, setHoveredItem] = useState(0);
    const [hoverdetail, setHoverDetail] = useState(0)
    const [beginDate, setBeginDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [betHistory, setBetHistory] = useState(1);
    const [orderHistory, setOrderHistory] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [detailList, setDetailList] = useState([]);
    const [activeTab, setActiveTab] = useState('betHistory');
    const settingsRef = useRef(null);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };


    // 點擊區域外則關閉
    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(0);
            setHoverDetail(0);
        }
    };

    // 變更起始日與終止日
    const handleBeginDateChange = (event) => {
        setBeginDate(event.target.value);
    }
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    }


    // 更新日期並執行搜索
    const updateDatesAndSearch = (updateFunction) => {
        // 更新起始日
        const nowBeginDate = new Date(beginDate);
        updateFunction(nowBeginDate, setBeginDate);

        // 更新終止日
        const nowEndDate = new Date(endDate);
        updateFunction(nowEndDate, setEndDate);

        // 依照新日期重新搜尋
        bettingHistoryClick();
    };

    // 增減一個月
    const handleAddMonth = () => {
        updateDatesAndSearch((date, setDate) => {
            date.setMonth(date.getMonth() + 1);
            setDate(date.toISOString().split('T')[0]);
        });
    };
    const handleSubtractMonth = () => {
        updateDatesAndSearch((date, setDate) => {
            date.setMonth(date.getMonth() - 1);
            setDate(date.toISOString().split('T')[0]);
        });
    };

    // 顯示投注紀錄並取得投注資料
    const bettingHistoryClick = (o) => {
        if (gameLobbyClient !== null) {
            gameLobbyClient.GetHistorySummary(beginDate, endDate, (s, o) => {
                if (s) {
                    console.log(o);
                    if (o.ResultCode === 0) {
                        setTableData(o.SummaryList);
                    } else {
                        console.log('GetHistorySummary: 系統錯誤處理');
                    }
                } else {
                    console.log('GetHistorySummary: 傳輸等例外問題處理');
                }
            });

        }
    }

    //顯示投注紀錄並取得投注資料
    const reacquireHistoryDetail = (GameCode, QueryDate) => {
        if (gameLobbyClient !== null) {
            gameLobbyClient.GetHistoryDetail(GameCode, QueryDate, (s, o) => {

                if (s) {
                    console.log(o)
                    if (o.ResultCode === 0) {
                        setDetailList(o.DetailList);

                    } else {
                        console.log('GetHistorySummary: 系統錯誤處理');
                    }
                } else {
                    console.log('GetHistorySummary: 傳輸等例外問題處理');
                }
            });

        }
    }

    const toHistoryDetail = (GameCode, QueryDate) => {
        if (gameLobbyClient !== null) {
            gameLobbyClient.GetHistoryDetail(GameCode, QueryDate, (s, o) => {

                if (s) {
                    if (o.ResultCode === 0) {
                        setDetailList(o.DetailList);
                        setHoverDetail(1);
                        setHoveredItem(0);
                    } else {
                        console.log('GetHistorySummary: 系統錯誤處理');
                    }
                } else {
                    console.log('GetHistorySummary: 傳輸等例外問題處理');
                }
            });

        }
    }

    // 起始日與終止日變動時再次執行搜尋
    useEffect(() => {
        bettingHistoryClick();
    }, [beginDate, endDate])


    useEffect(() => {
        if (gameLobbyClient !== null) {
            gameLobbyClient.GetHistorySummary(beginDate, endDate, (s, o) => {
                if (s) {
                    if (o.ResultCode === 0) {
                        setTableData(o.SummaryList);
                    } else {
                        console.log('GetHistorySummary: 系統錯誤處理');
                    }
                } else {
                    console.log('GetHistorySummary: 傳輸等例外問題處理');
                }
            });
        }
    }, [])


    useEffect(() => {
        // 在 component mount 時加入 click 事件監聽器
        document.addEventListener('click', handleDocumentClick);
        // 在 component unmount 時移除 click 事件監聽器
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };

    }, []);

    // 設置起始日(當日前七天)與終止日(當日)
    useEffect(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];
        setBeginDate(formattedSevenDaysAgo);
        setEndDate(today.toISOString().split('T')[0]);
    }, []);



    return (
        <div className='betting-history-box forpc'>
            <div
                className='betting-history'
                onClick={(e) => {
                    if (e.currentTarget === e.target) {
                        setHoveredItem(1);
                        setHoverDetail(0);
                    }
                    bettingHistoryClick();

                }}
                ref={settingsRef}
            >
                <div>
                    <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                        <div className='title'>
                            <div className='type-container'>
                                <div className={activeTab === 'betHistory' ? 'type-tabs active' : 'type-tabs'}
                                    onClick={(e) => {
                                        setBetHistory(1);
                                        setOrderHistory(0);
                                        handleTabClick('betHistory');
                                        bettingHistoryClick();
                                    }}
                                >
                                    {'Global.bet_history'}
                                </div>
                                <div className={activeTab === 'orderHistory' ? 'type-tabs active' : 'type-tabs'}
                                    onClick={(e) => {
                                        setBetHistory(0);
                                        setOrderHistory(1);
                                        handleTabClick('orderHistory');
                                        bettingHistoryClick();
                                    }}
                                >
                                    {'Global.work_order_history'}
                                </div>
                            </div>
                            <div className='month-container' >
                                <button onClick={handleSubtractMonth}>
                                    <span>＜</span>
                                    {"Global.last_month"}
                                </button>
                                <button onClick={handleAddMonth}>
                                    {"Global.next_month"}
                                    <span>＞</span>
                                </button>
                            </div>
                        </div>
                        <div className='flex-box'>
                            <div>{'Global.begindate'}
                                <input type="date" id="begindate" value={beginDate} onChange={handleBeginDateChange} name="begindate" />
                            </div>
                            <div>{'Global.enddate'}
                                <input type="date" id="enddate" value={endDate} onChange={handleEndDateChange} name="enddate" />
                            </div>
                        </div>

                        <div className={`dis ${orderHistory === 1 ? 'visible' : ''}`}>
                            {tableData.length > 0 ? (
                                <table>
                                    <>
                                        <thead>
                                            <tr>
                                                {tableHeaders.map((header, index) => (
                                                    <th key={index}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        {tableData.length > 0 && (
                                            <tbody>
                                                {tableData.filter(data => data.GameCode === 'EWin.BAC.0').map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{data.SummaryDate}</td>
                                                        <td>{data.CurrencyType}</td>
                                                        <td>{`Global.${data.GameCode}`}</td>
                                                        <td>{data.RewardValue}</td>
                                                        <td>{data.ValidBetValue}</td>
                                                        <td className='detail' onClick={() => toHistoryDetail(data.GameCode, data.SummaryDate)}>
                                                        <div>＋</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        )}
                                    </>
                                </table>

                            ) : (
                                <div className='noData'>{"Global.no_data"}</div>
                            )

                            }

                        </div>
                        <div className={`dis ${betHistory === 1 ? 'visible' : ''}`}>
                            {tableData.length > 0 ? (
                                <table>
                                    <><thead>
                                        <tr>
                                            {tableHeaders.map((header, index) => (
                                                <th key={index}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                        <tbody>
                                            {tableData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.SummaryDate}</td>
                                                    <td>{data.CurrencyType}</td>
                                                    <td>{`Global.${data.GameCode}`}</td>
                                                    <td>{data.RewardValue}</td>
                                                    <td>{data.ValidBetValue}</td>
                                                    <td className='detail' onClick={() => toHistoryDetail(data.GameCode, data.SummaryDate)}>
                                                        <div>＋</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </>
                                </table>

                            ) : (
                                <div className='noData'>{"Global.no_data"}</div>
                            )

                            }

                        </div>
                    </div>
                    <div className={`hover-box-detail ${hoverdetail === 1 ? 'visible' : ''}`}>
                        <div className='title'>
                            <div className='type-container'>
                                <div className='type-tabs'>
                                    {'Global.details'}
                                </div>
                            </div>
                            <div className='month-container'>
                                <button onClick={handleSubtractMonth}>
                                    <span>＜</span>
                                    {"Global.last_month"}
                                </button>
                                <button onClick={handleAddMonth}>
                                    {"Global.next_month"}
                                    <span>＞</span>
                                </button>
                            </div>
                        </div>
                        <div className='flex-box'>
                            <div>{'Global.begindate'}
                                <input type="date" id="begindate" value={beginDate} onChange={handleBeginDateChange} name="begindate" />
                            </div>
                            <div>{'Global.enddate'}
                                <input type="date" id="enddate" value={endDate} onChange={handleEndDateChange} name="enddate" />
                            </div>
                        </div>

                        <div className='dis'>
                            {tableData.length > 0 || detailList.length > 0 ? (
                                <table className='table-flex'>
                                        <tbody>
                                            <tr className='header'>
                                                <th>{tableHeaders[0]}</th>
                                            </tr>
                                            <tr>
                                                <td className='day-choose'>
                                                    {tableData.map((data, index) => (
                                                        <span key={index} onClick={() => reacquireHistoryDetail(data.GameCode, data.SummaryDate)}>{data.SummaryDate}</span>
                                                    ))}
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody className='detailContainer'>
                                            <tr className='header'>
                                                {detailTableHeaders.map((header, index) => (
                                                    <th key={index}>{header}</th>
                                                ))}
                                            </tr>
                                                {detailList.map((data, index) => (
                                                    <tr key={index} className='detail'>
                                                        <td className='col-arrange-center'>
                                                            <span className='order-id'>{data.OrderID}</span>
                                                            <span>{data.CreateDate.split(" ")[0]}</span>
                                                            <span>{data.CreateDate.split(" ")[1]}</span>
                                                        </td>
                                                        <td>{data.RoundInfo}</td>
                                                        <td>{data.CurrencyType}</td>
                                                        <td className='col-arrange-left'>
                                                            <span>庒:{data.OrderBanker}</span>
                                                            <span>閒:{data.OrderPlayer}</span>
                                                            <span>和:{data.OrderTie}</span>
                                                            <span>庒對:{data.OrderBankerPair}</span>
                                                            <span>閒對:{data.OrderPlayerPair}</span>
                                                        </td>
                                                        <td>
                                                            {data.Result === '1' || data.Result === '5' || data.Result === '9' || data.Result === 'D' ? '庒' :
                                                            data.Result === '2' || data.Result === '6' || data.Result === 'A' || data.Result === 'E' ? '閒' :
                                                            data.Result === '3' || data.Result === '7' || data.Result === 'B' || data.Result === 'F' ? '和' :
                                                            ''}
                                                        </td>
                                                        <td>{data.RewardValue}</td>
                                                        <td>{data.BuyChipValue}</td>
                                                        <td>{data.LendChipTax}</td>
                                                        <td>{data.AddChip}</td>
                                                        <td>{data.TipsValue}</td>
                                                        <td>{data.TableChip}</td>
                                                        <td className='snapshot'>
                                                           <img src={data.SnapShot} alt="Snapshot" />
                                                        </td>
                                                    </tr>
                                                ))}

                                        </tbody>
                                </table>

                            ) : (
                                <div className='noData'>{"Global.no_data"}</div>
                            )

                            }

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}



export default BettingHistory;