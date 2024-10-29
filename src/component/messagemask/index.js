import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const MsgMaskResult = forwardRef((props, ref) => {
    const [showMsgMask, setShowMsgMask] = useState(false);
    const [msgMaskAlertMsg, setMsgMaskAlertMsg] = useState('');
    const [msgMaskAlertTipMsg, setMsgMaskAlertTipMsg] = useState('');
    let fn_click = useRef(null);

    const showMessageMask = (msg) => {
        setMsgMaskAlertMsg(msg);
        setShowMsgMask(true);
    }

    const hideMessageMask = () => {
        setMsgMaskAlertMsg('');
        fn_click.current = null;
        setShowMsgMask(false);
    }

    useEffect(() => {

    }, []);

    useImperativeHandle(ref, () => {
        return {
            ShowMask: (alertMsg, clickfunction, tipText) => {
                hideMessageMask();

                if (clickfunction) {
                    fn_click.current = clickfunction;
                }

                showMessageMask(alertMsg);

                if (tipText) {
                    setMsgMaskAlertTipMsg(tipText);
                } else {
                    setMsgMaskAlertTipMsg("");
                }
            },

            HideMask: () => {
                hideMessageMask();
            }
        }
    });

    return (
        showMsgMask ?
            ReactDOM.createPortal(<div className={'maskContainer ' + (msgMaskAlertTipMsg === "" ? "" : "hasTip")}
                onClick={() => { if (fn_click.current) fn_click.current(); }} >

                
                <label >
                    {msgMaskAlertMsg}
                </label>

                <label className='maskTip'>
                    {msgMaskAlertTipMsg}
                </label>
                <div className='backEffect'></div>
            </div>, document.querySelector('.game-view-wrap'))
            : <div></div>
    )
})

export default MsgMaskResult;
