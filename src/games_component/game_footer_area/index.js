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
    const BaccaratType = props.baccaratType;

    const updateMiddleBtnType = useCallback((v) => {
        setMiddleBtnType(v);
    });

    const showComponent = () => {
        if (middleBtnType == "Chip") {
            return props.children;
        } else if (middleBtnType == "GameSet") {
            if (BaccaratType == 0 || BaccaratType == 1) {
                return <GameControlButton chipItems={props.chipItems}
                    roadMapNumber={props.roadMapNumber}
                    gameSetID={props.gameSetID}
                    gameClient={props.gameClient}
                    orderData={props.orderData}
                    getTableInfo={props.getTableInfo}
                    updateMiddleBtnType={updateMiddleBtnType}
                    baccaratType={BaccaratType}
                    handleQuery={props.handleQuery}
                />
            } else {
                return <div></div>
            }

        } else {
            return <div></div>
        }
    }

    return (
        <div className='game-footer-area'>
            <div className='left-box'>
                <div className='box-area'>
                    <GameBalance />
                </div>
                <div className='box-area'>
                   <GameTotalBet totalBetValue={props.totalBetValue} />
                </div>
            </div>
            <div className='middle-box'>
                {showComponent()}
            </div>
            <div className='right-box'>
                <div className='box-area'>
                    {BaccaratType === 0 || BaccaratType === 1 ? <GameOpenGameSetAction updateMiddleBtnType={updateMiddleBtnType} /> : <></>}
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

