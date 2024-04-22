
import { useLobbyContext } from 'provider/GameLobbyProvider';

import './index.scss';

function Footer(props) {
    const { t,userInfo } = useLobbyContext();


    return (
        <div className='footer-box aniFooterAction'>
            <div className='user-wallet'>{t("Global.balance")}：
                {userInfo.BetLimitCurrencyType}&nbsp;
                {userInfo && userInfo.Wallet && userInfo.Wallet.map((i, index) => (
                    i.CurrencyType === userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                ))}
            </div>
        </div>
    )
}

// export default Footer;



export default Footer;