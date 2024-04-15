// GameLobby相關
export const actEwinurl = (ewinurl) => ({
    type: 'EWIN_URL',
    payload: { ewinurl }
})

export const actCT = (ct) => ({
    type: 'CT',
    payload: { ct }
})

export const actGUID = (guid) => ({
    type: 'GUID',
    payload: { guid }
})

export const actIsGameLobbyLoading = (isGameLobbyLoading) => ({
    type: 'IS_GAME_LOBBY_LOADING',
    payload: { isGameLobbyLoading }
})

export const actTilist = (tiList) => ({
    type: 'TILIST',
    payload: { tiList }
})

export const actUserInfo = (userInfo) => ({
    type: 'USERINFO',
    payload: { userInfo }
})

export const actFavo = (favo) => ({
    type: 'FAVO',
    payload: { favo }
})

export const actShoeResults = (shoeResults) => ({
    type: 'SHOE_RESULTS',
    payload: { shoeResults }
})