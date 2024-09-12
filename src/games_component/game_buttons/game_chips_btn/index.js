import './index.scss';

const GameChipsButton = ((props) => {      
    return (
        <div className={'game-chips-area ' +  (props.isCanBet && 'can-bet')}>
            {/* {(!props.onGameSetAction && props.isCanBet) && <span onClick={handleConfirm} className='confirm'>確認</span>} */}
            <span onClick={() => {if(props.isCanBet){props.handleBet('confirmBet', null, null)}}} className='confirm'>確認</span>
            <span onClick={() => {if(props.isCanBet){props.handleBet('cancelBet', null, null)}}} className='cancel'>撤銷</span>
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
            <span onClick={() => {if(props.isCanBet){props.handleBet('doubleBet', null, null)}}} className='double'>加倍</span> 
        </div>
    )
})




export default (GameChipsButton);