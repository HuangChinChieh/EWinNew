import { useState, useRef, useEffect } from 'react';
import { useLanguage } from 'hooks';
import './index.scss';

const GameGoodTrendNoticeButton = () => {
    const { t } = useLanguage();
    const notifyRef = useRef(null);
    const [hoverItem, setHoverItem] = useState(0);


    useEffect(() => {
        const handleDocumentClick_GameGoodTrendNoticeButton = (e) => {
            if (notifyRef.current && !notifyRef.current.contains(e.target)) {
                setHoverItem(0);
            }
        }

        if (hoverItem !== 0) {
            // 在 component mount 時加入 click 事件監聽器
            setTimeout(() => {
                document.addEventListener('click', handleDocumentClick_GameGoodTrendNoticeButton);
            }, 100);            
        }

        // 在 component unmount 時移除 click 事件監聽器
        return () => {
            document.removeEventListener('click', handleDocumentClick_GameGoodTrendNoticeButton);
        };
    }, [hoverItem]);

    return (
        <div className='game-notify-box forpc'>
            <div
                className='game-notify'
                onClick={(event) => {
                    if (hoverItem === 0) {
                        setHoverItem(1);
                    }                
                }}
                ref={notifyRef}
            >

                <div className={`hover-box ${hoverItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t("Global.good_trend_notice")}</div>
                </div>
            </div>
        </div>
    )
}

export default GameGoodTrendNoticeButton;