import { generateUUIDv4 } from 'utils/guid';

const initGameLobbyState = {
    ewinurl: 'https://ewin.dev.mts.idv.tw',
    ct: '',
    guid: generateUUIDv4(),
    echo: 'test_echo',
    isGameLobbyLoading: true,
    tiList: [],
    userInfo: [],
    favos: [],
    shoeResults: ''
}

export const gameLobbyReducer = (state = initGameLobbyState, action) => {
    switch (action.type) {
        case 'EWIN_URL':
            return {
                ...state,
                ewinurl: action.payload.ewinurl
            }
        case 'CT':
            return {
                ...state,
                ct: action.payload.ct
            }
        case 'GUID':
            return {
                ...state,
                guid: action.payload.guid
            }
        case 'ECHO':
            return {
                ...state,
                echo: action.payload.echo
            }
        case 'IS_GAME_LOBBY_LOADING':
            return {
                ...state,
                isGameLobbyLoading: action.payload.isGameLobbyLoading
            }
        case 'TILIST':
            return {
                ...state,
                tiList: action.payload.tiList
            }
        case 'USERINFO':
            return {
                ...state,
                userInfo: action.payload.userInfo
            }
        case 'FAVO':
            return {
                ...state,
                favo: action.payload.favo
            }
        case 'SHOE_RESULTS':
            return {
                ...state,
                shoeResults: action.payload.shoeResults
            }
        default:
            return state;
    }
}