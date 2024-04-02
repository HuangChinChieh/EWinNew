import { useLobbyContext } from 'provider/GameLobbyProvider';
import './index.scss';

const GameTips = () => {
    const {
        t
    } = useLobbyContext();
    return (
        <div className='game-tips-box'>
            <span className='icon-box'>{t("Global.tips")}</span>
        </div>
    )
}

export default GameTips;