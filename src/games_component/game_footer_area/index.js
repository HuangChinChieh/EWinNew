import './index.scss';
import GameChipsButton from 'games_component/game_buttons/game_chips_btn';
import GameBalance from 'games_component/game_balance';
import GameTotalBet from 'games_component/game_total_bet';
import GameTips from 'games_component/game_tips';
import GameAddTable from 'games_component/game_add_table';

const GameFooterArea = () => {

    return (
        <div className='game-footer-area'>
            <div className='game-footer-area-box'>
                <div className='left-box'>
                    <div className='box-area'>
                        <GameBalance />
                    </div>
                    <div className='box-area'>
                        <GameTotalBet />
                    </div>
                </div>
                <div className='middle-box'>
                    <div className='game-box-straight'>
                        <GameChipsButton />
                    </div>
                </div>
                <div className='right-box'>
                    <div className='box-area'>
                        <GameTips />
                    </div>
                    <div className='box-area'>
                        <GameAddTable />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default GameFooterArea;

