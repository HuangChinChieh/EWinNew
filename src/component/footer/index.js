import React, { useContext } from 'react';
import { WalletContext } from 'provider/GameLobbyProvider';
import './index.scss';

function Footer(props) {
    const { wallet } = useContext(WalletContext);
    const walletArray = Object.values(wallet);


    return (
        <div className='footer-box aniFooterAction'>
            <div className='user-wallet'>{"Global.balance"}
            {/* ：{betLimitCurrencyType}&nbsp; */}
                { walletArray.map((i, index) => (
                    // i.CurrencyType === betLimitCurrencyType ? 
                    <span className='without-mr' key={index}>{i.Balance}</span> 
                    // : ''
                ))}
            </div>
        </div>
    )
}

// export default Footer;



export default Footer;