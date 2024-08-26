var kingkeyPlayer = function () {
    var _scriptPath = "";
    var _vp_is_iOS = /(iPhone|iPod|iPad).*AppleWebKit.*Safari/i.test(navigator.userAgent);
    var _vp_wfs;
    var _vp_264player;
    var _vp_initialized = false;
    var _vp_playerType = 0;  // 0=decoder/1=video

    const _vp_typeWfs = 1;
    const _vp_type264 = 0;
    const playerTypeAuto = 0;
    const playerType1 = 1;  // decoder
    const playerType2 = 2;  // video

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

    function _prepareScript(type, scriptsUri, cb) {
        switch (type) {
            case _vp_typeWfs:
                _loadScript(scriptsUri + 'flv.js', function () {
                    if (cb != null)
                        cb();
                });
                break;
            case _vp_type264:
                _loadScript(scriptsUri + 'WebGLCanvas.js', function () {
                    _loadScript(scriptsUri + 'SPSParser.js', function () {
                        _loadScript(scriptsUri + 'h264Player.js', function () {
                            if (cb != null)
                                cb();
                        });
                    });
                });
                break;
        }
    }

    function _playVideo_Close() {
        if (_vp_playerType == 0) {
            // decoder
            if (_vp_264player != null) {
                _vp_264player.closeVideo();
            }

            _vp_264player = null;
        } else {
            if (_vp_wfs != null) {
                _vp_wfs.destroy();
            }

            _vp_wfs = null;
        }
    }

    this.initialize = function (scriptBaseUri, playerType, cb) {
        if (_vp_initialized == false) {
            if (scriptBaseUri != null) {
                if (scriptBaseUri.substr(scriptBaseUri.length - 1, 1) != "/")
                    _scriptPath = scriptBaseUri + "/";
                else
                    _scriptPath = scriptBaseUri;
            }

            _vp_playerType = playerType;

            if (playerType == playerTypeAuto) {
                if (_vp_is_iOS == true) {
                    // iOS
                    _vp_playerType = 0;
                } else {
                    _vp_playerType = 1;
                }
            } else if (playerType == playerType1) {
                _vp_playerType = 0;
            } else {
                _vp_playerType = 1;
            }

            if (_vp_playerType == 0) {
                // decoder
                _prepareScript(_vp_type264, _scriptPath, function () {
                    _vp_initialized = true;
                    if (cb != null)
                        cb();
                });
            } else {
                _prepareScript(_vp_typeWfs, _scriptPath, function () {
                    _vp_initialized = true;
                    if (cb != null)
                        cb();
                });
            }
        }
    }

    this.getVideoFrameCount = function () {
        var count = 0;

        if (_vp_playerType == 0) {
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

    this.getLastReceiveDate = function () {
        var lastDate = null;

        if (_vp_playerType == 0) {
            // decoder
            if (_vp_264player != null) {
                lastDate = _vp_264player.lastReceiveDate();
            }

        } else {
            if (_vp_wfs != null) {
                if (_vp_wfs.websocketLoader) {
                    lastDate = _vp_wfs.websocketLoader.lastReceiveDate;
                }
            }
        }

        return lastDate;
    }

    this.resize = function (w, h) {
        var vpMainDiv = document.getElementById("_vp_mainDiv");

        if (vpMainDiv != null) {
            vpMainDiv.style.width = w + "px";
            vpMainDiv.style.height = h + "px";
        }

        switch (_vp_playerType) {
            case 0:
                //decoder
                if (_vp_264player != null) {
                    _vp_264player.setVideoSize("_vp_mainDiv", w, h);
                }

                break;
            case 1:
                //wfs
                var _vp_mainPlayer = document.getElementById("_vp_mainPlayer");

                if (_vp_mainPlayer != null) {
                    _vp_mainPlayer.style.width = w + "px";
                    _vp_mainPlayer.style.height = h + "px";
                }

                break;
        }
    }

    this.playVideo = function (channelName, parentDiv) {
        if (parentDiv != null) {
            var vpMainDiv = document.getElementById("_vp_mainDiv");
            var _vp_mainPlayer = document.getElementById("_vp_mainPlayer");
            var protocol = window.location.href.indexOf("https://") == 0 ? "https" : "http";
            var _vp_wsUrl;

            if (protocol == "https") {
                _vp_wsUrl = "wss://vid.td888.net:951/_rtsp/" + channelName;
            } else {
                _vp_wsUrl = "ws://vid.td888.net:86/_rtsp/" + channelName;
            }
            //_vp_wsUrl = "ws://127.0.0.1:86/_rtsp/" + channelName;

            if (vpMainDiv != null) {
                _playVideo_Close();
            } else {
                vpMainDiv = document.createElement("DIV");
                vpMainDiv.id = "_vp_mainDiv";
                vpMainDiv.style.width = parentDiv.clientWidth + "px";
                vpMainDiv.style.height = parentDiv.clientHeight + "px";

                if (_vp_playerType == 1) {
                    // video
                    var videoTag = document.createElement("video");

                    videoTag.id = "_vp_mainPlayer";
                    videoTag.autoplay = true;
                    videoTag.muted = true;
                    videoTag.setAttribute("playsinline", null);
                    videoTag.setAttribute("webkit-playsinline", null);
                    videoTag.style.width = parentDiv.clientWidth + "px";
                    videoTag.style.height = parentDiv.clientHeight + "px";

                    _vp_mainPlayer = videoTag;

                    vpMainDiv.appendChild(videoTag);
                }

                parentDiv.appendChild(vpMainDiv);
            }

            if (_vp_playerType == 0) {
                // decoder
                _vp_264player = new h264Player();
                _vp_264player.initialize(_scriptPath);
                _vp_264player.playVideo(_vp_wsUrl, "_vp_mainDiv");
            } else {
                if (flvjs.isSupported()) {
                    _vp_wfs = flvjs.createPlayer({
                        type: 'flv',
                        url: _vp_wsUrl,
                        hasAudio: false,
                        hasVideo: true,
                    },
                        {
                            dataType: 'flv'
                        });
                    _vp_wfs.attachMediaElement(_vp_mainPlayer);
                    _vp_wfs.load();
                }
            }

            //防延遲處理
            _vp_mainPlayer.onprogress = function (e) {
                if (e.target.buffered.length > 0 && e.target.buffered.end(0) && e.target.currentTime) {
                    if ((e.target.buffered.end(0) - e.target.currentTime) > 3.00) {
                        e.target.currentTime = e.target.buffered.end(0);
                        console.log("currentTime adjust");
                    }
                }
            };
        }
    }

    this.closeVideo = function () {
        _playVideo_Close();
    }
};
