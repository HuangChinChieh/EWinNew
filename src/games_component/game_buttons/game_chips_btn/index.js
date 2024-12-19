import { useEffect, useState, useRef, useCallback } from 'react';
import './index.scss';
import { click } from '@testing-library/user-event/dist/click';

const GameChipsButton = (props) => {


    return (
        <div className={'game-chips-area ' + (props.isCanBet && 'can-bet')}>
            {/* {(!props.onGameSetAction && props.isCanBet) && <span onClick={handleConfirm} className='confirm'>確認</span>} */}
            <span onClick={() => { if (props.isCanBet) { props.handleBet('confirmBet', null, null) } }} className='confirm'>確認</span>
            <span onClick={() => { if (props.isCanBet) { props.handleBet('cancelBet', null, null) } }} className='cancel'>撤銷</span>
            <GameChipItems chipsItems={props.chipsItems} selIndex={props.selChipData.index} onChipSelect={props.setSelChipData} ></GameChipItems>
            <span onClick={() => { if (props.isCanBet) { props.handleBet('doubleBet', null, null) } }} className='double'>加倍</span>
        </div>
    )
};



const GameChipItems = ({ chipsItems, selIndex, onChipSelect }) => {
    //const [isMouseOnChipBox, setIsMouseOnChipBox] = useState(false);
    const [isShowLeftArrow, setIsShowLeftArrow] = useState(false);
    const [isShowRightArrow, setIsShowRightArrow] = useState(false);
    const chipsItemDivRef = useRef(null);
    const eachChipWidth = 68;
    const movingIndex = useRef(selIndex);

    const getEachChipRealWidth = () => {
        let chipRealWidth;
        const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

        chipRealWidth = eachChipWidth * htmlFontSize / 16;

        return chipRealWidth;
    };

    const checkShowArrow = () => {
        const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        if (chipsItemDivRef.current.scrollWidth === chipsItemDivRef.current.clientWidth) {
            setIsShowLeftArrow(false);
            setIsShowRightArrow(false);
        } else {
            if (chipsItemDivRef.current.scrollLeft !== 0) {
                setIsShowLeftArrow(true);
            } else {
                setIsShowLeftArrow(false);
            }


            if ((chipsItemDivRef.current.scrollLeft + chipsItemDivRef.current.clientWidth) < (chipsItemDivRef.current.scrollWidth - 6.5 * htmlFontSize)) {
          
                setIsShowRightArrow(true);
            } else {
                setIsShowRightArrow(false);
            }
        }
    };


    //direction 0 => left to right, 1=> right to left
    const chipsDivMove = (direction, movingCount) => {
        if (direction === 0) {
            chipsItemDivRef.current.scrollTo({
                left: chipsItemDivRef.current.scrollLeft + movingCount * getEachChipRealWidth(), // 滾動的目標位置
                behavior: 'smooth' // 平滑滾動
            });
        } else {
            chipsItemDivRef.current.scrollTo({
                left: chipsItemDivRef.current.scrollLeft - movingCount * getEachChipRealWidth(), // 滾動的目標位置
                behavior: 'smooth' // 平滑滾動
            });

        }
    };

    const resetScroll = ()=>{
        return;
        setTimeout(() => {
            if (movingIndex.current > 3) {
                chipsItemDivRef.current.scrollTo({
                    left: (movingIndex.current - 3) * getEachChipRealWidth(), // 滾動的目標位置
                    behavior: 'smooth' // 平滑滾動
                });
            } else {
                chipsItemDivRef.current.scrollTo({
                    left: 0, // 滾動的目標位置
                    behavior: 'smooth' // 平滑滾動
                });
            }
        }, 300);
    }

    const chipClick = useCallback((selData) => {
        //判斷要往右還是往左移動多少籌碼
        //選擇到的籌碼要移至中間(第五顆)

        let index = selData.index;
        movingIndex.current = index;
        if (index > 4) {
            chipsItemDivRef.current.scrollTo({
                left: (index - 4) * getEachChipRealWidth(), // 滾動的目標位置
                behavior: 'smooth' // 平滑滾動
            });
        } else {
            chipsItemDivRef.current.scrollTo({
                left: 0, // 滾動的目標位置
                behavior: 'smooth' // 平滑滾動
            });
        }

        onChipSelect(selData);
    }, [onChipSelect])

    return (
        <div className="game-chips-box">
            <div className='game-chips-expand-box'>
                <div className={`game-chips-expand-box-left ${isShowLeftArrow ? 'show' : ''}`} onClick={() => { chipsDivMove(1, 3); }}>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="24" height="24" data-icon="ChevronLeftStandard" aria-hidden="true"><path d="M8.41409 12L15.707 19.2928L14.2928 20.7071L6.29277 12.7071C6.10523 12.5195 5.99988 12.2652 5.99988 12C5.99988 11.7347 6.10523 11.4804 6.29277 11.2928L14.2928 3.29285L15.707 4.70706L8.41409 12Z" fill="currentColor"></path>
                        </svg>
                    </button>
                </div>
                <div ref={chipsItemDivRef} className='game-chips-box-middle' onScroll={() => { checkShowArrow(); }} onMouseOver={() => { setTimeout(() => { checkShowArrow(); }, 300); }} onMouseLeave={()=>{resetScroll();}}>
                    {
                        chipsItems.map((item, index) => (
                            <GameChipItem key={item.styleIndex} item={item} index={index} chipClick={chipClick} isAct={(selIndex === index)}></GameChipItem>
                        ))
                    }
                </div>

                <div className={`game-chips-expand-box-right ${isShowRightArrow ? 'show' : ''}`} onClick={() => { chipsDivMove(0, 3); }}>
                    <button >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 24 24" width="24" height="24" data-icon="ChevronRightStandard" aria-hidden="true"><path d="M15.5859 12L8.29303 19.2928L9.70725 20.7071L17.7072 12.7071C17.8948 12.5195 18.0001 12.2652 18.0001 12C18.0001 11.7347 17.8948 11.4804 17.7072 11.2928L9.70724 3.29285L8.29303 4.70706L15.5859 12Z" fill="currentColor"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const GameChipItem = ({ item, index, chipClick, isAct }) => {
    const [isMoving, setIsMoving] = useState(false);


    const onChipClick = (event, chipItem, index) => {
        setIsMoving(true);

        if (chipClick) {
            chipClick({ ...chipItem, index: index });
        }
    };

    useEffect(() => {
        if (isMoving) {
            setTimeout(() => {
                setIsMoving(false);
            }, 300);
        }
    }, [isMoving])

    return (
        <div className={`game-chip chips-${item.styleIndex} ${isAct ? 'act' : ''}  ${isMoving ? 'chip-move' : ''} `}
            onClick={(event) => (onChipClick(event, item, index))}>
            <div className='game-chip-box'>
                <div>{item.showText}</div>
            </div>
        </div>
    );
};





export default (GameChipsButton);