import { useState, useEffect } from 'react';
import './index.scss';

const GameChipsButton = ((props) => {
    const chipsItem = [
        { chipsId: 0 },
        { chipsId: 1 },
        { chipsId: 2 },
        { chipsId: 3 },
        { chipsId: 4 },
        { chipsId: 5 },
        { chipsId: 6 },
        { chipsId: 7 }
    ]

    // const [defaultClick, setDefaultClick] = useState('show');
    
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);


        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [windowWidth]);

    const handleClick = (event) => {
        const chipsId = parseInt(event.currentTarget.className.split('-')[1], 10);
        console.log('chipsId', chipsId);

        if (chipsId !== props.defaultChipsId) {
            dispatch(setDefaultChipsId(chipsId));
            dispatch(checkClickChipsId(''));
        }

        props.setIsAnimationActive1('');
        props.setIsAnimationActive2('');
        props.setIsAnimationActive3('');
        props.setIsAnimationActive4('');
        props.setIsAnimationActive5('');


        // console.log('windowWidth', windowWidth)

        // 橫版切換需收回
        if (windowWidth === 640 || windowWidth === 667 || windowWidth === 568 || windowWidth === 896 || windowWidth === 933 || windowWidth === 845 || windowWidth === 787 || windowWidth === 916 || windowWidth === 896 || windowWidth === 736 || windowWidth === 812) {
            props.setDefaultClick('show');
        }

    };

    const [initialized, setInitialized] = useState(true);

    useEffect(() => {
        if (!initialized) {
            const timerLoading = setTimeout(() => {
                props.setIsAnimationActive1(true);
                props.setIsAnimationActive2(true);
                props.setIsAnimationActive3(true);
                props.setIsAnimationActive4(true);
                props.setIsAnimationActive5(true);

                // 在1秒后执行第二组动作
                setTimeout(() => {
                    props.setIsAnimationActive1(false);
                    props.setIsAnimationActive2(false);
                    props.setIsAnimationActive3(false);
                    props.setIsAnimationActive4(false);
                    props.setIsAnimationActive5(false);
                }, 1000);

                setInitialized(true);
            }, 100);

            return () => clearTimeout(timerLoading);
        }
    }, [initialized]);

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

    const handleDouble = () => {
        // 這邊加倍感覺有問題, 應該不是 total值加倍, 是籌碼加倍, 再與設計確認
        props.setTotalChips1(props.totalChips1 * 2);
        props.setTotalChips2(props.totalChips2 * 2);
        props.setTotalChips3(props.totalChips3 * 2);
        props.setTotalChips4(props.totalChips4 * 2);
        props.setTotalChips5(props.totalChips5 * 2);

        props.setIsAnimationActive1(false);
        props.setIsAnimationActive2(false);
        props.setIsAnimationActive3(false);
        props.setIsAnimationActive4(false);
        props.setIsAnimationActive5(false);
        setInitialized(false);


    }
    //投注確認
    const handleConfirm = () => {

    }

    
    return (
        <div>
            <span onClick={handleConfirm} className='confirm'>確認</span>
            <span onClick={handleCancel} className='cancel'>撤銷</span>
            <div className="game-chips-box">
                <div className={props.defaultClick}>
                    <div className={`default-click chips-${props.defaultChipsId}`} onClick={() => props.setDefaultClick('none')}></div>
                    {
                        chipsItem.map((item) => (
                            <span
                                key={item.chipsId}
                                className={`chips-${item.chipsId} ${props.defaultChipsId === item.chipsId ? 'act' : ''}`}
                                onClick={handleClick}
                            />
                        ))
                    }
                </div>
            </div>
            <span onClick={handleDouble} className='double'>加倍</span>
            <span onClick={handleDouble} className='double'>加值</span>
        </div>
    )
})


const mapStateToProps = (state) => {
    // console.log('檢查state', state);
    // console.log('檢查state.defaultChipsId', state.root.defaultChipsId);
    // console.log('numberOfClicks', state.root.numberOfClicks)
    return {
        defaultChipsId: state.root.defaultChipsId,
        clickChipsId: state.root.clickChipsId,
        numberOfClick: state.root.numberOfClick,
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
        isAnimationActive1: state.root.isAnimationActive1,
        isAnimationActive2: state.root.isAnimationActive2,
        isAnimationActive3: state.root.isAnimationActive3,
        isAnimationActive4: state.root.isAnimationActive4,
        isAnimationActive5: state.root.isAnimationActive5,
        // clickCount: state.root.clickCount,
    };
};


const mapDispatchToProps = (dispatch) => ({
    setDefaultChipsId,
    checkClickChipsId,
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
    // setIsAnimationActive1: (isActive) => dispatch(setIsAnimationActive1(isActive)),
    // setIsAnimationActive2: (isActive) => dispatch(setIsAnimationActive2(isActive)),
    // setIsAnimationActive3: (isActive) => dispatch(setIsAnimationActive3(isActive)),
    // setIsAnimationActive4: (isActive) => dispatch(setIsAnimationActive4(isActive)),
    // setIsAnimationActive5: (isActive) => dispatch(setIsAnimationActive5(isActive)),
    setIsAnimationActive1: (isAnimationActive1) => dispatch(setIsAnimationActive1(isAnimationActive1)),
    setIsAnimationActive2: (isAnimationActive2) => dispatch(setIsAnimationActive2(isAnimationActive2)),
    setIsAnimationActive3: (isAnimationActive3) => dispatch(setIsAnimationActive3(isAnimationActive3)),
    setIsAnimationActive4: (isAnimationActive4) => dispatch(setIsAnimationActive4(isAnimationActive4)),
    setIsAnimationActive5: (isAnimationActive5) => dispatch(setIsAnimationActive5(isAnimationActive5)),
    setDefaultClick: (defaultClick) => dispatch(setDefaultClick(defaultClick)),
});


export default connect(mapStateToProps, mapDispatchToProps)(GameChipsButton);