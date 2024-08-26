const kingkeyPlayer = function (domain) {
    let defaultDomain = "vid.td888.net";
    let _scriptPath = "";
    let _vp_is_iOS = /(iPhone|iPod|iPad).*AppleWebKit.*Safari/i.test(navigator.userAgent);
    let _vp_wfs;
    let _vp_264player;
    let _vp_MP4Player;
    let _vp_TCPlayer;
    let _vp_WSPPlayer;
    let _vp_SRSPlayer;
    let _vp_HWPlayer;
    let _vp_initialized = false;
    let _vp_playerType = "decoder";  // decoder/wfs/mp4/tc/gc/hw
    let isPlaying = null;

    let _httpPort = 86;
    let _httpsPort = 951;

    let tcLastCurrentTime = null;
    let tcLastUpdateDate = null;

    let hwPlaying = false;
    let hwLastUpdateDate = null;
    let hwLastInfo = null;

    function _loadScript(s, cb) {
        if (document.querySelector(`script[src="${s}"]`)) {
            if (cb != null)
                cb(); // 如果已经加载过，则直接 resolve
            return;
        }

        let script = document.createElement("script");

        script.type = 'text/javascript';
        script.src = s;
        script.onload = function () {
            if (cb != null)
                cb();
        };

        document.body.appendChild(script);
    }

    function _prepareScript(type, scriptsUri, cb) {
        switch (type) {
            case "decoder":
                _loadScript(scriptsUri + 'WebGLCanvas.js?20200830', function () {
                    _loadScript(scriptsUri + 'h264Player.js?20201007', function () {
                        if (cb != null)
                            cb();
                    });
                });
                break;
            case "wfs":
                _loadScript(scriptsUri + 'wfs.js', function () {
                    if (cb != null)
                        cb();
                });
                break;
            case "mp4":
                _loadScript(scriptsUri + 'MP4Player.js?20200830', function () {
                    if (cb != null)
                        cb();
                });
                break;
            case "tc":
                // 忽略 ScriptPath, 使用 TC 預設 Script URL
                /*
                _loadScript('https://web.sdk.qcloud.com/player/tcplayerlite/release/v2.4.1/TcPlayer-2.4.1.js', function () {
                    if (cb != null)
                        cb();
                });
                */
                _loadScript(scriptsUri + 'TcPlayer-2.4.2.js?20220112', function () {
                    if (cb != null)
                        cb();
                });
                break;
            case "hw":
                _loadScript(scriptsUri + 'HWLLSPlayer.js?29231013', function () {
                    if (cb != null)
                        cb();
                });
                break;
            case "gc":
                _loadScript(scriptsUri + 'GcPlayer.js?20231218', function () {
                    if (cb != null)
                        cb();
                });
                break;
            case "srs":
                _loadScript(scriptsUri + 'SRSPlayer.js?20230404', function () {
                    if (cb != null)
                        cb();
                });
                break;
            default:
                break;
        }
    }

    function _playVideo_Close() {
        let vpMainDiv = document.getElementById("_vp_mainDiv");

        isPlaying = false;
        if (_vp_playerType === "decoder") {
            // decoder
            if (_vp_264player != null) {
                _vp_264player.closeVideo();
            }

            if (vpMainDiv != null)
                clearChildren(vpMainDiv);

            _vp_264player = null;
        } else if (_vp_playerType === "wfs") {
            if (_vp_wfs != null) {
                _vp_wfs.destroy();
            }

            _vp_wfs = null;
        } else if (_vp_playerType === "mp4") {
            // decoder
            if (_vp_MP4Player != null) {
                _vp_MP4Player.Close();
            }

            if (vpMainDiv != null)
                clearChildren(vpMainDiv);

            _vp_MP4Player = null;
        } else if (_vp_playerType === "tc") {
            // TC
            if (_vp_TCPlayer != null) {
                _vp_TCPlayer.destroy();
            }

            if (vpMainDiv != null)
                clearChildren(vpMainDiv);

            _vp_TCPlayer = null;
        } else if (_vp_playerType === "hw") {
            // HW
            if (_vp_HWPlayer != null) {
                _vp_HWPlayer.destoryClient();
            }

            if (vpMainDiv != null)
                clearChildren(vpMainDiv);

            _vp_HWPlayer = null;
        } else if (_vp_playerType === "gc") {
            // WSP
            if (_vp_WSPPlayer != null) {
                _vp_WSPPlayer.Close();
            }

            if (vpMainDiv != null)
                clearChildren(vpMainDiv);

            _vp_WSPPlayer = null;
        } else if (_vp_playerType === "srs") {
            if (_vp_SRSPlayer != null) {
                _vp_SRSPlayer.Close();
            }

            if (vpMainDiv != null)
                clearChildren(vpMainDiv);

            _vp_SRSPlayer = null;
        }
    }

    function clearChildren(o) {
        while (o.firstChild) o.removeChild(o.firstChild);
    };

    this.get264OffscreenCanvas = function () {
        let c;

        if (_vp_264player != null) {
            c = _vp_264player.getOffscreenCanvas();
        }

        return c;
    }

    this.setHttpPort = function (v) {
        _httpPort = v;
    };

    this.setHttpsPort = function (v) {
        _httpsPort = v;
    };

    this.width = function () {
        let vpMainDiv = document.getElementById("_vp_mainDiv");
        let retValue = 0;

        if (vpMainDiv != null) {
            if (_vp_playerType === "decoder") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].clientWidth;
                }
            } else if (_vp_playerType === "wfs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            } else if (_vp_playerType === "mp4") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            } else if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.el.clientWidth;
                }
            } else if (_vp_playerType === "hw") {
                if (vpMainDiv.children.length > 0) {
                    if (vpMainDiv.children[0].tagName.toLowerCase() === "div") {
                        retValue = vpMainDiv.children[0].children[0].videoWidth;
                    }
                }
            } else if (_vp_playerType === "gc") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            } else if (_vp_playerType === "srs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            }
        } else {
            // 可能是 TC Player
            if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.el.clientWidth;
                }
            }
        }

        return retValue;
    }

    this.srcWidth = function () {
        let vpMainDiv = document.getElementById("_vp_mainDiv");
        let retValue = 0;

        if (vpMainDiv != null) {
            if (_vp_playerType === "decoder") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].clientWidth;
                }
            } else if (_vp_playerType === "wfs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            } else if (_vp_playerType === "mp4") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            } else if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.videoWidth();
                }
            } else if (_vp_playerType === "hw") {
                if (vpMainDiv.children.length > 0) {
                    if (vpMainDiv.children[0].tagName.toLowerCase() === "div") {
                        retValue = vpMainDiv.children[0].children[0].videoWidth;
                    }
                }
            } else if (_vp_playerType === "gc") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            } else if (_vp_playerType === "srs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoWidth;
                }
            }
        } else {
            // 可能是 TC Player
            if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.videoWidth();
                }
            }
        }

        return retValue;
    }

    this.height = function () {
        let vpMainDiv = document.getElementById("_vp_mainDiv");
        let retValue = 0;

        if (vpMainDiv != null) {
            if (_vp_playerType === "decoder") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].clientHeight;
                }
            } else if (_vp_playerType === "wfs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            } else if (_vp_playerType === "mp4") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            } else if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.el.clientHeight;
                }
            } else if (_vp_playerType === "hw") {
                if (vpMainDiv.children.length > 0) {
                    if (vpMainDiv.children[0].tagName.toLowerCase() === "div") {
                        retValue = vpMainDiv.children[0].children[0].videoHeight;
                    }
                }
            } else if (_vp_playerType === "gc") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            } else if (_vp_playerType === "srs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            }
        } else {
            // 可能是 TC Player
            if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.el.clientHeight;
                }
            }
        }

        return retValue;
    }

    this.srcHeight = function () {
        let vpMainDiv = document.getElementById("_vp_mainDiv");
        let retValue = 0;

        if (vpMainDiv != null) {
            if (_vp_playerType === "decoder") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].clientHeight;
                }
            } else if (_vp_playerType === "wfs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            } else if (_vp_playerType === "mp4") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            } else if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.videoHeight();
                }
            } else if (_vp_playerType === "hw") {
                if (vpMainDiv.children.length > 0) {
                    if (vpMainDiv.children[0].tagName.toLowerCase() === "div") {
                        retValue = vpMainDiv.children[0].children[0].videoHeight;
                    }
                }
            } else if (_vp_playerType === "gc") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            } else if (_vp_playerType === "srs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0].videoHeight;
                }
            }
        } else {
            // 可能是 TC Player
            if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.videoHeight();
                }
            }
        }

        return retValue;
    }

    this.getMainDiv = function () {
        let vpMainDiv = document.getElementById("_vp_mainDiv");

        return vpMainDiv;
    }

    this.getVideoElement = function () {
        let vpMainDiv = document.getElementById("_vp_mainDiv");
        let retValue = 0;

        if (vpMainDiv != null) {
            if (_vp_playerType === "decoder") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0];
                }
            } else if (_vp_playerType === "wfs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0];
                }
            } else if (_vp_playerType === "mp4") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0];
                }
            } else if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.el;
                }
            } else if (_vp_playerType === "hw") {
                if (vpMainDiv.children.length > 0) {
                    if (vpMainDiv.children[0].tagName.toLowerCase() === "div") {
                        retValue = vpMainDiv.children[0].children[0];
                    }
                }
            } else if (_vp_playerType === "gc") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0];
                }
            } else if (_vp_playerType === "srs") {
                if (vpMainDiv.children.length > 0) {
                    retValue = vpMainDiv.children[0];
                }
            }
        } else {
            if (_vp_playerType === "tc") {
                if (_vp_TCPlayer != null) {
                    retValue = _vp_TCPlayer.video.el;
                }
            }
        }

        return retValue;
    }

    this.initialize = function (scriptBaseUri, playerType, cb) {   
        if (_vp_initialized === false) {
            if (scriptBaseUri != null) {
                if (scriptBaseUri.substr(scriptBaseUri.length - 1, 1) !== "/")
                    _scriptPath = scriptBaseUri + "/";
                else
                    _scriptPath = scriptBaseUri;
            }

            _vp_playerType = playerType;

            _prepareScript(_vp_playerType, _scriptPath, function () {
                _vp_initialized = true;
                if (cb != null)
                    cb();
            });
        }
    }

    this.getVideoFrameCount = function () {
        let count = 0;

        if (_vp_playerType === "decoder") {
            // decoder
            if (_vp_264player != null) {
                count = _vp_264player.videoFrameCount();
            }

        } else {
            if (_vp_wfs != null) {
                if (_vp_wfs.websocketLoader) {
                    if (_vp_wfs.websocketLoader.videoFrames != null) {
                        count = _vp_wfs.websocketLoader.videoFrames.length;
                    }
                }
            }
        }

        return count;
    }

    this.playingState = function () {
        let retValue = null;

        if (_vp_playerType === "decoder") {
            // decoder
            if (_vp_264player != null) {
                retValue = _vp_264player.playingState();
            }
        } else if (_vp_playerType === "mp4") {
            if (_vp_MP4Player != null) {
                retValue = _vp_MP4Player.playingState();
            }
        } else if (_vp_playerType === "tc") {
            if (_vp_TCPlayer != null) {
                retValue = _vp_TCPlayer.playing();
            }
        } else if (_vp_playerType === "hw") {
            if (_vp_HWPlayer != null) {
                retValue = hwPlaying;
            }
        } else if (_vp_playerType === "gc") {
            if (_vp_WSPPlayer != null) {
                retValue = _vp_WSPPlayer.playingState();
            }
        } else if (_vp_playerType === "srs") {
            if (_vp_SRSPlayer != null) {
                retValue = _vp_SRSPlayer.playingState();
            }
        }

        return retValue;
    }

    this.getLastReceiveDate = function () {
        let lastDate = null;

        if (_vp_playerType === "decoder") {
            // decoder
            if (_vp_264player != null) {
                lastDate = _vp_264player.lastReceiveDate();
            }
        } else if (_vp_playerType === "wfs") {
            if (_vp_wfs != null) {
                if (_vp_wfs.websocketLoader) {
                    lastDate = _vp_wfs.websocketLoader.lastReceiveDate;
                }
            }
        } else if (_vp_playerType === "mp4") {
            if (_vp_MP4Player != null) {
                lastDate = _vp_MP4Player.GetLastUpdateTime();
            }
        } else if (_vp_playerType === "tc") {
            if (_vp_TCPlayer != null) {
                lastDate = tcLastUpdateDate;
            }
        } else if (_vp_playerType === "hw") {
            if (_vp_HWPlayer != null) {
                if (hwPlaying === true)
                    hwLastUpdateDate = new Date();

                lastDate = hwLastUpdateDate;
            }
        } else if (_vp_playerType === "gc") {
            if (_vp_WSPPlayer != null) {
                lastDate = _vp_WSPPlayer.GetLastUpdateTime();
            }
        } else if (_vp_playerType === "srs") {
            if (_vp_SRSPlayer != null) {
                lastDate = _vp_SRSPlayer.GetLastUpdateTime();
            }
        }

        return lastDate;
    }

    this.resize = function (w, h) {
        let vpMainDiv = document.getElementById("_vp_mainDiv");

        if (vpMainDiv != null) {
            vpMainDiv.style.width = w + "px";
            vpMainDiv.style.height = h + "px";
        }

        switch (_vp_playerType) {
            case "decoder":
                //decoder
                if (_vp_264player != null) {
                    _vp_264player.setVideoSize("_vp_mainDiv", w, h);
                }

                break;
            case "wfs":
            case "mp4":
            case "srs":
            case "gc":
                //wfs, video source
                let _vp_mainPlayer = document.getElementById("_vp_mainPlayer");

                if (_vp_mainPlayer != null) {
                    _vp_mainPlayer.style.width = w + "px";
                    _vp_mainPlayer.style.height = h + "px";
                }

                break;
            case "hw":
                break;
            case "tc":
                if (_vp_TCPlayer != null) {
                    if (_vp_TCPlayer.video != null) {
                        if (_vp_TCPlayer.video.el != null) {
                            _vp_TCPlayer.width = w + "px";
                            _vp_TCPlayer.height = h + "px";                            
                            _vp_TCPlayer.el.style.width = w + "px";
                            _vp_TCPlayer.el.style.height = h + "px";
                            _vp_TCPlayer.video.el.style.width = w + "px";
                            _vp_TCPlayer.video.el.style.height = h + "px";
                        }
                    }
                }

                break;
            default:
                break;
        }
    }

    this.mute = function (value) {
        //mute(muted)

        if (_vp_playerType === "tc") {
            // 目前只有 TC Player 支援
            if (_vp_TCPlayer != null) {
                _vp_TCPlayer.mute(value);
            }
        } else if (_vp_playerType === "hw") {
            if (_vp_HWPlayer != null) {
                _vp_HWPlayer.muteAudio();
            }
        }
    }

    this.volume = function (value) {
        if (_vp_playerType === "tc") {
            // 目前只有 TC Player 支援
            if (_vp_TCPlayer != null) {
                _vp_TCPlayer.volume(value);
            }
        } else if (_vp_playerType === "hw") {
            if (_vp_HWPlayer != null) {
                _vp_HWPlayer.setPlayoutVolume(value);
            }
        }
    }

    this.playVideo = function (channelName, param, tryCount, parentDiv) {
        let protocol = window.location.href.indexOf("https://") == 0 ? "https" : "http";

        if ((domain == null) || (domain === "")) {
            domain = defaultDomain;
        }

        if (parentDiv != null) {
            if (_vp_playerType !== "tc") {
                // 1, 2, 3 都支援, TC 自行處理
                let vpMainDiv = document.getElementById("_vp_mainDiv");
                let _vp_mainPlayer = document.getElementById("_vp_mainPlayer");
                let _vp_Url;

                if (vpMainDiv != null) {
                    _playVideo_Close();
                } else {
                    vpMainDiv = document.createElement("DIV");
                    vpMainDiv.id = "_vp_mainDiv";
                    vpMainDiv.style.width = parentDiv.clientWidth + "px";
                    vpMainDiv.style.height = parentDiv.clientHeight + "px";

                    parentDiv.appendChild(vpMainDiv);
                }


                if (_vp_mainPlayer == null) {
                    if ((_vp_playerType === "wfs") ||
                        (_vp_playerType === "mp4") ||
                        (_vp_playerType === "gc") ||
                        (_vp_playerType === "srs")) {
                        // video
                        let videoTag = document.createElement("video");

                        videoTag.id = "_vp_mainPlayer";
                        videoTag.autoplay = true;
                        videoTag.muted = true;
                        // for wechat attributes
                        //x-webkit-airplay="true" x5-playsinline="true" webkit-playsinline="true" playsinline="true"
                        //videoTag.setAttribute("x5-video-player-type", "h5");
                        videoTag.setAttribute("x-webkit-airplay", "true");
                        videoTag.setAttribute("x5-playsinline", "true");
                        videoTag.setAttribute("playsinline", "true");
                        videoTag.setAttribute("webkit-playsinline", "true");
                        //videoTag.setAttribute("x5-video-player-type", "h5");
                        //videoTag.setAttribute("x5-video-player-fullscreen", "true");
                        videoTag.style.width = parentDiv.clientWidth + "px";
                        videoTag.style.height = parentDiv.clientHeight + "px";
                        videoTag.addEventListener("click", function () {
                            this.muted = false;
                        });

                        _vp_mainPlayer = videoTag;

                        vpMainDiv.appendChild(videoTag);
                    }
                }

                if (_vp_playerType === "decoder") {
                    // decoder
                    if (protocol === "https") {
                        _vp_Url = "wss://" + domain + ":" + _httpsPort + "/_rtsp/" + channelName + "?" + param;
                    } else {
                        _vp_Url = "ws://" + domain + ":" + _httpPort + "/_rtsp/" + channelName + "?" + param;
                    }

                    _vp_264player = new window.h264Player();
                    _vp_264player.initialize(_scriptPath);
                    _vp_264player.playVideo(_vp_Url, "_vp_mainDiv");
                } else if (_vp_playerType === "wfs") {
                    if (protocol === "https") {
                        _vp_Url = "wss://" + domain + ":" + _httpsPort + "/_rtsp/" + channelName + "?" + param;
                    } else {
                        _vp_Url = "ws://" + domain + ":" + _httpPort + "/_rtsp/" + channelName + "?" + param;
                    }

                    if (window.Wfs.isSupported()) {
                        _vp_wfs = new window.Wfs();
                        _vp_wfs.attachMedia(_vp_mainPlayer, _vp_Url);
                    }
                } else if (_vp_playerType === "mp4") {
                    //_vp_mainPlayer
                    if (protocol === "https") {
                        _vp_Url = "https://" + domain + ":" + _httpsPort + "/_rtsp/" + channelName + "?" + param;
                    } else {
                        _vp_Url = "http://" + domain + ":" + _httpPort + "/_rtsp/" + channelName + "?" + param;
                    }

                    if (_vp_Url.indexOf("?") !== -1) {
                        _vp_Url += "&mp4=1";
                    } else {
                        _vp_Url += "?mp4=1";
                    }

                    if (_vp_mainPlayer != null) {
                        _vp_MP4Player = new window.MP4Player(_vp_mainPlayer, _vp_Url);
                        _vp_MP4Player.Play();
                    }
                } else if (_vp_playerType === "hw") {
                    let playType = 0; // webrtc

                    // 偵測手機型號:
                    // iOS -> rtc
                    // 華為 -> flv
                    if (_vp_is_iOS) {
                        // iOS, 必須使用 webrtc
                        playType = 0;
                    } else {
                        // 判斷是否為華為
                        //Mozilla/5.0 (Linux; Android 10; HarmonyOS; EBG-AN10; HMSCore 6.3.0.327) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.105 HuaweiBrowser/12.0.3.310 Mobile Safari/537.36
                        let ua = navigator.userAgent;

                        if (ua.indexOf("HuaweiBrowser") !== -1)
                            playType = 1;
                        else if (ua.indexOf("LLD-AL00") !== -1)
                            playType = 1;
                    }

                    if (playType === 0) {  // webrtc
                        _vp_Url = "webrtc://" + domain + "/live/" + channelName + "?" + param;
                        _vp_HWPlayer = window.HWLLSPlayer.createClient("webrtc");
                    } else {  // flv
                        if (protocol === "https") {
                            _vp_Url = "https://" + domain + "/live/" + channelName + ".flv?" + param;
                        } else {
                            _vp_Url = "http://" + domain + "/live/" + channelName + ".flv?" + param;
                        }
                        _vp_HWPlayer = window.HWLLSPlayer.createClient("flv");
                    }

                    if (_vp_HWPlayer != null) {
                        hwLastInfo = null;
                        hwLastUpdateDate = new Date();

                        _vp_HWPlayer.on("video-broken", function () {
                            //alert("video-broken");
                            hwPlaying = false;
                        });

                        _vp_HWPlayer.on("video-start", function () {
                            //alert("video-start");
                            hwPlaying = true;
                        });

                        _vp_HWPlayer.on("video-recovery", function () {
                            //alert("video-recovery");
                            hwPlaying = true;
                        });


                        _vp_HWPlayer.startPlay(_vp_Url, {
                            elementId: "_vp_mainDiv",
                            autoPlay: true,
                            domainPolicy: 1,
                            objectFit: "contain",
                            schedulePolicy: "DNS",
                            showLoading: false,
                            webrtcConfig: {
                                receiveVideo: true,
                                receiveAudio: false
                            }
                        });

                        //_vp_HWPlayer.enableStreamStateDetection(true, 5, { enable:true });

                        // HW media-statistic 在 iphone 會失效
                        /*
                        _vp_HWPlayer.streamStatistic(true, 1);
                        _vp_HWPlayer.on("media-statistic", function (StatisticInfo) {
                            if (_vp_HWPlayer != null) {
                                if ((hwLastInfo != null) && (StatisticInfo != null)) {
                                    let currDate = new Date();

                                    if ((StatisticInfo.video != null) && (hwLastInfo.video != null)) {
                                        if (StatisticInfo.video.bytesReceived != hwLastInfo.video.bytesReceived) {
                                            hwPlaying = true;
                                            hwLastInfo = StatisticInfo;
                                            hwLastUpdateDate = new Date();
                                        } else {
                                            if (hwLastUpdateDate != null) {
                                                if (((currDate - hwLastUpdateDate) / 1000) >= 5)
                                                    hwPlaying = false;
                                            }
                                        }
                                    } else {
                                        if (hwLastUpdateDate != null) {
                                            if (((currDate - hwLastUpdateDate) / 1000) >= 5)
                                                hwPlaying = false;
                                        }
                                    }
                                } else {
                                    hwPlaying = true;
                                    hwLastInfo = StatisticInfo;
                                    hwLastUpdateDate = new Date();
                                }
                            }
                        });
                        */
                    }
                } else if (_vp_playerType === "gc") {
                    //
                    if (protocol === "https") {
                        _vp_Url = "https://" + domain + "/live/" + channelName;
                    } else {
                        _vp_Url = "http://" + domain + "/live/" + channelName;
                    }

                    if (_vp_mainPlayer != null) {
                        let playType = 0; // webrtc

                        // 偵測手機型號:
                        // iOS -> rtc
                        // 華為 -> flv
                        if (_vp_is_iOS) {
                            // iOS, 必須使用 webrtc
                            playType = 0;
                        } else {
                            // 判斷是否為華為
                            //Mozilla/5.0 (Linux; Android 10; HarmonyOS; EBG-AN10; HMSCore 6.3.0.327) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.105 HuaweiBrowser/12.0.3.310 Mobile Safari/537.36
                            let ua = navigator.userAgent;

                            if (ua.indexOf("HuaweiBrowser") !== -1)
                                playType = 1;
                            else if (ua.indexOf("LLD-AL00") !== -1)
                                playType = 1;
                        }

                        console.log("gcPlayer type=" + playType);

                        _vp_WSPPlayer = new window.WsPlayer(_vp_mainPlayer,
                            _vp_Url + ".sdp?" + param,
                            _vp_Url + ".flv?" + param);
                        _vp_WSPPlayer.Init(_scriptPath, playType, function () {
                            _vp_WSPPlayer.Play();
                        });
                    }
                } else if (_vp_playerType === "srs") {
                    //
                    if (protocol === "https") {
                        _vp_Url = "https://" + domain + ":4443/live/" + channelName;
                    } else {
                        _vp_Url = "http://" + domain + ":88/live/" + channelName;
                    }

                    if (_vp_mainPlayer != null) {
                        let playType = 0; // webrtc

                        // 偵測手機型號:
                        // iOS -> rtc
                        // 華為 -> flv
                        if (_vp_is_iOS) {
                            // iOS, 必須使用 webrtc
                            playType = 0;
                        } else {
                            // 判斷是否為華為
                            //Mozilla/5.0 (Linux; Android 10; HarmonyOS; EBG-AN10; HMSCore 6.3.0.327) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.105 HuaweiBrowser/12.0.3.310 Mobile Safari/537.36
                            let ua = navigator.userAgent;

                            if (ua.indexOf("HuaweiBrowser") !== -1)
                                playType = 1;
                            else if (ua.indexOf("LLD-AL00") !== -1)
                                playType = 1;
                        }

                        if (playType === 0) {
                            // webrtc
                            if ((tryCount % 2) !== 0)
                                playType = 1;  // webrtc failure
                        }


                        _vp_SRSPlayer = new window.SRSPlayer(_vp_mainPlayer,
                            _vp_Url + "?" + param);

                        _vp_SRSPlayer.Init(_scriptPath, playType, function () {
                            _vp_SRSPlayer.Play();
                        });
                    }
                }
            } else {
                // TC Player
                let vpMainDiv = document.getElementById("_vp_mainDiv");
                let rtcUrl;
                let flvUrl;

                if (vpMainDiv != null) {
                    _playVideo_Close();
                } else {
                    vpMainDiv = document.createElement("DIV");
                    vpMainDiv.id = "_vp_mainDiv";
                    vpMainDiv.style.width = parentDiv.clientWidth + "px";
                    vpMainDiv.style.height = parentDiv.clientHeight + "px";

                    parentDiv.appendChild(vpMainDiv);
                }

                tcLastCurrentTime = null;
                tcLastUpdateDate = new Date();

                if (protocol === "https") {
                    rtcUrl = "webrtc://" + domain + "/live/" + channelName + "?" + param;
                    flvUrl = "https://" + domain + "/live/" + channelName + ".flv" + "?" + param;
                } else {
                    rtcUrl = "webrtc://" + domain + "/live/" + channelName + "?" + param;
                    flvUrl = "http://" + domain + "/live/" + channelName + ".flv" + "?" + param;
                }

                _vp_TCPlayer = new window.TcPlayer("_vp_mainDiv", {
                    webrtc: rtcUrl,
                    flv: flvUrl,
                    autoplay: true,      //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                    live: true,
                    controls: "none",
                    flash: false,
                    h5_flv: true,
                    width: parentDiv.clientWidth,//视频的显示宽度，请尽量使用视频分辨率宽度
                    height: parentDiv.clientHeight,//视频的显示高度，请尽量使用视频分辨率高度
                    wording: {
                        1002: '',
                        2002: '',
                        2032: '',
                        2048: ''
                    },
                    listener: function (msg) {
                        // console.log('listener',msg);
                        if (msg.type === 'error') {
                            window.setTimeout(function () {
                                _vp_TCPlayer.load();//进行重连
                            }, 1000);
                        } else if (msg.type === 'timeupdate') {
                            if (_vp_TCPlayer.playing() === true) {
                                if (tcLastCurrentTime != _vp_TCPlayer.currentTime()) {
                                    tcLastCurrentTime = _vp_TCPlayer.currentTime();
                                    tcLastUpdateDate = new Date();
                                }
                                
                            }
                        }
                    }
                });
                _vp_TCPlayer.mute(true);
                _vp_TCPlayer.el.style.background = "transparent"
            }
        }
    };

    this.closeVideo = function () {
        _playVideo_Close();
    };

    this.ping = function (playerType, streamName, cb) {
        let xmlHttp = new XMLHttpRequest();
        let url;
        let d1;
        let d2;
        let totalMS = 0;
        let protocol = window.location.href.indexOf("https://") == 0 ? "https" : "http";

        if (playerType === "srs") {
            if (protocol === "https") {
                url = "https://" + domain + ":4443/";
            } else {
                url = "http://" + domain + ":88/";
            }
        } else {
            if ((domain == null) || (domain === "")) {
                if (protocol === "https") {
                    //url = "https://" + defaultDomain + "/live/" + streamName + ".flv";
                    url = "https://" + defaultDomain + "/";
                } else {
                    //url = "http://" + defaultDomain + "/live/" + streamName + ".flv";
                    url = "http://" + defaultDomain + "/";
                }
            } else {
                if (protocol === "https") {
                    //url = "https://" + domain + "/live/" + streamName + ".flv";
                    url = "https://" + domain + "/";
                } else {
                    //url = "http://" + domain + "/live/" + streamName + ".flv";
                    url = "http://" + domain + "/";
                }
            }
        }

        d1 = new Date();
        xmlHttp.open("OPTIONS", url, true);
        xmlHttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                //let contentText = this.responseText;
                d2 = new Date();

                totalMS = (d2 - d1);

                if (cb) {
                    cb(true, totalMS);
                }
            }
        };

        xmlHttp.withCredentials = false;

        try { xmlHttp.send(); }
        catch (ex) { }
    };

    this.getSignalPNG = function (latencyMS) {
        let avgMS = latencyMS;
        let png;

        if (avgMS <= 40) {
            png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIk2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNy0yMFQxOToxNDozOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNy0yMFQxOToxNDo1NyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDctMjBUMTk6MTQ6NTcrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk3YjQwZjRhLTQyNGMtNjE0MC05MzkyLTkxYjhkZDE3MWNkOCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmZmYmZmYzNiLWU0NTMtN2Y0MC1iYjIwLTAwMmExZjU4OGEyMiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTk1NTNjYTQtMTAyYi1mYzQ0LTg0MDMtNmM3ZmMwZmI5YWM5IiBzdEV2dDp3aGVuPSIyMDE4LTA3LTIwVDE5OjE0OjM4KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmJhYTMyM2VjLWQzNTUtZDM0Zi1hMWYwLWYwMjgyODZmMjA5YSIgc3RFdnQ6d2hlbj0iMjAxOC0wNy0yMFQxOToxNDo1NyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5N2I0MGY0YS00MjRjLTYxNDAtOTM5Mi05MWI4ZGQxNzFjZDgiIHN0RXZ0OndoZW49IjIwMTgtMDctMjBUMTk6MTQ6NTcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YmFhMzIzZWMtZDM1NS1kMzRmLWExZjAtZjAyODI4NmYyMDlhIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnYcSaoAAAB9SURBVGiB7doxCoBADAVRI3pUT+VRLWIlaCeuMHyYV1nukC02YHX3lGymDzBqoQ9wtx316jrsa9f1HT8BA2gG0AygGUAzgGYAzQDar/vAl/f8qPgJGEAzgGYAzQCaATQDaAbQ4gMeCw2xkIyKn4ABNANoBtAMoMUHlH+rwE4UVhJfLk1wSAAAAABJRU5ErkJggg==";
        } else if (avgMS <= 60) {
            png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIk2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNy0yMFQxOToxNDozOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNy0yMFQxOToxNTowOCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDctMjBUMTk6MTU6MDgrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBkZDZlMDFmLTU3YjEtMzc0ZS1hM2Y1LWNiZDkzMTM2ZDgyZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjg0ZjkyMDQzLWY0NDktMmM0My04YWE4LWU4NTYxMzc1YzBlNSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTk1NTNjYTQtMTAyYi1mYzQ0LTg0MDMtNmM3ZmMwZmI5YWM5IiBzdEV2dDp3aGVuPSIyMDE4LTA3LTIwVDE5OjE0OjM4KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFhNDljNGZlLTA4OWQtODU0Yy04NmU0LTczNTU1YTRlZmFiMyIgc3RFdnQ6d2hlbj0iMjAxOC0wNy0yMFQxOToxNTowOCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowZGQ2ZTAxZi01N2IxLTM3NGUtYTNmNS1jYmQ5MzEzNmQ4MmYiIHN0RXZ0OndoZW49IjIwMTgtMDctMjBUMTk6MTU6MDgrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MWE0OWM0ZmUtMDg5ZC04NTRjLTg2ZTQtNzM1NTVhNGVmYWIzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq7wfL8AAACQSURBVGiB7dpBCoAgFABRjTpN9z9KpymwVWDQQrKYfsxbtXT6QUrlUkqKbKAX0GukF1Bbl7HpcZjmLR/XTuAN9R2uXU0o/AQMoBlAM4BmAM0AmgG0R3ejd/bzvcJPwACaATQDaAbQDKAZQDOAFj7gdKAhDiS9wk/AAJoBNANo4QM++Z249YWa0g8mkP1bBbYDiIAZNmM7wP0AAAAASUVORK5CYII=";
        } else {
            png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIk2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wNy0yMFQxOToxNDozOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNy0yMFQxOToxNToyMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDctMjBUMTk6MTU6MjArMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNmMjU4YjA2LTI1NjYtODA0Zi05ZDE2LTNkNmE3NGU0NWZhZSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk5Yjk2MjkyLTYyNWMtN2U0YS04OGIwLTU1NTE0NDExOGViMSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTk1NTNjYTQtMTAyYi1mYzQ0LTg0MDMtNmM3ZmMwZmI5YWM5IiBzdEV2dDp3aGVuPSIyMDE4LTA3LTIwVDE5OjE0OjM4KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjgwNjA1MDdmLWM3NGUtYTY0MS1iZmM5LWI3Mjk1MjkyYjE4OCIgc3RFdnQ6d2hlbj0iMjAxOC0wNy0yMFQxOToxNToyMCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozZjI1OGIwNi0yNTY2LTgwNGYtOWQxNi0zZDZhNzRlNDVmYWUiIHN0RXZ0OndoZW49IjIwMTgtMDctMjBUMTk6MTU6MjArMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODA2MDUwN2YtYzc0ZS1hNjQxLWJmYzktYjcyOTUyOTJiMTg4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjk5NTUzY2E0LTEwMmItZmM0NC04NDAzLTZjN2ZjMGZiOWFjOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjidKC8AAACRSURBVGiB7dqxCoAwDABRI/r/H+wQJ6GCgxrlCNybXISecajFyMyps5leQNVCL2C0Rdx6HdbMOK6dwB/GJzy6mlD7CRhAM4BmAM0AmgE0A2if7kbf7OernMCVJ/v5qvYTMIBmAM0AmgE0A2gG0NoHnLbTxAdJVfsJGEAzgGYArX3AL+dC1fOfJ/e3n0D4twpsB5NnHl2e2B2cAAAAAElFTkSuQmCC";
        }

        return png;
    };

};

export default kingkeyPlayer;
