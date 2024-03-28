import { useState, useRef, useEffect } from 'react';
import './index.scss';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { useLobbyContext } from "provider/GameLobbyProvider";


const BettingHistory = () => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mbhoveredItem, setMbHoveredItem] = useState(null);
    const [isSet, setIsSet] = useState(false);
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
    const tableHeaders = [t("Global.date"), t("Global.type"), t('Global.win_lose'), t("Global.details")];

    const handleSliderClick = () => {
        setIsSet(!isSet);
    };

    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(null);
        }
    };


    // 設置起始日與終止日變動時變更參數值並重新取得投注資料
    const handleBeginDateChange = (event) => {
        setBeginDate(event.target.value);
        bettingHistoryClick()
    }
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        bettingHistoryClick()
    }


    useEffect(() => {
        // 在 component mount 時加入 click 事件監聽器
        document.addEventListener('click', handleDocumentClick);
        console.log('2U2',CT);
        // 在 component unmount 時移除 click 事件監聽器
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };

    }, []);


    useEffect(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];
        setBeginDate(formattedSevenDaysAgo);
        setEndDate(today.toISOString().split('T')[0]);

    }, []); // 設置起始日(當日前七天)與終止日(當日)

    // 顯示投注紀錄並取得投注資料
    const bettingHistoryClick = () => {
        setHoveredItem(1)
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


    return (
        <div className='betting-history-box forpc'>
            <div
                className='betting-history'
                onClick={bettingHistoryClick}
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

                    <div className='dis'>
                        <table>
                            {tableData.length > 0 ? (
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
                                                <td>{t(`Global.${data.GameCode}`)}</td>
                                                <td>{data.RewardValue}</td>
                                                <td className='detail'>
                                                    <button>{t("Global.details")}</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            ) : (
                                <div className='noData'>{t("Global.no_data")}</div>
                            )

                            }

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BettingHistory;