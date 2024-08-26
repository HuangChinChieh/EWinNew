import './index.scss';

const GameTotalBet = (props) => {
    return (
        <div className='game-total-bet-box'>
            <span className='icon-box'>總投注額: </span>
            <span>
               {props.totalBetValue}
            </span>
        </div>
    )
}


export default GameTotalBet;
