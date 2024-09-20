import React, { useEffect, useRef } from 'react';
import './index.scss';

const CountdownCircle = (props) => {
    const animationDom = useRef(null);//需要動態修改變量的Dom
    let prevCountdownData = useRef(null);

    let timer = useRef(0);
    // const countdownData = {
    //     remainingSecond:60,
    //     lastQueryDate:new Date(),
    //     tableTimeoutSecond:60
    // };

    const refreshCountdown = () => {

        const countdownData = props.getCountdownInfo();
        let countdownSecond = countdownData.remainingSecond * 1000 - (new Date() - countdownData.lastQueryDate);
        let percentage;
        let polygonText;

        countdownData.tableTimeoutSecond = 0;
        if (prevCountdownData.current == null) {
            prevCountdownData.current = countdownData;
        } else {
            let prevCountdownSecond = prevCountdownData.current.remainingSecond * 1000 - (new Date() - prevCountdownData.current.lastQueryDate);

            if (Math.abs(prevCountdownSecond - countdownSecond) < 1000) {
                countdownSecond = prevCountdownSecond;
            } else {
                //重新調準時間
                prevCountdownData.current = countdownData;
            }
        }

        countdownSecond = countdownSecond < 0 ? 0 : countdownSecond;

        percentage = countdownSecond / (countdownData.tableTimeoutSecond * 1000);

        //原先設計原型做法為以正方形為基準，描繪一個多邊形(最多六邊，少則三邊)，去控制消失的邊長，基於原先設計，去做處理，如果直接畫圓會較為簡單清晰
        if (percentage === 1) {
            polygonText = "(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0)";
        } else if (percentage >= 0.75) {
            const linePercentage = (1 - (percentage - 0.75) / 0.25) * 100;
            polygonText = `polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 ${linePercentage}%)`;
        } else if (percentage >= 0.5) {
            const linePercentage = (1 - (percentage - 0.5) / 0.25) * 100;
            polygonText = `polygon(50% 50%, 0 0, 100% 0, 100% 100%, ${linePercentage}% 100%)`;
        } else if (percentage >= 0.25) {
            const linePercentage = (percentage - 0.25) / 0.25 * 100;
            polygonText = `polygon(50% 50%, 0 0, 100% 0, 100% ${linePercentage}%)`;
        } else if (percentage >= 0) {
            const linePercentage = percentage / 0.25 * 100;
            polygonText = `polygon(50% 50%, 0 0, ${linePercentage}% 0)`;
        } else if (percentage === 0) {
            polygonText = `polygon(50% 50%, 0 0)`;
        }

        if (percentage > 0.33) {
            animationDom.current.className = `countdown-circle green show`;
        } else if (percentage > 0.15) {
            animationDom.current.className = `countdown-circle yellow show`;
        } else {
            animationDom.current.className = `countdown-circle red show`;
        }

        animationDom.current.style.setProperty('--PathContent', polygonText);
        animationDom.current.querySelector('.countdown-text').innerText = Math.ceil(countdownSecond / 1000).toString();
        //由於倒數時間更動頻繁，不適合用state


        if (parseInt(countdownSecond / 1000) === 0) {
            if (countdownData.tableTimeoutSecond !== 0) {
                props.setIsCanBet(false);
            } else {
                requestAnimationFrame(refreshCountdown);
            }
        } else {
            requestAnimationFrame(refreshCountdown);
        }
    };

    useEffect(() => {
        if (props.isCanBet && props.getCountdownInfo().tableTimeoutSecond !== 0) {
            requestAnimationFrame(refreshCountdown);
        }
    }, [props.isCanBet]);



    return (
        <div className='countdown-circle-box' >
            <div ref={animationDom} className={"countdown-circle " + ((props.isCanBet && props.getCountdownInfo().tableTimeoutSecond !== 0) ? "show" : "")}>
                        <div className="countdown-text"></div>
            </div>
        </div>
    );
};

//由於有用到動畫計時，減少不必要的render
export default React.memo(CountdownCircle, (prevProps, nextProps) => {
    return prevProps.isCanBet === nextProps.isCanBet;
});

