import './index.scss';
import AddTip from "component/addTip";
import { useState } from 'react';
import ReactDOM from 'react-dom';

const GameTips = (props) => {
    const [showAddTip, setShowAddTip] = useState(false);
    const statusTipDisabled = props.statusTipDisabled; //false = 啟用按鈕, true = 停用按鈕
    const showTip = () => {
        if (!statusTipDisabled) {
            setShowAddTip(true);
        }
    }

    const hideTip = () => {
        setShowAddTip(false);
    }

    return (
        <>
            <div className='game-tips-box' onClick={showTip} style={statusTipDisabled ? { backgroundColor: "#DEDEDE" } : {}}>
                <span className='icon-box'>打賞小費</span>
            </div>
            {
                showAddTip ? ReactDOM.createPortal(
                    <AddTip
                        gameClient={props.gameClient}
                        roadMapNumber={props.roadMapNumber}
                        gameSetID={props.gameSetID}
                        handleQuery={props.handleQuery}
                        getTableInfo={props.getTableInfo}
                        orderData={props.orderData}
                        showTip={true}
                        hideTip={hideTip}
                        chipsItem={props.chipItems}
                    />
                    , document.body) : <></>
            }
        </>
    )
}

export default GameTips;