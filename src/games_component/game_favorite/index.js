
import {
    BrowserRouter as Router,
    useLocation
} from "react-router-dom";
import { connect } from 'react-redux';
import {
    actIsFavorited
} from 'store/gameBaccarActions';
import {
    actFavo
} from 'store/gamelobbyActions';
import { EWinGameLobbyClient } from 'signalr/bk/EWinGameLobbyClient';
import { showMessage } from 'store/actions';
import './index.scss';

const GameFavorite = (props) => {


    const location = useLocation();

    const getNewGameId = location.pathname.split('/').pop();

    const gameLobbyClient = EWinGameLobbyClient.getInstance(props.ct, props.ewinurl);

    const handleClick = async (TableNumber) => {

        if (gameLobbyClient !== null) {

            let newFavo = [...props.favo];
            const index = newFavo.indexOf(TableNumber);

            if (props.favo && props.favo.includes(TableNumber)) {
                props.showMessage(`移除收藏 ${TableNumber}`);
                props.actIsFavorited(false);
                if (index > -1) {
                    newFavo.splice(index, 1);
                    props.actFavo(newFavo);
                }
            } else {
                props.showMessage(`新增收藏 ${TableNumber}`);
                props.actIsFavorited(true);
                newFavo.push(TableNumber);
                props.actFavo(newFavo);
            }

            gameLobbyClient.SetUserAccountProperty("EWinGame.Favor", JSON.stringify(newFavo), function (s, o) {
                if (s) {
                    if (o.ResultCode == 0) {

                    } else {
                        //系統錯誤處理
                        console.log('GetUserAccountProperty: 系統錯誤處理');
                    }
                } else {
                    //傳輸等例外問題處理
                    console.log('GetUserAccountProperty: 傳輸等例外問題處理');
                }
            });

        }




    };

    return (
        <div className='game-favorite-box'>
            <span onClick={() => {
                handleClick(getNewGameId);
                props.actIsFavorited(!props.isFavorited);
            }} className={props.favo && props.favo.includes(getNewGameId) ? 'remove-to-favorites' : 'add-to-favorites'} />
        </div>
    )
}


const mapStateToProps = (state) => {

    return {
        ct: state.gameLobby.ct,
        guid: state.gameLobby.guid,
        favo: state.gameLobby.favo,
        isFavorited: state.gameBaccar.isFavorited
    };
};

const mapDispatchToProps = {
    showMessage,
    actIsFavorited,
    actFavo
};

export default connect(mapStateToProps, mapDispatchToProps)(GameFavorite);
