import React, { useEffect, useRef } from 'react';
import './index.scss';

const CountdownCircle = (props) => {
    const animationDom = useRef(null);//需要動態修改變量的Dom
    const refreshCountdown = () => {
        const countdownData = props.getCountdownInfo();
        let countdownSecond = countdownData.remainingSecond * 1000 - (new Date() - countdownData.lastQueryDate);
        let percentage;
        let polygonText;

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
            animationDom.className = `countdown-circle green`;
        } else if (percentage > 0.15) {
            animationDom.className = `countdown-circle yellow`;
        } else {
            animationDom.className = `countdown-circle red`;
        }

        animationDom.style.setProperty('--PathContent', polygonText);
        animationDom.querySelector('.countdown-text').innerText = Math.ceil(percentage).toString();
        //由於倒數時間更動頻繁，不適合用state
    };

    useEffect(() => {
        if(props.isCanBet){
            let timer;
        
            function animate() {
                refreshCountdown();
                timer = requestAnimationFrame(animate);
            }
    
            animate();
    
            return () => { cancelAnimationFrame(timer) };
        }       
    }, [props.isCanBet]);



    return (
        <div className='countdown-circle-box' >
            {/* {!isOnCountdown
                ?
                <div className={`countdown-circle red done`}>
                    <div className="countdown-text">{props.RemainingSecond}</div>
                </div>
                :
                <div className={`countdown-circle ${props.RemainingSecond >= 20 ? 'green' : props.seconds <= 9 ? 'red' : 'yellow'}`} style={{ '--countdown-duration': `${tableTimeoutSecond}s` }}>
                    <div className="countdown-text">{props.RemainingSecond}</div>
                </div>
            } */}


            {
                props.isCanBet ?
                    <div ref={animationDom} className="countdown-circle">
                        <div className="countdown-text"></div>
                    </div>
                    :
                    <div className={`countdown-circle red done`}>
                    </div>
            }
        </div>
    );
};

//由於有用到動畫計時，減少不必要的render
export default React.memo(CountdownCircle, (prevProps, nextProps) => {
    return prevProps.isCanBet === nextProps.isCanBet;
});

