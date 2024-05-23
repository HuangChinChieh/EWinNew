import { useState } from 'react';
import './index.scss';

const GameChipsButton = ((props) => {
    const chipsItem = [
        { index: 1, chipsValue: 25 },
        { index: 2, chipsValue: 50 },
        { index: 3, chipsValue: 100 },
        { index: 4, chipsValue: 500 },
        { index: 5, chipsValue: 1000 },
        { index: 6, chipsValue: 1250 },
        { index: 7, chipsValue: 5000 },
        { index: 8, chipsValue: 10000 }
    ];

    const type = ""

    const [selChipIndex, setSelChipIndex] = useState(0); 

    const handleSelChip = (event, chipValue) => {
        props.updateSelChipValue(event, chipValue)
        setSelChipIndex(chipValue);
    };

    const handleCancel = (event) => {
        props.cancelBet(event);
    };

    const handleDouble = (event) => {
        props.doubleBet(event);
    };

    //投注確認
    const handleAdd = (event) => {
        props.addGameSetActionChip(event);
    };


    const handleConfirm = (event) => {
        props.addGameSetActionChip(event);
    };




    return (
        <div>
            {/* {(!props.onGameSetAction && props.isCanBet) && <span onClick={handleConfirm} className='confirm'>確認</span>} */}
            {props.isCanBet && <span onClick={handleCancel} className='cancel'>撤銷</span>}
            <div className="game-chips-box">
           
                    {
                        chipsItem.map((item) => (
                            <div key={item.index}
                                className={`chips-${item.index} ${props.selChipIndex === item.index ? 'act' : ''}`}
                                onClick={(event) => (handleSelChip(event, item.chipsValue))}>
                                <span

                                />
                            </div>
                        ))
                    }
            
            </div>
            {(!props.onGameSetAction && props.isCanBet) && <span onClick={handleDouble} className='double'>加倍</span>}
            {(props.onGameSetAction && props.isCanBet) && <span onClick={handleAdd} className='confirm'>加值</span>}
        </div>
    )
})




export default (GameChipsButton);