import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const MsgMaskResult = forwardRef((props, ref) => {
    const [showMsgMask, setShowMsgMask] = useState(false);
    const [leftMsg, setLeftMsg] = useState('');
    const [rightMsg, setRightMsg] = useState('');
    const [leftTip, setLeftTip] = useState('');
    const [rightTip, setRightTip] = useState('');
    let fn_click = useRef(null);

    const showMessageMask = (msgText, tipText) => {
        if(msgText && msgText.length > 0){
            const msgMiddleIndex = Math.floor(msgText.length / 2);
            setLeftMsg(msgText.slice(0, msgMiddleIndex));
            setRightMsg(msgText.slice(msgMiddleIndex));
        }
        
        if(tipText && tipText.length > 0){
            const tipMiddleIndex = Math.floor(tipText.length / 2);

       
            setLeftTip(tipText.slice(0, tipMiddleIndex));
            setRightTip(tipText.slice(tipMiddleIndex));

        }   
    }

    const hideMessageMask = () => {
        setLeftMsg('');
        setRightMsg('');
        setLeftTip('');
        setRightTip('');
        fn_click.current = null;
        setShowMsgMask(false);
    }

    useEffect(() => {

    }, []);

    useImperativeHandle(ref, () => {
        return {
            ShowMask: (msgText, clickFunction, tipText) => {
                hideMessageMask();

                if (clickFunction) {
                    fn_click.current = clickFunction;
                }

                showMessageMask(msgText, tipText);            
            },

            HideMask: () => {
                hideMessageMask();
            }
        }
    });

    return (
        showMsgMask ?
            ReactDOM.createPortal(<div className={'maskContainer ' + ((leftMsg + rightMsg) === "" ? "" : "hasTip")}
                onClick={() => { if (fn_click.current) fn_click.current(); }} >
                <div className='left'>
                    <label>
                        {leftMsg}
                    </label>

                    <label className='maskTip'>
                        {leftTip}
                    </label>
                </div>

                <div className='right'>
                    <label >
                        {rightMsg}
                    </label>
                    <label className='maskTip'>
                        {rightTip}
                    </label>
                </div>
                <div className='backEffect'></div>
            </div>, document.querySelector('.game-view-wrap'))
            : <div></div>
    )
})

export default MsgMaskResult;
