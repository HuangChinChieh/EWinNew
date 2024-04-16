const initGameBaccarState = {
    isGameBaccarLoading: true,
    userBetlimitList: [],
    isFavorited: false,
    roadMapNumber: ''
}


export const gameBaccarReducer = (state = initGameBaccarState, action) => {
    switch (action.type) {
        case 'IS_GAME_BACCAR_LOADING':
            return {
                ...state,
                isGameBaccarLoading: action.payload.isGameBaccarLoading
            }
        case 'USER_BET_LIMIT_LIST':
            return {
                ...state,
                userBetlimitList: action.payload.userBetlimitList
            }
        case 'IS_FAVORITED':
            return {
                ...state,
                isFavorited: action.payload.isFavorited
            }
        case 'ROADMAP_NUMBER':
            return {
                ...state,
                roadMapNumber: action.payload.roadMapNumber
            }
        default:
            return state;
    }
}
