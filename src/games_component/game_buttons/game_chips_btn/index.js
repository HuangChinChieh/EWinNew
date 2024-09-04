import './index.scss';
import '../../animation/betAnimation/orderAnimation.scss';
import { moveChipAnimation } from '../../animation/betAnimation/baccaratBasicAnimation'

const GameChipsButton = ((props) => {   
    const handleDoubleBet = ()=>{
        const promiseArray = [];

        for(let areaType in props.orderData){
            if(props.orderData[areaType].totalValue > 0){
                promiseArray.push(new Promise((resolve, reject)=>{
                    moveChipAnimation(areaType, ()=>{resolve()});
                }));
            }       
        }

        if(promiseArray.length > 0) {
            Promise.all(promiseArray).then(()=>{            
                props.dispatchOrderData({ type:"doubleBet"});
            });
        }       
    };

    return (
        <div className={'game-chips-area ' +  (props.isCanBet && 'can-bet')}>
            {/* {(!props.onGameSetAction && props.isCanBet) && <span onClick={handleConfirm} className='confirm'>確認</span>} */}
            <span onClick={() => props.dispatchOrderData({ type:"confirmBet"})} className='confirm'>確認</span>
            <span onClick={() => props.dispatchOrderData({ type:"clearBet"})} className='cancel'>撤銷</span>
            <div className="game-chips-box">
           
                    {
                        props.chipsItems.map((item, index) => (
                            <div key={item.styleIndex}
                                className={`chips-${item.styleIndex} ${props.selChipData.index === index ? 'act' : ''}`}
                                onClick={() => (props.setSelChipData({...item, index:index}))}>
                                <div>{item.chipValue}</div>
                            </div>
                        ))
                    }
            
            </div>
            <span onClick={() => handleDoubleBet()} className='double'>加倍</span> 
        </div>
    )
})




export default (GameChipsButton);