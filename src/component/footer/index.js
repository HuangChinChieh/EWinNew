
import { useLobbyContext } from 'provider/GameLobbyProvider';
import { connect } from 'react-redux';
import './index.scss';

function Footer(props) {
    const { t } = useLobbyContext();


    return (
        <div className='footer-box aniFooterAction'>
            <div className='user-wallet'>{t("Global.balance")}：
                {props.userInfo.BetLimitCurrencyType}&nbsp;
                {props.userInfo && props.userInfo.Wallet && props.userInfo.Wallet.map((i, index) => (
                    i.CurrencyType === props.userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                ))}
            </div>
        </div>
    )
}

// export default Footer;

const mapStateToProps = (state) => {
    return {
        userInfo: state.gameLobby.userInfo
    };
};

export default connect(mapStateToProps)(Footer);