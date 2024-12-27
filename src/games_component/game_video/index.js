import { useRef, useEffect, useImperativeHandle, forwardRef, useContext, useState, useCallback } from 'react';
import './index.scss';
import { md5 } from 'js-md5';
import kingkeyPlayer from 'utils/kingkeyPlayer'
import { BaccaratTableNotifyContext } from '../../view/game_views'

const GameVideo = forwardRef((props, ref) => {

    //串流主要三個相關屬性
    //vpDomain，串流的相關位址，來自server設定 => 用戶無法異動
    //stream 串流的名稱，來自於桌台設定 => 透過選擇桌台做改變
    //playerType，串流的撥放方式

    const player = useRef(new kingkeyPlayer(props.vpDomain));
    const playerType = useRef("mp4");
    const videoDom = useRef(null);
    const magnifierType = useRef(2);
    const magnifierCanvas = useRef(null);
    const magnifierOffScreenCanvas = useRef(null);
    const magnifierWorker = useRef(null)
    const videoIntervalNumber = useRef(-1);
    const videoLastReceiveDate = useRef(new Date());
    const { NotifyOn, NotifyOff } = useContext(BaccaratTableNotifyContext);
    const height = "67.5rem";
    //const height = "720px";
    const width = "120rem";


    const getVideoURL = useCallback((_ct, _tableNumber, vs, s, cb) => {        
        let sh;
        let obj;
        let SID = window.sessionStorage.getItem("SID");

        sh = md5.hex(vs + SID + s);
        obj = {
            CT: _ct,
            SH: sh,
            RoadMapNumber: _tableNumber
        };

        fetch('http://ewin.dev.mts.idv.tw/GetVideoURL.aspx', {
            method: 'POST', // 请求方法
            headers: {
                'Content-Type': 'application/json' // 指定请求内容类型为 JSON
            },
            body: JSON.stringify(obj) // 将 JavaScript 对象转换为 JSON 字符串
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 解析响应中的 JSON 数据
        }).then(o => {
            if (o.Result === 0) {
                if (cb)
                    cb(o);
            }
        }).catch(error => {
            console.error('Error:', error); // 处理可能发生的错误
        });
    }, []);

    const isIPhone = () => {
        if ((navigator.userAgent.indexOf("iOS") !== -1) || (navigator.userAgent.indexOf("iPhone") !== -1) || (navigator.userAgent.indexOf("iPad") !== -1)) {
            return true;
        } else {
            return false;
        }
    };


    //初始化部分跟vpDomain的選擇改由下拉選單部分進行
    // useEffect(() => {
    //     //初始化視頻，撈取相關資料       
    //     getVideoSourceList(CT, (success, o) => {
    //         if (success) {
    //             if (o.Source && o.Source.length > 0) {
    //                 setVpDomain(o.Source[0].Server);
    //             }
    //         }
    //     });
    // }, [CT, getVideoSourceList])

    useEffect(() => {
        const handleFirstDrawing = (event) => {
            //console.log("event=" + JSON.stringify(event.detail) + "handleFirstDrawing In Video");
            //debugger;
            magnifierType.current = 2;
            updateMagnifier();

            setTimeout(() => {
                magnifierType.current = 0;
            }, 20000);
        };

        const updateMagnifier = () => {
            const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            let ctx;
            let sourceRect;
            let videoTag;

            if (player.current == null || magnifierCanvas.current == null) {
                return;
            }

            videoTag = player.current.getVideoElement();
            switch (magnifierType.current) {
                case 0:
                    magnifierCanvas.current.style.display = "none";
                    return;
                case 1:
                    //sourceRect = { x:40 * htmlFontSize, y:0 * htmlFontSize, width: 60 * htmlFontSize, height: 33.75 * htmlFontSize}; 
                    magnifierCanvas.current.style.display = "block";
                    if (videoTag !== 0) {
                        sourceRect = { x: 0, y: 0.25 * videoTag.videoHeight, width: videoTag.videoWidth, height: videoTag.videoHeight };
                    }

                    //sourceRect = { x:0, y:0 , width: 800 , height: 448}; 
                    break;
                case 2:
                    magnifierCanvas.current.style.display = "block";
                    if (videoTag !== 0) {
                        sourceRect = { x: 0.2 * videoTag.videoWidth, y: 0.2 * videoTag.videoHeight, width: 0.6 * videoTag.videoWidth, height: 0.6 * videoTag.videoHeight };
                    }
                    break;
                default:
                    break;
            }

            if (magnifierWorker.current != null) {

                if (window || "createImageBitmap" in window) {
                    if (videoTag !== 0) {
                        //判斷視頻正在撥放
                        //video.readyState > 2：確認視頻有足夠的資料可供播放。
                        if (videoTag.readyState > 2 && sourceRect.width > 0 && sourceRect.height > 0) {
                            window.createImageBitmap(videoTag, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height).then(bitmap => {
                                magnifierWorker.current.postMessage({ imageBitmap: bitmap, cmd: "process" }, [bitmap]);
                            })
                        }
                    }
                }
            } else {
                ctx = magnifierCanvas.current.getContext("2d");
                if (videoTag !== 0) {
                    ctx.drawImage(videoTag, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 0, 0, magnifierCanvas.current.width, magnifierCanvas.current.height);
                }

            }

            requestAnimationFrame(updateMagnifier);
        }

        const handleTableChange = (event) => {
            //console.log("event=" + JSON.stringify(event.detail) + "handleTableChange In Video");        
            if (event.detail.tableStatus === "RealStopBet") {
                magnifierType.current = 1;
                updateMagnifier();

                // setTimeout(() => {
                //     magnifierType.current = 0;
                // }, 5000);

            } else if (event.detail.tableStatus === "GameResult") {
                magnifierType.current = 0;
            } else {

            }
        };


        //設定Worker與Canvas
        if (magnifierWorker.current != null) {
            if ('transferControlToOffscreen' in magnifierCanvas.current) {
                //啟用背景搭配offscreen
                let offscreenCanvas;



                if (magnifierOffScreenCanvas.current == null) {
                    offscreenCanvas = magnifierCanvas.current.transferControlToOffscreen();
                    offscreenCanvas.width = 1920;
                    offscreenCanvas.height = 1080;
                    magnifierOffScreenCanvas.current = offscreenCanvas;
                } else {
                    offscreenCanvas = magnifierOffScreenCanvas.current;
                }

                magnifierWorker.current = new Worker(new URL('./offscreenWorker.js', import.meta.url));
                magnifierWorker.current.postMessage({ canvas: offscreenCanvas, cmd: "init" }, [offscreenCanvas]);
            }

            NotifyOn("TableChange", handleTableChange);
            NotifyOn("FirstDrawing", handleFirstDrawing);
        }


        return (() => {
            if (magnifierWorker.current != null) {
                magnifierWorker.current.terminate();
                NotifyOff("TableChange", handleTableChange);
                NotifyOff("FirstDrawing", handleFirstDrawing);
            }
        });
    }, [NotifyOn, NotifyOff]);

    useEffect(() => {
        const videoOn = () => {
            getVideoURL(props.CT, props.tableNumber, props.vpDomain, props.stream, (o) => {
                if (o.ServerType === "TD888") {
                    if (isIPhone() === true) {
                        playerType.current = "wfs";
                    } else {
                        playerType.current = "mp4";
                    }
                } else if (o.ServerType === "TC") {
                    playerType.current = "tc";
                } else if (o.ServerType === "WSP") {
                    playerType.current = "gc";
                } else if (o.ServerType === "SRS") {
                    playerType.current = "srs";
                } else if (o.ServerType === "HW") {
                    playerType.current = "hw";
                } else {
                    playerType.current = "decoder";
                }

                player.current = new kingkeyPlayer(o.Server);

                player.current.initialize("/Scripts/Video/", playerType.current, function () {
                    let videoPlayDate = new Date();
                    player.current.playVideo(o.StreamName, o.Token, playerTryCount, videoDom.current);

                    window.setTimeout(function () {
                        player.current.resize(videoDom.current.clientWidth, videoDom.current.clientHeight);
                    }, 1000);

                    videoIntervalNumber.current = setInterval(function () {
                        let recvDate = player.current.getLastReceiveDate();
                        let playing = player.current.playingState();
                        let currDate = new Date();
                        //let idBadVideoMessage = document.getElementById("idBadVideoMessage");

                        if (playing === true) {
                            if (videoLastReceiveDate.current != null) {
                                if (currDate >= recvDate) {
                                    if (((currDate - recvDate) / 1000) > 10) {
                                        console.log("video reconnect");

                                        playerTryCount++;

                                        videoOff();

                                        // if (badVideoMessageShow)
                                        //     idBadVideoMessage.style.display = "block";

                                        setTimeout(function () {
                                            videoOn();
                                        }, 1000);
                                    } else {
                                        //idBadVideoMessage.style.display = "none";
                                    }
                                }
                            }

                            videoLastReceiveDate.current = recvDate;
                        } else if (playing === false) {
                            if (((currDate - videoPlayDate) / 1000) > 5) {
                                videoPlayDate = new Date();
                                playerTryCount++;
                                videoOff();

                                // if (badVideoMessageShow)
                                //     idBadVideoMessage.style.display = "block";

                                setTimeout(function () {
                                    videoOn();
                                }, 1000);
                            }
                        }
                    }, 3000);
                });
            });
        };

        const videoOff = () => {
            let objVideo = document.getElementById("objVideo");

            if (objVideo != null) {
                videoDom.current.removeChild(objVideo);
            }

            if (videoIntervalNumber.current !== -1) {
                clearInterval(videoIntervalNumber.current);
                videoIntervalNumber.current = -1;
            }

            if (player.current != null) {
                player.current.closeVideo();
            }

            videoLastReceiveDate.current = null;
            player.current = null;
        };


        let playerTryCount = 0;

        //設定video
        if (props.vpDomain) {
            videoDom.current.style.width = width;
            videoDom.current.style.height = height;

            videoOn();
        }

        return (() => {
            videoOff();
            clearInterval(videoIntervalNumber.current);
        });
    }, [props.vpDomain, props.CT, props.tableNumber, props.stream, getVideoURL]);


    useEffect(() => {
        const resize = (event) => {
            player.current.resize(videoDom.current.clientWidth, videoDom.current.clientHeight);
        };

        window.addEventListener('resize', resize);

        return (() => {
            window.removeEventListener('resize', resize);
        });
    }, [])



    useImperativeHandle(ref, () => ({
        PingVideo: (_stream, _cbCompleted) => {
            const getGPS = (cb) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            cb(true, latitude, longitude)
                        },
                        (err) => {
                            cb(false, 0, 0);
                        }
                    );
                } else {
                    cb(false, 0, 0);
                }
            };

            if (player.current != null) {
                if (_stream !== "") {
                    player.current.ping(playerType.current, _stream, (success, ms) => {
                        if (success) {
                            if (ms !== -1) {
                                _cbCompleted(ms);
                            } else {
                                _cbCompleted(9999);
                            }
                        } else {
                            _cbCompleted(-1);
                        }
                    });
                } else {
                    _cbCompleted(-1);
                }
            } else {
                _cbCompleted(-1);
            }


            // getGPS((isGetGPS, latitude, longitude)=>{
            //     api.QualityResponse(Math.uuid(), "Video", vpDomain, 1, ms, GPSLat, GPSLon);
            // });
        },

        // GetVideoSourceList: (cb) => {
        //     getVideoSourceList(CT, cb);
        // },

    }));

    if (props.vpDomain === "") {
        return (<></>);
    } else {
        return (
            <>
                <div id="divVideoArea" ref={videoDom}>

                </div>


                {/* <div id="idBadVideoMessage" class="SwitchSourceDiv" style="">
                    <div class="SwitchSourceN">
                        <div class="SSN_Ani1">
                            <img src="images/Icon_signal_3.svg" />
                        </div>
                        <div class="SSN_Ani2">
                            <img src="images/Icon_signal_1.svg" /><img src="images/Icon_signal_2.svg" />
                        </div>
                        <div class="SSN_TitDiv">
                            <div class="SSN_Tit"><span class="language_replace" langkey="切換視頻線路" style="display: inline;">切換視頻線路</span></div>
                            <div class="SSN_Text">
                                <span class="language_replace" langkey="檢查到您的連線品質不良" style="display: inline;">檢查到您的連線品質不良</span>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="magnifierDiv">
                    <canvas className="magnifier" ref={magnifierCanvas}></canvas>
                </div>
            </>
        )
    }
});




export default (GameVideo);