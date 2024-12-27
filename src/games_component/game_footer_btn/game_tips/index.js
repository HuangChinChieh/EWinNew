import './index.scss';
import AddTip from "component/addTip";
import { useState } from 'react';
import ReactDOM from 'react-dom';

const GameTips = (props) => {
    const [showAddTip, setShowAddTip] = useState(false);
    const showTip = () => {
        setShowAddTip(true);
    }

    const hideTip = () => {
        setShowAddTip(false);
    }

    return (
        <>
            <div className='game-tips-box' onClick={showTip}>
                <span className='icon-box'>打賞小費</span>
            </div>
            {
                showAddTip ? ReactDOM.createPortal(<AddTip
                    gameClient={props.gameClient}
                    roadMapNumber={props.roadMapNumber}
                    gameSetID={props.gameSetID}
                    handleQuery={props.handleQuery}
                    getTableInfo={props.getTableInfo}
                    orderData={props.orderData}
                    showTip={true}
                    hideTip={hideTip}
                />, document.body) : <></>
            }
        </>
    )
}

export default GameTips;