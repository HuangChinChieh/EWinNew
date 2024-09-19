import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useState, memo } from 'react';
import './index.scss';


const Card = (props) => {
    const frontDom = useRef(null);
    const backDom = useRef(null);
    const getParentClass = () => {
        let ret = "";
        if (props.isFlip) {
            if (props.isT) {
                ret = "flip-container2_t";
            } else {
                ret = "flip-container2";
            }
        } else {
            if (props.isT) {
                ret = "flip-container_t";
            } else {
                ret = "flip-container";
            }
        }

        return ret;
    };

    const cardInfoToImgFile = (singleCardInfo, isT) => {
        var cardColor;
        var cardPoint;
        var retValue = "";

        cardColor = singleCardInfo.substr(0, 1);
        cardPoint = singleCardInfo.substr(1, 1);

        retValue = cardValueToColor(cardColor);

        switch (cardPoint.toUpperCase()) {
            case "0":
                retValue += "_10";
                break;
            case "J":
                retValue += "_11";
                break;
            case "Q":
                retValue += "_12";
                break;
            case "K":
                retValue += "_13";
                break;
            default:
                retValue += "_" + cardPoint;
        }

        if (isT) {
            retValue += "_t.png";
        } else {
            retValue += ".png";
        }

        return retValue;
    };

    const cardValueToColor = (color) => {
        var retValue = "";

        //00=沒有牌/每兩個字元一組, 第一字元花色(1梅2方3心4桃), 第二字元點數(0-9,JQK), 排列為: 閒,閒,庄,庄,閒補,庄補
        switch (color) {
            case "1":
                retValue = "club";
                break;
            case "2":
                retValue = "diamond";
                break;
            case "3":
                retValue = "heart";
                break;
            case "4":
                retValue = "spade";
                break;
            default:
                break;
        }

        return retValue;
    }


    const getChildDom = () => {
        return (
            <>
                <div className={props.isT ? "front_t" : "front"} ref={frontDom}></div>
                <div className={props.isT ? "back_t" : "back"} ref={backDom}></div>
            </>
        )
    };


    useEffect(() => {
        props.getImage(cardInfoToImgFile(props.singleCardInfo, props.isT), (imgDom) => {
            backDom.appendChild(imgDom);
        })

        if (props.isT) {
            props.getImage("card_back_t.png", (imgDom) => {
                frontDom.appendChild(imgDom);
            })
        } else {
            props.getImage("card_back.png", (imgDom) => {
                frontDom.appendChild(imgDom);
            })
        }

    });

    if (props.singleCardInfo !== "" && props.singleCardInfo !== "00") {
        return (<div id={props.id} className={getParentClass()}>{getChildDom()}</div>);
    } else {
        return (<></>);
    }
};

