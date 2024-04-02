
import {
    BrowserRouter as Router,
    useLocation
} from "react-router-dom";
import { useLobbyContext } from 'provider/GameLobbyProvider';
import { connect } from 'react-redux';
import { showMessage } from 'store/actions';
import './index.scss';

const GameFavorite = (props) => {
    const {
        CT,
        GUID,
        newInstance,
        Favos,
        isFavorited,
        setIsFavorited
    } = useLobbyContext();

    const location = useLocation();

    const getNewGameId = location.pathname.split('/').pop();

    const handleClick = async (TableNumber) => {

        if (newInstance !== null) {

            var index = Favos.indexOf(TableNumber);
            if (Favos.includes(TableNumber)) {
                props.showMessage(`移除收藏 ${TableNumber}`);
                setIsFavorited(false);
                if (index > -1) {
                    Favos.splice(index, 1);
                }
            } else {
                props.showMessage(`新增收藏 ${TableNumber}`);
                setIsFavorited(true);
                Favos.push(TableNumber);
            }

            newInstance.SetUserAccountProperty(CT, GUID, "EWinGame.Favor", JSON.stringify(Favos), function (s, o) {
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
                setIsFavorited(!isFavorited);
            }} className={Favos.includes(getNewGameId) ? 'remove-to-favorites' : 'add-to-favorites'} />
        </div>
    )
}


const mapStateToProps = (state) => {

    return {

    };
};

const mapDispatchToProps = {
    showMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(GameFavorite);
