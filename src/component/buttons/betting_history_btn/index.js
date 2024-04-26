import { useState, useRef, useEffect } from 'react';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import './index.scss';
import SummaryTable from './summary_table'; 
import BettingTable from './betting_table';
import BettingHistoryDetail from './betting_history_detail';
import snapshot from 'img/bettinghistory/snapshot.png'


const BettingHistory = (props) => {

    
    const tableHeaders = [
        "日期",
        "幣別",
        "類型",
        '上下數',
        '轉碼數',
        "詳細內容"
    ];
    
    const detailTableHeaders = [
        "序號",
        "場次",
        '幣別',
        '注碼',
        '結果',
        '上下數',
        '轉碼數',
        '配碼稅金',
        '加彩',
        '小費',
        '檯面',
        "快照"
    ];
    
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
    const [isButtonClicked, setIsButtonClicked] = useState(false);


    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleButtonClick = () => {
        setIsButtonClicked(true);
        bettingHistoryClick();
    };

    // 點擊區域外則關閉
    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(0);
            setHoverDetail(0);
            setIsButtonClicked(false);

        }
    };

    // 變更起始日與終止日
    const handleBeginDateChange = (event) => {
        setBeginDate(event.target.value);
    }
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    }

    const [popupVisible, setPopupVisible] = useState(false);

    const openPopup = () => {
      setPopupVisible(true);
    };
  
    const closePopup = () => {
      setPopupVisible(false);
      setHoverDetail(1);

    };

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
        console.log('GameCode',GameCode)
        console.log('QueryDate',QueryDate)

        if (gameLobbyClient !== null) {
            gameLobbyClient.GetHistoryDetail(GameCode, QueryDate, (s, o) => {


                if (s) {
                    console.log(o.ResultCode)
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
        <>
                        <div>
                {popupVisible && (
                    <div className="popup">
                    <div className="popup-content">
                         <img src={snapshot} alt="Description ohe image" />
                        <button onClick={closePopup}>X</button>
                    </div>
                    </div>
                )}
            </div>  
            <div className='betting-history-box forpc'>
                <div
                    className={`betting-history ${isButtonClicked ? 'active' : ''}`}
                    onClick={(e) => {
                        if (e.currentTarget === e.target) {
                            setHoveredItem(1);
                            setHoverDetail(0);
                        }
                        handleButtonClick();

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
                                        投注紀錄
                                    </div>
                                    <div className={activeTab === 'orderHistory' ? 'type-tabs active' : 'type-tabs'}
                                        onClick={(e) => {
                                            setBetHistory(0);
                                            setOrderHistory(1);
                                            handleTabClick('orderHistory');
                                            bettingHistoryClick();
                                        }}
                                    >
                                        工單紀錄
                                    </div>
                                </div>
                                <div className='month-container' >
                                    <button onClick={handleSubtractMonth}>
                                        <span>＜</span>
                                        上個月
                                    </button>
                                    <button onClick={handleAddMonth}>
                                        下個月
                                        <span>＞</span>
                                    </button>
                                </div>
                            </div>
                            <div className='flex-box'>
                                <div>起始日
                                    <input type="date" id="begindate" value={beginDate} onChange={handleBeginDateChange} name="begindate" />
                                </div>
                                <div>終止日
                                    <input type="date" id="enddate" value={endDate} onChange={handleEndDateChange} name="enddate" />
                                </div>
                            </div>

                            <div className={`dis ${orderHistory === 1 ? 'visible' : ''}`}>
                                {tableData.length > 0 ? (
                                    <BettingTable
                                        tableData={tableData}
                                        tableHeaders={tableHeaders}
                                        toHistoryDetail={toHistoryDetail}
                                    />

                                ) : (
                                    <div className='noData'>尚無資料</div>
                                )

                                }

                            </div>
                            <div className={`dis ${betHistory === 1 ? 'visible' : ''}`}>
                                {tableData.length > 0 ? (
                                    <SummaryTable
                                        tableData={tableData}
                                        tableHeaders={tableHeaders}
                                        toHistoryDetail={toHistoryDetail}
                                    />

                                ) : (
                                    <div className='noData'>尚無資料</div>
                                )

                                }

                            </div>
                        </div>
                        <div className={`hover-box-detail ${hoverdetail === 1 ? 'visible' : ''}`}>
                            <div className='title'>
                                <div className='type-container'>
                                    <div className='type-tabs'>
                                        詳細內容
                                    </div>
                                </div>
                                <div className='month-container'>
                                    <button onClick={handleSubtractMonth}>
                                        <span>＜</span>
                                        上個月
                                    </button>
                                    <button onClick={handleAddMonth}>
                                        下個月
                                        <span>＞</span>
                                    </button>
                                </div>
                            </div>
                            <div className='flex-box'>
                                <div>起始日
                                    <input type="date" id="begindate" value={beginDate} onChange={handleBeginDateChange} name="begindate" />
                                </div>
                                <div>終止日
                                    <input type="date" id="enddate" value={endDate} onChange={handleEndDateChange} name="enddate" />
                                </div>
                            </div>

                            <div className='dis'>
                                {tableData.length > 0 || detailList.length > 0 ? (
                                    <BettingHistoryDetail
                                        setHoverDetail={setHoverDetail}
                                        tableHeaders={tableHeaders}
                                        detailTableHeaders={detailTableHeaders}
                                        tableData={tableData}
                                        reacquireHistoryDetail={reacquireHistoryDetail}
                                        detailList={detailList}
                                    />

                                ) : (
                                    <div className='noData'>尚無資料</div>
                                )

                                }

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}



export default BettingHistory;