import './index.scss';
import { useHistory } from 'react-router-dom';

const GameExitTable = () => {
    const history = useHistory();

    return (
        <div className='game-exit-table-box' onClick={() => { history.replace("");}}>
            <span className='icon-box'>返回</span>
        </div>
    )
}

export default GameExitTable;