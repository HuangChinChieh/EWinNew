export const demostate = (demoState) => ({
    type: 'DEMO_STATE',
    payload: { demoState }
});


// 收藏相關
export const toggleFavorite = (TableNumber) => async (dispatch, getState) => {
    // const isFavorite = getState().root.favorites.includes(gameId);

    dispatch({
        type: 'TOGGLE_FAVORITE',
        payload: { TableNumber },
    });

    // 在這裡可以執行其他異步操作（例如 API 請求），之後調整
    // ...


    return Promise.resolve();
};

// 顯示收藏訊息
export const showMessage = (message) => ({
    type: 'SHOW_MESSAGE',
    payload: { message }
});

// 靜音相關
export const toggleMute = (TableNumber) => ({
    type: 'TOGGLE_MUTE',
    payload: { TableNumber },
});
// 遊戲標題相關
export const getGameTitle = (TableNumber) => ({
    type: 'GAME_TITLE',
    payload: TableNumber
});
// 獲取代幣ID
export const setDefaultChipsId = (chipsId) => ({
    type: 'SET_DEFAULT_CHIPS_ID',
    payload: chipsId,
});
// 獲取投注狀態的ID
export const checkClickChipsId = (clickChipsId) => ({
    type: 'CHECK_CLICK_CHIPS_ID',
    payload: clickChipsId
})
// 獲取控制項下注次數
// export const setCheckNumberOfClick = (numberOfClick) => ({
//     type: 'CHECK_NUMBER_OF_CLICK',
//     payload: numberOfClick
// })

// 獲取控制項1下注次數
export const setCheckNumberOfClick1 = (numberOfClick1) => ({
    type: 'CHECK_NUMBER_OF_CLICK1',
    payload: numberOfClick1
})

// 獲取控制項2下注次數
export const setCheckNumberOfClick2 = (numberOfClick2) => ({
    type: 'CHECK_NUMBER_OF_CLICK2',
    payload: numberOfClick2
})

// 獲取控制項3下注次數
export const setCheckNumberOfClick3 = (numberOfClick3) => ({
    type: 'CHECK_NUMBER_OF_CLICK3',
    payload: numberOfClick3
})

// 獲取控制項4下注次數
export const setCheckNumberOfClick4 = (numberOfClick4) => ({
    type: 'CHECK_NUMBER_OF_CLICK4',
    payload: numberOfClick4
})

// 獲取控制項5下注次數
export const setCheckNumberOfClick5 = (numberOfClick5) => ({
    type: 'CHECK_NUMBER_OF_CLICK5',
    payload: numberOfClick5
})

// 秒數相關
export const setSeconds = (seconds) => ({
    type: 'SECONDS',
    payload: seconds
})

// 抓取倒數的初始值, 此值餵給 animation 做倒數讀秒
export const setFirstSeconds = (firstSeconds) => ({
    type: 'FIRSTSECONDS',
    payload: firstSeconds
})

// 啟用動畫1
export const setIsAnimationActive1 = (isActive) => ({
    type: 'SET_IS_ANIMATION_ACTIVE1',
    payload: isActive,
});

// 啟用動畫2
export const setIsAnimationActive2 = (isActive) => ({
    type: 'SET_IS_ANIMATION_ACTIVE2',
    payload: isActive,
});

// 啟用動畫3
export const setIsAnimationActive3 = (isActive) => ({
    type: 'SET_IS_ANIMATION_ACTIVE3',
    payload: isActive,
});

// 啟用動畫4
export const setIsAnimationActive4 = (isActive) => ({
    type: 'SET_IS_ANIMATION_ACTIVE4',
    payload: isActive,
});

// 啟用動畫5
export const setIsAnimationActive5 = (isActive) => ({
    type: 'SET_IS_ANIMATION_ACTIVE5',
    payload: isActive,
});

//cancel 相關

// 優化這塊試試,這邊優化後會出錯,要再研究一下
// export const setTotalChips = (num, totalChips) => ({
//     type: 'SET_TOTAL_CHIPS',
//     payload: { num, totalChips },
// });

// 計算區塊1的總投注額
export const setTotalChips1 = (totalChips1) => ({
    type: 'SET_TOTAL_CHIPS1',
    payload: totalChips1,
})
// 計算區塊2的總投注額
export const setTotalChips2 = (totalChips2) => ({
    type: 'SET_TOTAL_CHIPS2',
    payload: totalChips2,
})
// 計算區塊3的總投注額
export const setTotalChips3 = (totalChips3) => ({
    type: 'SET_TOTAL_CHIPS3',
    payload: totalChips3,
})
// 計算區塊4的總投注額
export const setTotalChips4 = (totalChips4) => ({
    type: 'SET_TOTAL_CHIPS4',
    payload: totalChips4,
})
// 計算區塊5的總投注額
export const setTotalChips5 = (totalChips5) => ({
    type: 'SET_TOTAL_CHIPS5',
    payload: totalChips5,
})
// 區塊1 focus效果判斷
export const setIsAct1 = (isAct1) => ({
    type: 'SET_IS_ACT1',
    payload: isAct1
})
// 區塊2 focus效果判斷
export const setIsAct2 = (isAct2) => ({
    type: 'SET_IS_ACT2',
    payload: isAct2
})
// 區塊3 focus效果判斷
export const setIsAct3 = (isAct3) => ({
    type: 'SET_IS_ACT3',
    payload: isAct3
})
// 區塊4 focus效果判斷
export const setIsAct4 = (isAct4) => ({
    type: 'SET_IS_ACT4',
    payload: isAct4
})
// 區塊5 focus效果判斷
export const setIsAct5 = (isAct5) => ({
    type: 'SET_IS_ACT5',
    payload: isAct5
})
// 代幣選擇後控制
export const setDefaultClick = (defaultClick) => ({
    type: 'SET_DEFAULT_CLICK',
    payload: defaultClick
})