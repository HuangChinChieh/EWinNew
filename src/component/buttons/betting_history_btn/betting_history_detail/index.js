import { useState,  useEffect, useRef } from 'react';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import gobacksummary from 'img/header/backArrow.png'
import snapshot from 'img/bettinghistory/snapshot.png'

const BettingHistoryDetail = ({
    beginDate,
    endDate,
    parameterData,
    setDisplayArea,
    passGamecodeAndQuerydate,
}) => {    
    const [detailList, setDetailList] = useState([]);
    const [selectedDateAndGamecode, setSelectedDateAndGamecode] = useState({
        GameCode: '', 
        QueryDate: ''
    });

    const gameLobbyClient = EWinGameLobbyClient.getInstance();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [historyDays,setHistoryDays]=useState([]);
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


    useEffect(() => {
        bettingHistoryClick();
    }, [beginDate, endDate])

    useEffect(() => {
        reacquireHistoryDetail(parameterData.gamecode,parameterData.querydate)
    }, [parameterData])


    // 顯示投注紀錄並取得投注資料
    const bettingHistoryClick = () => {
        if (gameLobbyClient !== null) {
            gameLobbyClient.GetHistorySummary(beginDate, endDate, (s, o) => {
                if (s) {

                    if (o.ResultCode === 0) {
                        const filteredData = o.SummaryList.reduce((acc, curr) => {
                            const {SummaryDate,GameCode}=curr;
                            const existingItemIndex = acc.findIndex(item =>
                                item.SummaryDate === SummaryDate && item.GameCode === GameCode
                            );

                            if (existingItemIndex !== -1) {
                                // 如果存在相同的 SummaryDate 和 GameCode，不做任何操作
                            } else {
                                // 否則將當前物件添加到累加器中
                                acc.push({ SummaryDate, GameCode });
                            }
                            return acc;
                        }, []);
                        setHistoryDays(filteredData);
                        //console.log('historyDays',historyDays);

                    } else {
                        console.log('GetHistorySummary: 系統錯誤處理',o.Message);
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
                    if (o.ResultCode === 0) {
                        setDetailList(o.DetailList);
                        setSelectedDateAndGamecode({GameCode,QueryDate});


                    } else {
                        console.log('GetHistorySummary: 系統錯誤處理',o.Message);
                    }
                } else {
                    console.log('GetHistorySummary: 傳輸等例外問題處理');
                }
            });

        }
    }
    // useEffect(() => {
    //     bettingHistoryClick();
    // }, [beginDate, endDate,parameterData])



    const openLightbox = (id) => {
        setLightboxOpen(id);
    };
    
    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const goBackSummary = () => {
        setDisplayArea(1);
    };

    return ( 
        <>
            <div className='title'>
                <div className='type-container'>
                    <div className='type-tabs'>
                        詳細內容
                    </div>
                    <div className='goback-summary'>
                        <img src={gobacksummary} onClick={goBackSummary}></img>
                    </div>
                </div>
            </div>
            <div className='dis'>
                {historyDays.length > 0 || detailList.length > 0 ? (
                    <>
                        <table className='table-flex'>
                                <tbody>
                                    <tr className='header'>
                                        <th>日期</th>
                                    </tr>
                                    <tr>
                                        <td className='day-choose'>
                                            {historyDays.map((data, index) => (
                                                <span 
                                                    key={index} 
                                                    onClick={(e) => passGamecodeAndQuerydate(e, data.GameCode, data.SummaryDate)}
                                                        className={selectedDateAndGamecode.GameCode ===data.GameCode &&
                                                            selectedDateAndGamecode.QueryDate ===data.SummaryDate ? 'active' : ''}

                                                >
                                                    {data.SummaryDate}</span>
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody className='detailContainer'>
                                    <tr className='header'>
                                        {detailTableHeaders.map((data, index) => (
                                            <th key={index}>{data}</th>
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
                                                <td className='snapshot' onClick={() => openLightbox(data.OrderID)}>
                                                    <img src={snapshot} alt="Description of the image" />
                                                </td>
                                                
                                            </tr>
                                        ))}
            
                                </tbody>
                        </table>
                        <div className={`lightbox ${lightboxOpen ? 'open' : ''}`} onClick={closeLightbox}>
                            <div className="lightbox-content">
                                <img src={snapshot} alt="" />
                                <button className="close-button" onClick={closeLightbox}>X</button>
                            </div>
                        </div>
                    </>

                ) : (
                    <div className='noData'>尚無資料</div>
                )

                }

            </div>
        </>

    )
}



export default BettingHistoryDetail;