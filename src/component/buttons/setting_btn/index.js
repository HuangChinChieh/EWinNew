import { useState, useRef, useEffect } from 'react';
import './index.scss';
const SettingButton = () => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mbhoveredItem, setMbHoveredItem] = useState(null);
    const [isSet, setIsSet] = useState(false);
    const settingsRef = useRef(null);

    const handleSliderClick = () => {
        setIsSet(!isSet);
    };

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
        <div className='settings-box'>
            <div
                className='settings forpc'
                onClick={() => setHoveredItem(1)}
                ref={settingsRef}
            >

                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='flex-box'>
                        <div>
                            {"Setting.title"}
                        </div>
                        <div className={`custom-slider ${isSet ? 'set' : ''}`}>
                            <input type="checkbox" id="sliderCheckbox" />
                            <label htmlFor="sliderCheckbox" onClick={handleSliderClick}></label>
                        </div>
                    </div>
                    <div className='dis'>
                        {"Setting.dis"}
                    </div>
                </div>
            </div>
            <div className='formb'>
                <div className='setting-wrap'>
                    <span className='flex-box'
                        onClick={() => setMbHoveredItem(1)}

                    >
                        <span className='icons'></span>
                        <span> {"Setting.is_true"}</span>
                    </span>
                    <div className={`hover-box ${mbhoveredItem === 1 ? 'visible' : ''}`}>
                        <div className='flex-box'>
                            <div className='backicon' onClick={() => setMbHoveredItem(null)} />
                            <div>
                                {"Setting.title"}
                            </div>
                            <div className={`mbcustom-slider ${isSet ? 'set' : ''}`}>
                                <input type="checkbox" id="mbsliderCheckbox" />
                                <label htmlFor="mbsliderCheckbox" onClick={handleSliderClick}></label>
                            </div>
                        </div>
                        <div className='dis'>
                            {"Setting.dis"}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SettingButton;