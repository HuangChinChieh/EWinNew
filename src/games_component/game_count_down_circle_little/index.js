import React, { useEffect, useRef } from 'react';
import './index.scss';

const CountdownLittleCircle = (props) => {
    const animationDom1 = useRef(null);
    const animationDom2 = useRef(null);//需要動態修改變量的Dom    
    const textDom = useRef(null)
    const nowAngle = useRef(0);
    const plusAngle = useRef(0);

    const refreshCountdown = () => {
        const frameRate = 60;
        const totalAngle = 360;
        const duration = props.countdownData.tableTimeoutSecond * 1000;
        const totalFrames = (duration / 1000) * frameRate;
        const anglePerFrame = totalAngle / totalFrames;
        const nextAngle = nowAngle.current + anglePerFrame;

        if (animationDom1.current == null || animationDom2.current == null) {
            return;
        }

        if (nextAngle >= 360) {
            nowAngle.current = 0;
            props.setIsCanBet(false);
            plusAngle.current = 0;
            animationDom1.current.className = `countdown-little-circle white`;
            textDom.current.innerText = "00";
            animationDom2.current.style.transform = `rotate(0deg)`
        } else {
            if (nowAngle.current > 300) {
                animationDom1.current.className = `countdown-little-circle red`;
            } else if (nowAngle.current > 240) {
                animationDom1.current.className = `countdown-little-circle yellow`;
            } else {
                animationDom1.current.className = `countdown-little-circle white`;
            }

            nowAngle.current = nextAngle;
            textDom.current.innerText = getCountDownText();
            animationDom2.current.style.transform = `rotate(${nowAngle.current}deg)`

            requestAnimationFrame(refreshCountdown);
        }
    };

    const getCountDownText = () => {
        const second = parseInt((props.countdownData.remainingSecond * 1000 - (new Date() - props.countdownData.lastQueryDate)) / 1000);

        if (second < 10) {
            return ("0" + second);
        } else {
            return (second.toString());
        }
    };

    useEffect(() => {
        if (props.isCanBet === true) {
            if (props.countdownData.tableTimeoutSecond !== 0) {
                //設定起始角度
                let countdownSecond = props.countdownData.remainingSecond * 1000 - (new Date() - props.countdownData.lastQueryDate);

                if (countdownSecond > 0) {
                    nowAngle.current = (1 - (countdownSecond / (props.countdownData.tableTimeoutSecond * 1000))) * 360;
                    requestAnimationFrame(refreshCountdown);
                } else {
                    props.setIsCanBet(false);
                    textDom.current.innerText = "00";
                    animationDom2.current.style.transform = `rotate(0deg)`
                    animationDom1.current.className = `countdown-little-circle white`;
                    plusAngle.current = 0;
                    nowAngle.current = 0;
                }
            } else {
                props.setIsCanBet(false);
                textDom.current.innerText = "00";
                animationDom2.current.style.transform = `rotate(0deg)`
                animationDom1.current.className = `countdown-little-circle white`;
                plusAngle.current = 0;
                nowAngle.current = 0;
            }
        } else {
            textDom.current.innerText = "00";
            animationDom2.current.style.transform = `rotate(0deg)`
            animationDom1.current.className = `countdown-little-circle white`;
            plusAngle.current = 0;
            nowAngle.current = 0;
        }
    });



    return (
        <div className='countdown-little-box' >
            <div ref={animationDom1} className={"countdown-little-circle "}>
                <svg width="2rem" height="2rem" viewBox="0 0 64 64" >

                    <defs>
                        <mask id="clockMaskSmall">

                            <rect x="0" y="0" width="64" height="64" fill="white"></rect>


                            <rect x="29" y="14" width="6" height="20" fill="black"></rect>

                            <rect ref={animationDom2} x="29" y="6" width="6" height="26" fill="black" style={{ 'transformOrigin': 'center' }}></rect>
                            <circle cx="32" cy="32" r="4" fill="black"></circle>
                        </mask>
                    </defs>


                    <circle className='countdown-little-circle-back' cx="32" cy="32" r="30" mask="url(#clockMaskSmall)"></circle>


                </svg>
            </div>

            <div ref={textDom} className="countdown-little-text">60</div>
        </div>
    );
};

//由於有用到動畫計時，減少不必要的render
export default React.memo(CountdownLittleCircle, (prevProps, nextProps) => {
    let ret = false;

    if (prevProps.isCanBet === nextProps.isCanBet) {
        if (nextProps.countdownData === null) {
            ret = true
        } else {
            let prevCountdownSecond = prevProps.countdownData.remainingSecond * 1000 - (new Date() - prevProps.countdownData.lastQueryDate);
            let nowCountdownSecond = nextProps.countdownData.remainingSecond * 1000 - (new Date() - nextProps.countdownData.lastQueryDate);

            if (Math.abs(prevCountdownSecond - nowCountdownSecond) > 1000) {
                ret = true;
            } else {
                ret = false;
            }
        }
    } else {
        ret = true;
    }

    return ret;
});

