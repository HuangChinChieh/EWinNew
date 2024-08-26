var h264Player = function () {
    var _h264_scriptPath = "";
    var _h264_decoder;
    var wWebsocket;
    var lastReceiveDate = new Date();
    var videoFrameProcessStarted = false;
    var firstTimestamp = null;
    var firstVideoDate = null;
    var timerVideo = null;
    var videoFrames = [];
    var display = null;
    var isPlaying = false;
    var raiseInfo = false;
    var _lastCanvasWidth;
    var _lastCanvasHeight;
    var _divParent;

    this.playingState = function () {
        return isPlaying;
    }

    this.closeVideo = function () {
        if (this.timerVideo != null) {
            clearInterval(this.timerVideo);
            this.timerVideo = null;
        }

        if (_h264_decoder != null) {
            _h264_decoder.postMessage({ type: 'close', data: null });
            _h264_decoder.terminate();
        }

        if (wWebsocket != null) {
            wWebsocket.close();
        }

        isPlaying = false;
        videoFrames = null;
        _h264_decoder = null;
        wWebsocket = null;
        raiseInfo = false;
    }

    this.setVideoSize = function (divParent, width, height) {
        var divParent = document.getElementById(divParent);
        var c;

        if (divParent) {
            divParent.style.width = width + "px";
            divParent.style.height = height + "px";

            if (divParent.childNodes.length > 0) {
                var w_rate;
                var h_rate;

                c = divParent.childNodes[0];

                w_rate = width / c.clientWidth;
                h_rate = height / c.clientHeight;

                _h264_setElementTransform(c, "scale(" + w_rate + "," + h_rate + ")");
            }
        }
    }

    this.videoFrameCount = function () {
        var count = 0;

        if (videoFrames != null) {
            count = videoFrames.length;
        }

        return count;
    }

    this.lastReceiveDate = function () {
        return lastReceiveDate;
    }

    this.initialize = function (scriptBaseUri) {
        if (scriptBaseUri != null) {
            if (scriptBaseUri.substr(scriptBaseUri.length - 1, 1) != "/")
                _h264_scriptPath = scriptBaseUri + "/";
            else
                _h264_scriptPath = scriptBaseUri;
        }

    }

    this.getOffscreenCanvas = function () {
        var c;

        if (display)
            c = display.getOffscreenCanvas();

        return c;
    }

    this.playVideo = function (url, divParent) {
        _divParent = document.getElementById(divParent);

        if (_h264_decoder != null)
            this.closeVideo();

        _h264_decoder = new Worker(_h264_scriptPath + 'decoder.js?20201007');
        _h264_decoder.addEventListener('message', function (e) {
            if (e != null) {
                var frameData = e.data.data;
                var width = e.data.width;
                var height = e.data.height;

                if ((raiseInfo == false) || (width != _lastCanvasWidth) || (height != _lastCanvasHeight)) {
                    if ((width != null) && (height != null)) {
                        raiseInfo = true;
                        _lastCanvasWidth = width;
                        _lastCanvasHeight = height;

                        display = initialCanvas(width, height);
                    }
                }

                if (display != null)
                    display.drawNextOuptutPictureGL(width, height, null, frameData);
            }
        });

        _h264_getBinary(url, function (frameData, timestamp) {
            if (frameData != null) {
                isPlaying = true;
                videoFrames[videoFrames.length] = {
                    data: frameData,
                    timestamp: timestamp
                }
            }
        });

        timerVideo = setInterval(function () {
            if (videoFrames != null) {
                if (videoFrameProcessStarted == true) {
                    if (videoFrames.length > 0) {
                        var currDate = new Date();
                        var processCount = 0;

                        for (var i = 0; i < videoFrames.length; i++) {
                            var frame = videoFrames[i];
                            var timeDelta = 0;

                            if ((firstTimestamp == null) || (frame.timestamp < firstTimestamp)) {
                                firstVideoDate = new Date();
                                firstTimestamp = frame.timestamp;
                            };

                            timeDelta = ((frame.timestamp - firstTimestamp) / 90);

                            //console.log("over time:" + (currDate - _this.firstVideoDate) + "  delta:" + timeDelta + "  frames:" + _this.videoFrames.length);

                            if ((currDate - firstVideoDate) >= timeDelta) {
                                processCount++;
                                lastReceiveDate = new Date();

                                _h264_decoder.postMessage({ type: 'frame', data: frame.data });
                            } else {
                                break;
                            }
                        }

                        videoFrames = videoFrames.slice(processCount);
                    }
                } else {
                    if (videoFrames.length > 10) {
                        videoFrameProcessStarted = true;
                    }
                }
            }
        }, 10);
    }

    function initialCanvas(_width, _height) {
        var c;
        var w_rate;
        var h_rate;
        var GLCanvas;

        width = _width;
        height = _height;

        w_rate = _divParent.clientWidth / _width;
        h_rate = _divParent.clientHeight / _height;

        if (_divParent.childNodes.length > 0) {
            c = _divParent.childNodes[0];
        } else {
            c = document.createElement("canvas");
            _divParent.appendChild(c);
        }

        c.width = width;
        c.height = height;
        c.style.cssText = "position:relative; -moz-transform-origin: 0 0; -moz-transform: scale(1.0,1.0); -webkit-transform-origin: 0 0; -webkit-transform: scale(1.0,1.0); -o-transform-origin: 0 0; -o-transform: scale(1.0,1.0); -ms-transform-origin: 0 0; -ms-transform: scale(1.0,1.0); transform-origin: 0 0; transform: scale(1.0,1.0);";

        _h264_setElementTransform(c, "scale(" + w_rate + "," + h_rate + ")");

        GLCanvas = new WebGLCanvas(c);

        return GLCanvas;
    }

    function _h264_setElementTransform(o, value) {
        o.style.WebkitTransform = value;
        o.style.MozTransform = value;
        o.style.transform = value;
    }

    function _Filter003(d) {
        var i = 0;
        var j = 0;
        var buff = new Uint8Array(d.length);
        var retValue;

        while (i < d.length) {
            if (i < (d.length - 3)) {
                if ((d[i+0] == 0) && (d[i+1] == 0) && (d[i+2] == 3)) {
                    buff[j] = 0;
                    buff[j + 1] = 0;
                    i += 3;
                    j += 2;
                } else {
                    buff[j] = d[i];
                    i++;
                    j++;
                }
            } else {
                buff[j] = d[i];
                i++;
                j++;
            }
        }

        //retValue = new Uint8Array(buff, 0, j);
        if (j != buff.length) {
            retValue = buff.subarray(0, j);
        } else {
            retValue = buff;
        }

        return retValue;
    }

    function _h264_getBinary(URL, frameCB) {
        if (wWebsocket != null)
            this.closeVideo();

        wWebsocket = new WebSocket(URL);
        wWebsocket.binaryType = "arraybuffer";
        wWebsocket.onmessage = function (evt) {
            var frames;

            if (evt != null) {
                frames = _h264_procVideoSlice(evt);
                if (frames) {
                    if (frames.length > 0) {
                        for (var i = 0; i < frames.length; i++) {
                            var slice = frames[i];

                            if (frameCB)
                                frameCB(slice.data, slice.timestamp);
                        }
                    }
                }
            }
        };
    }

    function _h264_procVideoSlice(evt) {
        var retValue = [];

        function invokeVideoCB(frameType, header, data, timestamp) {
            var retValue = {
                frameType: frameType,
                header: header,
                data: data,
                timestamp: timestamp
            }

            return retValue;
        }

        if (evt.data instanceof ArrayBuffer) {
            var aDataArray = new Uint8Array(evt.data);
            var lastBeginIndex = 0;

            for (var i = 0; i < (aDataArray.length - 3); ++i) {
                if (aDataArray[i] == 13 &&
                    aDataArray[i + 1] == 10 &&
                    aDataArray[i + 2] == 13 &&
                    aDataArray[i + 3] == 10) {
                    var headerArray = new Uint8Array(evt.data, lastBeginIndex, (i - lastBeginIndex));
                    var headerStr = String.fromCharCode.apply(null, headerArray);
                    var headerStrArray = headerStr.split("\r\n");
                    var timestamp = 0;
                    var frameType;
                    var frameLength = 0;
                    var frameContentType;

                    for (var j = 0; j < headerStrArray.length; j++) {
                        if (headerStrArray[j]) {
                            if (headerStrArray[j] != "") {
                                var index;

                                index = headerStrArray[j].indexOf(":");
                                if (index != -1) {
                                    var cmd;
                                    var value;

                                    cmd = headerStrArray[j].substr(0, index);
                                    value = headerStrArray[j].substr(index + 1);

                                    switch (cmd.toUpperCase()) {
                                        case "CONTENT-TYPE":
                                            frameContentType = value.trim();
                                            break;
                                        case "CONTENT-LENGTH":
                                            frameLength = parseInt(value);
                                            break;
                                        case "TIMESTAMP":
                                            timestamp = parseInt(value);
                                            break;
                                        case "FRAME-TYPE":
                                            frameType = value.trim();
                                            break;
                                    }
                                }
                            }
                        }
                    }

                    if (frameLength > 0) {
                        if (frameContentType.toUpperCase() == "video/h264".toUpperCase()) {
                            switch (frameType) {
                                case "KeyFrame":
                                    // find 0x67, 0x68, 0x65
                                    var lastFrameOffset = i + 4;
                                    var lastFrameCode = 0;
                                    var frameInit67;
                                    var frameInit68;
                                    var frameArray;

                                    for (var j = i + 4; j < (aDataArray.length - 5); ++j) {
                                        if (aDataArray[j] == 0 &&
                                            aDataArray[j + 1] == 0 &&
                                            aDataArray[j + 2] == 0 &&
                                            aDataArray[j + 3] == 1) {
                                            var nowCode = aDataArray[j + 4]

                                            if ((j - lastFrameOffset) > 0) {
                                                var tmpFrameArray = new Uint8Array(evt.data, lastFrameOffset, j - lastFrameOffset);

                                                switch (tmpFrameArray[4]) {
                                                    case 103:
                                                        // 67
                                                        //p.decode(tmpFrameArray);
                                                        retValue[retValue.length] = invokeVideoCB('init', headerStr, tmpFrameArray, timestamp);

                                                        break;
                                                    case 104:
                                                        // 68
                                                        //p.decode(tmpFrameArray);
                                                        retValue[retValue.length] = invokeVideoCB('init', headerStr, tmpFrameArray, timestamp);

                                                        break;
                                                }

                                                lastFrameOffset = j;
                                            }

                                            if (nowCode == 101) {
                                                var frameArray = new Uint8Array(evt.data, j, aDataArray.length - j);

                                                //p.decode(frameArray);
                                                retValue[retValue.length] = invokeVideoCB('key', headerStr, frameArray, timestamp);

                                                break;
                                            }
                                        }
                                    }

                                    break;
                                case "NonKeyFrame":
                                    var frameArray = new Uint8Array(evt.data, i + 4, frameLength);

                                    //p.decode(frameArray);
                                    retValue[retValue.length] = invokeVideoCB('nonKey', headerStr, frameArray, timestamp);

                                    break;
                                case "VideoInitFrame":
                                    var frameArray = new Uint8Array(evt.data, i + 4, frameLength);

                                    if ((frameArray[4] == 103) || (frameArray[4] == 104))
                                        retValue[retValue.length] = invokeVideoCB('init', headerStr, frameArray, timestamp);

                                    break;
                                default:
                                    //alert(frameType);
                                    break;
                            }
                        }
                    }

                    i += (frameLength + 4);
                    lastBeginIndex = i;
                    //break;
                }
            }
        }

        return retValue;
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
}
