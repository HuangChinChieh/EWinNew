import { useState, useRef, useEffect,useContext } from 'react';
import { LobbyPersonalContext } from 'provider/GameLobbyProvider';

import './index.scss';
const SettingButton = () => {
    const { lobbyPersonal,setLobbyPersonal } = useContext(LobbyPersonalContext);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mbhoveredItem, setMbHoveredItem] = useState(null);
    const settingsRef = useRef(null);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleButtonClick = () => {
        setIsButtonClicked(true);
        setHoveredItem(1)
    };
    const handleSliderClick = () => {
        setLobbyPersonal(!lobbyPersonal)
    };

    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(null);
            setIsButtonClicked(false);

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
                className={`settings ${isButtonClicked ? 'active' : ''}`}
                onClick={handleButtonClick}
                ref={settingsRef}
            >

                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='flex-box'>
                        <div>
                            遊戲大廳個性化
                        </div>
                        <div className={`custom-slider ${lobbyPersonal ? 'set' : ''}`}>
                            <input type="checkbox" id="sliderCheckbox" />
                            <label htmlFor="sliderCheckbox" onClick={handleSliderClick}></label>
                        </div>
                    </div>
                    <div className='dis'>
                            如果您想查看遊戲大廳的個人化遊戲桌列表，請保持該選項處於啟用狀態。 否則，請將其停用，我們將停止為此目的處理個人資料。
                    </div>
                </div>
            </div>
            <div className='formb'>
                <div className='setting-wrap'>
                    <span className='flex-box'
                        onClick={() => setMbHoveredItem(1)}
                    >
                        <span className='icons'></span>
                        <span> 設置</span>
                    </span>
                    <div className={`hover-box ${mbhoveredItem === 1 ? 'visible' : ''}`}>
                        <div className='flex-box'>
                            <div className='backicon' onClick={() => setMbHoveredItem(null)} />
                            <div>
                                遊戲大廳個性化
                            </div>
                            <div className={`mbcustom-slider ${lobbyPersonal ? 'set' : ''}`}>
                                <input type="checkbox" id="mbsliderCheckbox" />
                                <label htmlFor="mbsliderCheckbox" onClick={handleSliderClick}></label>
                            </div>
                        </div>
                        <div className='dis'>
                            如果您想查看遊戲大廳的個人化遊戲桌列表，請保持該選項處於啟用狀態。 否則，請將其停用，我們將停止為此目的處理個人資料。
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SettingButton;