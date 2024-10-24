import { useRef, useEffect, useImperativeHandle, forwardRef,  useState } from 'react';

const MsgMaskResult = forwardRef((props, ref) => {
    const [showMsgMask, setShowMsgMask] = useState(false);
    const [msgMaskAlertMsg, setMsgMaskAlertMsg] = useState('');
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
            ShowMask: (alertMsg, clickfunction) => {
                hideMessageMask();

                if (clickfunction) {
                    fn_click.current = clickfunction;
                }

                showMessageMask(alertMsg);
            },

            HideMask: () => {
                hideMessageMask();
            }
        }
    });

    return (
        showMsgMask ? <div style={{ minWidth: '100%', minHeight: '100vh', position: 'fixed', zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.4)', textAlign: 'center' }}
            onClick={() => { if (fn_click.current) fn_click.current(); }} >
            <label style={{ fontSize: '50px', color: 'white', lineHeight: '100vh' }} >
                {msgMaskAlertMsg}
            </label>
        </div > : <div></div>
    )
})

export default MsgMaskResult;
