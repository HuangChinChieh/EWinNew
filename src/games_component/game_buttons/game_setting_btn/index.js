import { useState, useRef, useEffect } from 'react';
import { useLanguage } from 'hooks';
import './index.scss';
const GameSettingButton = () => {
    const { t } = useLanguage();
    const [hoveredItem, setHoveredItem] = useState(null);
    const settingsRef = useRef(null);

    useEffect(() => {
        const handleDocumentClick_GameSettingButton = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
                setHoveredItem(null);
            }
        };

        if (hoveredItem !== null) {
            // 在 component mount 時加入 click 事件監聽器
            setTimeout(() => {
                document.addEventListener('click', handleDocumentClick_GameSettingButton);    
            }, 100);            
        }

        // 在 component unmount 時移除 click 事件監聽器
        return () => {
            document.removeEventListener('click', handleDocumentClick_GameSettingButton);
        };
    }, [hoveredItem]);


    return (
        <div className='game-setting-box forpc'>
            <div
                className='game-setting-box'
                onClick={(event) => {
                    if (hoveredItem === null) {
                        setHoveredItem(1);
                    }
                }}
                ref={settingsRef}
            >

                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t("Global.setting")}</div>
                    <div className='dis'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameSettingButton;
