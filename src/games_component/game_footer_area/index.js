import './index.scss';
// import GameChipsButton from 'games_component/game_buttons/game_chips_btn';
import { useCallback, useState } from 'react';
import GameBalance from 'games_component/game_footer_btn/game_balance';
import GameTotalBet from 'games_component/game_footer_btn/game_total_bet';
import GameTips from 'games_component/game_footer_btn/game_tips';
import GameAddTable from 'games_component/game_footer_btn/game_add_table';
import GameOpenGameSetAction from 'games_component/game_footer_btn/game_open_gameSet_action';
import GameControlButton from 'games_component/game_buttons/game_gameset_btn';

const GameFooterArea = (props) => {
    const [middleBtnType, setMiddleBtnType] = useState("Chip")
    const updateMiddleBtnType = useCallback((v) => {
        setMiddleBtnType(v);
    });

    return (
        <div className='game-footer-area'>
            <div className='left-box'>
                <div className='box-area'>
                    <GameBalance />
                </div>
                <div className='box-area'>
                    {/* <GameTotalBet totalBetValue={props.totalBetValue} /> */}
                </div>
            </div>
            <div className='middle-box'>
                    {middleBtnType === "Chip" ? props.children : (middleBtnType === "GameSet" ? 
                    <GameControlButton chipItems={props.chipItems}
                                roadMapNumber={props.roadMapNumber}
                                gameSetID={props.gameSetID}
                                shoeNumber={props.shoeNumber}
                                roundNumber={props.roundNumber}
                                orderSequence={props.orderSequence}
                                gameClient={props.gameClient}

                    /> : <div></div>)}            
            </div>
            <div className='right-box'>
                <div className='box-area'>
                    <GameOpenGameSetAction updateMiddleBtnType={updateMiddleBtnType}/>
                    </div>
                <div className='box-area'>
                    <GameTips />
                </div>
                <div className='box-area'>
                    <GameAddTable />
                </div>
            </div>
        </div>
    )
}


export default GameFooterArea;

