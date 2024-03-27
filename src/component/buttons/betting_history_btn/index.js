import { useState, useRef, useEffect } from 'react';
import { useLanguage } from 'hooks';
import './index.scss';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import { select } from 'react-cookies';
import { event } from 'jquery';
const BettingHistory = () => {
    const { CT }= useLobbyContext();
    const { t } = useLanguage();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mbhoveredItem, setMbHoveredItem] = useState(null);
    const [isSet, setIsSet] = useState(false);
    const settingsRef = useRef(null);
    const [selectBeginDate,setSelectBeginDate]=useState('');
    const [selectEndDate,setSelectEndDate]=useState('');




    // const tableHeaders = ['日期', '類型', '上下數', '詳細內容'];
    const tableHeaders = [t("Global.date"), t("Global.type"), t('Global.win_lose'), t("Global.details")];

    const tableData = [
        { date: '2023-11-16', type: '網投', UpDownNumber: 9.6 },
        { date: '2023-11-18', type: '網投', UpDownNumber: 12.3 },
        { date: '2023-11-20', type: '網投', UpDownNumber: 7.2 },
        { date: '2023-11-22', type: '網投', UpDownNumber: 7.2 },
        { date: '2023-12-15', type: '網投', UpDownNumber: 7.2 },
        { date: '2024-01-12', type: '網投', UpDownNumber: 7.2 },
        { date: '2024-01-20', type: '網投', UpDownNumber: 7.2 },
        // Add more data as needed
    ];

    const handleSliderClick = () => {
        setIsSet(!isSet);
    };

    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(null);
        }
    };

    const handleBeginDate=(event)=>{
        setSelectBeginDate(event.target.value)
    }
    const handleEndDate=(event)=>{
        setSelectEndDate(event.target.value)
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

    return (
        <div className='betting-history-box forpc'>
            <div
                className='betting-history'
                onClick={() => setHoveredItem(1)}
                ref={settingsRef}
            >

                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t('Global.bet_history')}</div>
                    
                    {/* <div className='flex-box'>
                        <div>{t('Global.begindate')}
                            <input type="date" id="begindate" value={selectBeginDate} onChange={handleBeginDate} name="begindate"/>
                        </div>
                        <div>{t('Global.enddate')}
                            <input type="date" id="enddate" value={selectEndDate} onChange={handleEndDate} name="enddate"/>
                        </div>
                    </div> */}
                    
                    <div className='dis'>
                        <table>
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
                                        <td>{data.date}</td>
                                        <td>{data.type}</td>
                                        <td>{data.UpDownNumber}</td>
                                        <td className='detail'>
                                            <button>{t("Global.details")}</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BettingHistory;