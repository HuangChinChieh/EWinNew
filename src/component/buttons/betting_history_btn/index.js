import { useState, useRef, useEffect } from 'react';
import './index.scss';
import { useLobbyContext } from "provider/GameLobbyProvider";


const BettingHistory = () => {
    const [hoveredItem, setHoveredItem] = useState(0);
    const [beginDate, setBeginDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const {
        t,
        newInstance,
        CT,
        GUID
    } = useLobbyContext();
    const settingsRef = useRef(null);
    // const tableHeaders = ['日期', '類型', '上下數', '詳細內容'];
    const tableHeaders = [t("Global.date"), t("Global.currency"), t("Global.type"), t('Global.win_lose'), t('Global.rolling'), t("Global.details")];


    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(0);
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
        if (newInstance.length !== 0) {
            newInstance.GetHistorySummary(CT, GUID, beginDate, endDate, (s, o) => {
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
    }

    // 起始日與終止日變動時再次執行搜尋
    useEffect(()=>{
        bettingHistoryClick()
    },[beginDate,endDate])


    useEffect(() => {
        if (newInstance.length !== 0) {
            newInstance.GetHistorySummary(CT, GUID, beginDate, endDate, (s, o) => {
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
                onClick={() => setHoveredItem(1)}
                ref={settingsRef}
            >
                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t('Global.bet_history')}</div>
                    <div className='flex-box'>
                        <div>{t('Global.begindate')}
                            <input type="date" id="begindate" value={beginDate} onChange={handleBeginDateChange} name="begindate" />
                        </div>
                        <div>{t('Global.enddate')}
                            <input type="date" id="enddate" value={endDate} onChange={handleEndDateChange} name="enddate" />
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
                    <div className='dis'>
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
                                                <td className='detail'>
                                                    <button>{t("Global.details")}</button>
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
            </div>
        </div>
    )
}

export default BettingHistory;