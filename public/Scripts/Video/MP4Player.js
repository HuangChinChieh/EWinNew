var MP4Player = function (idVideoTag, url) {
    var controller = null;
    var trig_count = 20;  // 啟動 appendBuffer 的數量
    var isPlaying = false;
    var emptyBuffer = false;
    var lastUpdateDate = null;
    var lastAdjectDate = null;
    var mediaSource = null;
    var isVideoFrame = true;
    var isAudioFrame = false;
    var isMoof = false;  // 是否已經過 moof 分析

    function xmlHttpGet(URL, dataCb) {
        var signal;

        controller = new AbortController();
        signal = controller.signal;

        const logProgress = (reader) => {
            return reader.read().then(({ value, done }) => {
                if (done) {
                    console.log('Download completed');
                    return;
                }

                if (dataCb != null) {
                    dataCb(value);
                }

                return logProgress(reader);
            });
        };
        fetch(URL, { signal })
            .then(function (response) {
                return response.body.getReader();
            }).then(logProgress);
    }

    this.GetLastUpdateTime = function () {
        return lastUpdateDate;
    }

    this.GetCurrentPlayTime = function () {
        return idVideoTag.currentTime;
    }

    this.playingState = function () {
        return isPlaying;
    }

    this.Close = function () {
        if (controller != null) {
            controller.abort();
            controller = null;
        }

        isMoof = false;
        isVideoFrame = true;
        isAudioFrame = false;
        isPlaying = false;
        lastUpdateDate = null;
        lastAdjectDate = null;

        idVideoTag.pause();

        if (mediaSource != null) {
            var sb_list = mediaSource.sourceBuffers;

            if (sb_list != null) {
                for (var i = 0; i < sb_list.length; i++) {
                    var sb = sb_list[i];

                    try { sb.abort(); }
                    catch (ex) { }

                    mediaSource.removeSourceBuffer(sb);
                }
            }
        }
    }

    this.Play = function () {
        var sourceBuffer;
        var tmpBuffer = new Uint8Array();
        var videoBuffer = [];

        function valifyPacket(buf) {
            if (buf.length >= 4) {
                var i = 0;
                var mp4Array = "";

                while (i < buf.length) {
                    var segmentLength;


                    segmentLength = (buf[i] * Math.pow(256, 3)) + (buf[i + 1] * Math.pow(256, 2)) + (buf[i + 2] * 256) + buf[i + 3];
                    mp4Array += "{" + buf[i + 4] + "," + buf[i + 5] + "," + buf[i + 6] + "," + buf[i + 7] + "}";

                    // mdat
                    if ((buf[i + 4] == 0x6d) &&
                        (buf[i + 5] == 0x64) &&
                        (buf[i + 6] == 0x61) &&
                        (buf[i + 7] == 0x74)) {
                        // 這是 data 長度
                        //console.log("mdat(" + segmentLength + "), next bytes=" + buf[i + 8] + "," + buf[i + 9] + "," + buf[i + 10] + "," + buf[i + 11]);
                        var frameType = buf[i + 12] & 0xf;

                        if (frameType == 0x5)
                            console.log("KeyFrame mdat(" + segmentLength + "), next bytes=" + buf[i + 12] + "," + buf[i + 13] + "," + buf[i + 14] + "," + buf[i + 15]);
                        else
                            console.log("NonKeyFrame mdat(" + segmentLength + "), next bytes=" + buf[i + 12] + "," + buf[i + 13] + "," + buf[i + 14] + "," + buf[i + 15]);
                    }


                    i += segmentLength;
                }

                console.log("valify packet: " + i + "/" + buf.length + "  :  " + mp4Array);
            }
        }

        function appendBuffer() {
            if (isPlaying == true) {
                if (sourceBuffer.updating == false) {
                    if (videoBuffer.length > 0) {
                        //var buf = concat(videoBuffer);
                        var buf = videoBuffer.shift();

                        /*
                        console.log("append to source buffer, length=" + buf.length + ", left buffer count=" + videoBuffer.length);
                        if (lastUpdateDate != null)
                            console.log("latency:" + ((new Date()) - lastUpdateDate) + "ms");
    
    
                        valifyPacket(buf);
                        */

                        lastUpdateDate = new Date();
                        emptyBuffer = false;
                        sourceBuffer.appendBuffer(buf);

                        /*
                        if (idVideoTag.buffered.length > 0)
                            console.log("append to source buffer finished, buffered=" + idVideoTag.buffered.end(0));
                        else
                            console.log("append to source buffer finished");
                            */
                    } else {
                        emptyBuffer = true;
                        //console.log("buffer empty");
                    }
                }
            }
        }

        mediaSource = new MediaSource();
        mediaSource.addEventListener('sourceopen', function () {
            //var mimeType = 'video/mp4; codecs="avc1.64001E,mp4a.40.2"';
            //var mimeType = 'video/mp4; codecs="avc1.64001E"';
            var mimeType;

            console.log("sourceopen");

            if ((isVideoFrame) && (isAudioFrame))
                mimeType = 'video/mp4; codecs="avc1.64001E,mp4a.40.2"';
            else
                mimeType = 'video/mp4; codecs="avc1.64001E"';

            if (MediaSource.isTypeSupported(mimeType) == true) {
                sourceBuffer = mediaSource.addSourceBuffer(mimeType);

                //sourceBuffer.mode = "segments";
                //sourceBuffer.mode = "sequence";

                console.log("source open, sourceBuffer mode=" + sourceBuffer.mode + ", mimeType=" + mimeType);


                sourceBuffer.addEventListener('abort', function () {
                    // updating: true -> false
                    console.log("sourceBuffer: abort");

                    appendBuffer();
                });

                sourceBuffer.addEventListener('error', function () {
                    // updating: true -> false
                    console.log("sourceBuffer: error");

                    appendBuffer();
                });

                sourceBuffer.addEventListener('update', function () {
                    // updating: true -> false
                    //console.log("sourceBuffer: update");

                    appendBuffer();
                });

                sourceBuffer.addEventListener('updatestart', function () {
                    // updating: false -> true
                    //console.log("sourceBuffer: updatestart");
                });

                sourceBuffer.addEventListener('updateend', function () {
                    //event is fired after onupdate.
                    //console.log("sourceBuffer: updateend");
                });


                appendBuffer();
            } else {
                console.log("mime " + mimeType + " is not supported");
            }
        });


        mediaSource.addEventListener('sourceended', function () {
            console.log("sourceend");
        });

        mediaSource.addEventListener('sourceclose', function () {
            console.log("sourceclose");
        });

        mediaSource.addEventListener('error', function () {
            console.log("error");
        });

        function mergeArray(a, b) {
            var c = new a.constructor(a.length + b.length);
            c.set(a);
            c.set(b, a.length);

            return c;
        }

        xmlHttpGet(url, function (v) {
            var i = 0;
            var lastMdat = 0;
            var trackId = -1;

            tmpBuffer = mergeArray(tmpBuffer, v);

            //console.log("merge array");
            while (true) {
                if (tmpBuffer.length >= 8) {
                    var bLength = (tmpBuffer[i + 0] * Math.pow(256, 3)) + (tmpBuffer[i + 1] * Math.pow(256, 2)) + (tmpBuffer[i + 2] * 256) + tmpBuffer[i + 3];

                    //console.log(tmpBuffer[i + 0] + "," + tmpBuffer[i + 1] + "," + tmpBuffer[i + 2] + "," + tmpBuffer[i + 3] + "(" + bLength + ")  mark=" + tmpBuffer[i + 4] + "," + tmpBuffer[i + 5] + "," + tmpBuffer[i + 6] + "," + tmpBuffer[i + 7]);
                    if (tmpBuffer.length >= (i + bLength)) {
                        // moof
                        if ((tmpBuffer[i + 4] == 0x6d) &&
                            (tmpBuffer[i + 5] == 0x6f) &&
                            (tmpBuffer[i + 6] == 0x6f) &&
                            (tmpBuffer[i + 7] == 0x66)) {
                            // moof, bytes 44 - 47 應該是 track id
                            // 判斷 36 - 39 是否 tfhd
                            if ((tmpBuffer[i + 36] == 0x74) &&
                                (tmpBuffer[i + 37] == 0x66) &&
                                (tmpBuffer[i + 38] == 0x68) &&
                                (tmpBuffer[i + 39] == 0x64)) {
                                // tfhd
                                trackId = (tmpBuffer[i + 44] * Math.pow(256, 3)) + (tmpBuffer[i + 45] * Math.pow(256, 2)) + (tmpBuffer[i + 46] * 256) + tmpBuffer[i + 47];

                                //console.log("track Id=" + trackId);
                                if (trackId == 1)
                                    isVideoFrame = true;
                                else if (trackId == 2)
                                    isAudioFrame = true;
                            }
                        } else if ((tmpBuffer[i + 4] == 0x6d) &&
                            (tmpBuffer[i + 5] == 0x64) &&
                            (tmpBuffer[i + 6] == 0x61) &&
                            (tmpBuffer[i + 7] == 0x74)) {
                            // 尋找陣列中最後的 mdat (可能包含多個)

                            lastMdat = (i + bLength);
                        }

                        i += bLength;
                    } else {
                        //console.log("not see mdat, need " + (i+bLength) + ", length=" + tmpBuffer.length + ", mark1=" + tmpBuffer[4] + "," + tmpBuffer[5] + "," + tmpBuffer[6] + "," + tmpBuffer[7] + "  mark2=" + tmpBuffer[i + 4] + "," + tmpBuffer[i + 5] + "," + tmpBuffer[i + 6] + "," + tmpBuffer[i + 7]);
                        break;
                    }
                } else {
                    //console.log("not see mdat, length=" + tmpBuffer.length);
                    break;
                }
            }

            if (lastMdat > 0) {
                var pushArray = tmpBuffer.slice(0, lastMdat);
                tmpBuffer = tmpBuffer.slice(lastMdat);

                //console.log("found mdat, length=" + pushArray.length + " (i+bLength=" + lastMdat + "), left length=" + tmpBuffer.length + ", mark1=" + tmpBuffer[4] + "," + tmpBuffer[5] + "," + tmpBuffer[6] + "," + tmpBuffer[7]);

                videoBuffer.push(pushArray);
            }


            if (isPlaying == false) {
                if (videoBuffer.length >= trig_count) {
                    //console.log("first playing");

                    isPlaying = true;
                    idVideoTag.src = window.URL.createObjectURL(mediaSource);
                    idVideoTag.play();
                }
            } else if (emptyBuffer == true) {
                //console.log("buffer empty call");
                appendBuffer();
            }
        });
    }



    // video tag event
    idVideoTag.addEventListener('waiting', function () {
        console.warn("video waiting, time=(" + idVideoTag.currentTime + "/" + idVideoTag.duration + "), p=" + idVideoTag.paused + ", rs=" + idVideoTag.readyState + ", e=" + idVideoTag.ended);
        idVideoTag.play();
    });

    idVideoTag.addEventListener('timeupdate', function () {
        //console.warn("video timeupdate, buffed=" + idVideoTag.buffered.end(0));
    });

    idVideoTag.addEventListener('suspend', function () {
        console.warn("video suspend");
    });

    idVideoTag.addEventListener('stalled', function () {
        console.warn("video stalled");
    });

    idVideoTag.addEventListener('seeking', function () {
        console.warn("video seeking");
    });

    idVideoTag.addEventListener('seeked', function () {
        console.warn("video seeked");
    });

    idVideoTag.addEventListener('ratechange', function () {
        console.warn("video ratechange");
    });

    idVideoTag.addEventListener('progress', function (e) {
        //console.warn("video progress, " + idVideoTag.currentTime + "/" + idVideoTag.duration + ", buffered=" + idVideoTag.buffered.start(0) + ":" + idVideoTag.buffered.end(0) + ", played=" + idVideoTag.played.start(0) + ":" + idVideoTag.played.end(0));

        if (e.target.buffered != null) {
            if (e.target.buffered.length > 0) {
                if (e.target.buffered.end(0) && e.target.currentTime) {
                    if ((e.target.buffered.end(0) - e.target.currentTime) > 1.00) {
                        var currentDate = new Date();

                        if ((((currentDate - lastAdjectDate) / 1000) >= 10) || (lastAdjectDate == null)) {
                            e.target.currentTime = e.target.buffered.end(0);
                            lastAdjectDate = new Date();
                            console.log("currentTime adjust");
                        }
                    }
                }
            }
        }
    });

    idVideoTag.addEventListener('playing', function () {
        console.warn("video playing");
    });

    idVideoTag.addEventListener('play', function () {
        console.warn("video play");
    });

    idVideoTag.addEventListener('pause', function () {
        console.warn("video pause");
    });

    idVideoTag.addEventListener('loadstart', function () {
        console.warn("video loadstart");
    });

    idVideoTag.addEventListener('error', function () {
        console.warn("video error");
    });

    idVideoTag.addEventListener('ended', function () {
        console.warn("video ended");
    });

    idVideoTag.addEventListener('emptied', function () {
        console.warn("video emptied");
    });

    idVideoTag.addEventListener('abort', function () {
        console.warn("video abort");
    });
};
