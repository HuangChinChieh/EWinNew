import { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import './index.scss';

const GameLimitButton = (props) => {
    const {
        t
    } = useLobbyContext();

    const [hoveredItem, setHoveredItem] = useState(null);
    const [selectedLimit, setSelectedLimit] = useState(null);
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');
    const settingsRef = useRef(null);


    useEffect(() => {
        if (props.userBetlimitList && props.userBetlimitList.BetLimitList && props.userBetlimitList.BetLimitList.length > 0) {
            const { BetLimitID, Banker } = props.userBetlimitList.BetLimitList[0];
            setMin(Banker.Min);
            setMax(Banker.Max);
            handleOptionClick(BetLimitID, Banker.Min, Banker.Max);
        }
    }, [props.userBetlimitList]);

    const handleDocumentClick = (e) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target)) {
            // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
            setHoveredItem(null);
        }
    };

    const handleOptionClick = (id, cmin, cmax) => {
        setSelectedLimit(id);
        setHoveredItem(null);
        setMin(cmin);
        setMax(cmax);
        // console.log('id', id, 'min', cmin, 'max', cmax)
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
                <p>{props.userInfo.BetLimitCurrencyType} {min} ~ {max} </p>
                <div className={`hover-box ${hoveredItem === 1 ? 'visible' : ''}`}>
                    <div className='title'>{t("Global.choose_bet_limit")}</div>
                    <div className='dis'>
                        {props.userBetlimitList && props.userBetlimitList.BetLimitList && (
                            <div className='dis'>
                                {props.userBetlimitList.BetLimitList.map(limit => (
                                    <div
                                        key={limit.BetLimitID}
                                        onClick={() => handleOptionClick(limit.BetLimitID, limit.Banker.Min, limit.Banker.Max)}
                                        className={`option ${selectedLimit === limit.BetLimitID ? 'selected' : ''}`}
                                    >
                                        {limit.Banker.Min}~{limit.Banker.Max}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.gameLobby.userInfo,
        userBetlimitList: state.gameBaccar.userBetlimitList
    };
};

export default connect(mapStateToProps)(GameLimitButton);
