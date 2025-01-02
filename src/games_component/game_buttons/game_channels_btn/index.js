import React, { useState, useContext, useRef, useEffect, useCallback,  } from 'react';
import ReactDOM from "react-dom";
import './index.scss';
import { useHistory } from "react-router-dom";
import { ToolTipContext } from "provider/tooltipProvider";

const GameVideoChannelsButton = ({ videoControlRef, serverUrl, CT, setVideoResolutionType, setVpDomain, videoResolutionType, vpDomain, stream}) => {
    const [selStreamName, setSelStreamName] = useState("");        
    const [avgMS, setAvgMS] = useState(-1);
    const [videoSourceList, setVideoSourceList] = useState([]);
    const [active, setActive] = useState(false);
    const popRef = useRef(null);
    const history = useHistory();
    const { showTooltip, hideTooltip } = useContext(ToolTipContext);

    const getVideoSourceList = useCallback((_ct, _serverUrl, cb) => {
        fetch(
            _serverUrl + "/GetVideoSource.aspx?CT=" +
            window.encodeURIComponent(_ct),
            {
                method: "GET", // 请求方法// 将 JavaScript 对象转换为 JSON 字符串
            }
        ).then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json(); // 解析响应中的 JSON 数据
        }).then((o) => {
            cb(true, o);
        }).catch(() => {
            cb(false, null);
        });
    }, []);


    const showChannelLine = (event) => {        
        if(!active){
            getVideoSourceList(CT, serverUrl, (success, o) => {
                if (success) {
                    if (o.Source && o.Source.length > 0) {
                        setActive(true);
                        setVideoSourceList(o.Source);
                    }
                }
            });
        }       
    };

    const hideChannelLine = () => {
        popRef.current.classList.add('hide');
        setTimeout(() => {
            setActive(false);
        }, 400);
    }

    const selectVideoSource = (_vpDomain, _videoResolutionType, _streamName) => {
        setVideoResolutionType(_videoResolutionType);
        setSelStreamName(_streamName);
        setVpDomain(_vpDomain);
    };

    const getSignalType = (_avgMS) => {
        let signalType;

        if (_avgMS <= 40) {
            signalType = "strong";
        } else if (_avgMS <= 60) {
            signalType = "normal";
        } else {
            signalType = "weak";
        }

        return (signalType);
    };



    useEffect(() => {
        getVideoSourceList(CT, serverUrl, (success, o) => {
            if (success) {
                if (o.Source && o.Source.length > 0) {
                    setVideoResolutionType(1);
                    setSelStreamName(o.Source[0].Name);
                    setVpDomain(o.Source[0].Server);
                }
            }
        });
    }, [getVideoSourceList, CT, serverUrl, setVideoResolutionType, setVpDomain]);


    useEffect(() => {
        const timer = setInterval(() => {
            videoControlRef.current.PingVideo(stream,(_avgMS) =>{
                setAvgMS(_avgMS);
            });
        }, 3000);

        return ()=>{            
            clearInterval(timer);
        };

    }, [stream, videoControlRef, videoResolutionType, vpDomain])


    useEffect(() => {
        const handleDocumentClick_GameVideoChannelsButton = (e) => {            
            if (popRef.current && !popRef.current.contains(e.target)) {                
                // 當點擊 settings 以外的地方時，設定 setHoveredItem(null)
                popRef.current.classList.add('hide');
                setTimeout(() => {
                    setActive(false);
                }, 400);    
            }
        };

        if(active){
            setTimeout(() => {
                document.addEventListener("click", handleDocumentClick_GameVideoChannelsButton)    
            }, 100);            
        }

        return (()=>{document.removeEventListener("click", handleDocumentClick_GameVideoChannelsButton);});

    }, [active])


    return (

        <div className='channelLine-box'>

            <div className='channelLine-box-content' onClick={showChannelLine}>
                <div className='channelLine-box-left' onMouseEnter={(event) => { showTooltip(event.currentTarget, "切換視頻線路") }} onMouseLeave={() => { hideTooltip() }}>
                    <div className='channelLine-box-icon'>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                            <g>
                                <path d="M17 11V8.5C17 7.67157 16.3284 7 15.5 7H5.5C4.67157 7 4 7.67157 4 8.5V16.5C4 17.3284 4.67157 18 5.5 18H15.5C16.3284 18 17 17.3284 17 16.5V14.5"
                                    stroke="#8d8d9f"
                                    strokeLinecap="round">

                                </path>
                                <path d="M17 11L20.2764 9.3618C20.6088 9.19558 21 9.43733 21 9.80902V15.2785C21 15.6276 20.6513 15.8692 20.3244 15.7467L17 14.5"
                                    stroke="#8d8d9f"
                                    strokeLinecap="round">
                                </path>
                            </g>
                        </svg>
                        <span>:</span>
                    </div>
                    <div className='channelLine-box-title'>{selStreamName}</div>
                </div>

                {/* <div className='channelLine-box-icon-arrow'></div> */}
                <div className="channelLine-box-signal" onMouseEnter={(event) => { showTooltip(event.currentTarget, "訊號強度：弱") }} onMouseLeave={() => { hideTooltip() }}>
                    <div className={`wifi-symbol ${getSignalType(avgMS)}`}>
                        <div className="wifi-circle first"></div>
                        <div className="wifi-circle second"></div>
                        <div className="wifi-circle third"></div>
                    </div>
                </div>
            </div>
            {active && <>
                <div className='channelLine-box-options' ref={popRef}>
                    <div className='channelLine-box-options-header'>
                        選擇線路視頻:
                        <div className='tip'>
                            HD為高畫質線路，若連線品質不佳時會有延遲狀況發生。
                        </div>
                    </div>
                    {videoSourceList.length > 0 && videoSourceList.filter((data) => data.Hide === false).map((data, i) => {
                        return (<div className={`channelLine-box-option ${(selStreamName === data.Name) ? "select" : ""}`} key={data.Name}>
                            <div className='channelLine-box-option-no'>{i + 1}.</div>

                            <div className='channelLine-box-option-title'>
                                {data.Name}
                            </div>

                            <div className='channelLine-box-option-contents'>
                                <div className={`channelLine-box-option-content HD ${(selStreamName === data.Name && videoResolutionType === 1) ? "select" : ""}`} onClick={() => { selectVideoSource(data.Server, 1, data.Name); }}>
                                    <div className='channelLine-box-option-content-check'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="#8d8d9f"><path d="M23.8976 5.35229C24.5323 5.98706 24.5323 7.01792 23.8976 7.65269L10.8976 20.6527C10.2628 21.2875 9.23193 21.2875 8.59717 20.6527L2.09717 14.1527C1.4624 13.5179 1.4624 12.4871 2.09717 11.8523C2.73193 11.2175 3.76279 11.2175 4.39756 11.8523L9.7499 17.1996L21.6022 5.35229C22.237 4.71753 23.2679 4.71753 23.9026 5.35229H23.8976Z"></path></svg>
                                    </div>
                                    <div className='channelLine-box-option-content-icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 25.7 15.3">

                                            <g>
                                                <path d="M17.9,5.3h-0.7L16.7,10h0.7c0.6,0,1-0.1,1.2-0.2c0.2-0.1,0.5-0.3,0.6-0.6c0.2-0.3,0.3-0.8,0.4-1.5
                                                         c0.1-0.9,0-1.5-0.3-1.9C19,5.5,18.6,5.3,17.9,5.3z"/>
                                                <path d="M23.8,0H1.9C0.9,0,0,0.9,0,1.9v11.5c0,1.1,0.9,1.9,1.9,1.9h21.9c1.1,0,1.9-0.9,1.9-1.9V1.9
                                                     C25.7,0.9,24.9,0,23.8,0z M12.1,12H9.4l0.4-3.5H6.9L6.5,12H3.9l0.9-8.6h2.7l-0.3,3H10l0.3-3h2.7L12.1,12z M22.2,7.6
                                                         c-0.1,0.9-0.3,1.6-0.5,2.1c-0.3,0.5-0.6,0.9-1,1.3s-0.8,0.6-1.3,0.7c-0.6,0.2-1.1,0.2-1.6,0.2h-3.9l0.9-8.6h3.9
                                                         c0.8,0,1.4,0.1,1.9,0.3c0.5,0.2,0.8,0.5,1.1,0.9C21.9,5,22.1,5.4,22.2,6S22.3,7,22.2,7.6z"/>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className='channelLine-box-option-content-tip'>HD</div>
                                </div>
                                <div className={`channelLine-box-option-content ${(selStreamName === data.Name && videoResolutionType === 0) ? "select" : ""}`} onClick={() => { selectVideoSource(data.Server, 0, data.Name); }}>
                                    <div className='channelLine-box-option-content-check'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="#8d8d9f"><path d="M23.8976 5.35229C24.5323 5.98706 24.5323 7.01792 23.8976 7.65269L10.8976 20.6527C10.2628 21.2875 9.23193 21.2875 8.59717 20.6527L2.09717 14.1527C1.4624 13.5179 1.4624 12.4871 2.09717 11.8523C2.73193 11.2175 3.76279 11.2175 4.39756 11.8523L9.7499 17.1996L21.6022 5.35229C22.237 4.71753 23.2679 4.71753 23.9026 5.35229H23.8976Z"></path></svg>
                                    </div>
                                    <div className='channelLine-box-option-content-icon'></div>
                                    <div className='channelLine-box-option-content-tip'>SD</div>
                                </div>
                            </div>
                        </div>);
                    })}
                    <div className='channelLine-box-options-footer'><div className='channelLine-box-options-close' onClick={hideChannelLine}><i></i>關閉</div></div>
                </div>
            </>}
        </div>
    );
};




export default GameVideoChannelsButton;