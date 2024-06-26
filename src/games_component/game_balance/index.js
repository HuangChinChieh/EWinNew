import { useLobbyContext } from 'provider/GameLobbyProvider';
import { connect } from 'react-redux';
import './index.scss';

const GameBalance = (props) => {
    const {
        t
    } = useLobbyContext();
    return (
        <div className='game-balance-box'>
            <span className='icon-box'>{t("Global.balance")}: </span>
            <span>
                {props.userInfo && props.userInfo.Wallet && props.userInfo.Wallet.map((i, index) => (
                    // 登入後BetLimitCurrencyType全部變成空字串 暫時用 hardcode製作
                    // i.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                    i.CurrencyType === localStorage.getItem('CurrencyType') ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                ))}
            </span>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.gameLobby.userInfo,
    };
};

export default connect(mapStateToProps)(GameBalance);
