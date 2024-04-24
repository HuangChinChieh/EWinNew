import React from 'react';
import ReactDOM from 'react-dom/client';
import store from 'store/store';
import 'local/i18n';
import { LanguageProvider } from 'hooks';
import { Provider } from 'react-redux';

import { CookiesProvider } from 'react-cookie';

import 'global_css/default.css';
import 'global_css/grid.css';
import 'global_css/media.css';
import Layout from 'layout';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <LanguageProvider>
          <CookiesProvider defaultSetOptions={{ path: '/' }}>
            <Layout />
          </CookiesProvider>
        </LanguageProvider>    
    </Provider>  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




