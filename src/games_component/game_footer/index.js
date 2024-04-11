import { useLobbyContext } from 'provider/GameLobbyProvider';
import { connect } from 'react-redux';
import './index.scss';

function GameFooter(props) {
    const { t, userInfo } = useLobbyContext();
    return (
        <div className='game-footer-box aniFooterAction'>
            <div className='total-betting'>
                <span className='title'>
                    {t('Global.total_betting')}：
                </span>
                <span>
                    {userInfo.BetLimitCurrencyType}&nbsp;{props.totalChips1 + props.totalChips2 + props.totalChips3 + props.totalChips4 + props.totalChips5}
                </span>
            </div>
            <div className='user-wallet'>
                <span className='title'>{t("Global.balance")}：</span>
                <span>
                    {userInfo.BetLimitCurrencyType}&nbsp;
                    {userInfo && userInfo.Wallet && userInfo.Wallet.map((i, index) => (
                        i.CurrencyType === userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                    ))}
                </span>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        totalChips1: state.root.totalChips1,
        totalChips2: state.root.totalChips2,
        totalChips3: state.root.totalChips3,
        totalChips4: state.root.totalChips4,
        totalChips5: state.root.totalChips5,
    };
};

export default connect(mapStateToProps)(GameFooter);
