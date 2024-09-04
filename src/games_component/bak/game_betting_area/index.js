import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBox from 'games_component/game_buttons/game_btn_box';
import GameChipsButton from 'games_component/game_buttons/game_chips_btn';

import './index.scss';
import './animations.scss';
import './media.scss';

// 之後會優化代碼

const GameBettingArea = (props) => {    
    const canvasRef = useRef(null);
    const pathRef1 = useRef(null);
    const pathRef2 = useRef(null);
    const pathRef3 = useRef(null);
    const pathRef4 = useRef(null);
    const pathRef5 = useRef(null);

    // const [isAct1, setIsAct1] = useState('');
    // const [isAct2, setIsAct2] = useState('');
    // const [isAct3, setIsAct3] = useState('');
    // const [isAct4, setIsAct4] = useState('');
    // const [isAct5, setIsAct5] = useState('');

    // const [totalChips1, setTotalChips1] = useState(0);
    // const [totalChips2, setTotalChips2] = useState(0);
    // const [totalChips3, setTotalChips3] = useState(0);
    // const [totalChips4, setTotalChips4] = useState(0);
    // const [totalChips5, setTotalChips5] = useState(0);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const getChipsId = props.defaultChipsId;
    const [chips, setChips] = useState(0);
    const [buttonClickCounts, setButtonClickCounts] = useState({ btn1: 0, btn2: 0, btn3: 0, btn4: 0, btn5: 0 });

    const numberOfClick1 = props.numberOfClick1;
    const numberOfClick2 = props.numberOfClick2;
    const numberOfClick3 = props.numberOfClick3;
    const numberOfClick4 = props.numberOfClick4;
    const numberOfClick5 = props.numberOfClick5;

    const chipsDenominations = [25, 50, 100, 500, 1000, 1250, 5000, 10000];



    const updateButtonClickCount = (button) => {
        setButtonClickCounts((prevCounts) => ({
            ...prevCounts,
            [button]: prevCounts[button] + 1
        }));
    };


    useEffect(() => {
        setChips([25, 50, 100, 500, 1000, 1250, 5000, 10000][props.defaultChipsId]);
        // setButtonClickCounts({ btn1: 0, btn2: 0, btn3: 0, btn4: 0, btn5: 0 });
    }, [props.defaultChipsId]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);


        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [windowWidth]);

    useEffect(() => {
        if (props.seconds === 0) {
            props.setIsAct1('');
            props.setIsAct2('');
            props.setIsAct3('');
            props.setIsAct4('');
            props.setIsAct5('');
            props.setTotalChips1(0);
            props.setTotalChips2(0);
            props.setTotalChips3(0);
            props.setTotalChips4(0);
            props.setTotalChips5(0);
            // setCheckNumberOfClick1(0);
            // setCheckNumberOfClick2(0);
            setButtonClickCounts({ btn1: 0, btn2: 0, btn3: 0, btn4: 0, btn5: 0 });
        }
    }, [props.seconds])


    useEffect(() => {

        if (props.seconds === 0) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        const widthForPC = (() => {
            //第一顆按鈕控制path
            const path1 = new Path2D();
            // 繪製背景
            // ctx.beginPath();
            //初始點
            path1.moveTo(0, 0);
            path1.lineTo(0, canvas.height / 1.45);
            path1.lineTo(canvas.width / 40, canvas.height / 1.2);
            path1.lineTo(canvas.width / 11.2, canvas.height);
            path1.lineTo(canvas.width / 4.55, canvas.height);
            path1.lineTo(canvas.width / 3, canvas.height / 1.6);
            path1.lineTo(canvas.width / 5.3, canvas.height / 1.6);
            path1.lineTo(canvas.width / 7.5, canvas.height / 1.9);
            path1.lineTo(canvas.width / 10, canvas.height / 2.8);
            path1.lineTo(canvas.width / 11, canvas.height / 3.7);
            path1.lineTo(canvas.width / 11, 1);
            path1.lineTo(0, 0);
            ctx.fillStyle = 'rgba(255,255,255,0)';
            ctx.fill(path1);
            pathRef1.current = path1;

            //第二顆按鈕控制path
            const path2 = new Path2D();
            path2.moveTo(canvas.width / 3, canvas.height / 1.6);
            path2.lineTo(canvas.width / 4.6, canvas.height);
            path2.lineTo(canvas.width / 1.3, canvas.height);
            path2.lineTo(canvas.width / 1.5, canvas.height / 1.6);
            path2.lineTo(canvas.width / 3, canvas.height / 1.6);
            ctx.fillStyle = 'rgba(220,155,255,0)';
            ctx.fill(path2);
            pathRef2.current = path2;

            //第三顆按鈕控制path
            const path3 = new Path2D();
            path3.moveTo(canvas.width / 1.5, canvas.height / 1.6);
            path3.lineTo(canvas.width / 1.3, canvas.height);
            path3.lineTo(canvas.width / 1.095, canvas.height);
            path3.lineTo(canvas.width / 1.02, canvas.height / 1.2);
            path3.lineTo(canvas.width / 1, canvas.height / 1.5);
            path3.lineTo(canvas.width, 0);
            path3.lineTo(canvas.width / 1.11, 0);
            path3.lineTo(canvas.width / 1.1, canvas.height / 3.2);
            path3.lineTo(canvas.width / 1.2, canvas.height / 1.6);
            path3.lineTo(canvas.width / 1.5, canvas.height / 1.6);
            ctx.fillStyle = 'rgba(0,255,125,0)';
            ctx.fill(path3);
            pathRef3.current = path3;
            //第四顆按鈕控制path
            const path4 = new Path2D();
            path4.moveTo(canvas.width / 1.12, 0);
            path4.lineTo(canvas.width / 1.98, 0);
            path4.lineTo(canvas.width / 1.98, canvas.height / 1.7);
            path4.lineTo(canvas.width / 1.25, canvas.height / 1.7);
            path4.lineTo(canvas.width / 1.18, canvas.height / 2);
            path4.lineTo(canvas.width / 1.14, canvas.height / 2.5);
            path4.lineTo(canvas.width / 1.13, canvas.height / 3);
            path4.lineTo(canvas.width / 1.12, canvas.height / 4);
            ctx.fillStyle = 'rgba(255,0,12,0)';
            ctx.fill(path4);
            pathRef4.current = path4;

            //第五顆按鈕控制path
            const path5 = new Path2D();
            path5.moveTo(canvas.width / 2, 0);
            path5.lineTo(canvas.width / 9.2, 0);
            path5.lineTo(canvas.width / 9.5, canvas.height / 3.6);
            path5.lineTo(canvas.width / 8, canvas.height / 2.5);
            path5.lineTo(canvas.width / 7.3, canvas.height / 2.2);
            path5.lineTo(canvas.width / 5.9, canvas.height / 1.9);
            path5.lineTo(canvas.width / 5, canvas.height / 1.7);
            path5.lineTo(canvas.width / 2, canvas.height / 1.7);
            path5.lineTo(canvas.width / 2, 0);
            ctx.fillStyle = 'rgba(218,0,123,0)';
            ctx.fill(path5);
            pathRef5.current = path5;
        })
        const widthForMb = (() => {
            //第一顆按鈕控制path
            const path1 = new Path2D();
            // 繪製背景
            // ctx.beginPath();
            //初始點
            path1.moveTo(0, 0);
            path1.lineTo(0, canvas.height / 1.25);
            path1.lineTo(canvas.width / 11, canvas.height);
            path1.lineTo(canvas.width / 4.6, canvas.height);
            path1.lineTo(canvas.width / 3.15, canvas.height / 1.6);
            path1.lineTo(canvas.width / 5, canvas.height / 1.6);
            path1.lineTo(canvas.width / 7.5, canvas.height / 1.85);
            path1.lineTo(canvas.width / 10.8, canvas.height / 2.5);
            path1.lineTo(canvas.width / 10.8, 0);
            path1.lineTo(0, 0);
            ctx.fillStyle = 'rgba(255,255,255,0)';
            ctx.fill(path1);
            pathRef1.current = path1;

            //第二顆按鈕控制path
            const path2 = new Path2D();
            path2.moveTo(canvas.width / 3, canvas.height / 1.6);
            path2.lineTo(canvas.width / 4.6, canvas.height);
            path2.lineTo(canvas.width / 1.3, canvas.height);
            path2.lineTo(canvas.width / 1.5, canvas.height / 1.6);
            path2.lineTo(canvas.width / 3, canvas.height / 1.6);
            ctx.fillStyle = 'rgba(220,155,255,0)';
            ctx.fill(path2);
            pathRef2.current = path2;

            //第三顆按鈕控制path
            const path3 = new Path2D();
            path3.moveTo(canvas.width / 1.5, canvas.height / 1.6);
            path3.lineTo(canvas.width / 1.3, canvas.height);
            path3.lineTo(canvas.width / 1.1, canvas.height);
            path3.lineTo(canvas.width / 1.05, canvas.height / 1.05);
            path3.lineTo(canvas.width / 1.02, canvas.height / 1.12);
            path3.lineTo(canvas.width / 1, canvas.height / 1.2);
            path3.lineTo(canvas.width / 1, canvas.height / 1.5);
            path3.lineTo(canvas.width, 0);
            path3.lineTo(canvas.width / 1.09, 0);
            path3.lineTo(canvas.width / 1.09, canvas.height / 3.2);
            path3.lineTo(canvas.width / 1.12, canvas.height / 2.1);
            path3.lineTo(canvas.width / 1.2, canvas.height / 1.7);
            path3.lineTo(canvas.width / 1.5, canvas.height / 1.6);
            ctx.fillStyle = 'rgba(0,255,125,0)';
            ctx.fill(path3);
            pathRef3.current = path3;
            //第四顆按鈕控制path
            const path4 = new Path2D();
            path4.moveTo(canvas.width / 1.12, 0);
            path4.lineTo(canvas.width / 1.98, 0);
            path4.lineTo(canvas.width / 1.98, canvas.height / 1.7);
            path4.lineTo(canvas.width / 1.25, canvas.height / 1.7);
            path4.lineTo(canvas.width / 1.17, canvas.height / 2);
            path4.lineTo(canvas.width / 1.15, canvas.height / 2.2);
            path4.lineTo(canvas.width / 1.14, canvas.height / 2.5);
            path4.lineTo(canvas.width / 1.13, canvas.height / 3);
            path4.lineTo(canvas.width / 1.12, canvas.height / 4);
            ctx.fillStyle = 'rgba(255,0,12,0)';
            ctx.fill(path4);
            pathRef4.current = path4;

            //第五顆按鈕控制path
            const path5 = new Path2D();
            path5.moveTo(canvas.width / 2, 0);
            path5.lineTo(canvas.width / 9, 0);
            path5.lineTo(canvas.width / 9.4, canvas.height / 3.6);
            path5.lineTo(canvas.width / 8, canvas.height / 2.5);
            path5.lineTo(canvas.width / 7.3, canvas.height / 2.2);
            path5.lineTo(canvas.width / 5.9, canvas.height / 1.9);
            path5.lineTo(canvas.width / 5, canvas.height / 1.7);
            path5.lineTo(canvas.width / 2, canvas.height / 1.7);
            path5.lineTo(canvas.width / 2, 0);
            ctx.fillStyle = 'rgba(218,0,123,0)';
            ctx.fill(path5);
            pathRef5.current = path5;
        })

        // 判斷螢幕寬度後必須重新配置新的寬高, 重新畫path

        // const parentWidth = canvas.parentElement.clientWidth;
        // canvas.width = parentWidth;
        if (windowWidth < 320) {
            canvas.width = 304;
            canvas.height = 152;
            widthForMb()

        } else if (windowWidth < 340) {
            canvas.width = 304;
            canvas.height = 152;
            widthForMb()
        } else if ((windowWidth < 361)) {
            canvas.width = 330;
            canvas.height = 166;
            widthForMb();
        } else if ((windowWidth < 378)) {
            canvas.width = 350;
            canvas.height = 170;
            widthForMb();
        } else if ((windowWidth < 415)) {
            canvas.width = 375;
            canvas.height = 185;
            widthForMb();
        } else if ((windowWidth < 435)) {
            canvas.width = 410;
            canvas.height = 195;
            widthForMb();
        } else if ((windowWidth < 502)) {
            canvas.width = 425;
            canvas.height = 120;
            widthForPC();
        } else if ((windowWidth < 729)) {
            canvas.width = 502;
            canvas.height = 142;
            widthForPC();
        } else if ((windowWidth < 897)) {
            canvas.width = 612;
            canvas.height = 173;
            widthForPC();
        } else {
            canvas.width = 714;
            canvas.height = 202;
            widthForPC();

        }


        const handleClick = (event) => {

            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (ctx.isPointInPath(pathRef1.current, mouseX, mouseY)) {
                props.setIsAct1('isAct');
                dispatch(checkClickChipsId('clickBtn1'));
                updateButtonClickCount('btn1');

                // 寫入 redux後需要更改寫法
                const newTotalChips1 = buttonClickCounts.btn1 > 0 ? props.totalChips1 + chips : chips;
                props.setTotalChips1(newTotalChips1);

                // if (buttonClickCounts.btn1 > 0) {
                //     props.setTotalChips1(prevTotalChips => {
                //         return prevTotalChips + chips;
                //     });

                // } else {
                //     props.setTotalChips1(chips);
                // }

                if (props.clickChipsId === 'clickBtn1') {
                    dispatch(setCheckNumberOfClick1(numberOfClick1 + 1));
                }

                props.setIsAnimationActive1('');

                setTimeout(() => {
                    props.setIsAnimationActive1('active');
                }, 200);

            } else if (ctx.isPointInPath(pathRef2.current, mouseX, mouseY)) {
                props.setIsAct2('isAct');
                dispatch(checkClickChipsId('clickBtn2'));
                updateButtonClickCount('btn2');
                const newTotalChips2 = buttonClickCounts.btn2 > 0 ? props.totalChips2 + chips : chips;
                props.setTotalChips2(newTotalChips2);

                // if (buttonClickCounts.btn2 > 0) {
                //     setTotalChips2(prevTotalChips => {
                //         return prevTotalChips + chips;
                //     });
                // } else {
                //     setTotalChips2(chips);
                // }

                if (props.clickChipsId === 'clickBtn2') {
                    dispatch(setCheckNumberOfClick2(numberOfClick2 + 1));
                }

                props.setIsAnimationActive2('');

                setTimeout(() => {
                    props.setIsAnimationActive2('active');
                }, 200);

            } else if (ctx.isPointInPath(pathRef3.current, mouseX, mouseY)) {
                props.setIsAct3('isAct');
                dispatch(checkClickChipsId('clickBtn3'));
                updateButtonClickCount('btn3');
                const newTotalChips3 = buttonClickCounts.btn3 > 0 ? props.totalChips3 + chips : chips;
                props.setTotalChips3(newTotalChips3);
                // if (buttonClickCounts.btn3 > 0) {
                //     setTotalChips3(prevTotalChips => {
                //         return prevTotalChips + chips;
                //     });
                // } else {
                //     setTotalChips3(chips);
                // }

                if (props.clickChipsId === 'clickBtn3') {
                    dispatch(setCheckNumberOfClick3(numberOfClick3 + 1));
                }

                props.setIsAnimationActive3('');

                setTimeout(() => {
                    props.setIsAnimationActive3('active');
                }, 200);

            } else if (ctx.isPointInPath(pathRef4.current, mouseX, mouseY)) {
                props.setIsAct4('isAct');
                dispatch(checkClickChipsId('clickBtn4'));
                updateButtonClickCount('btn4');
                const newTotalChips4 = buttonClickCounts.btn4 > 0 ? props.totalChips4 + chips : chips;
                props.setTotalChips4(newTotalChips4);
                // if (buttonClickCounts.btn4 > 0) {
                //     setTotalChips4(prevTotalChips => {
                //         return prevTotalChips + chips;
                //     });

                // } else {
                //     setTotalChips4(chips);
                // }

                if (props.clickChipsId === 'clickBtn4') {
                    dispatch(setCheckNumberOfClick4(numberOfClick4 + 1));
                }

                props.setIsAnimationActive4('');

                setTimeout(() => {
                    props.setIsAnimationActive4('active');
                }, 200);

            } else if (ctx.isPointInPath(pathRef5.current, mouseX, mouseY)) {
                props.setIsAct5('isAct');
                dispatch(checkClickChipsId('clickBtn5'));
                updateButtonClickCount('btn5');
                const newTotalChips5 = buttonClickCounts.btn5 > 0 ? props.totalChips5 + chips : chips;
                props.setTotalChips5(newTotalChips5);
                // if (buttonClickCounts.btn5 > 0) {
                //     setTotalChips5(prevTotalChips => {
                //         return prevTotalChips + chips;
                //     });
                // } else {
                //     setTotalChips5(chips);
                // }

                if (props.clickChipsId === 'clickBtn5') {
                    dispatch(setCheckNumberOfClick5(numberOfClick5 + 1));
                }

                props.setIsAnimationActive5('');

                setTimeout(() => {
                    props.setIsAnimationActive5('active');
                }, 200);
            }
            else {

            }

        };

        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('click', handleClick);
        };


    }, [
        windowWidth,
        props.seconds,
        buttonClickCounts,
        chips
    ])


    // 限制只顯示3筆, 模擬 totalchips值 由低到高
    const renderAnimations = (totalChips, divClassNamePrefix) => {
        const animations = [];
        let generatedDivs = 0; // 已生成的 div 數量
        let remainingChips = totalChips;

        for (let i = chipsDenominations.length - 1; i >= 0 && generatedDivs < 3; i--) {
            const chipsDenomination = chipsDenominations[i];
            const numberOfChips = Math.floor(remainingChips / chipsDenomination);

            for (let j = 0; j < numberOfChips && generatedDivs < 3; j++) {
                animations.push(
                    <div key={generatedDivs} className={`${divClassNamePrefix} animation-${generatedDivs + 1}`}>
                        <img src={require(`../../img/games/chips/chips-${chipsDenomination}.png`)} alt={chipsDenomination} />
                    </div>
                );
                generatedDivs++;
            }

            remainingChips -= numberOfChips * chipsDenomination;
        }
        return animations;
    };

    const animations1 = renderAnimations(props.totalChips1, "clickBtn1");
    const animations2 = renderAnimations(props.totalChips2, "clickBtn2");
    const animations3 = renderAnimations(props.totalChips3, "clickBtn3");
    const animations4 = renderAnimations(props.totalChips4, "clickBtn4");
    const animations5 = renderAnimations(props.totalChips5, "clickBtn5");



    return (
        <div className='game-betting-area'>
            <div className='game-betting-area-box'>
                <div className='left-box'>

                </div>
                <div
                    className={`middle-box ${props.seconds === 0 ? 'disable' : 'enable'}`}>
                    <canvas ref={canvasRef} />
                    <ButtonBox label={t('Global.p_pair')} bglabel="" totalChips={props.totalChips1} isAct={props.isAct1} animations={animations1} getChipsId={getChipsId} isAnimationActive={props.isAnimationActive1} btn="btn1" />
                    <ButtonBox label={t('Global.tie')} bglabel="" totalChips={props.totalChips2} isAct={props.isAct2} animations={animations2} getChipsId={getChipsId} isAnimationActive={props.isAnimationActive2} btn="btn2" />
                    <ButtonBox label={t('Global.b_pair')} bglabel="" totalChips={props.totalChips3} isAct={props.isAct3} animations={animations3} getChipsId={getChipsId} isAnimationActive={props.isAnimationActive3} btn="btn3" />
                    <ButtonBox label={t('Global.banker')} bglabel={t('Global.banker')} totalChips={props.totalChips4} isAct={props.isAct4} animations={animations4} getChipsId={getChipsId} isAnimationActive={props.isAnimationActive4} btn="btn4" />
                    <ButtonBox label={t('Global.player')} bglabel={t('Global.player')} totalChips={props.totalChips5} isAct={props.isAct5} animations={animations5} getChipsId={getChipsId} isAnimationActive={props.isAnimationActive5} btn="btn5" />
                    {/* <div className={`btn1 btn-box ${isAct1}`} >
                        <div className="info-box">
                            <p>{t('Global.p_pair')}</p>
                            <div className={`chips-animation-box chipsId-${getChipsId} ${props.isAnimationActive1 ? 'active' : ''}`}>
                                <span>
                                    {totalChips1 !== 0 ? totalChips1 : ''}
                                </span>
                                {isAct1 && animations1}
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className='right-box'>

                </div>
            </div>
            <div className='game-box-straight'>
                <GameChipsButton />
            </div>
        </div >
    )
}

const mapStateToProps = (state) => {
    // console.log('defaultChipsId', state.root.defaultChipsId);
    // console.log('clickChipsId', state.root.clickChipsId);
    // console.log('檢查state.clickCount', state.root.clickCount);
    return {
        defaultChipsId: state.root.defaultChipsId,
        clickChipsId: state.root.clickChipsId,
        // seconds: state.root.seconds,
        numberOfClick: state.root.numberOfClick,
        numberOfClick1: state.root.numberOfClick1,
        numberOfClick2: state.root.numberOfClick2,
        numberOfClick3: state.root.numberOfClick3,
        numberOfClick4: state.root.numberOfClick4,
        numberOfClick5: state.root.numberOfClick5,
        isAnimationActive1: state.root.isAnimationActive1,
        isAnimationActive2: state.root.isAnimationActive2,
        isAnimationActive3: state.root.isAnimationActive3,
        isAnimationActive4: state.root.isAnimationActive4,
        isAnimationActive5: state.root.isAnimationActive5,
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
    setDefaultChipsId,
    checkClickChipsId,
    // setSeconds,
    setCheckNumberOfClick1,
    setCheckNumberOfClick2,
    setCheckNumberOfClick3,
    setCheckNumberOfClick4,
    setCheckNumberOfClick5,
    setIsAnimationActive1: (isActive) => dispatch(setIsAnimationActive1(isActive)),
    setIsAnimationActive2: (isActive) => dispatch(setIsAnimationActive2(isActive)),
    setIsAnimationActive3: (isActive) => dispatch(setIsAnimationActive3(isActive)),
    setIsAnimationActive4: (isActive) => dispatch(setIsAnimationActive4(isActive)),
    setIsAnimationActive5: (isActive) => dispatch(setIsAnimationActive5(isActive)),
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

});

export default connect(mapStateToProps, mapDispatchToProps)(GameBettingArea);