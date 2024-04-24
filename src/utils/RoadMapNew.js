export class roadMapAPI {
    //不採取table方案，與舊版相比在整體路珠超過路單時，不重新渲染，透過transform移動x軸
    //因此在塞入前多塞入一層Div
    lang = 'C';
    rawRoadCfg = null;
    bigRoadCfg = null;
    road1Cfg = null;
    road2Cfg = null;
    road3Cfg = null;
    blinkRoundNumber = 0; //  指定路單局數閃爍(0=不閃爍)
    queryRoadType = 0; // 0=無問路/1=庄問路/2=閒問路
    timerQueryRoad = null;
    rawResultData = [];
    rawRoad = []; // 珠盤路資料
    Road1 = [];  // 大路資料
    Road2 = [];  // 大眼仔資料
    Road3 = [];  // 小路資料
    Road4 = [];  // 曱甴路資料

    constructor(_lang) {
        //C=CH, E=EN   
        if (_lang != null) {
            this.lang = _lang;
        }
    }



    init(rawRoadConfig, bigRoadConfig, road1Config, road2Config, road3Config) {
        // 
        //alert(rawRoadConfig['a']);
        this.rawRoadCfg = this.defaultRawConfig(this.lang);
        this.bigRoadCfg = this.defaultBigConfig();
        this.road1Cfg = this.defaultSmallConfig(1);
        this.road2Cfg = this.defaultSmallConfig(2);
        this.road3Cfg = this.defaultSmallConfig(3);

        this.copyConfigValue(rawRoadConfig, this.rawRoadCfg);
        this.copyConfigValue(bigRoadConfig, this.bigRoadCfg);
        this.copyConfigValue(road1Config, this.road1Cfg);
        this.copyConfigValue(road2Config, this.road2Cfg);
        this.copyConfigValue(road3Config, this.road3Cfg);
    }

    setLanguage(_lang) {
        if (_lang != null) {
            this.lang = _lang;
            this.initDefaultImageRaw(this.lang, this.rawRoadCfg);
            this.initResultData();
        }
    }

    setQueryRoad(type) {
        this.queryRoadType = type;
        this.initResultData();
    }

    setRoadMapByString(resultString) {
        //1=莊(0001)/2=閒(0010)/3=和(0011)/5=莊+莊對(0101)/9=莊+閒對(1001)/D=莊+莊對+閒對(1101)/6=閒+莊對(0110)/A=閒+閒對(1010)/E=閒+莊對+閒對(1110)/7=和+莊對(0111)/B=和+閒對(1011)/F=和+莊對+閒對(1111)
        //設定當靴結果資料
        if (resultString != null) {
            for (var i = 0; i < resultString.length; i++) {
                var result = resultString.substr(i, 1);

                if (this.rawResultData[i]) {
                    this.rawResultData[i].LastResult = result;
                } else {
                    this.rawResultData[i] = {
                        Result: "",
                        LastResult: result,
                        RoundNumber: i + 1
                    };
                }
            }

            if (resultString.length < this.rawResultData.length)
                this.rawResultData.splice(resultString.length, this.rawResultData.length - resultString.length);
        }

        return this.initResultData();
    }

    updateQRoadMap(qType, qResult, imgR, imgB) {
        var qImgCfg = this.getDefaultQImg();

        switch (qType) {
            case 1:
                this.processQueryRoadImg(qResult.road1, imgR, imgB, qImgCfg.q1r, qImgCfg.q1b);

                break;
            case 2:
                this.processQueryRoadImg(qResult.road2, imgR, imgB, qImgCfg.q2r, qImgCfg.q2b);

                break;
            case 3:
                this.Road4processQueryRoadImg(qResult.road3, imgR, imgB, qImgCfg.q3r, qImgCfg.q3b);

                break;
            default:
                break;
        }
    }

    getResult(roundResult) {
        var retValue = {
            winner: "",
            winnerValue: 0,
            isBankerPair: false,
            isPlayerPair: false
        };

        switch (roundResult) {
            case "1":
                // 1=莊(0001)
                retValue.winner = "B";
                retValue.winnerValue = 1;
                retValue.isBankerPair = false;
                retValue.isPlayerPair = false;

                break;
            case "2":
                // 2=閒(0010)
                retValue.winner = "P";
                retValue.winnerValue = 2;
                retValue.isBankerPair = false;
                retValue.isPlayerPair = false;

                break;
            case "3":
                // 3=和(0011)
                retValue.winner = "T";
                retValue.winnerValue = 3;
                retValue.isBankerPair = false;
                retValue.isPlayerPair = false;

                break;
            case "5":
                // 5=莊+莊對(0101)
                retValue.winner = "B";
                retValue.winnerValue = 1;
                retValue.isBankerPair = true;
                retValue.isPlayerPair = false;

                break;
            case "9":
                // 9=莊+閒對(1001)
                retValue.winner = "B";
                retValue.winnerValue = 1;
                retValue.isBankerPair = false;
                retValue.isPlayerPair = true;

                break;
            case "D":
                // D=莊+莊對+閒對(1101)
                retValue.winner = "B";
                retValue.winnerValue = 1;
                retValue.isBankerPair = true;
                retValue.isPlayerPair = true;

                break;
            case "6":
                // 6=閒+莊對(0110)
                retValue.winner = "P";
                retValue.winnerValue = 2;
                retValue.isBankerPair = true;
                retValue.isPlayerPair = false;

                break;
            case "A":
                // A=閒+閒對(1010)
                retValue.winner = "P";
                retValue.winnerValue = 2;
                retValue.isBankerPair = false;
                retValue.isPlayerPair = true;

                break;
            case "E":
                // E=閒+莊對+閒對(1110)
                retValue.winner = "P";
                retValue.winnerValue = 2;
                retValue.isBankerPair = true;
                retValue.isPlayerPair = true;

                break;
            case "7":
                // 7=和+莊對(0111)
                retValue.winner = "T";
                retValue.winnerValue = 3;
                retValue.isBankerPair = true;
                retValue.isPlayerPair = false;

                break;
            case "B":
                // B=和+閒對(1011)
                retValue.winner = "T";
                retValue.winnerValue = 3;
                retValue.isBankerPair = false;
                retValue.isPlayerPair = true;

                break;
            case "F":
                // F=和+莊對+閒對(1111)
                retValue.winner = "T";
                retValue.winnerValue = 3;
                retValue.isBankerPair = true;
                retValue.isPlayerPair = true;

                break;
            default:
                break;
        }

        return retValue;
    }

    copyConfigValue(srcCfg, dstCfg) {
        if (srcCfg != null && dstCfg != null) {
            for (var key in dstCfg) {
                if (srcCfg.hasOwnProperty(key) === true) {
                    dstCfg[key] = srcCfg[key];
                }
            }
        }
    }

    initDefaultImageRaw(_lang, cfg) {
        if (cfg != null) {
            switch (_lang.toUpperCase()) {
                case "C":
                    cfg.pImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjJCRDUyMDhERkUyMTFFNzlEQjBFNDcyRjY5OTFEMjUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjJCRDUyMDdERkUyMTFFNzlEQjBFNDcyRjY5OTFEMjUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+goAHrgAAA75JREFUeNrkWr9PFEEUnjNGiPgjsYBOkMChNBRIReVBAhQ0JCSQ0BAIzXWQ0JBgoNBgclRQcSSGBoJ/AEcDVjTgEQpAkTuVDgojAsKJZn3PmbmbW26X3ZnZPS++5Etub3fffPPmvZk38zZAiEEKVW5q0lMLeAaoBzwGPATcAdwHHANOAQeA94B3gFXAjoZ2DVmUA8YB+wBDAvvs/Qp5Du5fqgK8BlxKkjbjkumr8pJ8MWAMcK6JtBnnTH+xbvLVgE2PSJuxydrTQh4C0fjmE3GOY9auEvkOwIXPxDkuWPtS5EOAVJ6Ic6QYD1fkq/PgKlZAHkGn5IsA8X+EOEc89yx0lfyYnaJQyDASCcMIh33vwNh15Kvs5nEkfnpqpEXsAN5TlUjk2gDOWshumHIFWK5JsVUisbJCyMRE5npqipBw2Lc8rIjxy5nbVDpd8tHiXHAkurp8sTxPJR7lsny/0yxzepqQ0VH6u6SEkOZmOiqBgHs0NbnOggdyWf6T2yCKRily3YvFqDUPD+11iCPmwPKIz5wzt/QTQIVbJ+zvz8sepJztH3a424ScvIXByfsfieR1E4Ubn7TP18toCIWsB7elhT5TWmr9jIIBnorkawps+xoUyVfKaLCaYWrAFGdn9JmjI+uZZmhIye/T5B/oNMvwMJ1CPZS7IvlbOjW3t2dfR6OEJBI0RjTJPZH8T11aMQgxSLng774+8EtwzPl5bR34LpL/qot8T0/2Nfr82lqmIzMzEG1B5WZORPJJHcTRPZAgBisnjNLYSMjyMpsZYASWlpSbOhDJ76lqQ3dA90BZWADTnGTfb23NdAg7EIspNfdBJL+hSh7d4e8QJq3TBhyBJBtjXMRwpCRlQyS/qkJ8cZFaE2VkxP7ZtjYaBygNDdJNvhXJ46HnF9nZpbOT/p6dpS5jJ3vgoOPjNAbq6qSII89tkTzKvFstmKgNDtLf6M9Os0zcD2AMSEqap0gePfCXGy0DA5npsLfXl5zmN+N5hTysgeSNG03oLmjx7m7qDjIiLmhOwovxzFlcwM1dB9vsXitIGGcQV+kgLFDxuFTukwI8F/8wnx7sAya8HHfs8NZW7nvr67avvgJ8tCOP8hKwqUoSAxLT3rKyq/d2d7OvcUWenLSdqZDPC6dlnWChnlUW/CkxR2ceO5Bi7StVRlpZpcLvykjbf1+TMlcDLzws43hSDTQfg89prsPOeV2HNaOCVbCTkqSTqhXwgKYPJ2rZkSH/9gDPVW4L3x78YKms+O3BtmqjgUL+6uOPAAMAhulm/vhhU/EAAAAASUVORK5CYII=";
                    cfg.bImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA1MUU2MjRERkUzMTFFNzg5RUFGMDgxRTcyNTBCNTAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA1MUU2MjNERkUzMTFFNzg5RUFGMDgxRTcyNTBCNTAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+n2mnRgAAAslJREFUeNrkmj9P20AUwBNUlagqicTAglRoZEKblY4sCQNlrYSAHbHkM0AVtlbiG2SoGEB8gzDwZ4GJhImKQohUtgxECU1KAq2u7+pz/TjFztU++3rqST/5QLm7n+2zfX7PURLRtzyR1E8ayABTwCvgBfAcSABNoAVcA+dACTgAPvselXhnDFgHKgDxQIW1H/fq4KWRAXwCHjxK8zyw/owg5WNAHriTJM1zx/qPyZafAE4DkuY5ZeNJkc8AjZDELZpsXF/y74BOyOIWHTa+J/ks0FUkbtFlHn8lP6FgqjhBPVKi8oNA+R8Rtyj3ugv1ks9LGXBxkZBCgZBazdz67zPfT96Qdh9PpQhptcjvQrdyLmDDTX5L6uk+OiJ/yuqqjD63nOSTQo/8XI4EWmj/7kuJl5bzAFqjLUtcZQa5Cl6x/sDyS5os45f4JfFr4XmHp83GhqpbZxpPm2xgxymbtYcsFmX1msHTZkqzN8A3WH5SM/kUlk9qJj+G5Yc1kx/C0YOnvi7IvT2x387OmheuU4lGRUeN4yN/r9mRv8Xydc3kv2H5qnCzJLq2G41IZH/fPN1OzMzYv9/ddf+teLnG8hfCzRIJu15XdsK+YPkT4WbxuF2/uVElf4LlD4SbjY7a9XJZlfwhlqdBz69CzQzD3LbbMNkuVIhTzzN+Sbzd/6EMT+WREbNeq6k66tu91vMF4Idrs4UFu14qqRD/yTx7hrjd32GLxcfvpHQ9H+5r4KN32AFuz9aAruN+T0/b9Z2dsI869XqP/8HLV4APjvP96sqsHx+ruFg/Apf9MiMx14gZnTrup1ZpxCzCYoNaxiq1jxJbzCvcgS4b31dm5C3LVISdGZn773NSfDawE2AaJ5BsIB8G35Sch90MOg/LM84y2FWP0lW/GfCopA8n0ixkaH17QOMqz9C3B9/ZUhZ/e3Dmd1BZ8krKLwEGAEvZGl4qi9w8AAAAAElFTkSuQmCC";
                    cfg.tImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTQwNjA5OENERkUzMTFFN0JCNDZEQTBCMjU5NkU2OUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTQwNjA5OEJERkUzMTFFN0JCNDZEQTBCMjU5NkU2OUEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+3ded8wAABCxJREFUeNrUWktME1EUfTUFERTiJyQmBhARfwgYJAaQhV24REMIoUpiEOKGBQtcqBGNxQ0msIENCchCpYiJW8SE4gaC4WOBlJ8FlIUCC01BsFQM3jt9rdOZaWemnZnSm5wwzLzPmdc79553Z3Skl0Ss6RUa5yzgCiAHcBqQBNgPSAA4AL8AS4AZwCigHzAV6qS6EFY+GVAJuAE4EUT/eUAn4Dngi1bk0wAPATcV+uW2Aa8ATwF2OR33yGgbA3gCmATcUtDl9HS8STp+jNIrfxLQDcjW4Dm0AkoBn5VYeXwQhzUiTug8I3TekMgXA3po1NDS4um8xcGSNwDMgL1hCuN76fwGueTRx98CosOch6Ipj3Sp5PGOX4fBVfwZ8ugSikJC5B8ALgQ7U1lCGWlLbSMrhSvMsUKGfO6Lhco0Gm8lxdrGpEaSoHf/QLmHc0nmwUyf66u/V0nhUCGZ+zOnxA1sATLYiYybaEyBiBtiDaTvcp+kmXq/9RLbmk0p4h53NlE5wlv5VMCsWOYcyB4g+Yn5gtdwpWsmakiXo8vnPLpRZVqlKLt2ezupWqgSkxL48C5yV75KSspvXmwm02vTzHHnciexbFoY/07cl0iWncs84iqo4Dse/2eTNUrpjeRUJihmRi75M4AULWbWvdfxzu1c3ZErxXH/MKVnZVNRG88d50UUtuE1LhH0YxUMdc+UJ87nRNgO8CI7SZ2KMPLpbJ9PldIjaziLd67uaB0xnTcxxxM/JwTbYKhU2JLZK38o2FFKjpX4+DzmAQ3sAJt8UOoR5QH3AcYEprCu8af3veRdsp0uKp2UJ5f7nNvY3mD+YsIyXzIzLqWSrbHJ/5Dbu+NcB0MSJQGCqWWszxPjR6P3JvBZUMHf0dbZ5Bfk9ERCHn3TYm/hZeCioSLvDcVHxatBfolNXrL0qz5S7RVZg6uDpP57Pa8N6h3jqJG5Xjpbqgb5WTb5EakbjYbMBq+CrLBV+G2LN1BgLVDL50fY5Psl7ZBy2kicPo75H6Wvglpdrn1gk8ei59dArcc2x7zHTTNN4VSWyNPGlcRYZrjnrweucqu9lTmuXaoNemaZClLIzELbQIxpdwNtSEIhrZD9pTx51QMsOb/Z5YKsm/IU3IA/Iu4Sm2pVshA2I1g9eByoboNlhYZduurPCKdyLFTixtLHYCiFJxXsE2o+gFOsYoYNUBI6dglxB+Xj5F7wV2ido77vCjNxF+UhmA0DlbgtgPIw3oCLzm/x10Ds5QKGzmse/ayh4XzXxUK3lNc67+hu3aoRcSudr0esodS3gRii8oi70LmlEuktOn4ekfAyTQ55TxTCJIFl5hfEXfRUwrbpeBl0fKfkhBfCG/AUwG36UB0Poj9Wel8Sjd+ACxnWDrFk6Pn2AOsqseT/twebVMqyvz2whSw1Ivmrj38CDABbFioHB/0yrAAAAABJRU5ErkJggg==";
                    break;
                case "E":
                    cfg.pImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEMwNEVDMUZERkUzMTFFNzkxNThGNUVDNjVGRDFBQjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEMwNEVDMUVERkUzMTFFNzkxNThGNUVDNjVGRDFBQjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+iD2MKwAAAoZJREFUeNrkmjtLA0EQgFcRDeID/AHGRxI1rVZ2CoHYChb+DXuVWGhlZRtBLHz+Aa20sfOBRUSDF42djSgGkyPKOgu7YXNJTLI7t7nDga84ws1+t7e5x8y1EUKJX6MDKU8UmAEmgXFgEOgB+oEPIAe8APfAFXAG3CGMS1UJAmvAI0AVeOT7D6k7NL9TCNgBiorSToo8X8hN+QCQAPJI0k7yPH8AWz4M3Lgk7eSGj4ciD39E+m5IXPDBx9WSnwcKhsUFBT6+kvwsYLdIXGBzj6bkwy1YKrVgHpFG5buAa4+IC66rX4Uq5RMeExck6smHXLyOY/yBQ3/J76kkvr2ldePigtJkUvsA9mrJj6je8huRF5HLUbq8rPUoMVxNfl11RpqRF6FxABvV5J8w5E9OKn9nos4DfH1Vln92yk/orMV68gK27pFmP8q82/lD/ayJN5+trfLtYFA5FXvxKclPmpA/OEBLNSXLj5mQj0TwUsnyIybkY7Hy7WxWOVVQlh8wIb+0VL59eKicqleW73RTenOTEMuC0yud3+NjQtJp5ZR9cvXAxrpUNhKWhfKmVZr5N1OFotNTQkZHtdN8yssm47b09jYhi4uExOMo6V7kihlbfdNYM4sk+Fc8yDN/6bMy5aUsf+Yz+XNZnhU9sz4RZ54pWZ7Fvk/kS56yfBL49rj4D/eskLfYjc/j8kfcs0KexQpge1Scea3Way54tW6z1kjRKeDnihnhtUFf1ip9XyUWLLTwAGw+vlZnJM6fn013Rub+fU/K2Q0suFgFdqUb6CyD7yL3YXfd7sM6GeI3joyidEa3A96G9OFElJcMxbcHrK7SLX178MUfZeVvD1K6g2LJtyR+BRgAT+IZYcm7PTcAAAAASUVORK5CYII=";
                    cfg.bImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjRFNkY2QjJERkUzMTFFN0JBM0JEMTc2NjdFRDU5NzciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjRFNkY2QjFERkUzMTFFN0JBM0JEMTc2NjdFRDU5NzciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bWReegAAAvhJREFUeNrkms9LG0EUx19KqUH7Ayp4bFKTbFtvYk+Ch1WE9OClENF76SXgxXMOyV3/Ag/Fi7D+BSKaguamCQqWNtiFevNgqbTWBAvbNzjrzo4bmp0fG5c++ELGJO99djLue/NmEw7E1+4r8jOCMlFjqJeoZ6iHqCeoc9Qv1AnqM2ofVUV9ko7qiCuFqqCOUY6Ajun306IMIl/Koj6grgSheV1Rf1md8ElUGXWpCJrXJfWfVA2fQzU0QfNq0HhK4E3Uj4jAXZ3TuFLwb1GtiMFdtWh8IfhJVLtH4K7alCMUfK4HS6WTCIfRLXwfqn5HwF3Vg+5CQfDlOwbuqvwv+KzG+7iKf2BfIrvHVQsVVDJUfVEsdhd6ZeX6s+LWR/kCa5thoZRfLDqhrFaTLSWeB838O4VVZmcbHwewLJkq+L07YOHnlcBNTQEkEp7IeGPD/5lCAW9+hmiEeR7+FSqtZaa3twHy+dsXMD0t6jFF9w838JPal0utptKbycKPaYdPpfzjzU0Zb69Z+Bfa4U3Te02WULMp481g4Ye1QZdKAAcHGIGGsG2AhQXp35HdgD9VBru11fm99XWA2VkVUR6xM/8gsn6FXJZ17TGbYcXr9rAZlphlqdhp3cz8d2UzyycpouXl67XOJilS64jbT3bZ2FqXyuIiQCbjv4C5ORmPJyx8M5L1Xq16rwcGZC7gCwu/Fwl8o+EfDw6Ketpj4auRwI+O+sdnZ6KePrLwpOn5TSs4qSJnZrzxxQXuTOsingjnEV8Sr2kDX1oC2NkBGBry/ra7K1oirAXtpDKR7KSInZ46jmGI3N//UM5bO6mvJIFrX/eHhwATE6KzblHOwP58NnR7r9uZJ1m1VJLtHuTi2repdNN0Ssa5Ywa0NxjLXmXsu8SuCj28gDaNL3Uykqf1c9QnI2/++zMp/jSwpbELrOU0kE9kq4rPYVd1n8PyStPEYQtC27In4AlFD06M0Jah++wB6av0M88e/KalLPvswZFsUFXwPbG/AgwACJJ5/CC5j1YAAAAASUVORK5CYII=";
                    cfg.tImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MThFRjlCNDZERkUzMTFFNzg4NkZGMUU2RTMyMDc5QUUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MThFRjlCNDVERkUzMTFFNzg4NkZGMUU2RTMyMDc5QUUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jUKgqAAAAr9JREFUeNrUmk1PE0EYx6eGlIYoJn4AC7WCGg4avGC4sF9A0gRDhMSENpz4AhqjAf0K3AoXlSomXpEDLycvVmxCICAvKmdighpTGkz8P+mzOClTutsdtjNP8jsAuzO/XXZnnnlmI2JeWBtNmtq5AfpAN7gGLoPz4CI4AL/BHtgAn8ASWA/aaSTAnY+DNLgPrtRx/g6YAdPgW1jySfAYDGn6zx2BV+A52PZz4jkfx8bAOFgFDzQ+ck3c3iq3H9N956+CWXAzhPewAO6BLR13nl7EjyGJC+4nz/0Gkk+BOR41woxW7jdVr7wDcqC5QcN4M/fv+JWnZ/wdiDZ4HoqyR4dXebriNw14VKoFebxWjUIq+UfglmGZAPk8rDVUJnm8jQnz4hB0yRNZ5UQz4Uc8m8iKdDJdt83U9pTI7Gb8vMATnI6ceGwSYMDwRJL82lXyGY1T/llmwaOqZ/4raNPRg9PiiIXeheOfx1bGxOT+pK4L+O56unf+ui7xECLO64djeceyRVSfLN9tmfxtWb7TMvkOWT5hmXxclr9kmfwFWT5qmXyrLF+yTP6nLP/DMvlfsvyuZfJ7svwXy+Q3Zfm8ZfJ5WX7JMvllWX6dszUbgjzXKvP5nCXyOdViJCvKRU+T4y97npCnkvNbw+Vn2VNZ+njCq3QTg7yenlb6oBjnizAtnlV6qeSp9PFBmFV4+gzugKL8S1XFjA4YFOW9JBPigH2KlX+oVmildCFlQLZZYg9l+nJaiXsRDDfwAkrc/2K1A2ptLtDQedfNn0PO1/trDd1etnXe82q9EJJ4gfubq3Wg191A2tzqEeVC51nNA4fcfo/wsJnmR94dhWiSoDLzC42pxBG318XtF72eGGQHvA2M8EvVXsf5VBt9KULeAVcF1Q6pZOh+e0B1lRbx/9uDP5zKyt8erAXtNGLzVx//BBgADqOHac/yqpcAAAAASUVORK5CYII=";
                    break;
                default:
                    break;
            }

            cfg.ppImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkNFOEE5MUMwQUY1MTFFNzlBOEE5NkU3OTZGMUUyNkYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkNFOEE5MUIwQUY1MTFFNzlBOEE5NkU3OTZGMUUyNkYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNTQ5MjliZS1hZjc5LTk2NDktYWZhMy00MTI2ZjU2NzE4YjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/0cX0wAAAQZJREFUeNrs2cEJgzAUBmAtlUzgLa6gA+hGDlIHsCfvzRiFztJCCx1AvbzmaWKlSOjxCf8Pz2iSw3d4xENiIor2mkO04wAPPPDAAw888MADDzzwwAMPPPDAAw888MADDzzwwPtUtoytu63BjcbNf8PXOoLqaOtM4fB6Ml1HCcN3Xng6EWlNpNQ88vcqnTR8yapxJMrzWfZbPM/rLqUk/IVFTbMN98XrLkYS/smiLAvjuYVcHrGge9gJEsfhTUpFUd9Pr6Oko/LFD63Dm9J0eX1Lwl/5UdfhTav1m6Ser3wzF8V2v/P8KpW0c77985xvJf6kkj3/YdctZPg4tDW40bj5Zd9HgAEAhfsTA0pHoR0AAAAASUVORK5CYII=";
            cfg.bpImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjJCMDE1NUMwQUY1MTFFNzkxNjVEQkFBQ0RDMDZFQkIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjJCMDE1NUIwQUY1MTFFNzkxNjVEQkFBQ0RDMDZFQkIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNTQ5MjliZS1hZjc5LTk2NDktYWZhMy00MTI2ZjU2NzE4YjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bGf4BgAAAQhJREFUeNrs1kEKwjAQBdCpWHICd/EK7QH0Rh7EHkBX3dtjCJ7FgoIH0G7GTNJYKSW4kin8D0OnSRavUJIQM9NXbV01rq6uXv2z6cdJW8Vm6erI6ch8rhFff4j7PbO1zMaEp7wPqbXhN57VdcxFEYbGJeMyH7LRhD95UlVNw2PJfEijCX/zpPU6jZdfKKTVgs/Yf4JLllEyxhA9n9J18kYKsnB195216ZWrVewepCSCP/tut0uvHOYvWvDxYAopy+n/XcaHbLXt84cf9/mDxkMqn/MJO77btP3dptV8t8niTjnHLGjGAR544IEHHnjggQceeOCBBx544IEHHnjggQceeOD/n7cAAwDkKJ97CtKlNQAAAABJRU5ErkJggg==";
        }
    }

    defaultRawConfig(_lang) {
        var cfg = {
            el: null,
            contentEl:null,
            colMax: 20,
            rowMax: 6,            
            x: 0,
            y: 0,
            width: 48,
            height: 48,
            enableDisplay: true,
            pImg: null,
            bImg: null,
            tImg: null,
            ppImg: null,
            bpImg: null,
            eventHandler: null
        };

        this.initDefaultImageRaw(_lang, cfg);

        return cfg;
    }

    defaultBigConfig() {
        var cfg = { 
            el: null,
            contentEl:null,
            colMax: 20,
            rowMax: 6,            
            x: 0,
            y: 0,
            width: 24,
            height: 24,
            enableDisplay: true,
            pImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUEzQjg5NUZERkUzMTFFN0JCQkRBNDQ5NDk2RjJBRkIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUEzQjg5NUVERkUzMTFFN0JCQkRBNDQ5NDk2RjJBRkIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphOTQ4ZWVlMS0yNGU4LWE1NDctYWE0YS02NGVlNDJiN2JjNmMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jT1X5AAAAUtJREFUeNq0lUFuwjAQRWPWkFuQLtkkKbcAUVY9VLgJXcOO7iOWLQIOQSC7SmEGxuqXldjGCKQv4cyfl8TKfKsoaqJnfo2lvefoTUkFqSRV0f1JKlkXUrfeu01D0vL+XE6xL2nor6k28Jx09gRrsX/ugk9If0bjgpSRBuIZyHph+Lhv2gVPSBcw/5DGHdumNRaf7rngFqFxBaYDaeQAa7FvD71rE54Zr/juCRbIzY/9GcJx/wpfsIbLDQpkILyEQhoIx7cvEX6CQhwIj4Fx4mtKxh+HWIWOv1L/HGbr8a/AH4dkDIGxr8JsOUAhCcww7Dsi/BsKn4Fw7NtgcD37nee275y1huLuwQn9tU1oV7bkDnBuZEvdlS2smSUV++LpW1LxwyfP6wfzvPbJc9yiL08w+958TyJUKoG0hdPpLGu+nrZBtdQrT/+rAAMAOUp5sE+QPr8AAAAASUVORK5CYII=",
            bImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjFEOTNEOEJERkUzMTFFN0I1QjA5M0Q5REZGQUI2NjkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjFEOTNEOEFERkUzMTFFN0I1QjA5M0Q5REZGQUI2NjkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphOTQ4ZWVlMS0yNGU4LWE1NDctYWE0YS02NGVlNDJiN2JjNmMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+DutTMwAAAU1JREFUeNq0lc1ugkAUhbldK29RuuwGaN+iRrvyofBN2nW7a/ekS2vUhxBkZzK9AzPxdML8OEaSE4F77odMuGdIJFcewk6487TmrIpVsxqJUr+1up+7Hzyue9abGP6XT9KXCT4zNQZ+ZbWBYK227/PAX1gno3HFKlhT5Zmq65Xhk30zGzxjHcG8Zj0L+9Ilqr6GniMuERo/wLRjPXrAWtK3hd5PE14Yr/gUCB6WYPBjf4FwXL8qGKzhwwOqfwyA11DII+H49jXCD1BII+EpMA7yHonzLOmDosefSMB90uPfgD2Nyhgi7GswW3ZQyCIjDPv2CP+GwjISjn1fGFzXfuel6ztP+sk6FzcXTuiva0Jt2VJ6wKWRLZ0tW6TmjlScKM/EkYqLkDzvLszzLiTPcYneA8HS9xC6E6FyFUg/sDu16rrq6yNQLbrl7v8nwACs7nmwSy/rvwAAAABJRU5ErkJggg==",
            tImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDdGODlEMjdERkYwMTFFN0E0OEM4RTExNDhGNTUzRTciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDdGODlEMjZERkYwMTFFN0E0OEM4RTExNDhGNTUzRTciIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmRhMmQ1ZGJkLTUwODgtYzU0My1iOWY0LTFmZWM3YjI2NWJlZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz70Xa7KAAAAdElEQVR42tTVuw2AMBAD0Eu2pWAYSkZhuotSUCBIch+7wAM8WW5cVFVYqUJMkUv+2bzSFiHhHT4Y+A3vaPwBI/EXjMK/4BOBj+Ati89gzeBLOIqb4Ahuhr24C/bgbtiKh2ALHoZXeAqe4Wl4hENg+oc2AQYAUj0sxKeOdJgAAAAASUVORK5CYII=",
            ppImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDY0NDlCRUMwQUY3MTFFN0I2QkNGMEU1MUNFMjhCM0MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDY0NDlCRUIwQUY3MTFFN0I2QkNGMEU1MUNFMjhCM0MiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SwvMxwAAALpJREFUeNrslUEKgzAQRceSRdIriAvFy4l3qK1r9RTtUewlpN2UnkEhhelMzM6sOghdZODxwQ9PIYNJEBH2mgPsOFEe5VEe5f8o10RDTMTs80IY1/Iv90eOxDgMiGWJqPWafY88I/cS+anr+DLYws9pzhL5xF8akue5kz8TwU00GwN6WbaFUgDWwkdyoO80DRdZ5uIlkV+rKlzUtYubeFt4O4oCUak1/WHepdvCGKIlHoT12foXw1eAAQCiH2bfdi3b8QAAAABJRU5ErkJggg==",
            bpImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkU2QUI4QUMwQUY2MTFFNzlGOUJGOUE3ODVBMTlFN0YiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkU2QUI4QUIwQUY2MTFFNzlGOUJGOUE3ODVBMTlFN0YiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMWI0NDE5NC01ZDU4LTBkNGQtYTE2Yy1kZDc3Y2U1ZTgxOWIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7NeUkQAAAKdJREFUeNrskrENgzAQRT8UtpIVEA1Mh1gipIYpUmSSbEGqKEOY5ucOUyWuLnLnL/07+770bFkGSYhP4km8isPRp2MOq7WcxQ8uC9n3pHOx617nMTfDr5znuPy2zsnLP/B1v2kK3nUKf1rhlb4xvHfYNvzIOSAEDTwMqsUvtG06bRqtbxil8DuGIZ2Oo9abFZ79t2T759V+QibVyKgCL/ACL/Ac+ggwAGugq6H3611cAAAAAElFTkSuQmCC",
            showTieCount: false,
            eventHandler: null
        };

        return cfg;
    }

    defaultSmallConfig(count) {
        var cfg = {
            el: null,
            contentEl:null,
            colMax: 20,
            x: 0,
            y: 0,
            width: 12,
            height: 12,
            enableDisplay: true,
            rImg: "",
            bImg: "",
            extraLine: true
        };

        switch (parseInt(count)) {
            case 1:
                cfg.rImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gISCQUUDEwAPAAAADxJREFUGNNjYCABMCJz/jMw/MeigBFDMZJCRlT9CA2MeBRiaGDC5SRs4kykeJBsxf9xqPlPfmgQG84kAQA3Xg8OKrOOigAAAABJRU5ErkJggg==";
                cfg.bImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gISCQQfgoXo9QAAADpJREFUGNNjYCABMKJy///HooQRi2K4QmQD/iNrYMSjEEMDE24nYYozkeJBshX/x6HmPyWhQVw4kwQALV4PDvc56OYAAAAASUVORK5CYII=";
                break;
            case 2:
                cfg.rImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gISCQQ7voYMJAAAADBJREFUGNNjYCABMCJz/jMw/MeigBFDMTaF6BoYCSlE1sBEipsHiWLSQ4PYcCYJAADd2QoOL/O+owAAAABJRU5ErkJggg==";
                cfg.bImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gISCQQECOAhGQAAAC5JREFUGNNjYCABMKJy///HooQRi2JsClE1MBJWiNDARIqbB4lickKDuHAmCQAA09kKDhxxsQkAAAAASUVORK5CYII=";
                break;
            case 3:
                cfg.rImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gISCQYoCA4veAAAAGVJREFUGNOV0TEOQFAQhOE/GiGuoKLh+kq8xBXUKgrOoBnNk7xql0m2+5qZBSeKB5A5sAY24JYDG8EukCDIgG0CZ0FpweML7ARnhJMF+wSOHrwSWFg7vmUWQeWNvgoGQc6fL1l5AMreQ936XVMlAAAAAElFTkSuQmCC";
                cfg.bImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gISCQcdR6baGgAAAHZJREFUGNOV0T0OgVEUBNATCQmdLVD5qaxaK7TEBlRWgIYvYQujeXTviUmmO7e5w8+klN4PuECH8+egBlfkRULWDZwl6QrckH4NzsmjwC0Z1OCM3AvcteCU3Arck2ENTsi1wAMZtf54KfDYgF/8JCcy9s9KrbwBXmdD8DOVqoEAAAAASUVORK5CYII=";
                break;
            default:
                break;
        }

        return cfg;
    }

    getDefaultQImg() {
        var qImg = {
            q1r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjlCMzZENDRGMjk3MTFFNkFFMEM5N0EyOUYyQTk5NTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjlCMzZENDNGMjk3MTFFNkFFMEM5N0EyOUYyQTk5NTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDhlZTkyYS05YjQ5LWI5NDEtYWJlMy0wNTkxYTlmMjdiYTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+o+NvgQAAA0pJREFUeNrUmr1v00AYh+1EMAAtEkikKg2IhYSJfHSBhaRS0zKT0P4DSNCWf6ZMCDqWRmmyQAdAtDABQoLC1JSVDylQkEqBBQXzO/sshTd3iWP70kukR5HP8d1zzuvT+b0zLSPwJwJSIMe/E2AMHAZHwS74BT6CbfAOPAVvwV/DCmBg+ScDFkEDWD5o8OszFo784Ec6DzZ8CsvYsOtVKH8a3A9ZmvLAbsejvOkx4krgLhiWnH8PHoLXPK5ZfP/k8c7i/gh/DtjzkAXT4Kykrh/gGuwqQWM+yuNSdqfugJLPZ6bEr5fVvWi37zNsDoJVScUroGAFe+BdWD33JO2s2h49yrM7XpZUeDMkaQdXxjAWJO1VZP+ArFJRqLzgw6OhRN7pQJq30x5CHuWvCi5+AmKhi1N5pwMx3h51mOkmPwZ2BXd8VIm4SN7pwIjgH2Be8U7yVUGP08rEZfJOB1ICl6pMPif48YJS8U7yTgfmBU45kTyNs5py8W7yTgdqbc8fkR8X9HBKE/kpgVu2VZ4OjUt9Efci73RgSTR0shMR8IWcvKKZfJH4Md+IOy9vPVHvm7hXeacDdeKZYW9BeTJXe2To+aFeeSafIYWvNJV/SY7HmXySFG5pKr9NjhNM/iQp/KypfIMcx5j8MVL4TVP5PXI8ZPKhvvVj9lWpl9SH+f9bK7vzf8hPDmh5302Tvj/vMfnvpPC4pmEzJJL/RApHNZWP0Qc4IhiCkprKJ+jQyeQ3SWFaU3nqtcmGmgtkzrA1IHObi26a4+sAziqjLGyaoEz+ksuahcw0OS6jC81BeJMqdHuTYqy3vanrIU8zGuteswfz+5w9mBM45WV5m5rgx6l9ytucF7jUOiWd4pKM2UifM2YnwHNBxuxUt1zljKa5ytmgWeKU4ixxSpIlvtVrfr4iyZfPKcrP35C0V+01P99tZWQZTIbUgUleX2grI72sSRV9SheDrkl5XQ2cBbc7rAayjMNj8AbUwQfwu2U18BCI8+k2S7UUwLkOq4HXYbcS5gr4GbCmeB12zW5H4Qr4hKIV8Il+LN+7ZO0hzDB2fArv8OuzfvcemFbw6WqU7/a4xL+TLbs+hnkMu7s+6nzXxzO+66MZZNfHPwEGAOxkqfRtuBOwAAAAAElFTkSuQmCC",
            q1b: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkE4MUEwRTRGMjk4MTFFNkE0OTU5RUQzOUJDRURBQUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkE4MUEwRTNGMjk4MTFFNkE0OTU5RUQzOUJDRURBQUEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDhlZTkyYS05YjQ5LWI5NDEtYWJlMy0wNTkxYTlmMjdiYTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+W7fu0gAAA0hJREFUeNrUmjtvE0EQx8+xSAEkSCDhKGBQGmwq/EgDDXakPKixSb4AEiThy0CFICXEMnYDFIAIUAFC4lXFoeUhOQSkEKBB5vgPHgtn2D2f7+GsT/rL2r273d/cza73ZjZiWbbl8xiAUlCOfxPQYWgPtA/ahH5AH6A16C30GHoD/bb9dW97VQa6DNUh24PqfH/GRtGLvEDnoUcegXWi9vJhwh+FbgcMLXWH+nELH3Hp80XoOjSsOf8Ouge9ZL8m//7O/k5+v5fHAY2HLDQDHdO09Q06D7ayX5+Psl/qntQ1qOhxzBT5fl3b1G/Uq9sMQrc0DS9DUz4Ge7uonZuafqj/wW7h6YmXNA1eCgj6r/6B2Iua/sq6N6BrVOUqz3h6tMKAZwPS3M9/LuQW/pzi5odQLGhwCc8GxLg/yTDbCR4zgr2peOKjYYCr4NmAEcUbIK64E3xFYXE6LHAdPBuQUrBUdPA5xcWLYYI7wbMBCwqmnApe+lk1bPBO8GxAVY4/CT+usHDaEPhpBVu2HV5OjUu9AHcDzwYsqaZOOoH1uL0uTp41DL4g+Nab3M0/nvYTtV6Bu4VnA2qCM0P0ebFSu2+ZeUiuPMFnROULQ+Gfi/I4wSdF5aqh8GuinCD4Q6Lyk6HwdVGOEfx+UfnFUPgtUR6KNEfutiPSS6JuQh+RyPZvVnryv8Q1u0x87ACX389bBP9VVB4w1G2GVPAfReWoofAxOYAHFFNQ0lD4hJw6Cf61qEwbCi+5iNs+KdYMq32ytjnVCnN87sNVZZTcpgGVxCs5Y5jLzIhyCSY0+uFLaqrTlxRpRX6pGwIvIxorbqMHCzscPZhXMOV1cZuq4uLUDsVtTihYqk5Bp7gmYjbS44jZQeipImJ2pFOsctbQWOWc3yhxKuQocUoTJb7SbXy+rImXz4cUn7+o6a/SbXy+U2bkBjQZkAGT3F5gmZFuclIFj9AFvzkpt9nAOeiqQzaQIg4PoFcQFlDWe+hnWzZwNxTn5TaFWvCvaR13yAZeANtykBnwMehuyHlYan8szAz4REgZ8IlepO9bytIUBm14BN7g+7Ne9x649XmnI8q7PU7zb7Jt18cw+3Br10eNd3084V0fDT+7Pv4IMADJDan0sYhzvgAAAABJRU5ErkJggg==",
            q2r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUVBNkU3QjRGMjk3MTFFNjlEMDZBNzY1MUFBRjcyODkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUVBNkU3QjNGMjk3MTFFNjlEMDZBNzY1MUFBRjcyODkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDhlZTkyYS05YjQ5LWI5NDEtYWJlMy0wNTkxYTlmMjdiYTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+596NUQAAAfRJREFUeNrUmjFPwkAUgEuJLia6SNQIGicYCWWX8h8EXPQnafAXsBGQRRkBHdjRTXZNbCQmSFw0tb6n75KmoSJHW+5d8tEu5X09LsfdexdztIWbDmSBAl3TQBJYAzaAMfAOPAJD4B64Ae6Ar4UiO/LkgCpgAY4EFj2fk3WQecgEepLCfvToe0OT3weuApb2ck1xApU/AsYhiwswTikI+TiNS2cJVCm+lPwq0FySuKBJHnPJ4xvXlywuaPj9An7yVUXE3UPoX/IlxcQF5VnyyQhnFZlZKOX21T1/uOfAuqZmQ68zv+VBQdEe91KYNmw6TOQ7Xvk8E3GB4R7zJxqvdoofMef3BZ6BBCP5F2BbbCQSzHoefbMob2o8m4nyOabyeZTPMJVPo/wuU/ktnG0+4GaFofwE5R2mPf8zx38ydZ+g/Ctn+Sem8pZOKTiObYjyA6byA5TvM5Xv41QZp1XlJrNV5Q72vA3UmfU6+tpiM1JjJl/zbsC7TLaA3WkbcC7ZA9Mv6dRSXLz1V8YspXjGbG9WrrKsqHyFa5b4Yt78fEMR8ct58/OsKyPsa1JuKhFXA4+DrsMeAO2QxdsUJ7QKeDGkCngxivK9wKApbCQpPKLnDVmHWAB5jzglaw/pmnGd+sBSzJvr1McDnfq4pVMf9iKBvwUYAEF0QQ8vAWsYAAAAAElFTkSuQmCC",
            q2b: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUQ5REVBNTRGMjk4MTFFNkI0ODc5MDg1OEJFNkEwRUEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUQ5REVBNTNGMjk4MTFFNkI0ODc5MDg1OEJFNkEwRUEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDhlZTkyYS05YjQ5LWI5NDEtYWJlMy0wNTkxYTlmMjdiYTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YkPn4AAAAfhJREFUeNrUmjFPwkAUgFuILia6SNQIGicYSWGX8h8EXPQnafAXsBGQRRkBHdjRTXZNIBITJC4arO/Ju6RpqNhrC/cu+WiX4747Lsfde6drmqX5LBEgDeTomQTiwAawBYyBD+AZ6AOPwB3wAHz7bNuSxQDKwBCwJBhSfUPewXslE+hICrvRoe8NTf4QuAlY2skttROo/AkwDllcgO0UgpCP0ry0VkCZ2peSXwfqKxIX1MnDkzz2uLpicUHN/ReYL19WRNw+hf4lX1BMXFBcJB9f4qoiswol7L4Rx9/tJbCpqVnQ68Jte5BTdMSd5OZNmxYT+ZZTPstEXJCxz/kzjVc5xw8deoAdGAAxRvKvwK44SMSYjTz6plHe1HgWE+UNpvJZlE8xlU+i/D5T+R1cbT7hZY2h/ESfLfo8C06bL6buE5R/4yz/wlR+GKEQHMfSR/keU/keyneZynf1WVjhd1e5zWxXuYcjPwWqzEYdfafiMFJhJl9xHsDbTI6A7XkHcC7RA9Mt6NRQXLzxV8QsoXjE7GBRrLKoqHyJa5T4ymt8vqaI+LXX+DzrzAj7nJSd0pKzgadB52GPgGbI4k1qJ7QMeD6kDHh+Gel7QYaWsJGk8IjqZ2Qd9ABufUQpWHtMz5Tt1gemYt5ttz6e6NbHPd36mPpp+EeAAQCydkEPul2EiwAAAABJRU5ErkJggg==",
            q3r: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlDRDI4QTRGMjk3MTFFNjkxMDRFMEE5OTI2NTAyQzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlDRDI4QTNGMjk3MTFFNjkxMDRFMEE5OTI2NTAyQzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDhlZTkyYS05YjQ5LWI5NDEtYWJlMy0wNTkxYTlmMjdiYTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+LcFDxQAAANZJREFUeNrUzkcKwDAMRFEfM7n/NQJOtDCku6nMLD5IzOalnFIiaznaspyscDb8Bc6Ef8Dlp4UfrbRw2WnhyPgqHBXfBEfEN8PR8F1wJHw3HAU/BEfAD8Oj8VPwSPw0PAqvAo/Aq8G98apwT7w63AtvAvfAm8Gt8aZwS7w53ArvArfAu8G18a5wTbw7XAsfAtfAh8Fn8aHwGXw4fBQPAR/Bw8B78VDwHjwcvBUPCW/Bw8JreGj4Hx4e/oWngL/haeB3PBX8jKeDFzwlvOAp4QVPCZd2AQYAsFqZYHcUJksAAAAASUVORK5CYII=",
            q3b: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjNmU1ZDQ4Yy05YzY4LWE0NDktOGUxMi0xZjFmMjY5NjBhY2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MENCOUUxMzRGMjk4MTFFNjk4RUNCODI2RkNGREZBMTgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MENCOUUxMzNGMjk4MTFFNjk4RUNCODI2RkNGREZBMTgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphZDhlZTkyYS05YjQ5LWI5NDEtYWJlMy0wNTkxYTlmMjdiYTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YzZlNWQ0OGMtOWM2OC1hNDQ5LThlMTItMWYxZjI2OTYwYWNiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+9PQEMwAAANJJREFUeNrUzjcOgEAQQ9E5Jtz/GkgDqy0QIm2YYBe/sNw8EVEhaznajpjhygxXZnjZtHBdieHlp4Xj4hvgmPhGOB6+A46F74Tj4AfgGPhBeD5+Ap6Ln4Tn4Q3gOXgjeDzeEB6LN4bH4R3gMXgnuD/eEe6Ld4b74QPgPvgguD0+EG6LD4bb4RPgNvgk+Dw+ET6HT4aP4wHgY3gQeD8eCN6HB4O34wHhbXhQ+D8eGP6NB4e/4wngz3gS+B1PBL/iyeAnnhBe8aTwiieFVzwpXGUXYAB+nZlgQuiNnwAAAABJRU5ErkJggg=="
        };

        return qImg;
    }







    getNextRawRoad(xPos, yPos, data) {
        var road;

        // data:
        // 1: 庄
        // 2: 閒

        road = {
            x: xPos,
            y: yPos,
            data: data,
            pair: 0,
            RoundNumber: -1,
            isQueryRoad: true,
            dataImg: null,
            ppImg: null,
            bpImg: null
        };

        yPos++;
        if (yPos >= 6) {
            xPos++;
            yPos = 0;
        }

        return road;
    }

    getNextRoad1(xPos, yPos, rTopCount, rEndCount, pointCount, lastDragon, lastData, data) {
        var road;

        // data:
        // 1: 庄
        // 2: 閒

        road = {
            x: 0,
            y: 0,
            data: 0,
            pair: 0,
            tieCount: 0,     // "和" 的計數
            colPosition: 0,  // 第幾列
            Number: 0,       // 第幾顆
            colCount: 0,     // 本列有多少路子(只紀錄在每一列的第一顆)
            RoundNumber: -1,     // 局數
            isDragon: false,
            isDragonStart: false,
            isColEnd: false,
            isQueryRoad: true,
            dataImg: null,
            bpImg: null,
            ppImg: null,
            tieImg: null,
            dragonDiv: null,
            divText: null
        };

        road.data = data;
        road.pair = 0;
        road.RoundNumber = -1;

        if (lastData != -1) {
            if (lastData != road.data) {
                // 由庄變閒或由閒變庄
                xPos++;

                rTopCount = 0;
                if (rEndCount) {
                    for (var k = 0; k < rEndCount.length; k++) {
                        if (rEndCount[k]) {
                            if (rEndCount[k] >= xPos) {
                                rTopCount = 6 - k;
                                break;
                            }
                        }
                    }
                }

                yPos = 0;
                pointCount = 1;
                lastDragon = false;

                road.x = xPos;
                road.y = yPos;
                road.colPosition = xPos;
                road.Number = (pointCount - 1);
                road.colCount = pointCount;
                road.isColEnd = true;
            } else {
                // 仍維持原本狀態
                pointCount++;
                road.colPosition = xPos;
                road.Number = (pointCount - 1);

                if ((yPos + 1) < (6 - rTopCount)) {
                    // 仍維持原位置
                    yPos++;

                    road.x = xPos;
                    road.y = yPos;
                } else {
                    var rPosition = 0;
                    // 拉龍
                    if (yPos > 0) {
                        rPosition = xPos + (pointCount - (6 - rTopCount));
                    } else {
                        rPosition = xPos;
                    }

                    if (!rEndCount[yPos]) {
                        rEndCount[yPos] = 0;
                    }

                    if (rPosition > rEndCount[yPos]) {
                        rEndCount[yPos] = rPosition;
                    }

                    if (lastDragon == false) {
                        // 龍的第一顆
                        road.isDragonStart = true;
                    }

                    lastDragon = true;

                    road.x = rPosition;
                    road.y = yPos;
                    road.isDragon = true;
                }
            }
        } else {
            pointCount = 1;
            road.colCount = pointCount;
        }

        return road;
    }

    getNextRoad2(matchCol, lastNoMatch, xPos, yPos, rTopCount, pointCount, rEndCount, lastColor, lastRoad1, data) {
        var road; // 小路使用
        var nextColor = -1; // -1=none, 0=red, 1=blue
        var r1;
        var r2;

        // data:
        // 1: 庄
        // 2: 閒

        if (lastRoad1) {
            if (lastRoad1.data != data) {
                // 庄跳閒或閒跳庄, 比對前兩列是否等長, 等長應紀錄紅色, 不等長記藍色
                r1 = this.findRoad1(lastRoad1.colPosition, 0);
                r2 = this.findRoad1(lastRoad1.colPosition - matchCol, 0);

                lastNoMatch = false;

                if (r1) {
                    if (r2) {
                        if (r1.colCount == r2.colCount) {
                            // 等長, 記錄紅色
                            nextColor = 0;
                        } else {
                            nextColor = 1;
                        }
                    } else {
                        nextColor = -1;
                    }
                } else {
                    nextColor = -1;
                }
            } else {
                // 同色, 是否連續
                if (lastNoMatch == true) {
                    // 長排, 記錄紅色
                    nextColor = 0;
                } else {
                    // 同色, 比對是否隔壁排有路 (無路藍色, 有路紅色)
                    var r;

                    r = this.findRoad1(lastRoad1.colPosition - matchCol, (lastRoad1.Number + 1));
                    if (r) {
                        // 隔壁排有路, 記錄紅色
                        nextColor = 0;
                        lastNoMatch = false;
                    } else {
                        // 隔壁排無路
                        nextColor = 1;
                        lastNoMatch = true;
                    }
                }
            }

            road = {
                x: 0,
                y: 0,
                color: nextColor,
                isQueryRoad: true,
                dataImg: null
            };

            if (lastColor != -1) {
                if (lastColor == nextColor) {
                    // 原排
                    pointCount++;

                    if ((yPos + 1) < (6 - rTopCount)) {
                        // 仍維持原位置
                        yPos++;

                        road.x = xPos;
                        road.y = yPos;
                    } else {
                        var rPosition = 0;
                        // 拉龍
                        rPosition = xPos + (pointCount - (6 - rTopCount));

                        if (!rEndCount[yPos]) {
                            rEndCount[yPos] = 0;
                        }

                        if (rPosition > rEndCount[yPos]) {
                            rEndCount[yPos] = rPosition;
                        }

                        road.x = rPosition;
                        road.y = yPos;
                    }
                } else {
                    // 新排
                    xPos++;

                    rTopCount = 0;
                    if (rEndCount) {
                        for (var k = 0; k < rEndCount.length; k++) {
                            if (rEndCount[k]) {
                                if (rEndCount[k] >= xPos) {
                                    rTopCount = 6 - k;
                                    break;
                                }
                            }
                        }
                    }

                    yPos = 0;
                    pointCount = 1;

                    road.x = xPos;
                    road.y = yPos;
                }
            } else {
                yPos = 0;
                pointCount = 1;

                road.x = xPos;
                road.y = yPos;
            }
        }

        return road;
    }

    initResultData() {
        var qRoadResult = {
            counting: null,
            road1: null,
            road2: null,
            road3: null
        };

        if (this.rawResultData != null) {
            var bc1;
            var pc1;
            var bc2;
            var pc2;
            var bc3;
            var pc3;

            this.initRawRoad();  // 處理珠盤路
            this.initRoad1();  // 處理大路
            qRoadResult.road1 = this.initRoad2(1, this.Road2);  // 處理大眼路
            qRoadResult.road2 = this.initRoad2(2, this.Road3);  // 處理小路
            qRoadResult.road3 = this.initRoad2(3, this.Road4);  // 處理曱甴路

            // 檢查問路系統, 避免意外出錯
            if (qRoadResult.road1.IfBanker != null)
                bc1 = qRoadResult.road1.IfBanker.color;

            if (qRoadResult.road1.IfPlayer != null)
                pc1 = qRoadResult.road1.IfPlayer.color;

            if (qRoadResult.road2.IfBanker != null)
                bc2 = qRoadResult.road1.IfBanker.color;

            if (qRoadResult.road2.IfPlayer != null)
                pc2 = qRoadResult.road1.IfPlayer.color;

            if (qRoadResult.road3.IfBanker != null)
                bc3 = qRoadResult.road1.IfBanker.color;

            if (qRoadResult.road3.IfPlayer != null)
                pc3 = qRoadResult.road1.IfPlayer.color;

            if ((bc1 == pc1) && (pc1 != -1)) {
                // 三路全不顯示
                if (qRoadResult.road1.IfBanker != null)
                    qRoadResult.road1.IfBanker.color = -1;

                if (qRoadResult.road1.IfPlayer != null)
                    qRoadResult.road1.IfPlayer.color = -1;

                if (qRoadResult.road2.IfBanker != null)
                    qRoadResult.road2.IfBanker.color = -1;

                if (qRoadResult.road2.IfPlayer != null)
                    qRoadResult.road2.IfPlayer.color = -1;

                if (qRoadResult.road3.IfBanker != null)
                    qRoadResult.road3.IfBanker.color = -1;

                if (qRoadResult.road3.IfPlayer != null)
                    qRoadResult.road3.IfPlayer.color = -1;
            } else if ((bc2 == pc2) && (pc2 != -1)) {
                // 後二路不顯示
                if (qRoadResult.road2.IfBanker != null)
                    qRoadResult.road2.IfBanker.color = -1;

                if (qRoadResult.road2.IfPlayer != null)
                    qRoadResult.road2.IfPlayer.color = -1;

                if (qRoadResult.road3.IfBanker != null)
                    qRoadResult.road3.IfBanker.color = -1;

                if (qRoadResult.road3.IfPlayer != null)
                    qRoadResult.road3.IfPlayer.color = -1;
            } else if ((bc3 == pc3) && (pc3 != -1)) {
                if (qRoadResult.road3.IfBanker != null)
                    qRoadResult.road3.IfBanker.color = -1;

                if (qRoadResult.road3.IfPlayer != null)
                    qRoadResult.road3.IfPlayer.color = -1;
            }

            qRoadResult.counting = this.updateCounting();  // 更新統計資料

            return qRoadResult;
        }
    }

    processQueryRoadImg(qRoad, imgBanker, imgPlayer, redSrc, blueSrc) {
        if (qRoad) {
            if (imgBanker) {
                if (qRoad.IfBanker) {
                    if (qRoad.IfBanker.color != -1) {
                        switch (qRoad.IfBanker.color) {
                            case 0:
                                imgBanker.src = redSrc;

                                break;
                            case 1:
                                imgBanker.src = blueSrc;

                                break;
                            default:
                                break;
                        }
                        imgBanker.style.display = "inline";
                    } else {
                        imgBanker.style.display = "none";
                    }
                } else {
                    imgBanker.style.display = "none";
                }
            }

            if (imgPlayer) {
                if (qRoad.IfPlayer) {
                    if (qRoad.IfPlayer.color != -1) {
                        switch (qRoad.IfPlayer.color) {
                            case 0:
                                imgPlayer.src = redSrc;

                                break;
                            case 1:
                                imgPlayer.src = blueSrc;

                                break;
                            default:
                                break;
                        }
                        imgPlayer.style.display = "inline";
                    } else {
                        imgPlayer.style.display = "none";
                    }
                } else {
                    imgPlayer.style.display = "none";
                }
            }
        } else {
            if (imgBanker)
                imgBanker.style.display = "none";

            if (imgPlayer)
                imgPlayer.style.display = "none";
        }
    }

    // 大眼路(1)/小路(2)/曱甴路(3)
    initRoad2(roadType, roadArray) {
        var oRoadMap = null;
        var road;
        var startPosition = -1;
        var roadPosLeft = 0;
        var roadPosTop = 0;
        var imgWidth = 0;
        var imgHeight = 0;
        var imgRed = "";
        var imgBlue = "";
        var enableDisplay = false;
        var extraLine = false;
        var matchCol = 0;
        var arrayMax = -1;
        var xMax = 0;
        var queryRoad = {
            IfPlayer: null,
            IfBanker: null
        };


        switch (roadType) {
            case 1:
                if (this.road1Cfg.el != null)
                    oRoadMap = this.road1Cfg.el;
                //else
                //    oRoadMap = document.body;

                roadPosLeft = this.road1Cfg.x;
                roadPosTop = this.road1Cfg.y;
                imgRed = this.road1Cfg.rImg;
                imgBlue = this.road1Cfg.bImg;
                matchCol = 1;
                xMax = this.road1Cfg.colMax;
                imgWidth = this.road1Cfg.width;
                imgHeight = this.road1Cfg.height;
                extraLine = this.road1Cfg.extraLine;
                enableDisplay = this.road1Cfg.enableDisplay;
                break;
            case 2:
                if (this.road2Cfg.el != null)
                    oRoadMap = this.road2Cfg.el;
                //else
                //    oRoadMap = document.body;

                roadPosLeft = this.road2Cfg.x;
                roadPosTop = this.road2Cfg.y;
                imgRed = this.road2Cfg.rImg;
                imgBlue = this.road2Cfg.bImg;
                matchCol = 2;
                xMax = this.road2Cfg.colMax;
                imgWidth = this.road2Cfg.width;
                imgHeight = this.road2Cfg.height;
                extraLine = this.road2Cfg.extraLine;
                enableDisplay = this.road2Cfg.enableDisplay;
                break;
            case 3:
                if (this.road3Cfg.el != null)
                    oRoadMap = this.road3Cfg.el;
                //else
                //    oRoadMap = document.body;

                roadPosLeft = this.road3Cfg.x;
                roadPosTop = this.road3Cfg.y;
                imgRed = this.road3Cfg.rImg;
                imgBlue = this.road3Cfg.bImg;
                matchCol = 3;
                xMax = this.road3Cfg.colMax;
                imgWidth = this.road3Cfg.width;
                imgHeight = this.road3Cfg.height;
                extraLine = this.road3Cfg.extraLine;
                enableDisplay = this.road3Cfg.enableDisplay;
                break;
            default:
                break;
        }

        startPosition = this.isRoad2Avail(matchCol);
        if (startPosition >= 0) {
            var lastNoMatch = false;
            var lastRoad1 = this.Road1[startPosition];
            var qR1, qR2, qColor; // 問路使用
            var xDisplay = 0;
            var xPosMax = 0;
            // 可以產生下三路結果
            var lastColor = -1;
            var j = -1;
            var xPos = 0;
            var yPos = 0;
            var pointCount = 0; // 相同顏色計算數量
            var rEndCount = []; // 拉龍拉到第幾個位置
            var rTopCount = 0; // 目前位置有幾條龍
            var nextColor = 0;  // 0=red, 1=blue

            if (this.Road1.length > (startPosition + 1)) {
                for (var i = (startPosition + 1); i < this.Road1.length; i++) {
                    lastRoad1 = this.Road1[i];

                    if (lastRoad1.isQueryRoad == false) {
                        if (lastRoad1.Number == 0) {
                            // 庄跳閒或閒跳庄, 比對前兩列是否等長, 等長應紀錄紅色, 不等長記藍色
                            var r1, r2;

                            r1 = this.findRoad1(lastRoad1.colPosition - 1, 0);
                            r2 = this.findRoad1(lastRoad1.colPosition - (matchCol + 1), 0);

                            lastNoMatch = false;

                            if (r1.colCount == r2.colCount) {
                                // 等長, 記錄紅色
                                nextColor = 0;
                            } else {
                                nextColor = 1;
                            }
                        } else {
                            // 同色, 是否連續
                            if (lastNoMatch == true) {
                                // 長排, 記錄紅色
                                nextColor = 0;
                            } else {
                                // 同色, 比對是否隔壁排有路 (無路藍色, 有路紅色)
                                var r;

                                r = this.findRoad1(lastRoad1.colPosition - matchCol, lastRoad1.Number);
                                if (r) {
                                    // 隔壁排有路, 記錄紅色
                                    nextColor = 0;
                                    lastNoMatch = false;
                                } else {
                                    // 隔壁排無路
                                    nextColor = 1;
                                    lastNoMatch = true;
                                }
                            }
                        }

                        j++;
                        if (!roadArray[j]) {
                            roadArray[j] = {
                                x: 0,
                                y: 0,
                                color: 0,
                                isQueryRoad: false,
                                dataImg: null
                            };
                        }

                        road = roadArray[j];
                        road.color = nextColor;
                        road.isQueryRoad = false;

                        if (lastColor != -1) {
                            if (lastColor == nextColor) {
                                // 原排
                                pointCount++;

                                if ((yPos + 1) < (6 - rTopCount)) {
                                    // 仍維持原位置
                                    yPos++;

                                    road.x = xPos;
                                    road.y = yPos;
                                } else {
                                    var rPosition = 0;
                                    // 拉龍
                                    rPosition = xPos + (pointCount - (6 - rTopCount));

                                    if (!rEndCount[yPos]) {
                                        rEndCount[yPos] = 0;
                                    }

                                    if (rPosition > rEndCount[yPos]) {
                                        rEndCount[yPos] = rPosition;
                                    }

                                    road.x = rPosition;
                                    road.y = yPos;
                                }
                            } else {
                                // 新排
                                xPos++;

                                rTopCount = 0;
                                for (var k = 0; k < rEndCount.length; k++) {
                                    if (rEndCount[k]) {
                                        if (rEndCount[k] >= xPos) {
                                            rTopCount = 6 - k;
                                            break;
                                        }
                                    }
                                }

                                yPos = 0;
                                pointCount = 1;

                                road.x = xPos;
                                road.y = yPos;
                            }
                        } else {
                            yPos = 0;
                            pointCount = 1;

                            road.x = xPos;
                            road.y = yPos;
                        }

                        // 尋找路單最大 x 位置
                        if (road.x > xPosMax) {
                            xPosMax = road.x;
                        }

                        lastColor = nextColor;
                    }
                }
            }

            arrayMax = j;

            // 產生問路資料
            //---------------------------------------------------------
            // 庄問路
            lastRoad1 = this.Road1[this.Road1.length - 1];
            if (lastRoad1.isQueryRoad == true)
                if (this.Road1.length >= 2)
                    lastRoad1 = this.Road1[this.Road1.length - 2];
                else
                    lastRoad1 = null;

            if (lastRoad1 != null) {
                queryRoad.IfBanker = this.getNextRoad2(matchCol, lastNoMatch, xPos, yPos, rTopCount, pointCount, rEndCount, lastColor, lastRoad1, 1);
                queryRoad.IfPlayer = this.getNextRoad2(matchCol, lastNoMatch, xPos, yPos, rTopCount, pointCount, rEndCount, lastColor, lastRoad1, 2);
            }

            // 0=無問路/1=庄問路/2=閒問路
            if (this.queryRoadType == 1) {
                arrayMax++;

                if (roadArray[arrayMax]) {
                    roadArray[arrayMax].color = queryRoad.IfBanker.color;
                    roadArray[arrayMax].x = queryRoad.IfBanker.x;
                    roadArray[arrayMax].y = queryRoad.IfBanker.y;
                } else {
                    roadArray[arrayMax] = queryRoad.IfBanker;
                }

                if (roadArray[arrayMax].x > xPosMax) {
                    xPosMax = roadArray[arrayMax].x;
                }

            } else if (this.queryRoadType == 2) {
                arrayMax++;

                if (roadArray[arrayMax]) {
                    roadArray[arrayMax].color = queryRoad.IfPlayer.color;
                    roadArray[arrayMax].x = queryRoad.IfPlayer.x;
                    roadArray[arrayMax].y = queryRoad.IfPlayer.y;
                } else {
                    roadArray[arrayMax] = queryRoad.IfPlayer;
                }

                if (roadArray[arrayMax].x > xPosMax) {
                    xPosMax = roadArray[arrayMax].x;
                }
            }

            // 問路產生結束
            //---------------------------------------------------------

            // 移除過多的 road (可能經過修改)
            if ((roadArray.length - 1) > arrayMax) {
                // 移除綁在畫面上的物件
                for (var i = arrayMax + 1; i < roadArray.length; i++) {
                    road = roadArray[i];

                    if (road.dataImg != null) {
                        if (road.dataImg.hasAttribute("BlinkId") == true) {
                            clearInterval(parseInt(road.dataImg.getAttribute("BlinkId")));
                            road.dataImg.removeAttribute("BlinkId");
                        }

                        try {
                            oRoadMap.removeChild(road.dataImg);
                        }
                        catch (e) {
                        }
                    }
                }

                roadArray.splice((arrayMax + 1), roadArray.length - (arrayMax + 1))
            }


            if ((xPosMax - (xMax - 1)) >= 0) {
                xDisplay = (xPosMax - (xMax - 1));
            } else {
                xDisplay = 0;
            }

            // 下三路呈現最多數量 x: 57
            // 處理下三路貼圖
            if ((enableDisplay == true) && (oRoadMap != null)) {
                for (var i = 0; i < roadArray.length; i++) {
                    var baseX;
                    var baseY;

                    road = roadArray[i];

                    if (road.x >= xDisplay) {
                        if (extraLine == true) {
                            baseX = roadPosLeft + ((road.x - xDisplay) * imgWidth) + parseInt((road.x - xDisplay) / 2);
                            baseY = roadPosTop + (road.y * imgHeight) + parseInt(road.y / 2);
                        } else {
                            baseX = roadPosLeft + ((road.x - xDisplay) * imgWidth);
                            baseY = roadPosTop + (road.y * imgHeight);
                        }

                        // 處理主要資料
                        if (road.dataImg == null) {
                            road.dataImg = document.createElement("img");
                            road.dataImg.style.display = "none";
                            road.dataImg.style.position = "absolute";
                            road.dataImg.style.width = (imgWidth - 1) + "px";
                            road.dataImg.style.height = (imgHeight - 1) + "px";

                            oRoadMap.appendChild(road.dataImg);
                        }

                        switch (road.color) {
                            case 0:
                                road.dataImg.src = imgRed;
                                road.dataImg.style.display = "inline";
                                break;
                            case 1:
                                road.dataImg.src = imgBlue;
                                road.dataImg.style.display = "inline";
                                break;
                            default:
                                road.dataImg.style.display = "none";
                        }

                        if (road.isQueryRoad == true) {
                            if (road.dataImg.hasAttribute("BlinkId") == false) {
                                var blinkId;

                                blinkId = this.setBlink(road.dataImg);
                                road.dataImg.setAttribute("BlinkId", blinkId);
                            }
                        } else {
                            if (road.dataImg.hasAttribute("BlinkId") == true) {
                                clearInterval(parseInt(road.dataImg.getAttribute("BlinkId")));
                                road.dataImg.removeAttribute("BlinkId");

                                this.clearBlink(road.dataImg);
                            }
                        }

                        // 重新設定 position
                        if (road.dataImg != null) {
                            road.dataImg.style.left = baseX + "px";
                            road.dataImg.style.top = baseY + "px";
                        }
                    } else {
                        if (road.dataImg != null) {
                            road.dataImg.style.display = "none";
                        }
                    }
                }
            }
        } else {
            if (roadArray) {
                for (var i = 0; i < roadArray.length; i++) {
                    road = roadArray[i];

                    if (road) {
                        if (road.dataImg) {
                            if (road.dataImg != null) {
                                if (road.dataImg.hasAttribute("BlinkId") == true) {
                                    clearInterval(parseInt(road.dataImg.getAttribute("BlinkId")));
                                    road.dataImg.removeAttribute("BlinkId");
                                }

                                try {
                                    oRoadMap.removeChild(road.dataImg);
                                }
                                catch (e) {
                                }
                            }
                        }
                    }
                }
            }

            roadArray.splice(0, roadArray.length);
        }

        return queryRoad;
    }

    // 檢查大路是否足夠產生指定小路(少一顆, 用來產生預先問路, 呼叫端需檢查)
    // 傳回值: 指定小路起始位置
    isRoad2Avail(matchCol) {
        var startPosition = -1;

        // 必須從大路, 第N列 (matchCol), 第二口, 開始計算  // 改回傳回第一口
        // 尋找該列第一顆
        for (var i = 0; i < this.Road1.length; i++) {
            if (this.Road1[i].colPosition == matchCol && this.Road1[i].Number == 0) {
                startPosition = i;
                break;
            }
        }

        return startPosition;
    }

    // 尋找指定位置的大路
    findRoad1(colPosition, Number) {
        // 傳回值: Road1 object
        var road = null;

        for (var _i = 0; _i < this.Road1.length; _i++) {
            if (this.Road1[_i].colPosition > colPosition) {
                break;
            } else if ((this.Road1[_i].colPosition == colPosition) && (this.Road1[_i].Number == Number)) {
                road = this.Road1[_i];
                break;
            }
        }

        return road;
    }

    // 大路
    initRoad1() {
        var xPos = 0;
        var yPos = 0;
        var pointCount = 0; // 相同顏色計算數量
        var rEndCount = []; // 拉龍拉到第幾個位置
        var rTopCount = 0; // 目前位置有幾條龍
        var oRoadMap;;
        var j = -1;
        var arrayMax = -1;
        var started = false;
        var lastData = -1;
        var lastDragon = false;
        var roadPosLeft = this.bigRoadCfg.x;
        var roadPosTop = this.bigRoadCfg.y;
        var tieCount = 0;
        var allowNext = false;
        var road;
        var colFirstRoad;
        var xPosMax = 0;
        var xDisplay = 0;
        var queryRoad = {
            IfPlayer: null,
            IfBanker: null
        };

        function raiseEvent(o, event) {
            var r;

            r = o.getAttribute("RoundNumber");

            if (this.rawRoadCfg.eventHandler != null) {
                this.rawRoadCfg.eventHandler(event, r);
            }
        }

        if (this.bigRoadCfg.el != null)
            oRoadMap = this.bigRoadCfg.el;
        //else
        //    oRoadMap = document.body;

        // 由珠盤路轉換為大路
        if (this.rawRoad.length > 0) {
            for (let i = 0; i < this.rawRoad.length; i++) {
                if (this.rawRoad[i].isQueryRoad == false) {
                    switch (this.rawRoad[i].data) {
                        case 1:
                            allowNext = true;

                            break;
                        case 2:
                            allowNext = true;

                            break;
                        case 3:
                            tieCount++;
                            allowNext = false;

                            break;
                        default:
                            break;
                    }

                    if (allowNext) {
                        if (road) {
                            road.tieCount += tieCount;
                            tieCount = 0;
                        }

                        // tieCount: 如果已記入到上一顆, 此處應該為 0
                        // 不為 0 就會記入到這一顆(通常是第一顆開和造成無法計入)
                        j++;
                        if (!this.Road1[j]) {
                            this.Road1[j] = {
                                x: 0,
                                y: 0,
                                data: 0,
                                pair: 0,
                                tieCount: tieCount,     // "和" 的計數
                                colPosition: 0,  // 第幾列
                                Number: 0,       // 第幾顆
                                colCount: 0,     // 本列有多少路子(只紀錄在每一列的第一顆)
                                RoundNumber: -1,     // 局數
                                isDragon: false,
                                isDragonStart: false,
                                isColEnd: false,
                                isQueryRoad: false,
                                dataImg: null,
                                bpImg: null,
                                ppImg: null,
                                tieImg: null,
                                dragonDiv: null,
                                divText: null
                            };
                        } else {
                            // 進入這裡通常是因為修改結果
                            this.Road1[j].tieCount = tieCount;
                        }

                        tieCount = 0;

                        road = this.Road1[j];

                        road.data = this.rawRoad[i].data;
                        road.pair = this.rawRoad[i].pair;
                        road.RoundNumber = this.rawRoad[i].RoundNumber;
                        road.isQueryRoad = false;

                        if (lastData != -1) {
                            if (lastData != road.data) {
                                // 由庄變閒或由閒變庄
                                xPos++;

                                rTopCount = 0;
                                for (var k = 0; k < rEndCount.length; k++) {
                                    if (rEndCount[k]) {
                                        if (rEndCount[k] >= xPos) {
                                            rTopCount = 6 - k;
                                            break;
                                        }
                                    }
                                }

                                yPos = 0;
                                pointCount = 1;
                                lastDragon = false;

                                road.x = xPos;
                                road.y = yPos;
                                road.colPosition = xPos;
                                road.Number = (pointCount - 1);
                                road.colCount = pointCount;
                                road.isColEnd = true;

                                colFirstRoad = road;
                            } else {
                                // 仍維持原本狀態
                                pointCount++;
                                road.colPosition = xPos;
                                road.Number = (pointCount - 1);

                                colFirstRoad.colCount = pointCount;

                                if ((yPos + 1) < (6 - rTopCount)) {
                                    // 仍維持原位置
                                    yPos++;

                                    road.x = xPos;
                                    road.y = yPos;
                                } else {
                                    var rPosition = 0;
                                    // 拉龍
                                    if (yPos > 0) {
                                        rPosition = xPos + (pointCount - (6 - rTopCount));
                                    } else {
                                        rPosition = xPos;
                                    }

                                    if (!rEndCount[yPos]) {
                                        rEndCount[yPos] = 0;
                                    }

                                    if (rPosition > rEndCount[yPos]) {
                                        rEndCount[yPos] = rPosition;
                                    }

                                    if (lastDragon == false) {
                                        // 龍的第一顆
                                        road.isDragonStart = true;
                                    }

                                    lastDragon = true;

                                    road.x = rPosition;
                                    road.y = yPos;
                                    road.isDragon = true;
                                }
                            }
                        } else {
                            pointCount = 1;
                            road.colCount = pointCount;
                            colFirstRoad = road;
                        }

                        // 設定最後的 x 位置
                        if (road.x > xPosMax) {
                            xPosMax = road.x;
                        }

                        lastData = road.data;

                        // 設定遇到第一顆閒, 避免一開始開和
                        started = true;
                    } else {
                        // 尚未進入下一顆
                        if (road) {
                            road.tieCount += tieCount;
                            tieCount = 0;
                        } else {
                            if (j == -1) {
                                // 尚未進入第一顆大路
                                if (!this.Road1[0]) {
                                    this.Road1[0] = {
                                        x: 0,
                                        y: 0,
                                        data: 0,
                                        pair: 0,
                                        tieCount: tieCount,     // "和" 的計數
                                        colPosition: 0,  // 第幾列
                                        Number: 0,       // 第幾顆
                                        colCount: 0,     // 本列有多少路子(只紀錄在每一列的第一顆)
                                        RoundNumber: -1,     // 局數
                                        isDragon: false,
                                        isDragonStart: false,
                                        isColEnd: false,
                                        isQueryRoad: false,
                                        dataImg: null,
                                        bpImg: null,
                                        ppImg: null,
                                        tieImg: null,
                                        dragonDiv: null,
                                        divText: null
                                    };
                                } else {
                                    this.Road1[0].data = 0;
                                    this.Road1[0].tieCount = tieCount;
                                }
                            }
                        }
                    }
                }
            }

            if (j >= 0)
                arrayMax = j;
            else
                arrayMax = 0;
        } else {
            // 目前沒有路
            arrayMax = -1;
        }


        // 產生問路

        // 庄
        queryRoad.IfBanker = this.getNextRoad1(xPos, yPos, rTopCount, rEndCount, pointCount, lastDragon, lastData, 1)
        queryRoad.IfPlayer = this.getNextRoad1(xPos, yPos, rTopCount, rEndCount, pointCount, lastDragon, lastData, 2)

        // 0=無問路/1=庄問路/2=閒問路
        if (this.queryRoadType == 1) {
            arrayMax++;

            if (this.Road1[arrayMax]) {
                this.Road1[arrayMax].data = queryRoad.IfBanker.data;
                this.Road1[arrayMax].x = queryRoad.IfBanker.x;
                this.Road1[arrayMax].y = queryRoad.IfBanker.y;
            } else {
                this.Road1[arrayMax] = queryRoad.IfBanker;
            }

            if (this.Road1[arrayMax].x > xPosMax) {
                xPosMax = this.Road1[arrayMax].x;
            }

        } else if (this.queryRoadType == 2) {
            arrayMax++;

            if (this.Road1[arrayMax]) {
                this.Road1[arrayMax].data = queryRoad.IfPlayer.data;
                this.Road1[arrayMax].x = queryRoad.IfPlayer.x;
                this.Road1[arrayMax].y = queryRoad.IfPlayer.y;
            } else {
                this.Road1[arrayMax] = queryRoad.IfPlayer;
            }

            if (this.Road1[arrayMax].x > xPosMax) {
                xPosMax = this.Road1[arrayMax].x;
            }

        }
        // 問路結束


        // 移除過多的 road (可能經過修改)
        if ((this.Road1.length - 1) > arrayMax) {
            // 移除綁在畫面上的物件
            for (let i = arrayMax + 1; i < this.Road1.length; i++) {
                road = this.Road1[i];

                if (road.divText != null) {
                    try {
                        oRoadMap.removeChild(road.divText);
                    }
                    catch (e) {
                    }
                }

                if (road.dataImg != null) {
                    if (road.dataImg.hasAttribute("BlinkId") == true) {
                        clearInterval(parseInt(road.dataImg.getAttribute("BlinkId")));
                        road.dataImg.removeAttribute("BlinkId");
                    }

                    try {
                        oRoadMap.removeChild(road.dataImg);
                    }
                    catch (e) {
                    }
                }

                if (road.tieImg != null) {
                    try {
                        oRoadMap.removeChild(road.tieImg);
                    }
                    catch (e) {
                    }
                }

                if (road.ppImg != null) {
                    try {
                        oRoadMap.removeChild(road.ppImg);
                    }
                    catch (e) {
                    }
                }

                if (road.bpImg != null) {
                    try {
                        oRoadMap.removeChild(road.bpImg);
                    }
                    catch (e) {
                    }
                }

                if (road.dragonDiv != null) {
                    try {
                        oRoadMap.removeChild(road.dragonDiv);
                    }
                    catch (e) {

                    }
                }
            }

            this.Road1.splice((arrayMax + 1), this.Road1.length - (arrayMax + 1))
        }

        if ((xPosMax - (this.bigRoadCfg.colMax - 1)) >= 0) {
            xDisplay = (xPosMax - (this.bigRoadCfg.colMax - 1));
        } else {
            xDisplay = 0;
        }

        colFirstRoad = null;

        // 大路呈現最多數量 x: 32
        // 處理大路貼圖
        if ((this.bigRoadCfg.enableDisplay === true) && (oRoadMap != null)) {
            for (var i = 0; i < this.Road1.length; i++) {
                var baseX;
                var baseY;

                road = this.Road1[i];
                if (road.Number == 0)
                    colFirstRoad = road;

                // 只處理畫面內的
                if (road.x >= xDisplay) {
                    baseX = roadPosLeft + ((road.x - xDisplay) * this.bigRoadCfg.width);
                    baseY = roadPosTop + (road.y * this.bigRoadCfg.height);

                    // 處理主要資料
                    if (road.dataImg == null) {
                        road.dataImg = document.createElement("img");
                        road.dataImg.style.display = "none";
                        road.dataImg.style.position = "absolute";
                        road.dataImg.style.width = (this.bigRoadCfg.width - 1) + "px";
                        road.dataImg.style.height = (this.bigRoadCfg.height - 1) + "px";
                        road.dataImg.setAttribute("RoundNumber", road.RoundNumber);

                        if (road.isQueryRoad == false) {
                            // 大路圖像點下去處理函式
                            if (this.bigRoadCfg.eventHandler != null) {
                                road.dataImg.onclick = function () { raiseEvent(this, "click"); };
                                road.dataImg.onmouseover = function () { raiseEvent(this, "mouseover"); };
                                road.dataImg.onmouseout = function () { raiseEvent(this, "mouseout"); };
                            }
                        }

                        oRoadMap.appendChild(road.dataImg);
                    }

                    if (road.divText == null) {
                        road.divText = document.createElement("div");
                        road.divText.style.display = "none";
                        road.divText.style.position = "absolute";
                        road.divText.style.color = "#008000";
                        road.divText.style.fontSize = "9px";
                        road.divText.style.width = (this.bigRoadCfg.width - 1) + "px";
                        road.divText.style.height = (this.bigRoadCfg.height - 1) + "px";
                        road.divText.style.textAlign = "center";
                        road.divText.style.lineHeight = (this.bigRoadCfg.height - 1) + "px";
                        road.divText.setAttribute("RoundNumber", road.RoundNumber);

                        if (road.isQueryRoad == false) {
                            // 大路圖像點下去處理函式
                            if (this.bigRoadCfg.eventHandler != null) {
                                road.divText.onclick = function () { raiseEvent(this, "click"); };
                                road.divText.onmouseover = function () { raiseEvent(this, "mouseover"); };
                                road.divText.onmouseout = function () { raiseEvent(this, "mouseout"); };
                            }
                        }

                        oRoadMap.appendChild(road.divText);
                    }

                    if (road.tieImg == null) {
                        road.tieImg = document.createElement("img");
                        road.tieImg.style.display = "none";
                        road.tieImg.style.position = "absolute";
                        road.tieImg.style.width = (this.bigRoadCfg.width - 1) + "px";
                        road.tieImg.style.height = (this.bigRoadCfg.height - 1) + "px";
                        road.tieImg.setAttribute("RoundNumber", road.RoundNumber);

                        if (road.isQueryRoad == false) {
                            // 大路圖像點下去處理函式
                            if (this.bigRoadCfg.eventHandler != null) {
                                road.tieImg.onclick = function () { raiseEvent(this, "click"); };
                                road.tieImg.onmouseover = function () { raiseEvent(this, "mouseover"); };
                                road.tieImg.onmouseout = function () { raiseEvent(this, "mouseout"); };
                            }
                        }

                        oRoadMap.appendChild(road.tieImg);
                    }

                    if (road.isDragon) {
                        // 拉龍
                        if (road.dragonDiv == null) {
                            road.dragonDiv = document.createElement("div");
                            road.dragonDiv.style.display = "none";
                            road.dragonDiv.style.position = "absolute";
                            road.dragonDiv.setAttribute("RoundNumber", road.RoundNumber);

                            if (road.isQueryRoad == false) {
                                // 大路圖像點下去處理函式
                                if (this.bigRoadCfg.eventHandler != null) {
                                    road.dragonDiv.onclick = function () { raiseEvent(this, "click"); };
                                    road.dragonDiv.onmouseover = function () { raiseEvent(this, "mouseover"); };
                                    road.dragonDiv.onmouseout = function () { raiseEvent(this, "mouseout"); };
                                }
                            }


                            oRoadMap.appendChild(road.dragonDiv);
                        }
                    } else {
                        if (road.dragonDiv != null) {
                            road.dragonDiv.style.display = "none";
                        }
                    }

                    switch (road.data) {
                        case 1:
                            road.dataImg.src = this.bigRoadCfg.bImg;
                            road.dataImg.style.display = "inline";
                            break;
                        case 2:
                            road.dataImg.src = this.bigRoadCfg.pImg;
                            road.dataImg.style.display = "inline";
                            break;
                        default:
                            road.dataImg.style.display = "none";
                    }

                    // 處理 "和" 數量
                    if (road.tieCount > 0) {
                        if (this.bigRoadCfg.showTieCount == true) {
                            if (road.tieCount > 1) {
                                road.divText.innerHTML = road.tieCount;
                                road.divText.style.display = "inline";
                            } else {
                                road.divText.innerHTML = "";
                                road.divText.style.display = "none";
                            }
                        } else {
                            road.divText.innerHTML = "";
                            road.divText.style.display = "none";
                        }

                        road.tieImg.src = this.bigRoadCfg.tImg;
                        road.tieImg.style.display = "inline";
                    } else {
                        road.divText.innerHTML = "";
                        road.divText.style.display = "none";
                        road.tieImg.style.display = "none";
                    }

                    // 處理對子
                    if (road.ppImg == null) {
                        road.ppImg = document.createElement("img");
                        road.ppImg.style.display = "none";
                        road.ppImg.style.position = "absolute";
                        road.ppImg.style.width = (this.bigRoadCfg.width - 1) + "px";
                        road.ppImg.style.height = (this.bigRoadCfg.height - 1) + "px";
                        road.ppImg.setAttribute("RoundNumber", road.RoundNumber);

                        if (road.isQueryRoad == false) {
                            // 大路圖像點下去處理函式
                            if (this.bigRoadCfg.eventHandler != null) {
                                road.ppImg.onclick = function () { raiseEvent(this, "click"); };
                                road.ppImg.onmouseover = function () { raiseEvent(this, "mouseover"); };
                                road.ppImg.onmouseout = function () { raiseEvent(this, "mouseout"); };
                            }
                        }

                        oRoadMap.appendChild(road.ppImg);
                    }

                    if (road.bpImg == null) {
                        road.bpImg = document.createElement("img");
                        road.bpImg.style.display = "none";
                        road.bpImg.style.position = "absolute";
                        road.bpImg.style.width = (this.bigRoadCfg.width - 1) + "px";
                        road.bpImg.style.height = (this.bigRoadCfg.height - 1) + "px";
                        road.bpImg.setAttribute("RoundNumber", road.RoundNumber);

                        if (road.isQueryRoad == false) {
                            // 大路圖像點下去處理函式
                            if (this.bigRoadCfg.eventHandler != null) {
                                road.bpImg.onclick = function () { raiseEvent(this, "click"); };
                                road.bpImg.onmouseover = function () { raiseEvent(this, "mouseover"); };
                                road.bpImg.onmouseout = function () { raiseEvent(this, "mouseout"); };
                            }
                        }

                        oRoadMap.appendChild(road.bpImg);
                    }

                    switch (road.pair) {
                        case 1:
                            // 庄對
                            road.bpImg.src = this.bigRoadCfg.bpImg;
                            road.bpImg.style.display = "inline";
                            road.ppImg.style.display = "none";
                            break;
                        case 2:
                            // 閒對
                            road.ppImg.src = this.bigRoadCfg.ppImg;
                            road.ppImg.style.display = "inline";
                            road.bpImg.style.display = "none";
                            break;
                        case 3:
                            // 庄閒對
                            road.bpImg.src = this.bigRoadCfg.bpImg;
                            road.bpImg.style.display = "inline";
                            road.ppImg.src = this.bigRoadCfg.ppImg;
                            road.ppImg.style.display = "inline";
                            break;
                        default:
                            road.bpImg.style.display = "none";
                            road.ppImg.style.display = "none";
                    }

                    if (road.isQueryRoad == true || road.RoundNumber == this.blinkRoundNumber) {
                        if (road.dataImg.hasAttribute("BlinkId") == false) {
                            var blinkId;

                            blinkId = this.setBlink(road.dataImg);
                            road.dataImg.setAttribute("BlinkId", blinkId);
                        }
                    } else {
                        if (road.dataImg.hasAttribute("BlinkId") == true) {
                            clearInterval(parseInt(road.dataImg.getAttribute("BlinkId")));
                            road.dataImg.removeAttribute("BlinkId");

                            this.clearBlink(road.dataImg);
                        }
                    }


                    // 重新設定 position
                    if (road.divText != null) {
                        road.divText.style.left = baseX + "px";
                        road.divText.style.top = baseY + "px";
                    }

                    if (road.dataImg != null) {
                        road.dataImg.style.left = baseX + "px";
                        road.dataImg.style.top = baseY + "px";
                    }

                    if (road.tieImg != null) {
                        road.tieImg.style.left = baseX + "px";
                        road.tieImg.style.top = baseY + "px";
                    }

                    if (road.dragonDiv != null) {
                        if (road.isDragon == true) {
                            if (road.y > 0) {
                                road.dragonDiv.style.top = parseInt((baseY + (this.bigRoadCfg.height / 2)) - 1) + "px";
                                road.dragonDiv.style.height = "1px";
                                road.dragonDiv.style.lineHeight = "1px";
                                road.dragonDiv.style.display = "inline";
                                road.dragonDiv.innerHTML = "";

                                switch (road.data) {
                                    case 1:  //庄
                                        road.dragonDiv.style.backgroundColor = "#ff0000";
                                        break;
                                    case 2:  //閒
                                        road.dragonDiv.style.backgroundColor = "#0000ff";
                                        break;
                                    default:
                                        break;
                                }

                                if (road.isDragonStart == true) {
                                    var extendWidth = parseInt(this.bigRoadCfg.width / 2);

                                    if (road.Number == (colFirstRoad.colCount - 1)) {
                                        // dragon start = dragon end
                                        road.dragonDiv.style.left = parseInt(baseX - extendWidth) + "px";
                                        road.dragonDiv.style.width = this.bigRoadCfg.width + "px";
                                    } else {
                                        // dragon start
                                        road.dragonDiv.style.left = parseInt(baseX - extendWidth) + "px";
                                        road.dragonDiv.style.width = (this.bigRoadCfg.width + extendWidth) + "px";
                                    }
                                } else if (road.Number == (colFirstRoad.colCount - 1)) {
                                    // dragon end
                                    road.dragonDiv.style.left = baseX + "px";
                                    road.dragonDiv.style.width = parseInt(this.bigRoadCfg.width / 2) + "px";
                                } else {
                                    // dragon body
                                    road.dragonDiv.style.left = baseX + "px";
                                    road.dragonDiv.style.width = this.bigRoadCfg.width + "px";
                                }
                            } else {
                                // 龍不能是第一顆
                                // 只能呈現文字
                                if (colFirstRoad.colCount > 1) {
                                    road.dragonDiv.style.left = baseX + "px";
                                    road.dragonDiv.style.top = baseY + "px";
                                    road.dragonDiv.style.width = this.bigRoadCfg.width + "px";
                                    road.dragonDiv.style.height = this.bigRoadCfg.height + "px";
                                    road.dragonDiv.style.lineHeight = this.bigRoadCfg.height + "px";
                                    road.dragonDiv.style.textAlign = "center";

                                    switch (road.data) {
                                        case 1:  //庄
                                            road.dragonDiv.style.backgroundColor = "";
                                            road.dragonDiv.style.color = "#ff0000";
                                            break;
                                        case 2:  //閒
                                            road.dragonDiv.style.backgroundColor = "";
                                            road.dragonDiv.style.color = "#0000ff";
                                            break;
                                        default:
                                            break;
                                    }

                                    road.dragonDiv.innerHTML = colFirstRoad.colCount;
                                    road.dragonDiv.style.display = "inline";
                                } else {
                                    road.dragonDiv.style.display = "none";
                                }
                            }
                        }
                    }

                    if (road.ppImg != null) {
                        road.ppImg.style.left = baseX + "px";
                        road.ppImg.style.top = baseY + "px";
                    }

                    if (road.bpImg != null) {
                        road.bpImg.style.left = baseX + "px";
                        road.bpImg.style.top = baseY + "px";
                    }
                } else {
                    if (road.divText != null) {
                        road.divText.style.display = "none";
                    }

                    if (road.dataImg != null) {
                        road.dataImg.style.display = "none";
                    }

                    if (road.dragonDiv != null) {
                        road.dragonDiv.style.display = "none";
                    }

                    if (road.ppImg != null) {
                        road.ppImg.style.display = "none";
                    }

                    if (road.bpImg != null) {
                        road.bpImg.style.display = "none";
                    }

                    if (road.tieImg != null) {
                        road.tieImg.style.display = "none";
                    }
                }
            }
        }
    }

    // 珠盤路
    initRawRoad() {
        var xPos = 0;
        var yPos = 0;
        var oRoadMap = null;
        var roadPosLeft = this.rawRoadCfg.x;
        var roadPosTop = this.rawRoadCfg.y;
        var xPosMax = 0;
        var xDisplay = 0;
        var arrayMax = -1;
        var queryRoad = {
            IfPlayer: null,
            IfBanker: null
        };


        function raiseEvent(o, event) {
            var r;

            r = o.getAttribute("RoundNumber");

            if (this.rawRoadCfg.eventHandler != null) {
                this.rawRoadCfg.eventHandler(event, r);
            }
        }

        if (this.rawRoadCfg.el != null) {
            //做調整，加入可以父層DiV
            if (this.rawRoadCfg.contentEl){
this.generateScrollDiv(this.rawRoadCfg);
            }
            oRoadMap = this.rawRoadCfg.contentEl;
        } //else {
        //  oRoadMap = document.body;
        //}

        // rawResultData[x].LastResult:
        // 1=莊(0001)/2=閒(0010)/3=和(0011)/5=莊+莊對(0101)/9=莊+閒對(1001)/D=莊+莊對+閒對(1101)/6=閒+莊對(0110)/A=閒+閒對(1010)/E=閒+莊對+閒對(1110)/7=和+莊對(0111)/B=和+閒對(1011)/F=和+莊對+閒對(1111)
        for (var i = 0; i < this.rawResultData.length; i++) {
            var rData = 0;  //1=庄/2=閒/3=和
            var rPair = 0;  //0=無對/1=庄對/2=閒對/3=庄閒對
            var valueChange = false;

            if (this.rawResultData[i].Result != this.rawResultData[i].LastResult) {
                this.rawResultData[i].Result = this.rawResultData[i].LastResult
                valueChange = true;
            }

            switch (this.rawResultData[i].LastResult) {
                case "1":
                    // 1=莊(0001)
                    rData = 1;
                    rPair = 0;
                    break;
                case "2":
                    // 2=閒(0010)
                    rData = 2;
                    rPair = 0;
                    break;
                case "3":
                    // 3=和(0011)
                    rData = 3;
                    rPair = 0;
                    break;
                case "5":
                    // 5=莊+莊對(0101)
                    rData = 1;
                    rPair = 1;
                    break;
                case "9":
                    // 9=莊+閒對(1001)
                    rData = 1;
                    rPair = 2;
                    break;
                case "D":
                    // D=莊+莊對+閒對(1101)
                    rData = 1;
                    rPair = 3;
                    break;
                case "6":
                    // 6=閒+莊對(0110)
                    rData = 2;
                    rPair = 1;
                    break;
                case "A":
                    // A=閒+閒對(1010)
                    rData = 2;
                    rPair = 2;
                    break;
                case "E":
                    // E=閒+莊對+閒對(1110)
                    rData = 2;
                    rPair = 3;
                    break;
                case "7":
                    // 7=和+莊對(0111)
                    rData = 3;
                    rPair = 1;
                    break;
                case "B":
                    // B=和+閒對(1011)
                    rData = 3;
                    rPair = 2;
                    break;
                case "F":
                    // F=和+莊對+閒對(1111)
                    rData = 3;
                    rPair = 3;
                    break;
                default:
                    break;
            }

            if (this.rawRoad[i]) {
                // 指定珠盤路位置存在
                this.rawRoad[i].x = xPos;
                this.rawRoad[i].y = yPos;
                this.rawRoad[i].data = rData;
                this.rawRoad[i].pair = rPair;
                this.rawRoad[i].isQueryRoad = false;
            } else {
                this.rawRoad[i] = {
                    x: xPos,
                    y: yPos,
                    data: rData,
                    pair: rPair,
                    RoundNumber: this.rawResultData[i].RoundNumber,
                    isQueryRoad: false,
                    dataImg: null,
                    ppImg: null,
                    bpImg: null
                };

                valueChange = true;
            }

            if (xPos > xPosMax) {
                xPosMax = xPos;
            }

            //調整y與x的位置
            yPos++;
            if (yPos >= 6) {
                xPos++;
                yPos = 0;
            }
        }

        arrayMax = this.rawResultData.length - 1;

        // 產生問路資料
        queryRoad.IfBanker = this.getNextRawRoad(xPos, yPos, 1)
        queryRoad.IfPlayer = this.getNextRawRoad(xPos, yPos, 2)

        // 0=無問路/1=庄問路/2=閒問路
        if (this.queryRoadType == 1) {
            arrayMax++;

            if (this.rawRoad[arrayMax]) {
                this.rawRoad[arrayMax].data = queryRoad.IfBanker.data;
                this.rawRoad[arrayMax].x = queryRoad.IfBanker.x;
                this.rawRoad[arrayMax].y = queryRoad.IfBanker.y;
            } else {
                this.rawRoad[arrayMax] = queryRoad.IfBanker;
            }

            if (this.rawRoad[arrayMax].x > xPosMax) {
                xPosMax = this.rawRoad[arrayMax].x;
            }
        } else if (this.queryRoadType == 2) {
            arrayMax++;

            if (this.rawRoad[arrayMax]) {
                this.rawRoad[arrayMax].data = queryRoad.IfPlayer.data;
                this.rawRoad[arrayMax].x = queryRoad.IfPlayer.x;
                this.rawRoad[arrayMax].y = queryRoad.IfPlayer.y;
            } else {
                this.rawRoad[arrayMax] = queryRoad.IfPlayer;
            }

            if (this.rawRoad[arrayMax].x > xPosMax) {
                xPosMax = this.rawRoad[arrayMax].x;
            }
        }

        // 問路結束

        // 移除過多的 road (可能經過修改) => 開牌結果總局數變少
        if ((this.rawRoad.length - 1) > arrayMax) {
            // 移除綁在畫面上的物件
            for (var i = arrayMax + 1; i < this.rawRoad.length; i++) {
                this.road = this.rawRoad[i];

                if (this.road.dataImg != null) {
                    if (this.road.dataImg.hasAttribute("BlinkId") == true) {
                        clearInterval(parseInt(this.road.dataImg.getAttribute("BlinkId")));
                        this.road.dataImg.removeAttribute("BlinkId");
                    }

                    try {
                        oRoadMap.removeChild(this.road.dataImg);
                    }
                    catch (e) {
                    }
                }

                if (this.road.ppImg != null) {
                    try {
                        oRoadMap.removeChild(this.road.ppImg);
                    }
                    catch (e) {
                    }
                }

                if (this.road.bpImg != null) {
                    try {
                        oRoadMap.removeChild(this.road.bpImg);
                    }
                    catch (e) {
                    }
                }
            }

            this.rawRoad.splice(this.rawResultData.length, this.rawRoad.length - this.rawResultData.length)
        }

        if ((xPosMax - (this.rawRoadCfg.colMax - 1)) >= 0) {
            xDisplay = (xPosMax - (this.rawRoadCfg.colMax - 1));
            this.setScrollDiv(this.rawRoadCfg, xDisplay);
        } 

        // 珠盤路最大 x:12
        // 處理珠盤路貼圖
        if ((this.rawRoadCfg.enableDisplay == true) && (oRoadMap != null)) {
            for (var i = 0; i < this.rawRoad.length; i++) {
                let baseX;
                let baseY;

                let road = this.rawRoad[i];

                if (road.x >= xDisplay) {
                    
                } else {
                    if (this.road.dataImg != null && this.road.dataImg.style.display == "inline")
                        this.road.dataImg.style.display = "none";

                    if (this.road.bpImg != null && this.road.bpImg.style.display == "inline")
                        this.road.bpImg.style.display = "none";

                    if (this.road.ppImg != null && this.road.ppImg.style.display == "inline")
                        this.road.ppImg.style.display = "none";
                }
            }
        }
    }

    updateCounting() {
        var countingResult = {
            banker: 0,
            player: 0,
            tie: 0,
            bankerPair: 0,
            playerPair: 0
        }

        for (var i = 0; i < this.rawResultData.length; i++) {
            switch (this.rawResultData[i].LastResult) {
                case "1":
                    // 1=莊(0001)
                    countingResult.banker++;
                    break;
                case "2":
                    // 2=閒(0010)
                    countingResult.player++;
                    break;
                case "3":
                    // 3=和(0011)
                    countingResult.tie++;
                    break;
                case "5":
                    // 5=莊+莊對(0101)
                    countingResult.banker++;
                    countingResult.bankerPair++;
                    break;
                case "9":
                    // 9=莊+閒對(1001)
                    countingResult.banker++;
                    countingResult.playerPair++;
                    break;
                case "D":
                    // D=莊+莊對+閒對(1101)
                    countingResult.banker++;
                    countingResult.bankerPair++;
                    countingResult.playerPair++;
                    break;
                case "6":
                    // 6=閒+莊對(0110)
                    countingResult.player++;
                    countingResult.bankerPair++;
                    break;
                case "A":
                    // A=閒+閒對(1010)
                    countingResult.player++;
                    countingResult.playerPair++;
                    break;
                case "E":
                    // E=閒+莊對+閒對(1110)
                    countingResult.player++;
                    countingResult.bankerPair++;
                    countingResult.playerPair++;
                    break;
                case "7":
                    // 7=和+莊對(0111)
                    countingResult.tie++;
                    countingResult.bankerPair++;
                    break;
                case "B":
                    // B=和+閒對(1011)
                    countingResult.tie++;
                    countingResult.playerPair++;
                    break;
                case "F":
                    // F=和+莊對+閒對(1111)
                    countingResult.tie++;
                    countingResult.bankerPair++;
                    countingResult.playerPair++;
                    break;
                default:
                    break;
            }
        }

        return countingResult;
    }

    clearBlink(o) {
        if (o != null) {
            o.style.filter = "alpha(opacity=100)";//"filter: alpha(opacity=70); -moz-opacity: 0.7; opacity: 0.7; display: inline;";
            o.style.opacity = 1.0;
        }
    }

    setBlink(o) {
        var op = 100;
        var opMode = 0;

        return setInterval(function () {
            o.style.filter = "alpha(opacity=" + op + ")";//"filter: alpha(opacity=70); -moz-opacity: 0.7; opacity: 0.7; display: inline;";
            o.style.opacity = (op / 100);

            if (opMode == 0) {
                op -= 10;
                if (op <= 0) {
                    op = 0;
                    opMode = 1;
                }
            } else {
                op += 10;
                if (op >= 100) {
                    op = 100;
                    opMode = 0;
                }
            }
        }, 50);
    }

    generateScrollDiv(cfg){
        let contentDiv = document.createElement("div");
        contentDiv.style.position = 'absolute';
        contentDiv.style.left = cfg.x - 1;
        contentDiv.style.top = cfg.y - 1;
        contentDiv.style.width = cfg.width * cfg.colMax;
        contentDiv.style.height = cfg.height * cfg.rowMax;        
        cfg.contentDiv = contentDiv;
    }    

    setScrollDiv(cfg, xDisplay){
        //設定偏移
        cfg.contentDiv.style.transform = 'translateX(' + cfg.width * xDisplay + 'px)' ;        
    }
}