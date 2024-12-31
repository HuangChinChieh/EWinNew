import { useState, useRef, useEffect } from 'react';
import { useLanguage } from 'hooks';
import './index.scss';

const GameBettingHistoryButton = () => {
    const { t } = useLanguage();
    const [hoveredItem, setHoveredItem] = useState(null);
    const settingsRef = useRef(null);


    useEffect(() => {
        const handleDocumentClick_GameBettingHistoryButton = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
                setHoveredItem(null);
            }
        };

        if (hoveredItem !== null) {
            // 在 component mount 時加入 click 事件監聽器
            setTimeout(() => {
                document.addEventListener('click', handleDocumentClick_GameBettingHistoryButton);    
            }, 100);            
        }

        // 在 component unmount 時移除 click 事件監聽器
        return () => {
            document.removeEventListener('click', handleDocumentClick_GameBettingHistoryButton);
        };
    }, [hoveredItem]);

    return (
        <div className='game-betting-history-box forpc'>
            <div
                className='game-betting-history'
                onClick={(event) => {
                    if(hoveredItem === null){
                        setHoveredItem(1);
                    }                    
                }}
                ref={settingsRef}
            >

                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t("Global.bet_history")}</div>
                    <div className='dis'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameBettingHistoryButton;