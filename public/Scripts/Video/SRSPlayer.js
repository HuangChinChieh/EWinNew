var SRSPlayer = function (idVideoTag, Url) {
    var flvPlayer;
    var rtcPlayer;
    var firstTime = null;
    var lastUpdateTime = new Date();
    var flvLastDecodedFrames = 0;
    var isPlaying = false;
    var playerType = 0;  // 0=rtc, 1=flv
    var statTimer = null;
    var lastRTCRecvBytes = 0;
    var initialFinished = false;

    var srsApiUrl;
    var srsRtcUrl;
    var srsFlvUrl;

    function xmlHttpPost(URL, postObject, cb) {
        var xmlHttp = new XMLHttpRequest;
        var postData;

        if (postObject)
            postData = JSON.stringify(postObject);

        xmlHttp.open("POST", URL, true);
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                var contentText = this.responseText;

                if (this.status == "200") {
                    if (cb) {
                        cb(true, contentText);
                    }
                } else {
                    cb(false, contentText);
                }
            }
        };

        xmlHttp.timeout = 30000;  // 30s
        xmlHttp.ontimeout = function () {
            if (cb)
                cb(false, "Timeout");
        };

        //xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.send(postData);
    }

    function _loadScript(s, cb) {
        var script = document.createElement("script");

        script.type = 'text/javascript';
        script.src = s;
        script.onload = function () {
            if (cb != null)
                cb();
        };

        document.body.appendChild(script);
    }

    function initRtcPlayer(cb) {
        rtcPlayer = new RTCPeerConnection(null);
        rtcPlayer.addTransceiver("audio", { direction: "recvonly" });
        rtcPlayer.addTransceiver("video", { direction: "recvonly" });
        rtcPlayer.onicecandidate = function (e) {
            console.log("onIceCandidate");
        };

        rtcPlayer.oniceconnectionstatechange = function (e) {
            if (rtcPlayer != null) {
                if (rtcPlayer.iceConnectionState == 'disconnected') {
                    close_internal();
                }
            }
        };

        rtcPlayer.onaddstream = function (e) {
            lastUpdateTime = new Date();

            if (firstTime == null)
                firstTime = lastUpdateTime;

            if ('srcObject' in idVideoTag) {
                idVideoTag.srcObject = e.stream;
            } else {
                idVideoTag.src = window.URL.createObjectURL(e.stream);
            }
            //idVideoTag.srcObject = e.stream;
        };

        if (cb)
            cb();
    }

    function resetFlvPlayer() {
        if (flvPlayer != null) {
            flvPlayer.unload();
            flvPlayer.load();
            flvPlayer.play();
        }
    }

    function initFlvPlayer(cb) {
        if (flvjs.isSupported()) {
            flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                enableWorker: true,
                stashInitialSize: 1,
                enableStashBuffer: false,
                hasVideo: true,
                hasAudio: false,
                url: srsFlvUrl
            });

            flvPlayer.on(flvjs.Events.ERROR, function (errorType, errorDetail, errorInfo) {
                //alert("Error");
            });

            flvPlayer.on(flvjs.Events.METADATA_ARRIVED, function (res) {
                //state.innerHTML = "aaa";
            });

            flvPlayer.on(flvjs.Events.STATISTICS_INFO, function (res) {
                //res.decodedFrames;
                if (res.decodedFrames != flvLastDecodedFrames) {
                    flvLastDecodedFrames = res.decodedFrames;

                    lastUpdateTime = new Date();
                }

                if (flvPlayer != null) {
                    if (flvPlayer.buffered != null) {
                        if (flvPlayer.buffered.length > 0) {
                            if ((flvPlayer.buffered.end(0) - flvPlayer.currentTime) >= 5) {
                                resetFlvPlayer();
                            }
                        }
                    }
                }
            });

            flvPlayer.attachMediaElement(idVideoTag);
        }

        if (cb)
            cb();
    }

    function initApiFront(cb) {
        xmlHttpPost(Url, null, function (success, data) {
            if (success) {
                var o = JSON.parse(data);

                if (o.Status == 0) {
                    srsApiUrl = o.apiUrl;
                    srsRtcUrl = o.streamUrl;
                    srsFlvUrl = o.flvUrl;
                }
            }

            if (cb)
                cb(success);
        });
    }


    function close_internal() {
        isPlaying = false;

        lastRTCRecvBytes = 0;
        if (playerType == 0) {
            if (rtcPlayer != null) {
                rtcPlayer.close();
                rtcPlayer = null;
            }

            firstTime == null;
        } else if (playerType == 1) {
            if (flvPlayer != null) {
                flvPlayer.pause();
                flvPlayer.unload();
                flvPlayer.detachMediaElement();
                flvPlayer.destroy();
                flvPlayer = null;
            }
        }

        if (statTimer != null) {
            window.clearInterval(statTimer);
            statTimer = null;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    this.GetLastUpdateTime = function () {
        return lastUpdateTime;
    }

    this.GetCurrentPlayTime = function () {
        if (playerType == 0) {
            if (firstTime != null) {
                return (lastUpdateTime - firstTime) / 1000;
            } else {
                return 0;
            }
        } else if (playerType == 1) {
            if (flvPlayer != null) {
                return flvPlayer.currentTime;
            }
        }
    }

    this.playingState = function () {
        return isPlaying;
    }

    this.Close = function () {
        close_internal();
    }

    this.Play = function () {
        if (playerType == 0) {
            var offerOpt = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            };

            if (statTimer != null) {
                window.clearInterval(statTimer);
                statTimer = null;
            }

            rtcPlayer.createOffer(offerOpt).then(function (offer) {
                var tid = Number(parseInt(new Date().getTime() * Math.random() * 100)).toString(16).slice(0, 7);

                rtcPlayer.setLocalDescription(offer);

                var req = {
                    api: srsApiUrl,
                    clientip: null,
                    sdp: offer.sdp,
                    streamurl: srsRtcUrl,
                    tid: tid
                }

                xmlHttpPost(srsApiUrl, req, function (success, data) {
                    if (success) {
                        var o = JSON.parse(data);

                        if (o.code == 0) {
                            var sdp = o.sdp;

                            rtcPlayer.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sdp }));

                            statTimer = window.setInterval(function () {
                                // 蒐集統計數據
                                rtcPlayer.getStats().then(res => {
                                    if (res != null) {
                                        res.forEach(report => {
                                            if (report.type == "inbound-rtp") {
                                                if (report.mediaType == "video") {
                                                    if (report.bytesReceived != null) {
                                                        if (lastRTCRecvBytes != report.bytesReceived) {
                                                            lastRTCRecvBytes = report.bytesReceived;
                                                            lastUpdateTime = new Date();
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }, 1000);
                        } else {
                            close_internal();
                        }
                    } else {
                        close_internal();
                    }
                });
            }).catch(function (ex) {
                console.log("Create offer fail:" + ex);
            });
        } else if (playerType == 1) {
            if (flvPlayer != null) {
                flvPlayer.load();
                flvPlayer.play();
            }
        }

        isPlaying = true;
    }

    this.Init = async function (scriptPath, type, cb) {
        playerType = type;

        initApiFront(function (success) {
            if (playerType == 0) {
                _loadScript(scriptPath + "webrtc-adapter.js", function () {
                    initRtcPlayer(cb);
                });
            } else if (playerType == 1) {
                _loadScript(scriptPath + "flv.min.js", function () {
                    initFlvPlayer(cb);
                });
            }
        });
    }


};
