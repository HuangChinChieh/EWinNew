﻿import { hubConnection } from 'signalr-no-jquery';
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

    // 獲取使用者資料
    GetUserInfo(CT, GUID, cb) {
        // console.log('Calling GetUserInfo method...');
        this.EWinHub.invoke("GetUserInfo", CT, GUID).done(function (o) {
            console.log('GetUserInfo response:', o);
            if (cb) {
                cb(o);
            }
        }).fail(function (err) {
            console.error('GetUserInfo failed:', err);
            if (cb) {
                cb(null);
            }
        });
    }


    // 取得會員特定資料(獲取我的最愛)
    GetUserAccountProperty(CT, GUID, PropertyName, cb) {
        this.EWinHub.invoke("GetUserAccountProperty", CT, GUID, PropertyName).done(function (o) {
            console.log('GetUserAccountProperty response:', o);
            if (cb) {
                cb(o);
            }
        }).fail(function (err) {
            console.error('GetUserAccountProperty failed:', err);
            if (cb) {
                cb(null);
            }
        })
    }

    // 設定會員特定資料
    SetUserAccountProperty(CT, GUID, PropertyName, PropertyValue, cb) {
        this.EWinHub.invoke("SetUserAccountProperty", CT, GUID, PropertyName, PropertyValue).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    RemoveUserAccountProperty(CT, GUID, PropertyName, cb) {
        this.EWinHub.invoke("RemoveUserAccountProperty", CT, GUID, PropertyName).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // 設定會員多個特定資料 
    UpdateProperty(CT, GUID, PS, cb) {
        this.EWinHub.invoke("UpdateProperty", CT, GUID, PS).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // 設定會員裝置資訊
    UpdateDeviceInfo(CT, GUID, DeviceGUID, PushType, DeviceName, DeviceKey, DeviceType, NotifyToken, GPSPosition, UserAgent, cb) {
        this.EWinHub.invoke("UpdateDeviceInfo", CT, GUID, DeviceGUID, PushType, DeviceName, DeviceKey, DeviceType, NotifyToken, GPSPosition, UserAgent).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    // 獲取首頁相關桌台資訊
    GetTableInfoList(CT, GUID, AreaCode, GameSetID, cb) {
        // console.log('Calling GetTableInfoList method...');
        this.EWinHub.invoke("GetTableInfoList", CT, GUID, AreaCode, GameSetID).done(function (o) {
            // console.log('webClient', o)
            if (cb) {
                cb(o);
            }
        }).fail(function (err) {
            console.error('GetTableInfoList failed:', err);
            if (cb) {
                cb(null);
            }
        });
    }



    GetSIDParam(CT, GUID, ParamName, cb) {
        this.EWinHub.invoke("GetSIDParam", CT, GUID, ParamName).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    SetSIDParam(CT, GUID, ParamName, ParamValue, cb) {
        this.EWinHub.invoke("SetSIDParam", CT, GUID, ParamName, ParamValue).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }


    SetPeekingCard(CT, GUID, GameSetID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, CardId, Action, x, y, cb) {
        this.EWinHub.invoke("SetPeekingCard", CT, GUID, GameSetID, CurrencyType, RoadMapNumber, ShoeNumber, RoundNumber, CardId, Action, x, y).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }


    SetGameSetID = function (CT, GUID, GameSetID, cb) {
        this.EWinHub.invoke("SetGameSetID", CT, GUID, GameSetID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    AddSubscribe(CT, GUID, RoadMapNumberList, ResetSubscribe, cb) {
        this.EWinHub.invoke("AddSubscribe", CT, GUID, RoadMapNumberList, ResetSubscribe).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    ClearSubscribe(CT, GUID, cb) {
        this.EWinHub.invoke("ClearSubscribe", CT, GUID).done(function (o) {
            if (cb)
                cb(true, o);
        }).fail(function (err) {
            if (cb)
                cb(false, err);
        });
    }

    RefreshSubscribe(CT, GUID, GameSetID, RoadMapNumber, StreamType, cb) {
        this.EWinHub.invoke("RefreshSubscribe", CT, GUID, GameSetID, RoadMapNumber, StreamType).done(function (o) {
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
