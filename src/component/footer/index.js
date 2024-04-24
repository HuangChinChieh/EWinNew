import React, { useContext } from 'react';
import { WalletContext } from 'provider/GameLobbyProvider';
import './index.scss';

function Footer(props) {
    const { wallet } = useContext(WalletContext);
   
    return (
        <div className='footer-box aniFooterAction'>
            <div className='user-wallet'>餘額
              <span className='without-mr'>{wallet.Balance}</span> 
            </div>
        </div>
    )
}

// export default Footer;



export default Footer;