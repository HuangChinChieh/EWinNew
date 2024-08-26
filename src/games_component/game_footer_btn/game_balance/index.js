import React, { useContext } from 'react';
import { WalletContext } from 'provider/GameLobbyProvider';
import './index.scss';

const GameBalance = (props) => {
    const { wallet } = useContext(WalletContext);

    return (
        <div className='game-balance-box'>
            <span className='icon-box'>餘額: </span>
            <span className='without-mr'>{wallet.Balance}</span>
        </div>
    )
}


export default GameBalance;
