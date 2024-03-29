import { useState, useRef, useEffect } from 'react';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import './index.scss';

const GameLimitButton = () => {
    const {
        t,
        userInfo
    } = useLobbyContext();
    const [hoveredItem, setHoveredItem] = useState(null);
    const settingsRef = useRef(null);

    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(null);
        }
    };

    useEffect(() => {
        // 在 component mount 時加入 click 事件監聽器
        document.addEventListener('click', handleDocumentClick);

        // 在 component unmount 時移除 click 事件監聽器
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <div className='game-limit-box forpc'>
            <div
                className='game-limit'
                onClick={() => setHoveredItem(1)}
                ref={settingsRef}
            >
                <p>{userInfo.BetLimitCurrencyType} </p>
                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t("Global.choose_bet_limit")}</div>
                    <div className='dis'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameLimitButton;