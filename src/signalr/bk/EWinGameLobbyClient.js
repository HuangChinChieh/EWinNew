﻿import { hubConnection } from 'signalr-no-jquery';
import { generateUUIDv4 } from 'utils/guid';

export class EWinGameLobbyClient {
    constructor(CT, eWinUrl) {
        this.EWinHub = null;
        this.currentState = 4;  //0=connecting, 1=connected, 2=reconnecting, 4=disconnected
        this.onReceive = null;
        this.onReconnected = null;
        this.onReconnecting = null;
        this.onConnected = null;
        this.onDisconnect = null;
        this.CONNECTING = 0;
        this.CONNECTED = 1;
        this.RECONNECTING = 2;
        this.DISCONNECTED = 4;
        this.CT = CT;
        this.GUID = generateUUIDv4();
        this.conn = hubConnection();

        if (eWinUrl) {
            this.EWinUrl = eWinUrl;
        }
    }

    componentDidMount() {
        this.initializeConnection();
    }

    handleReceiveMsg(handle) {
        this.onReceive = handle;
    }

    handleReconnected(handle) {
        this.onReconnected = handle;
    }

    handleReconnecting(handle) {
        this.onReconnecting = handle;
    }

    handleConnected(handle) {
        this.onConnected = handle;
    }

    handleDisconnect(handle) {
        this.onDisconnect = handle;
        // this.conn.stop();
    }

    //#region 通用API

    // 監聽連線狀態
    HeartBeat(Echo, cb) {
        if (!this.EWinHub) {
            console.error('EWinHub is not initialized.');
            return;
        }
        console.log('Calling HeartBeat method...');
        this.EWinHub.invoke("HeartBeat", Echo).done(function (o) {
            if (cb)
                cb(true, o)
            console.log('HeartBeat response', Echo, 'o', o);
        }).fail(function (err) {
            cb(false, err);
            console.log('err', err);
        });
    }

    /**
    * 傳入，特定屬性值
    * @typedef {Object} PropertySet
    * @param {number} Name 屬性名稱
    * @param {string} Value 屬性值
    */

    //#endregion

    //#region 回傳(用到的參考型別)

    /**
    * 用戶標籤
    * @typedef {Object} UserTag
    * @param {string} TagID 標籤ID
    * @param {string} TagText 標籤內容
    * @param {string} FontColor 文字顏色
    * @param {string} BGColor 背景顏色
    */

    /**
     * 工單資訊
     * @typedef {Object} UserGameSet
     * @param {number} GameSetID 工單ID
     * @param {string} GameSetNumber 工單號碼
     * @param {string} RoadMapNumber 指定桌台號碼
     * @param {string} UserInitChip 本金
     * @param {number} TableChip 檯面數
     * @param {string} RewardValue 輸贏數
     * @param {string} BuyChipValue 轉碼數
     * @param {string} AddChipValue 加彩
     * @param {string} TipsValue 小費
     */

    /**
     * 商戶資訊
     * @typedef {Object} CompanyInfo
     * @param {string} CompanyCode 商戶代碼
     * @param {string} LogoPCUrl 商戶PC用Logo
     * @param {string} LogoMobileUrl 商戶手機用Logo
     * @param {number} CashUnit 商戶貨幣單位 0=萬/1=千/2=元
     * @param {string} DefaultAreaCode 預設賭桌地區
     */

    /**
     * 錢包資訊
     * @typedef {Object} WalletInfo
     * @param {string} CurrencyType 幣別代碼
     * @param {string} CurrencyName 幣別名稱
     * @param {string} Symbol 幣別轉換符號
     * @param {number} ValueType 貨幣類型，(0=現金/1=信用/2=乙太網合約)
     * @param {string} Balance 錢包餘額
     */

    /**
     * 用戶屬性
     * @typedef {Object} UserAccountProperty
     * @param {string} PropertyName 屬性名稱
     * @param {string} PropertyValue 屬性值
     */

    //#region BetLimit相關資訊

    /**
     * 用戶屬性
     * @typedef {Object} BetLimitValue
     * @param {number} Min 最小值
     * @param {number} Max 最大值
     */

    /**
     * 限紅Basic
     * @typedef {Object} BetLimitInheritsBase
     */

    /**
     * 百家樂限紅
     * @typedef {BetLimitInheritsBase} BetLimitInfoBaccarat
     * @param {number} BetBaseBanker 莊基數
     * @param {BetLimitValue} Player 閒
     * @param {BetLimitValue} Banker 莊
     * @param {BetLimitValue} Tie 和
     * @param {BetLimitValue} Pair 閒
     */

    //#endregion

    /**
     * 串流
     * @typedef {Object} StreamInfo
     * @param {number} StreamResolution 串流處理類型,0=HD,1=SD,2=PinCamera
     * @param {string} StreamName 串流名稱
     */

    /**
     * 路單圖片資訊
     * @typedef {Object} RoadMapImageInfo
     * @param {number} ImageType 圖片類型,0=浮水印,1=Logo
     * @param {string} ImageUrl 圖片路徑
     */

    /**
     * 用戶屬性
     * @typedef {Object} BetLimitValue
     * @param {number} Min 最小值
     * @param {number} Max 最大值
     */

    /**
     * 桌台資訊
     * @typedef {Object} TableInfo
     * @param {string} TableNumber 桌號  
     * @param {string} TableType (1=傳統電投/2=快速電投)  
     * @param {string[]} Currency 幣別  
     * @param {BetLimitInheritsBase[]} BetLimit 限紅列表
     * @param {StreamInfo[]} Stream 視頻串流列表  
     * @param {RoadMapImageInfo[]} ImageList 路單相關圖片列表
     * @param {string} Status "TableType" + "." + "Status"   
     * TableType 類型 (目前只有BA) 
     * BA=百家樂
     * Status 狀態碼
     * Close=關閉 ,Shuffling=洗牌, NoService=沒有服務, AccidentPending=事故暫停
     * @param {string} AreaCode 賭桌所在區域  
     * @param {number} TableTimeoutSecond 賭桌設定的投注時間  
     * @param {number} RemainingSecond 剩餘時間  
     * @param {string} RoundInfo ex: 1543-12  靴號-局號  
     * @param {boolean} ReservedTable 是否是保留桌  
     * @param {boolean} LastRound 是否已經最後一局
     * @param {number} SortOrder 排序值  
     * @param {string} ShoeResult 靴結果總結
     * 1=莊(0001)
     * 2=閒(0010)
     * 3=和(0011)
     * 5=莊+莊對(0101)
     * 9=莊+閒對(1001)
     * D=莊+莊對+閒對(1101)
     * 6=閒+莊對(0110)
     * A=閒+閒對(1010)
     * E=閒+莊對+閒對(1110)
     * 7=和+莊對(0111)
     * B=和+閒對(1011)
     * F=和+莊對+閒對(1111)  
     */

    /**
    * 每日注單統計
    * @typedef {Object} HistorySummary
    * @param {string} SummaryDate 統計日期  
    * @param {string} GameCode  遊戲代碼 
    * @param {string} CurrencyType 幣別  
    * @param {number} OrderCount 該日投注筆數
    * @param {number} OrderValue 該日投注額度  
    * @param {number} RewardValue 該日輸贏數
    * @param {number} ValidBetValue 該日有效投注/轉碼數    
    */

    /**
     * 每日注單統計
     * @typedef {Object} HistoryDetail
     * @param {string} RoundInfo 桌-靴-局
     * @param {number} OrderID  投注流水號
     * @param {number} OrderType 0=電投/1=快速電投/2=網投  
     * @param {string} CurrencyType 幣別
     * @param {number} GameSetID 工單號碼  
     * @param {string} Result 該日輸贏數
     * @param {number} OrderBanker 庄投注
     * @param {number} OrderPlayer 閒投注
     * @param {number} OrderTie 和投注
     * @param {number} OrderBankerPair 庄對下注
     * @param {number} OrderPlayerPair 閒對下注  
     * @param {number} WinValue 贏數 
     * @param {number} LoseValue 輸數
     * @param {number} LendChipTax 放碼抽稅    
     * @param {number} RewardValue 輸贏數    
     * @param {number} BuyChipValue 轉碼數
     * @param {number} AddChip 實際加彩金額
     * @param {number} TipsValue 小費       
     * @param {number} TableChip 桌台數 
     * @param {number} BeforePoint 投注前餘額
     * @param {string} CardInfo 開牌結果
     * @param {string} SnapshotName 開牌結圖檔名
     * @param {string} CreateDate 下注日期
     */

    //#endregion

    //#endregion

    //#region 回傳

