

// 這邊是個參數的init值設定

const initialState = {
    favorites: [],
    showMessage: '',
    message: '',
    mutes: [],
    showMuteMessage: '',
    gameTitle: '',
    defaultChipsId: 0,
    clickChipsId: '',
    numberOfClick: 0,
    numberOfClick1: 0,
    numberOfClick2: 0,
    isAnimationActive1: false,
    isAnimationActive2: false,
    isAnimationActive3: false,
    isAnimationActive4: false,
    isAnimationActive5: false,
    seconds: 20,
    firstSeconds: 20,
    totalChips: 0,
    totalChips1: 0,
    totalChips2: 0,
    totalChips3: 0,
    totalChips4: 0,
    totalChips5: 0,
    isAct1: '',
    isAct2: '',
    isAct3: '',
    isAct4: '',
    isAct5: '',
    defaultClick: 'show',

};

const initDemoState = {
    demoState: 0 // demo state 初始值為0
}

export const demoReducer = (state = initDemoState, action) => {
    switch (action.type) {
        case 'DEMO_STATE':
            return {
                ...state,
                demoState: action.payload.demoState
            }
        default:
            return state;
    }
}


// 目前需要傳遞資料的事件不多, 所以都寫在 rootReducer裡面, 如果事件變多, 最好拆分多個 reducer 比較好管理

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        // case 'TOGGLE_FAVORITE':  // 收藏相關
        //     const { TableNumber } = action.payload;
        //     const isFavorite = state.favorites.includes(TableNumber);
        //     const showMessage = isFavorite
        //         ? `移除收藏: ${TableNumber}`
        //         : `已收藏: ${TableNumber}`;

        //     const existingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];


        //     // // 這邊寫法每次收藏都會清空再把新的收藏餵進去
        //     // const newFavorites = isFavorite
        //     //     ? state.favorites.filter((id) => id !== TableNumber)
        //     //     : [...state.favorites, TableNumber];

        //     // // 更新 favorites 狀態並將其寫入 localStorage
        //     // localStorage.setItem('favorites', JSON.stringify(newFavorites));


        //     return {
        //         ...state,
        //         // favorites: newFavorites,
        //         showMessage,
        //     };

        // 顯示tips相關訊息
        case 'SHOW_MESSAGE':
            return {
                ...state,
                message: action.payload.message
            }

        case 'TOGGLE_MUTE': // 靜音相關
            const { TableNumber: muteGameId } = action.payload;
            const isMuted = state.mutes.includes(muteGameId);
            const newMutes = isMuted
                ? state.mutes.filter((id) => id !== muteGameId)
                : [...state.mutes, muteGameId];

            // 更新 newMutes 狀態並將其寫入 localStorage
            localStorage.setItem('mutes', JSON.stringify(newMutes));

            return {
                ...state,
                mutes: newMutes,
                // showMuteMessage
            };

        case 'GAME_TITLE': // 遊戲標題相關
            localStorage.setItem('gameTitle', action.payload)
            return {
                ...state,
                TableNumber: action.payload
            }

        case 'SET_DEFAULT_CHIPS_ID': // 獲取代幣ID
            return {
                ...state,
                defaultChipsId: action.payload,
            };

        case 'CHECK_CLICK_CHIPS_ID': // 獲取投注狀態的ID
            return {
                ...state,
                clickChipsId: action.payload,
            }

        // case 'CHECK_NUMBER_OF_CLICK': // 獲取下注次數
        //     return {
        //         ...state,
        //         numberOfClick: action.payload,
        //     }

        case 'CHECK_NUMBER_OF_CLICK1': // 獲取控制項1下注次數
            return {
                ...state,
                numberOfClick1: action.payload,
            }

        case 'CHECK_NUMBER_OF_CLICK2': // 獲取控制項2下注次數
            return {
                ...state,
                numberOfClick2: action.payload,
            }

        case 'CHECK_NUMBER_OF_CLICK3': // 獲取控制項3下注次數
            return {
                ...state,
                numberOfClick3: action.payload,
            }

        case 'CHECK_NUMBER_OF_CLICK4': // 獲取控制項4下注次數
            return {
                ...state,
                numberOfClick4: action.payload,
            }

        case 'CHECK_NUMBER_OF_CLICK5': // 獲取控制項5下注次數
            return {
                ...state,
                numberOfClick5: action.payload,
            }

        case 'SECONDS': // 秒數相關
            return {
                ...state,
                seconds: action.payload,
            }

        case 'FIRSTSECONDS': // 抓取倒數的初始值, 此值餵給 animation 做倒數讀秒
            return {
                ...state,
                firstSeconds: action.payload,
            }
        // 啟用動畫1
        case 'SET_IS_ANIMATION_ACTIVE1':
            return {
                ...state,
                isAnimationActive1: action.payload,
            };
        // 啟用動畫2
        case 'SET_IS_ANIMATION_ACTIVE2':
            return {
                ...state,
                isAnimationActive2: action.payload,
            };
        // 啟用動畫3
        case 'SET_IS_ANIMATION_ACTIVE3':
            return {
                ...state,
                isAnimationActive3: action.payload,
            };
        // 啟用動畫4
        case 'SET_IS_ANIMATION_ACTIVE4':
            return {
                ...state,
                isAnimationActive4: action.payload,
            };
        // 啟用動畫5
        case 'SET_IS_ANIMATION_ACTIVE5':
            return {
                ...state,
                isAnimationActive5: action.payload,
            };
        //cancel 相關

        // 優化這塊試試,這邊優化後會出錯,要再研究一下
        // case 'SET_TOTAL_CHIPS':
        //     const { num, totalChips } = action.payload;
        //     return {
        //         ...state,
        //         [`totalChips${num}`]: totalChips,
        //     };


        // 計算區塊1的總投注額
        case 'SET_TOTAL_CHIPS1':
            return {
                ...state,
                totalChips1: action.payload,
            }
        // 計算區塊2的總投注額
        case 'SET_TOTAL_CHIPS2':
            return {
                ...state,
                totalChips2: action.payload,
            }
        // 計算區塊3的總投注額
        case 'SET_TOTAL_CHIPS3':
            return {
                ...state,
                totalChips3: action.payload,
            }
        // 計算區塊4的總投注額
        case 'SET_TOTAL_CHIPS4':
            return {
                ...state,
                totalChips4: action.payload,
            }
        // 計算區塊5的總投注額
        case 'SET_TOTAL_CHIPS5':
            return {
                ...state,
                totalChips5: action.payload,
            }
        // 區塊1 focus效果判斷
        case 'SET_IS_ACT1':
            return {
                ...state,
                isAct1: action.payload
            }
        // 區塊2 focus效果判斷
        case 'SET_IS_ACT2':
            return {
                ...state,
                isAct2: action.payload
            }
        // 區塊3 focus效果判斷
        case 'SET_IS_ACT3':
            return {
                ...state,
                isAct3: action.payload
            }
        // 區塊4 focus效果判斷
        case 'SET_IS_ACT4':
            return {
                ...state,
                isAct4: action.payload
            }
        // 區塊5 focus效果判斷
        case 'SET_IS_ACT5':
            return {
                ...state,
                isAct5: action.payload
            }

        // 代幣選擇後控制
        case 'SET_DEFAULT_CLICK':
            return {
                ...state,
                defaultClick: action.payload
            }

        default:
            return state;
    }
};





// export default rootReducer;

