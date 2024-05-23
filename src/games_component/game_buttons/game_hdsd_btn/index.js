import { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import './index.scss';

const GameHDSDButton = (props) => {
    const [hoveredItem, setHoveredItem] = useState(false);
    const settingsRef = useRef(null);    
    const [streamTypes, setStreamTypes] = useState([]);

    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(null);
        }
    };

    const handleHoveredItemClick = ()=>{
        const tableInfo = props.getTableInfo();
    };

    const handleOptionClick = (id) => {
        setSelectedLimit(id);
        setHoveredItem(null);
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
        <div className='game-hdsd-box forpc'>
            <div
                className='game-hdsd'
                onClick={() => setHoveredItem(1)}
                ref={settingsRef}
            >

                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t("VideoLine.title")}</div>
                    <div className='dis'>
                        {props.tiList && props.tiList.TableInfoList && props.tiList.TableInfoList.map((tableInfo, tableIndex) => (
                            (tableInfo.TableNumber === localTitle) && (
                                <div
                                    key={tableIndex}
                                >
                                    {tableInfo.Stream && tableInfo.Stream.map((stream, streamIndex) => (
                                        <span
                                            key={streamIndex}
                                            onClick={() => handleOptionClick(stream.StreamName)}
                                            className={`option ${selectedLimit === stream.StreamName ? 'selected' : ''}`}
                                        >
                                            {stream.StreamName} {stream.StreamResolution === 0 ? 'HD' : (stream.StreamResolution === 1 ? 'SD' : 'PinCamera')}
                                        </span>
                                    ))}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        tiList: state.gameLobby.tiList,
    };
};

export default connect(mapStateToProps)(GameHDSDButton);
