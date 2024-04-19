import { useLobbyContext } from 'provider/GameLobbyProvider';
import { connect } from 'react-redux';
import './index.scss';

const GameTotalBet = (props) => {
    const {
        t
    } = useLobbyContext();
    return (
        <div className='game-total-bet-box'>
            <span className='icon-box'>{t("Global.total_bet")}: </span>
            <span>
                {/* 登入後BetLimitCurrencyType全部變成空字串, 暫時先hardcode */}
                {/* {props.userInfo.BetLimitCurrencyType} {props.totalChips1 + props.totalChips2 + props.totalChips3 + props.totalChips4 + props.totalChips5} */}
                {localStorage.getItem('CurrencyType')} {props.totalChips1 + props.totalChips2 + props.totalChips3 + props.totalChips4 + props.totalChips5}
            </span>
        </div>
    )
}

const mapStateToProps = (state) => {
    // console.log('檢查state', state);
    // console.log('檢查state.favorites', state.root.favorites);
    return {
        totalChips1: state.root.totalChips1,
        totalChips2: state.root.totalChips2,
        totalChips3: state.root.totalChips3,
        totalChips4: state.root.totalChips4,
        totalChips5: state.root.totalChips5,
        userInfo: state.gameLobby.userInfo
    };
};

export default connect(mapStateToProps)(GameTotalBet);
