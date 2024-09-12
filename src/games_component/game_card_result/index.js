import { Link } from 'react-router-dom';
import './index.scss';
const CardResult = (props) => {
    const cardResult = props.cardResult;
    const handleCancel = () => {
        props.setTotalChips1(0);
        props.setTotalChips2(0);
        props.setTotalChips3(0);
        props.setTotalChips4(0);
        props.setTotalChips5(0);
        props.setIsAct1('');
        props.setIsAct2('');
        props.setIsAct3('');
        props.setIsAct4('');
        props.setIsAct5('');
        props.setDefaultClick('show')
    }

    return (
        <div className='game-back-box' onClick={handleCancel}>
            <Link to="/" />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        defaultClick: state.root.defaultClick,
        totalChips1: state.root.totalChips1,
        totalChips2: state.root.totalChips2,
        totalChips3: state.root.totalChips3,
        totalChips4: state.root.totalChips4,
        totalChips5: state.root.totalChips5,
        isAct1: state.root.isAct1,
        isAct2: state.root.isAct2,
        isAct3: state.root.isAct3,
        isAct4: state.root.isAct4,
        isAct5: state.root.isAct5,
    };
};


const mapDispatchToProps = (dispatch) => ({

    setTotalChips1: (totalChips1) => dispatch(setTotalChips1(totalChips1)),
    setTotalChips2: (totalChips2) => dispatch(setTotalChips2(totalChips2)),
    setTotalChips3: (totalChips3) => dispatch(setTotalChips3(totalChips3)),
    setTotalChips4: (totalChips4) => dispatch(setTotalChips4(totalChips4)),
    setTotalChips5: (totalChips5) => dispatch(setTotalChips5(totalChips5)),
    setIsAct1: (isAct1) => dispatch(setIsAct1(isAct1)),
    setIsAct2: (isAct2) => dispatch(setIsAct2(isAct2)),
    setIsAct3: (isAct3) => dispatch(setIsAct3(isAct3)),
    setIsAct4: (isAct4) => dispatch(setIsAct4(isAct4)),
    setIsAct5: (isAct5) => dispatch(setIsAct5(isAct5)),
    setDefaultClick: (defaultClick) => dispatch(setDefaultClick(defaultClick)),
});


export default connect(mapStateToProps, mapDispatchToProps)(GameBack);
