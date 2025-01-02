import { useState, useRef, useEffect } from 'react';
import { useLanguage } from 'hooks';
import './index.scss';
import { NULL } from 'sass';

const HowToPlayButton = () => {
    const { t } = useLanguage();
    const [hoveredItem, setHoveredItem] = useState(null);
    const settingsRef = useRef(null);



    useEffect(() => {
        const handleDocumentClick_HowToPlayButton = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
                setHoveredItem(null);
            }
        };

        if (hoveredItem !== null) {
            // 在 component mount 時加入 click 事件監聽器
            setTimeout(() => {
                document.addEventListener('click', handleDocumentClick_HowToPlayButton);    
            }, 100);            
        }

        // 在 component unmount 時移除 click 事件監聽器
        return () => {
            document.removeEventListener('click', handleDocumentClick_HowToPlayButton);
        };
    }, [hoveredItem]);

    return (
        <div className='how-to-play-box forpc'>
            <div
                className='how-to-play'
                onClick={(event) => {
                    if (hoveredItem === null) {
                        setHoveredItem(1);
                    }                
                }}
                ref={settingsRef}
            >

                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t("HowToPlay.title")}</div>
                    <div className='dis'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default HowToPlayButton;