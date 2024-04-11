import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { rootReducer, demoReducer, gameLobbyReducer } from './reducers';


const store = configureStore({
    reducer: {
        root: rootReducer,
        demo: demoReducer,
        gameLobby: gameLobbyReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});


export default store;