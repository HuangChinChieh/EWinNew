import { hubConnection } from 'signalr-no-jquery';
import { generateUUIDv4 } from 'utils/guid';

export class EWinGameBaccaratClient {
    // constructor(CT, eWinUrl) {
    //     this.conn = hubConnection();
    //     this.CT = CT;
    //     if (eWinUrl) {
    //         this.EWinUrl = eWinUrl;
    //     }
    // }

    // CT;
    // EWinHub;
    // currentState = 4;  //0=connecting, 1=connected, 2=reconnecting, 4=disconnected
    // onReceive;
    // onReconnected;
    // onReconnecting;
    // onConnected;
    // onDisconnect;
    // CONNECTING = 0;
    // CONNECTED = 1;
    // RECONNECTING = 2;
    // DISCONNECTED = 4;
    // EWinUrl = null;
    // conn;

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
    }

    //#region 通用API
    HeartBeat(Echo, cb) {
        this.EWinHub.invoke("HeartBeat", Echo).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    //#region 屬性使用到的 Refrence Type

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

    /**
     * 百家樂個人限紅資訊
     * @typedef {BetLimitInfoBaccarat} UserAccountBetLimit
     * @param {string} BetLimitID 限紅ID
     * @param {string} CurrencyType 幣別
     * @param {number} BetLimitType 限紅種類，0=快速電投，1=網投 (傳統傳統電投沒有檯紅列表)                       
     */

    /**
     * 籌碼資訊
     * @typedef {Object} CurrencyChipsList
     * @param {string} CurrencyType 籌碼幣別
     * @param {string} ChipsList 籌碼列表，100, 200, 300，逗號串接     
     */

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
     * 用戶標籤
     * @typedef {Object} UserTag
     * @param {string} TagID 標籤ID
     * @param {string} TagText 標籤內容
     * @param {string} FontColor 文字顏色
     * @param {string} BGColor 背景顏色
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
     * 路單圖片資訊
     * @typedef {Object} QueryUserInfo
      * @param {string} LoginAccount 會員帳號  
      * @param {string} RealName 屬性名稱  
      * @param {string} CompanyCode 屬性名稱  
      * @param {boolean} IsGuestAccount 是否訪客登入  
      * @param {boolean} IsWalletPasswordSet 是否設定錢包密碼(棄用)
      * @param {number} UserAccountType 玩家身分，0=一般會員/1=代理/2=股東
      * @param {boolean} AllowBet 是否允許下注
      * @param {number} AllowBPType 允許庄閒下注狀態，0=庄閒只能其一/1=庄閒可以同時投注
      * @param {string} UserCountry 用戶國家
      * @param {number} CashUnit 商戶貨幣單位 0=萬/1=千/2=元
      * @param {UserTag[]} Tag 用戶標籤資訊
      * @param {string} DefaultRoadMapAreaCode 公司預設桌台區域
      * @param {WalletInfo[]} Wallet 錢包資訊
      * @param {boolean} IsBindingAccount //目前是否綁定三方平台(目前是否透過三方平台登入)(棄用)
      * @param {number} BindingType //綁定三方平台，0=未綁定/1=wechat/2=Line/3=KaoKaoTalk(棄用)
      * @param {string} BindingUID 三方平台識別碼(棄用)
      * @param {string} BindingHeadImg 三方平台大頭貼(棄用)
      * @param {string} BindingNickname 三方平台暱稱(棄用)
     */

    /**
     * 咪牌資訊
     * @typedef {Object} PeekingCardInfo
     * @param {number} PeekingCardType 0=關閉/1=開啟
     * @param {boolean} IsHighestBankerOrder 目前用戶是否是庄投注的最高投注人 (最高投注人才允許可以咪牌, 其他人只能看他瞇牌)
     * @param {boolean} IsHighestPlayerOrder 目前用戶是否是閒投注的最高投注人 (最高投注人才允許可以咪牌, 其他人只能看他瞇牌)
     */

    /**
     * 工單資訊
     * @typedef {Object} GameSetOrderInfo
     * @param {string} GameSetRoadMapNumber 工單綁定桌台的桌台號碼  
     * @param {string} GameSetNumber 工單號碼        
     * @param {number} GameSetState 工單狀態，-1=尚未建立(暫存)/0=建立/1=進行中/2=暫停/3=完場/4=結算完成/5=取消  
     * @param {number} AddChip 加彩金額
     * @param {number} TotalUserChip 目前工單總籌碼，檯面數，本金
     * @param {number} TotalRewardValue 目前該工單總輸贏
     * @param {number} TotalBuyChipValue 目前該工單的總轉碼數
     * @param {number} TipsValue 小費金額
     * @param {string} Cmd 目前工單所處指令
     * @param {string} CmdResponseCode 指令回傳代碼(棄用)
     * @param {number} RequestAddChip 要求加彩金額      
     */

    /**
     * 投注資訊
     * 加彩與小費，類似投注行為
     * @typedef {Object} OrderInformation
     * @param {number} OrderSequence 投注異動操作流水號(只針對會員)
     * @param {string} OrderCmd 投注操作指令()            
     * @param {number} AddChip 電投加彩金額(只針對會員)
     * @param {number} Tips 小費金額(只針對會員)
     * @param {number} OrderBanker 庄投注額
     * @param {number} OrderPlayer 閑投注額
     * @param {number} OrderTie 和投注額
     * @param {string} OrderBankerPair 庄對投注額
     * @param {string} OrderPlayerPair 閑對投注額
     */

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
     * @typedef {APIResult} UserAccountBetLimitListResult
     * @param {UserAccountBetLimit[]} BetLimitList 會員帳號       
     */

    /**
     * 回傳，取得桌台資訊列表
     * @typedef {APIResult} TableInfoResult
     * @param {TableInfo[]} TableInfoList 桌台資訊列表            
     */

    /**
     * 回傳，單一桌台詳細資訊
     * @typedef {APIResult} TableInfoResult
     * @param {string} TableNumber 路單桌台號碼
     * @param {string} TableType BA=百家樂 (目前僅支援百家樂)
     * @param {number} BaccaratType 0=臨時路單/1=電投桌/2=快速電投桌/3=純網投桌
     * @param {number} UIType (0=貴賓廳樣式/1=現金網樣式)
     * @param {string[]} Currency 可用幣別
     * @param {CurrencyChipsList[]} TableChipsList 籌碼列表
     * @param {BetLimitInfoBaccarat[]} BetLimit 不同類型的桌台會套用不同的限紅資訊，目前應該是使用UserAccountBetLimitListResult
     * @param {StreamInfo[]} Stream 視頻串流列表     
     * @param {RoadMapImageInfo[]} ImageList 路單相關圖片列表
     * @param {string} Status "TableType" + "." + "Status"   
     * TableType 類型 (目前只有BA) 
     * BA=百家樂
     * Status 狀態碼
     * Close=關閉 ,Shuffling=洗牌, NoService=沒有服務, AccidentPending=事故暫停
     * @param {number} MagnifierType 0=關閉開牌放大鏡/1=啟動開牌放大鏡
     * @param {string} MagnifierSetting 放大鏡相關資訊 json String
     * ex {"x":0.5025,"y":0.62,"w":0.3475,"h":0.18,"rate":1.5}
     * 使用canvas進行放大鏡功能，畫布大小位置=整個video
     * 資訊提共位置與放大比例，iphone => 從video串流，按照資訊繪製放大的結果，其他 => 直接參考video區塊，按照資訊繪製放大後的結果
     * 後續再提供相關程式碼     
     * 
     * @param {string} AreaCode 賭桌所在區域
     * @param {number} TableTimeoutSecond 賭桌設定的投注時間
     * @param {number} RemainingSecond 剩餘時間
     * @param {string} RoundInfo ex: 1543-12  靴號-局號  
     * @param {number} DrawCardAnimType 發牌效果顯示方式(0=關閉/1=單張顯示/2=2閒2庄)
     * @param {number} RoundState -1=尚未建立/0=新建/1=允許下注/2=停止下注/3=開牌結算/4=取消本局/5=暫停/6=本桌尚未準備好/7=本桌完場/8=本桌取消
     * @param {boolean} IsResultConfirm 最新一局的局開牌結果是否已經確認
     * @param {number} RoundID 目前局數的局數ID
     * @param {boolean} ReservedTable 是否是保留桌
     * @param {boolean} LastRound 是否已經最後一局
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
     * @param {string} CardInfo 開牌結果，已開牌=顯示本局，未開牌=顯示上一局
     * 共12個字元，每兩個字元為1張牌，共六張
     * 位置依序為，閒1-閒2-閒3-庄1-庄2-庄3
     * 000000000000
     * 第一個字元
     *      if (CColor == "1") { f1 = "club"; }
            else if (CColor == "2") { f1 = "diamond"; }
            else if (CColor == "3") { f1 = "heart"; }
            else if (CColor == "4") { f1 = "spade"; }
     * 第二個字元        
            if (CValue == "0") { f2 = "10"; }
            else if (CValue == "1") { f2 = "1"; }
            else if (CValue == "2") { f2 = "2"; }
            else if (CValue == "3") { f2 = "3"; }
            else if (CValue == "4") { f2 = "4"; }
            else if (CValue == "5") { f2 = "5"; }
            else if (CValue == "6") { f2 = "6"; }
            else if (CValue == "7") { f2 = "7"; }
            else if (CValue == "8") { f2 = "8"; }
            else if (CValue == "9") { f2 = "9"; }
            else if (CValue == "J") { f2 = "11"; }
            else if (CValue == "Q") { f2 = "12"; }
            else if (CValue == "K") { f2 = "13"; }
     * @param {string} CardInfoRound 開牌資訊的相關桌靴局號碼，
     * 格式 [TableNumber]-[ShowNumber]-[RoundNumber] 
     * ex.W1-123-1
     */

    /**
     * 回傳，單一桌台詳細資訊
     * @typedef {APIResult} QueryStatus
     * @param {string} TableInfo 相關桌靴局號碼，
     格式 [TableNumber]-[ShowNumber]-[RoundNumber] 
     * ex.W1-123-1
     * @param {string} CompanyChipsList 公司預設籌碼(棄用)
     * @param {QueryUserInfo} UserInfo 投注用戶資訊
     * @param {boolean} PADAvailable 電投手Pad是否已經入場
     * @param {number} CashUnit 商戶貨幣單位 0=萬/1=千/2=元
     * @param {number} AllowOrder 允許投注，(0=不允許/1=允許)
     * @param {number} AllowCancelOrder 允許投注後取消，(0=不允許/1=允許)
     * @param {string} EnablePinStreamName 空值=沒偵錯訊號，有值=訊號串流名稱
     * @param {number} OnlineUserCount 目前在線人數
     * @param {PeekingCardInfo} PeekingInfo   瞇牌資訊(棄用)
     * @param {GameSetOrderInfo} GameSetOrder 電投工單相關資訊
     * @param {OrderInformation} SelfOrder 當局的用戶個人投注資訊(當局)
     * 一個用戶針對一局，只會有一筆投注紀錄(1筆Order)
     * @param {OrderInformation} TableOrder 當局的桌台投注資訊(當局總計)
     * 只用到莊閑等投注額
    */

    //#endregion

    /**
      * 瞇牌(暫時棄用)
      * 
      * @param {string} CT 用戶Token
      * @param {string} GUID 請求驗證戳
      * @param {number} GameSetID 工單ID
      * @param {string} CurrencyType 幣別
      * @param {string} RoadMapNumber 路單桌台號碼(即桌號)
      * @param {number} ShoeNumber 靴
      * @param {number} RoundNumber 局
      * @param {string} CardId 撲克牌ID
      * @param {string} Action 動作 S=顯示，T=觸碰，M=移動，R=釋放
      * @param {number} x X軸
      * @param {number} y Y軸
      * @param {APIResultCB} cb  callback
      * 
      * cb 回傳結果
      * 
      * @callback APIResultCB
      * @param {boolean} success 請求本身成功,失敗
      * @param {APIResult} o //回傳資料   
      * @returns {void}
      * 
      * @description 
      * 瞇牌 
      *       
      * @returns {void}
      */
    SetPeekingCard(CT, GUID, GameSetID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, CardId, Action, x, y, cb) {
        this.EWinHub.invoke("SetPeekingCard", this.CT, this.GUID, GameSetID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, CardId, Action, x, y).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }


    /**
     * 訂閱桌台異動通知
     * 
     * @param {string} CT 用戶Token
     * @param {string} GUID 請求驗證戳
     * @param {string} RoadMapNumberList 桌台號碼(,串接 ex. w1,w2)
     * @param {APIResultCB} cb  callback
     * cb 回傳結果
     * @callback APIResultCB
     * @param {boolean} success 請求本身成功,失敗
     * @param {APIResult} o //回傳資料   
     * @returns {void}
     * 
     * 
     * @description 訂閱桌台異動通知 
     * 
     * @returns {void}
     */
    AddSubscribe(CT, GUID, RoadMapNumberList, cb) {
        this.EWinHub.invoke("AddSubscribe", this.CT, this.GUID, RoadMapNumberList).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
     * 清除所有桌台訂閱 
     * 
     * @param {string} CT 用戶Token
     * @param {string} GUID 請求驗證戳
     * @param {APIResultCB} cb  callback
     * cb 回傳結果
     * @callback APIResultCB
     * @param {boolean} success 請求本身成功,失敗
     * @param {APIResult} o //回傳資料   
     * @returns {void}
     * 
     * 
     * @description 清除所有桌台訂閱 
     * 
     * @returns {void}
     */
    ClearSubscribe(CT, GUID, cb) {
        this.EWinHub.invoke("ClearSubscribe", this.CT, this.GUID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }





    /**
    * 刷新桌台訂閱資訊 
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳
    * @param {number} GameSetID 工單ID
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} RefreshStreamType 串流種類，0=HD，1=SD
    * @param {APIResultCB} cb  callback
    * cb 回傳結果
    * @callback APIResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {APIResult} o //回傳資料   
    * @returns {void}
    * 
    * 
    * @description 刷新桌台訂閱資訊 
    * 
    * @returns {void}
    */
    RefreshSubscribe(CT, GUID, GameSetID, RoadMapNumber, RefreshStreamType, cb) {
        this.EWinHub.invoke("RefreshSubscribe", this.CT, this.GUID, GameSetID, RoadMapNumber, RefreshStreamType).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 針對桌台取得取得個人限紅資料，
    * 會另外針對桌限紅過濾。
    * (傳統電投沒有檯紅列表) 
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {string} CurrencyType 幣別
    * @param {number} GameSetID 工單ID
    * @param {UserAccountBetLimitListResultCB} cb  callback
    * cb 回傳結果
    * @callback UserAccountBetLimitListResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {UserAccountBetLimitListResult} o //回傳資料   
    * @returns {void}
    * 
    * 
    * @description 
    * 針對桌台取得取得個人限紅資料，
    * 會另外針對桌限紅過濾
    * (傳統電投沒有檯紅列表) 
    * 
    * @returns {void}
    */
    UserAccountGetBetLimitListByRoadMap(CT, GUID, DeviceGUID, RoadMapNumber, CurrencyType, GameSetID, cb) {
        this.EWinHub.invoke("UserAccountGetBetLimitListByRoadMap", this.CT, this.GUID, DeviceGUID, RoadMapNumber, CurrencyType, GameSetID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }


    /**
    * 取得會員個人限紅資料
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳
    * @param {string} CurrencyType 幣別    
    * @param {UserAccountBetLimitListResultCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback UserAccountBetLimitListResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {UserAccountBetLimitListResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 取得會員個人限紅資料
    *       
    * @returns {void}
    */

    UserAccountGetBetLimitList(CT, GUID, CurrencyType, cb) {
        this.EWinHub.invoke("UserAccountGetBetLimitList", this.CT, this.GUID, CurrencyType).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 設定會員目前使用限紅
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳    
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {string} CurrencyType 幣別
    * @param {number} GameSetID 工單ID
    * @param {string} BetLimitID 限紅ID
    * @param {APIResultCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback APIResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {APIResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 設定會員目前使用限紅 
    *       
    * @returns {void}
    */
    UserAccountSetBetLimit(CT, GUID, RoadMapNumber, CurrencyType, GameSetID, BetLimitID, cb) {
        this.EWinHub.invoke("UserAccountSetBetLimit", this.CT, this.GUID, RoadMapNumber, CurrencyType, GameSetID, BetLimitID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 清除目前使用限紅
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳    
    * @param {APIResultCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback APIResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {APIResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 清除目前使用限紅 
    *       
    * @returns {void}
    */
    UserAccountClearBetLimit(CT, GUID, cb) {
        this.EWinHub.invoke("UserAccountClearBetLimit", this.CT, this.GUID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 傳統電投，要求出碼
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳    
    * @param {string} ContactPhoneNumber 連絡電話
    * @param {number} GameSetInitChip 要求出碼金額
    * @param {string} Description 備註    
    * @param {APIResultCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback APIResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {APIResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 傳統電投，要求出碼 
    *       
    * @returns {void}
    */
    RequireEntry(CT, GUID, ContactPhoneNumber, GameSetInitChip, Description, cb) {
        this.EWinHub.invoke("RequireEntry", this.CT, this.GUID, ContactPhoneNumber, GameSetInitChip, Description).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 取得單一桌台詳細資訊
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳    
    * @param {string} RoadMapNumber 路單桌台號碼    
    * @param {number} GameSetID 工單ID    
    * @param {TableInfoResultCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback TableInfoResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {TableInfoResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 取得單一桌台詳細資訊 
    *       
    * @returns {void}
    */
    GetTableInfo(CT, GUID, RoadMapNumber, GameSetID, cb) {
        this.EWinHub.invoke("GetTableInfo", this.CT, this.GUID, RoadMapNumber, GameSetID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 離開桌台
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳    
    * @param {number} GameSetID 工單ID
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {APIResultCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback APIResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {APIResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 離開桌台 
    *       
    * @returns {void}
    */
    LeaveRoadMap(CT, GUID, GameSetID, RoadMapNumber, cb) {
        this.EWinHub.invoke("LeaveRoadMap", this.CT, this.GUID, GameSetID, RoadMapNumber).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 進入桌台
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳    
    * @param {number} GameSetID 工單ID
    * @param {string} CurrencyType 幣別
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {APIResultCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback APIResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {APIResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 進入桌台 ，請再進入遊戲頁前呼叫
    *       
    * @returns {void}
    */
    EntryRoadMap(CT, GUID, GameSetID, CurrencyType, RoadMapNumber, cb) {
        this.EWinHub.invoke("EntryRoadMap", this.CT, this.GUID, GameSetID, RoadMapNumber, CurrencyType).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 傳統電投下住
    * Type0 => 傳統電投
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳    
    * @param {number} GameSetID 工單ID
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} OrderSequence 投注異動操作流水號
    * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
    * @param {number} OrderBanker 庄投注
    * @param {number} OrderPlayer 閒投注
    * @param {number} OrderTie 和投注
    * @param {number} OrderBankerPair 庄對下注
    * @param {number} OrderPlayerPair 閒對下注
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 傳統電投下住
    * Type0 => 傳統電投 
    *       
    * @returns {void}
    */
    AddBetType0(CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderBanker, OrderPlayer, OrderTie, OrderBankerPair, OrderPlayerPair, cb) {
        this.EWinHub.invoke("AddBetType0", this.CT, this.GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderBanker, OrderPlayer, OrderTie, OrderBankerPair, OrderPlayerPair).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }



    /**
    * 快速電投下住
    * Type1 => 快速電投
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳     
    * @param {string} CurrencyType 幣別     
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} OrderSequence 投注異動操作流水號
    * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
    * @param {number} OrderBanker 庄投注
    * @param {number} OrderPlayer 閒投注
    * @param {number} OrderTie 和投注
    * @param {number} OrderBankerPair 庄對下注
    * @param {number} OrderPlayerPair 閒對下注
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 快速電投下住
    * Type1 => 快速電投 
    *       
    * @returns {void}
    */
    AddBetType1(CT, GUID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderBanker, OrderPlayer, OrderTie, OrderBankerPair, OrderPlayerPair, cb) {
        this.EWinHub.invoke("AddBetType1", this.CT, this.GUID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderBanker, OrderPlayer, OrderTie, OrderBankerPair, OrderPlayerPair).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 網投下注
    * Type2 => 網投
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳     
    * @param {string} CurrencyType 幣別     
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} OrderSequence 投注異動操作流水號
    * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
    * @param {number} OrderBanker 庄投注
    * @param {number} OrderPlayer 閒投注
    * @param {number} OrderTie 和投注
    * @param {number} OrderBankerPair 庄對下注
    * @param {number} OrderPlayerPair 閒對下注
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 網投下注
    * Type2 => 網投
    *        
    * @returns {void}
    */
    AddBetType2(CT, GUID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderBanker, OrderPlayer, OrderTie, OrderBankerPair, OrderPlayerPair, cb) {
        this.EWinHub.invoke("AddBetType2", this.CT, this.GUID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderBanker, OrderPlayer, OrderTie, OrderBankerPair, OrderPlayerPair).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }


    /**
    * 傳統電投取消下注
    * Type0 => 傳統電投
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳     
    * @param {number} GameSetID 幣別     
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} OrderSequence 投注異動操作流水號
    * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 傳統電投取消下注
    * Type0 => 傳統電投
    *        
    * @returns {void}
    */
    ClearBetType0(CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, cb) {
        this.EWinHub.invoke("ClearBetType0", this.CT, this.GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 快速電投取消下注
    * Type1 => 快速電投
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳           
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} OrderSequence 投注異動操作流水號
    * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 快速電投取消下注
    * Type1 => 快速電投
    *        
    * @returns {void}
    */
    ClearBetType1(CT, GUID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, cb) {
        this.EWinHub.invoke("ClearBetType1", this.CT, this.GUID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }
    /**
    * 網投取消下注
    * Type2 => 網投
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳     
    * @param {number} GameSetID 幣別     
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} OrderSequence 投注異動操作流水號
    * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 網投取消下注
    * Type2 => 網投
    *        
    * @returns {void}
    */
    ClearBetType2(CT, GUID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, cb) {
        this.EWinHub.invoke("ClearBetType2", this.CT, this.GUID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 傳統電投修改當局投注指令
    * Type0 => 傳統電投
    * 主要用來在注單記錄Cmd
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳     
    * @param {number} GameSetID 工單號碼     
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} OrderSequence 投注異動操作流水號
    * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
    * @param {string} OrderCmd 指令代碼 
    * Pass=飛牌/NextShoe=換靴/ChangeDealer=更換荷官/ContactMe=請聯繫我/  
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 傳統電投修改當局投注指令
    * Type0 => 傳統電投
    * 主要用來在注單記錄Cmd
    *        
    * @returns {void}
    */
    SetBetType0Cmd(CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderCmd, cb) {
        this.EWinHub.invoke("SetBetType0Cmd", this.CT, this.GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, OrderCmd).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 傳統電投，發送工單指令    
    * 完場跟加彩，請呼叫其他API
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳           
    * @param {number} GameSetID 工單ID
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {number} GameSetCmd 工單指令代碼 
    * Pause=暫停/Completed=完場/Continue=繼續
    * @param {APIResultCB} cb  callback
    *   
    * cb 回傳結果
    * @callback APIResultCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {APIResult} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 傳統電投，發送工單指令    
    * 完場跟加彩，請呼叫其他API
    * GameSetCmd 與 OrderCmd 差異，前者只影響單一用戶，一張工單。後者影響多張工單，整個桌台，多個用戶。
    * 
    * 
    * @returns {void}
    */
    SetGameSetCmd(CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, GameSetCmd, cb) {
        this.EWinHub.invoke("SetGameSetCmd", this.CT, this.GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, GameSetCmd).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
    * 傳統電投，清除(取消)指令    
    * 
    * @param {string} CT 用戶Token
    * @param {string} GUID 請求驗證戳     
    * @param {number} GameSetID 工單ID
    * @param {string} RoadMapNumber 路單桌台號碼
    * @param {number} ShoeNumber 靴號
    * @param {number} RoundNumber 局號
    * @param {QueryStatusCB} cb  callback
    * 
    * cb 回傳結果
    * 
    * @callback QueryStatusCB
    * @param {boolean} success 請求本身成功,失敗
    * @param {QueryStatus} o //回傳資料   
    * @returns {void}
    * 
    * @description 
    * 傳統電投，清除(取消)指令   
    *        
    * @returns {void}
    */
    ClearGameSetCmd(CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, cb) {
        this.EWinHub.invoke("ClearGameSetCmd", this.CT, this.GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
     * 傳統電投，給小費   
     * Type0 => 傳統電投
     * 
     * @param {string} CT 用戶Token
     * @param {string} GUID 請求驗證戳     
     * @param {string} GameSetID 工單ID
     * @param {string} RoadMapNumber 路單桌台號碼
     * @param {number} ShoeNumber 靴號
     * @param {number} RoundNumber 局號
     * @param {number} OrderSequence 投注異動操作流水號
     * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
     * @param {number} TipsValue 小費
     * @param {QueryStatusCB} cb  callback
     * 
     * cb 回傳結果
     * 
     * @callback QueryStatusCB
     * @param {boolean} success 請求本身成功,失敗
     * @param {QueryStatus} o //回傳資料   
     * @returns {void}
     * 
     * @description 
     * 傳統電投，給小費   
     * Type0 => 傳統電投
     *       
     * @returns {void}
     */
    AddTipsType0(CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, TipsValue, cb) {
        this.EWinHub.invoke("AddTipsType0", this.CT, this.GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, TipsValue).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
     * 快速電投，給小費   
     * Type1 => 快速電投
     * 
     * @param {string} CT 用戶Token
     * @param {string} GUID 請求驗證戳     
     * @param {string} CurrencyType 幣別
     * @param {string} RoadMapNumber 路單桌台號碼
     * @param {number} ShoeNumber 靴號
     * @param {number} RoundNumber 局號
     * @param {number} OrderSequence 投注異動操作流水號
     * 每次進入新桌台歸0重新計算，每一次異動時(投注、加注、取消)，往上+1
     * @param {number} TipsValue 小費
     * @param {QueryStatusCB} cb  callback
     * 
     * cb 回傳結果
     * 
     * @callback QueryStatusCB
     * @param {boolean} success 請求本身成功,失敗
     * @param {QueryStatus} o //回傳資料   
     * @returns {void}
     * 
     * @description 
     * 快速電投，給小費   
     * Type1 => 快速電投
     *       
     * @returns {void}
     */
    AddTipsType1(CT, GUID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, TipsValue, cb) {
        this.EWinHub.invoke("AddTipsType1", this.CT, this.GUID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, OrderSequence, TipsValue).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }



    /**
     * 傳統電投，加彩    
     * 
     * @param {string} CT 用戶Token
     * @param {string} GUID 請求驗證戳     
     * @param {string} GameSetID 工單ID
     * @param {string} RoadMapNumber 路單桌台號碼
     * @param {number} ShoeNumber 靴號
     * @param {number} RoundNumber 局號
     * @param {number} AddChipValue 局號
     * @param {QueryStatusCB} cb  callback
     * 
     * cb 回傳結果
     * 
     * @callback QueryStatusCB
     * @param {boolean} success 請求本身成功,失敗
     * @param {QueryStatus} o //回傳資料   
     * @returns {void}
     * 
     * @description 
     * 傳統電投，加彩    
     *        
     * @returns {void}
     */
    AddChip(CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, AddChipValue, cb) {
        this.EWinHub.invoke("AddChip", CT, GUID, GameSetID, RoadMapNumber, ShoeNumber, RoundNumber, AddChipValue).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    /**
     * 查詢該桌狀態(含投注)   
     * 會抓到該桌最新的靴局去做查詢
     * 
     * @param {string} CT 用戶Token
     * @param {string} GUID 請求驗證戳     
     * @param {string} GameSetID 工單ID
     * @param {string} RoadMapNumber 路單桌台號碼
     * @param {QueryStatusCB} cb  callback
     * 
     * cb 回傳結果
     * 
     * @callback QueryStatusCB
     * @param {boolean} success 請求本身成功,失敗
     * @param {QueryStatus} o //回傳資料   
     * @returns {void}
     * 
     * @description 
     * 查詢該桌狀態(含投注)   
     * 會抓到該桌最新的靴局去做查詢
     *        
     * @returns {void}
     */
    Query(CT, GUID, GameSetID, RoadMapNumber, cb) {
        this.EWinHub.invoke("Query", CT, GUID, GameSetID, RoadMapNumber).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    };


    //#endregion

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

        //var conn = $.hubConnection();

        if (this.EWinUrl != null)
            this.conn.url = this.EWinUrl + "/signalr";
        else
            this.conn.url = "/signalr";

        this.EWinHub = this.conn.createHubProxy("EWinGame.Baccarat");
        this.EWinHub.on("NotifyMsg", this.serverMsg.bind(this));



        this.conn.disconnected(function () {
            setTimeout(function () {
                connectServer(this.conn);
            }, 1000);
        });

        this.conn.stateChanged(function (state) {
            //state.oldState
            this.currentState = state.newState;
        });

        this.conn.reconnected(function () {
            if (this.onReconnected != null)
                this.onReconnected();
        });

        this.conn.reconnecting(function () {
            if (this.onReconnecting != null)
                this.oinReconnecting();
        });

        connectServer(this.conn, { onConnected: this.onConnected, onDisconnect: this.onDisconnect });
    }

    getJSON(text) {
        let obj = JSON.parse(text);

        if (obj) {
            if (obj.hasOwnProperty('d')) {
                return obj.d;
            } else {
                return obj;
            }
        }
    }

    //#region Server推送通知 (onReceive)

    //Server推送通知 (onReceive)

    /**
     * 通知，參數基本Basic
     * @typedef {Object} NotifyMsgArgInheritsBase
     */

    //Basic
    /**
     * 通知目前設計為通知Client端，
     * 做對應Type相關資料的刷新，
     * 僅推送撈取用的鍵值
     * 通知，資料結構
     * 
     * @typedef {Object} NotifyMsg
     * @param {string} Id Timestamp-Rnd
     * @param {string} Type 通知類型
     * @param {NotifyMsgArgInheritsBase} Args 工單狀態，-1=尚未建立(暫存)/0=建立/1=進行中/2=暫停/3=完場/4=結算完成/5=取消
     */

    //#region Args種類

    //Type=HeartBeat
    /**
    * HeartBeat
    * @typedef {NotifyMsgArgInheritsBase} HeartBeatArg
    * @param {string} Echo Echo
    */

    //Type=GreatRoad
    /**
    * 好路通知
    * @typedef {NotifyMsgArgInheritsBase} GreatRoadArg
    * @param {string} TableNumber 桌號
    */

    //Type=GuestEntry
    /**
    * 有玩家進入桌台(可忽略)
    * @typedef {NotifyMsgArgInheritsBase} GuestEntryArg
    * @param {string} TableNumber 桌號
    * @param {number} GameSetID 工單號碼
    */

    //Type=GuestLeave
    /**
    * 有玩家離開桌台(可忽略)
    * @typedef {NotifyMsgArgInheritsBase} GuestLeaveArg
    * @param {string} TableNumber 桌號
    * @param {number} GameSetID 工單號碼
    */

    //Type=GameSetChange
    /**
    * 工單狀態改變
    * @typedef {NotifyMsgArgInheritsBase} GameSetChangeArg
    * @param {number} GameSetID 工單號碼
    */

    /**
    * 投注狀態改變
    * @typedef {NotifyMsgArgInheritsBase} BetChangeArg
    * @param {string} TableNumber 桌號
    */


    /**
    * 桌台狀態改變
    * @typedef {NotifyMsgArgInheritsBase} TableChangeArg
    * @param {string} TableNumber 桌號
    */


    /**
    * 瞇牌資訊推送
    * 僅有最高投注的人可瞇牌，其他人根據最高投注者的操作去同步資訊]
    * @typedef {NotifyMsgArgInheritsBase} PeekingCardArg
    * @param {string} TableNumber 桌號
    * @param {string} Action 動作 S=顯示，T=觸碰，M=移動，R=釋放
    * @param {string} GameSetID 工單號
    * @param {string} CurrencyType 幣別
    * @param {string} CardId 撲克牌ID
    * @param {number} TouchX 觸摸(起始)的x位置
    * @param {number} TouchY 觸摸(起始)的y位置
    * @param {number} MoveX 移動的x位置
    * @param {number} MoveY 移動的y位置
    */

    //#endregion


    //#endregion

    serverMsg(msg) {
        let o = this.getJSON(msg);

        //o的資料結構，可參考上方

        if (o != null) {
            if (this.onReceive != null)
                this.onReceive(o);
        }
    }


    static getInstance(CT, eWinUrl) {
        let Ret;

        if (EWinGameBaccaratClient.instance) {
            Ret = EWinGameBaccaratClient.instance;
        } else {
            if (CT) {
                // this.instance = new EWinGameBaccaratClient(CT, eWinUrl);
                EWinGameBaccaratClient.instance = new EWinGameBaccaratClient(CT, eWinUrl);
                Ret = EWinGameBaccaratClient.instance;
            } else {
                Ret = null;
            }
        }

        return Ret;
    }
}