    /**
    * 回傳，統一回傳格式
    * @typedef {Object} APIResult
    * @param {number} ResultCode 0=OK,1=ERR
    * @param {string} GUID 請求驗證戳
    * @param {string} Message 錯誤訊息  
    */

    /**
     * 回傳，會員特定屬性資料
     * @typedef {APIResult} UserAccountPropertyResult
     * @param {string} LoginAccount 會員帳號  
     * @param {string} PropertyName 屬性名稱  
     * @param {string} PropertyValue 屬性值  
     */

    /**
      * 回傳，會員Info
      * @typedef {APIResult} UserInfoResult
      * @param {string} LoginAccount 會員帳號  
      * @param {string} RealName 屬性名稱  
      * @param {boolean} IsGuestAccount 是否訪客登入  
      * @param {number} UserAccountType 玩家身分，0=一般會員/1=代理/2=股東
      * @param {number} AllowBetType 允許電投(0=不允許/1=允許傳統電投/2=允許快速電投/3=允許全部投注)
      * @param {string} UserCountry 用戶國家
      * @param {number} UserLevel 用戶等級
      * @param {UserTag[]} Tag 用戶標籤資訊
      * @param {string} BetLimitCurrencyType 目前使用的限紅幣別
      * @param {BetLimitInheritsBase} BetLimit 目前使用限紅列表
      * @param {CompanyInfo} Company 公司資訊
      * @param {WalletInfo[]} Wallet 錢包資訊
      * @param {UserGameSet[]} GameSetList 是否訪客登入
      * @param {UserAccountProperty[]} UserProperty 是否訪客登入
      */


    /**
     * 回傳，取得桌台資訊列表
     * @typedef {APIResult} TableInfoListResult
     * @param {TableInfo[]} TableInfoList 桌台資訊列表            
     */

    /**
     * 回傳，取得桌台資訊列表
     * @typedef {APIResult} HistorySummaryResult
     * @param {HistorySummary[]} SummaryList 桌台資訊列表            
     */

    /**
    * 回傳，取得桌台資訊列表
    * @typedef {APIResult} HistoryDetailResult
    * @param {HistoryDetail[]} DetailList 桌台資訊列表            
    */

    //#endregion

    /**
      * 取得會員特定資料
      * 
      * @param {string} CT 用戶Token
      * @param {string} GUID 請求驗證戳
      * @param {string} PropertyName 特定資料屬性名稱
      * @param {UserAccountPropertyResultCB} cb  callback
      * 
      * cb 回傳結果
      * 
      * @callback UserAccountPropertyResultCB
      * @param {boolean} success 請求本身成功,失敗
      * @param {UserAccountPropertyResult} o //回傳資料   
      * @returns {void}
      * 
      * @description 
      * 取得會員特定資料 
      *       
      * @returns {void}
      */




