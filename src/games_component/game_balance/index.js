import { useLobbyContext } from 'provider/GameLobbyProvider';
import './index.scss';

const GameBalance = () => {
    const {
        t,
        userInfo
    } = useLobbyContext();
    return (
        <div className='game-balance-box'>
            <span className='icon-box'>{t("Global.balance")}: </span>
            <span>
                {userInfo && userInfo.Wallet && userInfo.Wallet.map((i, index) => (
                    i.CurrencyType === userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                ))}
            </span>
        </div>
    )
}

export default GameBalance;