const CardResult = forwardRef((props, ref) => {
    //採用關閉，開啟曝露給父組件的設計方式


    const [isOpening, setIsOpening] = useState(false);
    const [cardInfo, setCardInfo] = useState("");
    const completedCallback = useRef(null);    // UI 只需要等待畫面上六張牌載入完成    // 載入過的牌組將會暫存在此, 如果重複開出可立即取用
    const jobList = useRef([]);
    const jobId = useRef(0);
    const jobRunningId = useRef(-1);
    const jobTimerId = useRef(-1);
    const isJobRunning = useRef(false);

    const [p1CardInfo, setP1CardInfo] = useState("");
    const [p2CardInfo, setP2CardInfo] = useState("");
    const [p3CardInfo, setP3CardInfo] = useState("");
    const [b1CardInfo, setB1CardInfo] = useState("");
    const [b2CardInfo, setB2CardInfo] = useState("");
    const [b3CardInfo, setB3CardInfo] = useState("");
    const [p1Flip, setP1Flip] = useState(false);
    const [p2Flip, setP2Flip] = useState(false);
    const [p3Flip, setP3Flip] = useState(false);
    const [b1Flip, setB1Flip] = useState(false);
    const [b2Flip, setB2Flip] = useState(false);
    const [b3Flip, setB3Flip] = useState(false);

    const [resultType, setResultType] = useState("");
    const [playerPoint, setPlayerPoint] = useState("");
    const [bankerPoint, setBankerPoint] = useState("");
    const imageCache = useRef({});

    const onReady = () => {
        if (cardInfo !== "") {
            let tp1 = "";
            let tp2 = "";
            let tp3 = "";
            let tb1 = "";
            let tb2 = "";
            let tb3 = "";

            tp1 = cardInfo.substring(0, 2);
            tp2 = cardInfo.substring(2, 2);
            tb1 = cardInfo.substring(4, 2);
            tb2 = cardInfo.substring(6, 2);

            if (cardInfo.length > 8) {
                tp3 = cardInfo.substring(8, 2);
                // 過濾 00
                if (tp3 === "00") {
                    tp3 = "";
                }
            }

            if (cardInfo.length > 10) {
                tb3 = cardInfo.substring(10, 2);
                // 過濾 00
                if (tb3 === "00") {
                    tb3 = "";
                }
            }

            setP1CardInfo(tp1);
            setP1Flip(false);
            jobList.current.push({ cmd: "fPCard1", delay: 50 });

            setP2CardInfo(tp2);
            setP2Flip(false);
            jobList.current.push({ cmd: "fPCard2", delay: 50 });


            setB1CardInfo(tb1);
            setB1Flip(false);
            jobList.current.push({ cmd: "fBCard1", delay: 50 });

            setB2CardInfo(tb2);
            setB2Flip(false);
            jobList.current.push({ cmd: "fBCard2", delay: 50 });

            jobList.current.push({ cmd: "cPCard3", data: tp3, delay: 50 });  // 顯示閒3
            jobList.current.push({ cmd: "fPCard3", delay: 50 });  // 翻閒3

            jobList.current.push({ cmd: "cBCard3", data: tb3, delay: 50 });
            jobList.current.push({ cmd: "fBCard3", delay: 50 });

            jobList.current.push({ cmd: "updateWinner", delay: 100 });
            jobList.current.push({ cmd: "completedCallback", delay: 500 });

            startJob();
        }
    };

    const updateWinner = () => {
        let playerPoint = 0;
        let bankerPoint = 0;
        // let isBankerPair = false;
        // let isPlayerPair = false;


        playerPoint = countingPoint(p1CardInfo + p2CardInfo + p3CardInfo);
        bankerPoint = countingPoint(b1CardInfo + b2CardInfo + b3CardInfo);

        // if (p1CardInfo !== "") {
        //     if (p1CardInfo.substring(1, 1) === p2CardInfo.substring(1, 1)) {
        //         isPlayerPair = true;
        //     }
        // }

        // if (b1CardInfo !== "") {
        //     if (b1CardInfo.substring(1, 1) === b2CardInfo.substring(1, 1)) {
        //         isBankerPair = true;
        //     }
        // }


        if (playerPoint > bankerPoint) {
            setResultType("Player");
        } else if (bankerPoint > playerPoint) {
            setResultType("Banker");
        } else {
            setResultType("Tie");
        }

        setPlayerPoint(playerPoint.toString());
        setBankerPoint(bankerPoint.toString());

        // if (isPlayerPair || isBankerPair) {
        //     var pairText = "";

        //     if (isPlayerPair) {
        //         pairText = "<span style='color: #FFFFFF'>" + mlp.getLanguageKey("閒") + "</span>";
        //     }

        //     if (isBankerPair) {
        //         if (pairText != "") {
        //             pairText += ", ";
        //         }

        //         pairText += "<span style='color: #FFFFFF'>" + mlp.getLanguageKey("庄") + "</span>";
        //     }

        //     //oWinnerPair.innerHTML = "<span style='color: #FFFFFF'>" + mlp.getLanguageKey("對子") + ": </span > " + pairText;
        // }
    };

    const countingPoint = (_cardInfo) => {
        let retValue = 0;

        if (_cardInfo !== "") {
            while (true) {
                let pStr = "";
                let pointValue = "";

                if (cardInfo !== "") {
                    pStr = cardInfo.substring(0, 2);
                    _cardInfo = _cardInfo.substring(2);

                    pointValue = pStr.substring(1, 1);
                    switch (pointValue) {
                        case "1":
                            retValue += 1;
                            break;
                        case "2":
                            retValue += 2;
                            break;
                        case "3":
                            retValue += 3;
                            break;
                        case "4":
                            retValue += 4;
                            break;
                        case "5":
                            retValue += 5;
                            break;
                        case "6":
                            retValue += 6;
                            break;
                        case "7":
                            retValue += 7;
                            break;
                        case "8":
                            retValue += 8;
                            break;
                        case "9":
                            retValue += 9;
                            break;
                        default:
                            break;
                    }
                } else {
                    break;
                }
            }
        }


        return (retValue % 10);
    }

    const showSingleCard = (cardType, faceValue) => {
        setIsOpening(true);


        switch (cardType.toUpperCase()) {
            case "P1":
                jobList.current.push({ cmd: "cPCard1", data: faceValue, delay: 50 });
                jobList.current.push({ cmd: "fPCard1", delay: 0 });
                break;
            case "P2":
                setP2CardInfo(faceValue);
                jobList.current.push({ cmd: "cPCard2", data: faceValue, delay: 50 });
                jobList.current.push({ cmd: "fPCard2", delay: 0 });
                break;
            case "P3":
                setP3CardInfo(faceValue);
                jobList.current.push({ cmd: "cPCard3", data: faceValue, delay: 50 });
                jobList.current.push({ cmd: "fPCard3", delay: 0 });
                break;
            case "B1":
                setB1CardInfo(faceValue);
                jobList.current.push({ cmd: "cBCard1", data: faceValue, delay: 50 });
                jobList.current.push({ cmd: "fBCard1", delay: 0 });
                break;
            case "B2":
                setB2CardInfo(faceValue);
                jobList.current.push({ cmd: "cBCard2", data: faceValue, delay: 50 });
                jobList.current.push({ cmd: "fBCard2", delay: 0 });
                break;
            case "B3":
                setB3CardInfo(faceValue);
                jobList.current.push({ cmd: "cBCard3", data: faceValue, delay: 50 });
                jobList.current.push({ cmd: "fBCard3", delay: 0 });
                break;
            default:
                break;
        }

        startJob();
    };

    const stopJob = () => {
        if (isJobRunning.current === true) {
            jobList.current.splice(0, jobList.current.length);
            isJobRunning.current = false;

            try {
                clearTimeout(jobTimerId.current);
            } catch (err) {

            }
        }
    };

    const startJob = () => {
        if (jobList.current.length > 0) {
            let nextJob;
            //let allowNextJob = true;

            isJobRunning.current = true;
            jobRunningId.current = jobId;

            nextJob = jobList.current[0];
            if (nextJob) {
                // if ( Object.keys(imageCache.current).length > 0) {
                //     for (let imageKey in imageCache.current){
                //         const image = imageCache.current[imageKey];

                //         if(image.complete === false){

                //             break;
                //         }
                //     }



                // }

                // if (allowNextJob) {
                //     jobTimerId = setTimeout(processJob, nextJob.delay);
                // } else {
                //     setTimeout(startJob, 1);
                // }

                //原先只處理兩張圖片，這邊先做隱藏

                jobTimerId.current = setTimeout(processJob, nextJob.delay);
            }
        } else {
            isJobRunning.current = false;
        }
    };

    const processJob = () => {
        let Job;

        if (jobRunningId.current === jobId.current) {
            if (jobList.length > 0) {
                Job = jobList.current[0];
                jobList.current.splice(0, 1);

                if (Job) {
                    let singleCardInfo;

                    switch (Job.cmd) {
                        case "cPCard1":
                            if ("data" in Job)
                                singleCardInfo = Job["data"];

                            setP1CardInfo(singleCardInfo);
                            setP1Flip(false);

                            break;
                        case "cPCard2":
                            if ("data" in Job)
                                singleCardInfo = Job["data"];

                            setP2CardInfo(singleCardInfo);
                            setP2Flip(false);
                            break;
                        case "cPCard3":
                            if ("data" in Job)
                                singleCardInfo = Job["data"];

                            setP3CardInfo(singleCardInfo);
                            setP3Flip(false);
                            break;
                        case "cBCard1":
                            if ("data" in Job)
                                singleCardInfo = Job["data"];

                            setB1CardInfo(singleCardInfo);
                            setB1Flip(false);
                            break;
                        case "cBCard2":
                            if ("data" in Job)
                                singleCardInfo = Job["data"];

                            setB2CardInfo(singleCardInfo);
                            setB2Flip(false);
                            break;
                        case "cBCard3":
                            if ("data" in Job)
                                singleCardInfo = Job["data"];

                            setB3CardInfo(singleCardInfo);
                            setB3Flip(false);
                            break;
                        case "fPCard1":
                            setP1Flip(true);
                            break;
                        case "fPCard2":
                            setP2Flip(true);
                            break;
                        case "fPCard3":
                            setP3Flip(true);
                            break;
                        case "fBCard1":
                            setB1Flip(true);
                            break;
                        case "fBCard2":
                            setB2Flip(true);
                            break;
                        case "fBCard3":
                            setB3Flip(true);
                            break;
                        case "updateWinner":
                            updateWinner();
                            break;
                        case "completedCallback":
                            if (completedCallback)
                                completedCallback();
                            break;
                        default:
                            break;
                    }
                }

                startJob();
            }
        }
    };




    const openCardResult = (_cardInfo, _cbCompleted) => {
        setIsOpening(true);
        jobId.current = jobId.current + 1;

        if (isJobRunning.current === true) {
            if (completedCallback.current == null) {
                completedCallback.current();
                completedCallback.current = null;
            }
        }

        stopJob();

        setCardInfo(_cardInfo);
        onReady();
    };

    const closeCardResult = () => {
        setIsOpening(false);
        setResultType("");
        setPlayerPoint("");
        setBankerPoint("");
        setP1CardInfo("11");
        setP2CardInfo("11");
        setP3CardInfo("");
        setB1CardInfo("11");
        setB2CardInfo("11");
        setB3CardInfo("");
        setP1Flip(false);
        setP2Flip(false);
        setP3Flip(false);
        setB1Flip(false);
        setB2Flip(false);
        setB3Flip(false);

    };

    const getJsxString = (id) => {
        let ret = "";

        // 直接在 JSX 外部使用 switch 来决定要渲染的内容
        switch (id) {
            case 'idResult':
                switch (resultType) {
                    case "Tie":
                        ret = "result_tie";
                        break;

                    case "Banker":
                        ret = "result_banker";
                        break;

                    case "Player":
                        ret = "result_player";
                        break;
                    default:
                        break;
                }
                break;
            case 'idWinnerText':
                switch (resultType) {
                    case "Tie":
                        ret = "和";
                        break;

                    case "Banker":
                        ret = "庄贏";
                        break;

                    case "Player":
                        ret = "閒贏";
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        return ret;
    };



    const getImage = useCallback((imgSrcName, cb) => {
        if (imgSrcName in imageCache.current) {

            if (imageCache.current[imgSrcName].complete) {
                cb(imageCache.current[imgSrcName].cloneNode(true));
            } else {
                imageCache.current[imgSrcName].addEventListener('load', () => {
                    cb(imageCache.current[imgSrcName].cloneNode(true));
                });
            }


        } else {
            const image = new Image();
            image.src = "Images/cards/" + imgSrcName;
            imageCache.current[imgSrcName] = image;
            imageCache.current[imgSrcName].addEventListener('load', () => {
                cb(imageCache.current[imgSrcName].cloneNode(true));
            });
        }
    }, []);

    useEffect(() => {
        getImage("card_back_t.png");
        getImage("card_back.png");
    }, []);

    useEffect(() => {



    }, []);

    useImperativeHandle(ref, () => ({
        OpenCard: (_cardInfo, _cbCompleted) => {
            openCardResult(_cardInfo, _cbCompleted);
        },

        CloseCard: () => {
            closeCardResult();
        },
        ShowSingleCard: (cardType, faceValue) => {
            showSingleCard(cardType, faceValue);
        }
    }));

    return (
        <div className={"openCardZoneWrapper " + isOpening && "isOpening"}>
            <div id="left_card" className={"left_cardE openCard " + (resultType === "Banker" && "result_bankerBG")}>
                <div id="idPlayerTitle">
                    <div id="idPlayerPoint">{playerPoint}</div>
                    <div className="PlayerPoint">
                        <div className="PlayerPointW"><span className="language_replace">閒</span></div>
                    </div>
                </div>
                <div>
                    <div id="pCard1"><Card singleCardInfo={p1CardInfo} isT={false} isFlip={p1Flip} getImage={getImage}></Card></div>
                    <div id="pCard2"><Card singleCardInfo={p2CardInfo} isT={false} isFlip={p2Flip} getImage={getImage}></Card></div>
                    <div id="pCard3"><Card singleCardInfo={p3CardInfo} isT={true} isFlip={p3Flip} getImage={getImage}></Card></div>
                </div>
            </div>

            <div>
                <div id="idResult" className={getJsxString("idResult")}>
                    <div className="WinnerText">
                        <span id="idWinnerText">{getJsxString("idWinnerText")}</span>
                    </div>
                </div>
            </div>
            <div id="right_card" className={"right_cardE openCard " + (resultType === "Player" && "result_playerBG")}>
                <div id="idBankerTitle">
                    <div id="idBankerPoint">{bankerPoint}</div>
                    <div className="BankerPoint">
                        <div className="BankerPointW"><span className="language_replace">庄</span></div>
                    </div>
                </div>
                <div>
                    <div id="bCard1"><Card singleCardInfo={b1CardInfo} isT={false} isFlip={b1Flip} getImage={getImage}></Card></div>
                    <div id="bCard2"><Card singleCardInfo={b2CardInfo} isT={false} isFlip={b2Flip} getImage={getImage}></Card></div>
                    <div id="bCard3"><Card singleCardInfo={b3CardInfo} isT={true} isFlip={b3Flip} getImage={getImage}></Card></div>
                </div>
            </div>
        </div>
    )
})
export default memo(CardResult);
