export const actIsGameBaccarLoading = (isGameBaccarLoading) => ({
    type: 'IS_GAME_BACCAR_LOADING',
    payload: { isGameBaccarLoading }
})

export const actUserBetlimitList = (userBetlimitList) => ({
    type: 'USER_BET_LIMIT_LIST',
    payload: { userBetlimitList }
})

export const actIsFavorited = (isFavorited) => ({
    type: 'IS_FAVORITED',
    payload: { isFavorited }
})