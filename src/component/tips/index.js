import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { use } from 'i18next';

// 目前這樣寫先透過 redux 來管理相關的state 以求demo,實際需要搭配後端api 來設計相關邏輯

const Tips = (props) => {
    // const { showMessage } = props;
    const [showTips, setShowTips] = useState('hiddenTips')
    const [showMessage,setShowMessage]=useState('')
    useEffect(() => {
        if (props.message) {
            setShowTips('showTips');

            const timerId = setTimeout(() => {
                setShowTips('hiddenTips');
                props.resetShowMessage();
            }, 2000);

            return () => clearTimeout(timerId);
        }
    }, [props.message]);



    return (
        <div className={`tips-box ${showTips}`}>
            <p>
                {props.message}
            </p>
        </div>
    )
}

const mapStateToProps = (state) => ({
    showMessage: state.root.showMessage,
    message: state.root.message
});

const mapDispatchToProps = (dispatch) => ({
    resetShowMessage: () => dispatch({ type: 'RESET_MESSAGE' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tips);