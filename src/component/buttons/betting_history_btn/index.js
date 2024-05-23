import { useState, useRef, useEffect } from 'react';
import './index.scss';
import SummaryTable from './summary_table'; 
import BettingHistoryDetail from './betting_history_detail';


const BettingHistory = () => {

    
    const [displayArea,setDisplayArea]=useState(2);
    const [beginDate, setBeginDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const settingsRef = useRef(null);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [parameterData,setParameterData]=useState({})





    const passGamecodeAndQuerydate=(e, gamecode, querydate)=>{
        e.stopPropagation()
        setDisplayArea(0);
        setParameterData({gamecode,querydate});
    };

    // 點擊區域外則關閉
    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setDisplayArea(2);
            setIsButtonClicked(false);
        }
    };
    // 變更起始日與終止日



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

    const updateDate = (beginDate, endDate) =>{
        setBeginDate(beginDate);
        setEndDate(endDate);
    };




    const topBtnClick = (e) => {
        if (e.currentTarget === e.target) {
            setIsButtonClicked(true);
            setDisplayArea(1);
        }
    };

    return (

            <div className='betting-history-box forpc'>
                <div
                    className={`betting-history ${isButtonClicked ? 'active' : ''}`}
                    onClick={topBtnClick}
                    ref={settingsRef}
                >
                    <div>
                        <div className={`hover-box ${displayArea === 1 ? 'visible' : ''}`}>
                                <SummaryTable 
                                    beginDate={beginDate} 
                                    endDate={endDate} 
                                    updateDate={updateDate}
                                    passGamecodeAndQuerydate={passGamecodeAndQuerydate}
                                />

                        </div>

                        <div className={`hover-box-detail ${displayArea === 0 ? 'visible' : ''}`}>
                                <BettingHistoryDetail
                                    beginDate={beginDate} 
                                    endDate={endDate} 
                                    setDisplayArea={setDisplayArea}
                                    parameterData={parameterData}
                                    passGamecodeAndQuerydate={passGamecodeAndQuerydate}
                                />

                        </div>
                    </div>

                </div>
            </div>
    )
}



export default BettingHistory;