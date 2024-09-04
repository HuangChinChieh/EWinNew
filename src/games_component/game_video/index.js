import { useRef, useEffect, useState, useContext } from 'react';
import './index.scss';
import { md5 } from 'js-md5';
import kingkeyPlayer from 'utils/kingkeyPlayer'
import { BaccaratTableNotifyContext } from '../../view/game_views'

const GameVideo = (props) => {
    //vpDomain
    //CT
    const vpDomain = props.vpDomain;
    const sName = props.streamName;
    const CT = props.CT;
    const tableNumber = props.tableNumber;
    const player = useRef(new kingkeyPlayer(vpDomain));
    const playerType = useRef(vpDomain);
    let playerTryCount = 0;
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



    const pingVideo = () => {
        let pingResponse = (success, ms) => {
            // var serverName = vpDomain;

            // if (success) {
            //     if (ms != -1) {
            //         idVideoPing.src = vp.getSignalPNG(ms);
            //         idVideoPing.style.display = "inline";
            //     } else {
            //         idVideoPing.src = vp.getSignalPNG(99999);
            //         idVideoPing.style.display = "inline";
            //     }
            // } else {
            //     // 服務器無法連接
            //     idVideoPing.style.display = "none";
            // }

            // if (serverName == null)
            //     serverName = "";

            // if (GPSLat == null)
            //     GPSLat = 0;

            // if (GPSLon == null)
            //     GPSLon = 0;

            // api.QualityResponse(Math.uuid(), "Video", serverName, 1, ms, GPSLat, GPSLon);
        };

        player.ping(playerType, sName, pingResponse);
    };


    const videoOn = () => {
        getVideoURL(vpDomain, sName, (o) => {
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

        if (player != null) {
            player.current.closeVideo();
        }

        videoLastReceiveDate.current = null;
        player.current = null;
    };


    const getVideoURL = (vs, s, cb) => {
        let sh;
        let obj;
        let SID = window.sessionStorage.getItem("SID");

        sh = md5.hex(vs + SID + s);
        obj = {
            CT: CT,
            SH: sh,
            RoadMapNumber: tableNumber
        };

        fetch('https://ewin.dev.mts.idv.tw/GetVideoURL.aspx', {
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
        })
            .then(o => {
                if (o.Result === 0) {
                    if (cb)
                        cb(o);
                }
            })
            .catch(error => {
                console.error('Error:', error); // 处理可能发生的错误
            });

    };


    const isIPhone = () => {
        if ((navigator.userAgent.indexOf("iOS") !== -1) || (navigator.userAgent.indexOf("iPhone") !== -1) || (navigator.userAgent.indexOf("iPad") !== -1)) {
            return true;
        } else {
            return false;
        }
    };


    const updateMagnifier = () => {
        const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);        
        let ctx;        
        let sourceRect;
        let videoTag;
        videoTag = player.current.getVideoElement();
        switch (magnifierType.current) {
            case 0:
                magnifierCanvas.current.style.display = "none";
                   return;
            case 1:
                //sourceRect = { x:40 * htmlFontSize, y:0 * htmlFontSize, width: 60 * htmlFontSize, height: 33.75 * htmlFontSize}; 
                magnifierCanvas.current.style.display = "block";
                sourceRect = { x:0, y:0.25 * videoTag.videoHeight , width: videoTag.videoWidth , height: videoTag.videoHeight}; 
               
                //sourceRect = { x:0, y:0 , width: 800 , height: 448}; 
                break;   
            case 2:
                magnifierCanvas.current.style.display = "block";
                sourceRect = { x:0.2 * videoTag.videoWidth, y:0.2 * videoTag.videoHeight, width: 0.6 * videoTag.videoWidth , height: 0.6 * videoTag.videoHeight}; 
                break;
            default:
                break;
        }

 
      
        if (magnifierWorker.current != null) {

            window.createImageBitmap(videoTag, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height).then(bitmap => {
                magnifierWorker.current.postMessage({ imageBitmap: bitmap, cmd: "process"}, [bitmap]);                      
            })                                           
        } else {
            ctx = magnifierCanvas.current.getContext("2d");
            ctx.drawImage(videoTag, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, 0, 0, magnifierCanvas.current.width, magnifierCanvas.current.height);             
        }         
        
        requestAnimationFrame(updateMagnifier);  
    }

    const handleTableChange = (event)=>{
        debugger
        //console.log("event=" + JSON.stringify(event.detail) + "handleTableChange In Video");        
        if(event.detail.tableStatus === "StopBet"){
            magnifierType.current = 1;
            updateMagnifier();

            // setTimeout(() => {
            //     magnifierType.current = 0;
            // }, 5000);
        }else{
            magnifierType.current = 0; 
        }
    };

    const handleFirstDrawing = (event)=>{        
        //console.log("event=" + JSON.stringify(event.detail) + "handleFirstDrawing In Video");

        magnifierType.current = 2;
        updateMagnifier();

        setTimeout(() => {
            magnifierType.current = 0;
        }, 20000);
    };

    const resize = (event)=>{
        player.current.resize(videoDom.current.clientWidth, videoDom.current.clientHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', resize);

        //設定Worker與Canvas
        if ('transferControlToOffscreen' in magnifierCanvas.current) {
            //啟用背景搭配offscreen
            let offscreenCanvas;

            if(magnifierOffScreenCanvas.current == null){
                offscreenCanvas = magnifierCanvas.current.transferControlToOffscreen();
                offscreenCanvas.width = 1920;
                offscreenCanvas.height = 1080;
                magnifierOffScreenCanvas.current = offscreenCanvas;
            }else{
                offscreenCanvas = magnifierOffScreenCanvas.current;
            }
                                  
            magnifierWorker.current = new Worker(new URL('./offscreenWorker.js', import.meta.url));
            magnifierWorker.current.postMessage({ canvas: offscreenCanvas, cmd: "init" }, [offscreenCanvas]);
        }

        NotifyOn("TableChange",handleTableChange);
        NotifyOn("FirstDrawing",handleFirstDrawing);


        return (() => {
            if (magnifierWorker.current != null)
                magnifierWorker.current.terminate();
                        
            NotifyOff("TableChange",handleTableChange);
            NotifyOff("FirstDrawing",handleFirstDrawing);

            window.removeEventListener('resize', resize);
        });
    }, []);

    useEffect(() => {

        //設定video
        if (vpDomain) {
            videoDom.current.style.width = width;
            videoDom.current.style.height = height;

            videoOn();
        }

        return (() => {
            clearInterval(videoIntervalNumber.current);
        });
    }, [props.vpDomain]);

    return (
        <>
            <div id="divVideoArea" ref={videoDom}>

            </div>
            <button style={{ position: "absolute", bottom: "20px", "zIndex": "99999", width: "200px" }} onClick={updateMagnifier}>測試</button>

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
};




export default (GameVideo);