import { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { useLobbyContext } from "provider/GameLobbyProvider";

import './index.scss';

const BettingHistory = (props) => {

    const gameLobbyClient = EWinGameLobbyClient.getInstance(props.ct, props.ewinurl);

    const [hoveredItem, setHoveredItem] = useState(0);
    const [beginDate, setBeginDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [betHistory, setBetHistory] = useState(1);
    const [orderHistory, setOrderHistory] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [detailList, setDetailList] = useState([]);
    const [hoverdetail, setHoverDetail] = useState(0)
    const [activeTab, setActiveTab] = useState('betHistory');
    const settingsRef = useRef(null);
    const {
        t,
    } = useLobbyContext();
    const tableHeaders = [t("Global.date"), t("Global.currency"), t("Global.type"), t('Global.win_lose'), t('Global.rolling'), t("Global.details")];
    const detailTableHeaders = [t("Global.order_id"), t("Global.round_info"), t('Global.currency'), t('Global.bet'),
    t('Global.card_info'), t('Global.win_lose'), t('Global.rolling'), t('Global.lend_chip_tax'), t('Global.add_chip'), t('Global.tips_value'),
    t('Global.table_chip'), t("Global.snap_shot_name")];


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

    // 增加一個月
    const handleAddMonth = () => {
        updateDatesAndSearch((date, setDate) => {
            date.setMonth(date.getMonth() + 1);
            setDate(date.toISOString().split('T')[0]);
        });
    };

    // 減少一個月
    const handleSubtractMonth = () => {
        updateDatesAndSearch((date, setDate) => {
            date.setMonth(date.getMonth() - 1);
            setDate(date.toISOString().split('T')[0]);
        });
    };

    // 顯示投注紀錄並取得投注資料
    const bettingHistoryClick = (o) => {
        if (gameLobbyClient !== null) {
            gameLobbyClient.GetHistorySummary(props.ct, props.guid, beginDate, endDate, (s, o) => {
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
            gameLobbyClient.GetHistoryDetail(props.ct, props.guid, GameCode, QueryDate, (s, o) => {

                if (s) {
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
            gameLobbyClient.GetHistoryDetail(props.ct, props.guid, GameCode, QueryDate, (s, o) => {

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
            gameLobbyClient.GetHistorySummary(props.ct, props.guid, beginDate, endDate, (s, o) => {
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
                                    {t('Global.bet_history')}
                                </div>
                                <div className={activeTab === 'orderHistory' ? 'type-tabs active' : 'type-tabs'}
                                    onClick={(e) => {
                                        setBetHistory(0);
                                        setOrderHistory(1);
                                        handleTabClick('orderHistory');
                                        bettingHistoryClick();
                                    }}
                                >
                                    {t('Global.work_order_history')}
                                </div>
                            </div>
                            <div className='month-container' >
                                <button onClick={handleSubtractMonth}>
                                    <span>＜</span>
                                    {t("Global.last_month")}
                                </button>
                                <button onClick={handleAddMonth}>
                                    {t("Global.next_month")}
                                    <span>＞</span>
                                </button>
                            </div>
                        </div>
                        <div className='flex-box'>
                            <div>{t('Global.begindate')}
                                <input type="date" id="begindate" value={beginDate} onChange={handleBeginDateChange} name="begindate" />
                            </div>
                            <div>{t('Global.enddate')}
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
                                        <tbody>
                                            {tableData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{data.SummaryDate}</td>
                                                    <td>{data.CurrencyType}</td>
                                                    <td>{t(`Global.${data.GameCode}`)}</td>
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
                                <div className='noData'>{t("Global.no_data")}</div>
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
                                                    <td>{t(`Global.${data.GameCode}`)}</td>
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
                                <div className='noData'>{t("Global.no_data")}</div>
                            )

                            }

                        </div>
                    </div>
                    <div className={`hover-box-detail ${hoverdetail === 1 ? 'visible' : ''}`}>
                        <div className='title'>
                            <div className='type-container'>
                                <div className='type-tabs'>
                                    {t('Global.details')}
                                </div>
                            </div>
                            <div className='month-container'>
                                <button onClick={handleSubtractMonth}>
                                    <span>＜</span>
                                    {t("Global.last_month")}
                                </button>
                                <button onClick={handleAddMonth}>
                                    {t("Global.next_month")}
                                    <span>＞</span>
                                </button>
                            </div>
                        </div>
                        <div className='flex-box'>
                            <div>{t('Global.begindate')}
                                <input type="date" id="begindate" value={beginDate} onChange={handleBeginDateChange} name="begindate" />
                            </div>
                            <div>{t('Global.enddate')}
                                <input type="date" id="enddate" value={endDate} onChange={handleEndDateChange} name="enddate" />
                            </div>
                        </div>

                        <div className='dis'>
                            {tableData.length > 0 || detailList.length > 0 ? (
                                <table className='table-flex'>
                                    <>
                                        <div>
                                            <thead>
                                                <tr>
                                                    <th>{tableHeaders[0]}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <td className='day-choose'>
                                                    {tableData.map((data, index) => (
                                                        <span onClick={() => reacquireHistoryDetail(data.GameCode, data.SummaryDate)}>{data.SummaryDate}</span>
                                                    ))}
                                                </td>
                                            </tbody>
                                        </div>
                                        <div>
                                            <thead>
                                                <tr>
                                                    {detailTableHeaders.map((header, index) => (
                                                        <th key={index}>{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
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
                                                        <td>{data.CardInfo}</td>
                                                        <td>{data.RewardValue}</td>
                                                        <td>{data.BuyChipValue}</td>
                                                        <td>{data.LendChipTax}</td>
                                                        <td>{data.AddChip}</td>
                                                        <td>{data.TipsValue}</td>
                                                        <td>{data.TableChip}</td>
                                                        <td className='snapshot'>
                                                            {/* {data.SnapshotName?
                                                        <img src={data.SnapshotName} alt='snapshot'/>:
                                                        <img src={snapshot} alt='default'/>
                                                    } */}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </div>

                                    </>
                                </table>

                            ) : (
                                <div className='noData'>{t("Global.no_data")}</div>
                            )

                            }

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        ewinurl: state.gameLobby.ewinurl,
        ct: state.gameLobby.ct,
        guid: state.gameLobby.guid
    };
};

export default connect(mapStateToProps)(BettingHistory);