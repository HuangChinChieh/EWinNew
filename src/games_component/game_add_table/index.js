import { useLobbyContext } from 'provider/GameLobbyProvider';
import './index.scss';

const GameAddTable = () => {
    const {
        t
    } = useLobbyContext();
    return (
        <div className='game-add-table-box'>
            <span className='icon-box'>{t("Global.table")}</span>
        </div>
    )
}

export default GameAddTable;