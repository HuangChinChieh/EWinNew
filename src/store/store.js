import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { rootReducer, demoReducer } from './reducers';
import { gameLobbyReducer } from './gameLobbyReducers';
import { gameBaccarReducer } from './gameBaccarReducers';

const store = configureStore({
    reducer: {
        root: rootReducer,
        demo: demoReducer,
        gameLobby: gameLobbyReducer,
        gameBaccar: gameBaccarReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});


export default store;