    // 獲取使用者資料
    /**
* 取得會員Info
* 
* @param {string} CT 用戶Token
* @param {string} GUID 請求驗證戳    
* @param {UserInfoResultCB} cb  callback
* 
* cb 回傳結果
* 
* @callback UserInfoResultCB
* @param {boolean} success 請求本身成功,失敗
* @param {UserInfoResult} o //回傳資料   
* @returns {void}
* 
* @description 
* 取得會員Info
*       
* @returns {void}
*/
    GetUserInfo(cb) {
        // console.log('Calling GetUserInfo method...');
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("GetUserInfo", this.CT, GUID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }


    // 取得會員特定資料(獲取我的最愛)
    /**
      * 取得會員特定資料
      * 
      * @param {string} CT 用戶Token
      * @param {string} GUID 請求驗證戳
      * @param {string} PropertyName 特定資料屬性名稱
      * @param {UserAccountPropertyResultCB} cb  callback
      * 
      * cb 回傳結果
      * 
      * @callback UserAccountPropertyResultCB
      * @param {boolean} success 請求本身成功,失敗
      * @param {UserAccountPropertyResult} o //回傳資料   
      * @returns {void}
      * 
      * @description 
      * 取得會員特定資料 
      *       
      * @returns {void}
      */
    GetUserAccountProperty(PropertyName, cb) {
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("GetUserAccountProperty", this.CT, GUID, PropertyName).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // 設定會員特定資料
    /**
 * 設定會員特定資料 
 * 
 * @param {string} CT 用戶Token
 * @param {string} GUID 請求驗證戳
 * @param {string} PropertyName 特定資料屬性名稱
 * @param {string} PropertyValue //屬性值  
 * @param {APIResultCB} cb  callback
 * cb 回傳結果
 * @callback APIResultCB
 * @param {boolean} success 請求本身成功,失敗
 * @param {APIResult} o //回傳資料   
 * @returns {void}
 * 
 * 
 * @description 設定會員特定資料 
 * 
 * @returns {void}
 */
    SetUserAccountProperty(PropertyName, PropertyValue, cb) {
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("SetUserAccountProperty", this.CT, GUID, PropertyName, PropertyValue).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }



    /**
 * 設定會員特定資料 
 * 
 * @param {string} CT 用戶Token
 * @param {string} GUID 請求驗證戳
 * @param {string} PropertyName 特定資料屬性名稱
 * @param {string} PropertyValue //屬性值  
 * @param {APIResultCB} cb  callback
 * cb 回傳結果
 * @callback APIResultCB
 * @param {boolean} success 請求本身成功,失敗
 * @param {APIResult} o //回傳資料   
 * @returns {void}
 * 
 * 
 * @description 設定會員特定資料 
 * 
 * @returns {void}
 */
    RemoveUserAccountProperty(PropertyName, cb) {
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("RemoveUserAccountProperty", this.CT, GUID, PropertyName).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // 設定會員多個特定資料 
    /**
* 設定會員多個特定資料 
* 
* @param {string} CT 用戶Token
* @param {string} GUID 請求驗證戳
* @param {PropertySet[]} PS 資料屬性集合
* @param {APIResultCB} cb  callback
* cb 回傳結果
* @callback APIResultCB
* @param {number} ResultCode 0=OK/1=ERR
* @param {boolean} success 請求本身成功,失敗
* @param {APIResult} o //回傳資料   
* @returns {void}
* 
* 
* @description 設定會員多個特定資料 
* 
* @returns {void}
*/
    UpdateProperty(PS, cb) {
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("UpdateProperty", this.CT, GUID, PS).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }



    // 設定會員裝置資訊
    /**
* 設定會員裝置資訊
* 
* @param {string} CT 用戶Token
* @param {string} GUID 請求驗證戳
* @param {string} DeviceGUID 裝置識別碼
* @param {string} PushType 推播類型 0=None,1=FCM,2=JPush
* @param {string} DeviceName 裝置名稱
* @param {string} DeviceKey 裝置Key(可能是搭配fingerPrint使用)
* @param {string} DeviceType 0=未知,1=PC,2=Mobile
* @param {string} NotifyToken 推播Token
* @param {string} GPSPosition GPS位置
* @param {string} UserAgent Http UserAgent
* @param {APIResultCB} cb  callback
* cb 回傳結果
* @callback APIResultCB
* @param {number} ResultCode 0=OK/1=ERR
* @param {boolean} success 請求本身成功,失敗
* @param {APIResult} o //回傳資料   
* @returns {void}
* 
* 
* @description 設定會員裝置資訊 
* 
* @returns {void}
*/
    UpdateDeviceInfo(DeviceGUID, PushType, DeviceName, DeviceKey, DeviceType, NotifyToken, GPSPosition, UserAgent, cb) {
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("UpdateDeviceInfo", this.CT, GUID, DeviceGUID, PushType, DeviceName, DeviceKey, DeviceType, NotifyToken, GPSPosition, UserAgent).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }




    // 獲取首頁相關桌台資訊
    /**
* 取得桌台資訊
* 
* @param {string} CT 用戶Token
* @param {string} GUID 請求驗證戳    
* @param {string} AreaCode 查詢地區，空白=所有地區    
* @param {number} GameSetID 額外綁定工單號，沒有傳0
* @param {TableInfoListResultCB} cb  callback
* 
* cb 回傳結果
* 
* @callback TableInfoListResultCB
* @param {boolean} success 請求本身成功,失敗
* @param {TableInfoListResult} o //回傳資料   
* @returns {void}
* 
* @description 
* 取得會員特定資料 
*       
* @returns {void}
*/
    GetTableInfoList(AreaCode, GameSetID, cb) {
        // console.log('Calling GetTableInfoList method...');
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("GetTableInfoList", this.CT, GUID, AreaCode, GameSetID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // 查詢遊戲每日統計
    /**
* 查詢遊戲每日統計
* 
* @param {string} CT 用戶Token
* @param {string} GUID 請求驗證戳    
* @param {string} BeginDate 起始日期，(有效日期字串,ex:2023/01/01 00:00:00)    
* @param {string} EndDate 結束日期，(有效日期字串,ex:2023/01/01 00:00:00)    
* @param {HistorySummaryResultCB} cb  callback
* 
* cb 回傳結果
* 
* @callback HistorySummaryResultCB
* @param {boolean} success 請求本身成功,失敗
* @param {HistorySummaryResult} o //回傳資料   
* @returns {void}
* 
* @description 
* 查詢遊戲每日統計
*       
* @returns {void}
*/
    GetHistorySummary(BeginDate, EndDate, cb) {
        // console.log('Calling GetTableInfoList method...');
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("GetHistorySummary", this.CT, GUID, BeginDate, EndDate).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // 查詢遊戲詳細記錄
    /**
* 查詢遊戲詳細記錄
* 
* @param {string} CT 用戶Token
* @param {string} GUID 請求驗證戳    
* @param {string} GameCode 遊戲代碼    
* @param {string} QueryDate 查詢日期，(有效日期字串,ex:2023/01/01 00:00:00)   
* @param {HistoryDetailResultCB} cb  callback
* 
* cb 回傳結果
* 
* @callback HistoryDetailResultCB
* @param {boolean} success 請求本身成功,失敗
* @param {HistoryDetailResult} o //回傳資料   
* @returns {void}
* 
* @description 
* 查詢遊戲詳細記錄
*       
* @returns {void}
*/
    GetHistoryDetail(GameCode, QueryDate, cb) {
        // console.log('Calling GetTableInfoList method...');
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("GetHistoryDetail", this.CT, GUID, GameCode, QueryDate).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // Keep Token
    /**
* Keep Token
* 
* @param {string} CT 用戶Token
* @param {string} GUID 請求驗證戳    
* @param {APIResultCB} cb  callback
* 
* cb 回傳結果
* 
* @param {number} ResultCode 0=OK/1=ERR
* @param {boolean} success 請求本身成功,失敗
* @param {APIResult} o //回傳資料  
* @returns {void}
* 
* @description 
* Keep Token 
*       
* @returns {void}
*/
    KeepSID(cb) {
        // console.log('Calling GetTableInfoList method...');
        let GUID = generateUUIDv4();
        this.EWinHub.invoke("KeepSID", this.CT, GUID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }


    state() {
        return this.currentState;
    }

    initializeConnection() {

        const connectServer = (c, events) => {

            c.start({ withCredentials: false })
                .done((function () {
                    //這邊的this有問題，由於使用箭頭函式，無法使用call or bind，採用傳入解決
                    if (this.onConnected != null)
                        this.onConnected();
                }).bind(events))
                .fail((function (error) {
                    if (this.onDisconnect != null) {
                        this.onDisconnect();
                    }
                }).bind(events));
        };

        if (this.EWinUrl != null)
            this.conn.url = this.EWinUrl + "/signalr";
        else
            this.conn.url = "/signalr";

        this.EWinHub = this.conn.createHubProxy("EWinGame.Lobby");

        this.EWinHub.on("serverMsg", this.serverMsg.bind(this));

        this.conn.disconnected(() => {
            setTimeout(() => {
                connectServer.call(this, this.conn);
            }, 1000);
        });

        this.conn.stateChanged((state) => {
            this.currentState = state.newState;
        });

        this.conn.reconnected(() => {
            if (this.onReconnected != null)
                this.onReconnected();
        });

        this.conn.reconnecting(() => {
            if (this.onReconnecting != null)
                this.onReconnecting();
        });

        connectServer(this.conn, { onConnected: this.onConnected, onDisconnect: this.onDisconnect });

    }

    getJSON(text) {
        var obj = JSON.parse(text);

        if (obj) {
            if (obj.hasOwnProperty('d')) {
                return obj.d;
            } else {
                return obj;
            }
        }
    }

    serverMsg(msg) {
        var o = this.getJSON(msg);

        if (o != null) {
            if (this.onReceive != null)
                this.onReceive(o);
        }

        console.log('Received message from server:', o);

    }


    static getInstance(CT, eWinUrl) {
        let Ret;

        if (EWinGameLobbyClient.instance) {
            Ret = EWinGameLobbyClient.instance;
        } else {
            if (CT) {
                EWinGameLobbyClient.instance = new EWinGameLobbyClient(CT, eWinUrl);
                Ret = EWinGameLobbyClient.instance;
            } else {
                Ret = null;
            }
        }

        return Ret;
    }
}
