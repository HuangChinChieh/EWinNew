import React from 'react';
import ReactDOM from 'react-dom/client';
import 'local/i18n';

import { CookiesProvider } from 'react-cookie';

import 'global_css/default.css';
import 'global_css/grid.css';
import 'global_css/media.css';
import Routers from 'routers';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Routers />
    </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




