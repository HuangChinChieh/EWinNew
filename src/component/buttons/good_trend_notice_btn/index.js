import { useState, useRef, useEffect } from 'react';
import './index.scss';

const GoodTrendNotice = () => {
    const notifyRef = useRef(null);
    const [hoverItem, setHoverItem] = useState(0);
    const [isButtonClicked, setIsButtonClicked] = useState(false);



    const handleDocumentClick = (e) => {
        if (notifyRef.current && !notifyRef.current.contains(e.target)) {
            setHoverItem(0);
            setIsButtonClicked(false);
        }
    }

    const handleButtonClick = () => {
        setIsButtonClicked(true);
        setHoverItem(1);
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
        <div className='notify-box forpc'>
            <div
                className={`notify ${isButtonClicked ? 'active' : ''}`}
                onClick={handleButtonClick}
                ref={notifyRef}
            >

                <div className={`hover-box ${hoverItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>好路通知</div>
                </div>
            </div>
        </div>
    )
}

export default GoodTrendNotice;