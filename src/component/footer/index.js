
import { useLobbyContext } from 'provider/GameLobbyProvider';
import './index.scss';

function Footer(props) {
    const { t,userInfo,betLimitCurrencyType,wallet } = useLobbyContext();

    return (
        <div className='footer-box aniFooterAction'>
            <div className='user-wallet'>{t("Global.balance")}：
                {betLimitCurrencyType}&nbsp;
                {userInfo && wallet && wallet.map((i, index) => (
                    i.CurrencyType === betLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                ))}
            </div>
        </div>
    )
}

// export default Footer;



export default Footer;