import React from 'react';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { useState,  useEffect } from 'react';

const SummaryTable = ({ 
    beginDate, 
    endDate ,
    updateDate,
    passGamecodeAndQuerydate,
    }) => {
    const activeTabSwitch = (tabName) => {
        setActiveTab(tabName);
    };
    const [activeTab, setActiveTab] = useState('betHistory');
    const [tableData, setTableData] = useState([]);
    const gameLobbyClient = EWinGameLobbyClient.getInstance();
    const tableHeaders = [
        "日期",
        "幣別",
        "類型",
        '上下數',
        '轉碼數',
        "詳細內容"
    ];



    useEffect(() => {
        bettingHistoryClick();
    }, [beginDate, endDate])

    // 顯示投注紀錄並取得投注資料
    const bettingHistoryClick = () => {
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
    }

    const handleSubtractMonth = () => {
        const newBeginDate = new Date(beginDate);
        const newEndDate = new Date(endDate);
        newBeginDate.setMonth(newBeginDate.getMonth() - 1);
        newEndDate.setMonth(newEndDate.getMonth() - 1);
        updateDate(newBeginDate.toISOString().split('T')[0],newEndDate.toISOString().split('T')[0]);
    
    };
    
    const handleAddMonth = () => {
        const newBeginDate = new Date(beginDate);
        const newEndDate = new Date(endDate);
        newBeginDate.setMonth(newBeginDate.getMonth() + 1);
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        updateDate(newBeginDate.toISOString().split('T')[0],newEndDate.toISOString().split('T')[0]);
    };

    const BeginDateRefrsh = (event) => {
        updateDate(event.target.value, endDate);
    };

    const EndDateChangeRefrsh = (event) => {
        updateDate(beginDate, event.target.value);
    };


    return (
            <>
                <div className='title'>
                    <div className='type-container'>
                        <div className={activeTab === 'orderHistory' ? 'type-tabs' : 'type-tabs active'}
                            onClick={() => activeTabSwitch('betHistory')}
                        >
                            投注紀錄
                        </div>
                        <div className={activeTab === 'orderHistory' ? 'type-tabs active' : 'type-tabs'}
                            onClick={() => activeTabSwitch('orderHistory')}
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
                        <input type="date" id="begindate" value={beginDate} onChange={BeginDateRefrsh} name="begindate" />
                    </div>
                    <div>終止日
                        <input type="date" id="enddate" value={endDate} onChange={EndDateChangeRefrsh} name="enddate" />
                    </div>
                </div>

                <div className={`dis ${activeTab === 'orderHistory' ? 'visible' : ''}`}>
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
                                {tableData.filter(data => data.GameCode === 'EWin.BAC.0').map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.SummaryDate}</td>
                                        <td>{data.CurrencyType}</td>
                                        <td>
                                            {data.GameCode === 'EWin.BAC.0' ? '傳統' :
                                            data.GameCode === 'EWin.BAC.1' ? '快速' :
                                            data.GameCode === 'EWin.BAC.2' ? '網投' :
                                            ''}
                                        </td>
                                        <td>{data.RewardValue}</td>
                                        <td>{data.ValidBetValue}</td>
                                        <td className='detail' onClick={(e) => {passGamecodeAndQuerydate(e, data.GameCode, data.SummaryDate)}}>
                                            <div>＋</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    </table>

                    ) : (
                        <div className='noData'>尚無資料</div>
                    )

                    }

                </div>
                <div className={`dis ${activeTab === 'orderHistory' ? '' : 'visible'}`}>
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
                                        <td>
                                            {data.GameCode === 'EWin.BAC.0' ? '傳統' :
                                            data.GameCode === 'EWin.BAC.1' ? '快速' :
                                            data.GameCode === 'EWin.BAC.2' ? '網投' :
                                            ''}
                                        </td>
                                        <td>{data.RewardValue}</td>
                                        <td>{data.ValidBetValue}</td>
                                        <td className='detail' onClick={(e) => passGamecodeAndQuerydate(e, data.GameCode, data.SummaryDate)}>
                                            <div>＋</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    </table>

                    ) : (
                        <div className='noData'>尚無資料</div>
                    )

                    }

                </div>
            </>
    );
}

export default SummaryTable;