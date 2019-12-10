import React from 'react';
import ReactDOM from 'react-dom';
import Container from './components/root/container/container';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import './index.css';
import {IntlProvider, addLocaleData} from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import messages_en from "../src/translation/en.json";
import 'babel-polyfill';
import 'es6-symbol';
import {isIE, isEdge, isFirefox, isSafari} from 'react-device-detect';

if(isIE || isEdge || isFirefox){
    require('./ie.css');
}

//Remove all consoles in one way

addLocaleData([...locale_en]);
const messages = {
    'en': messages_en
}

const info = document.querySelector('meta[name="user-access"]').getAttribute('content');
const userData = JSON.parse(info);
//userData.menuAccess = "SM#ST#PS#PLA";
userData.menuAccess = userData.menuAccess && userData.menuAccess.split("#");
const store = configureStore(userData);
ReactDOM.render(<Provider store={store}><IntlProvider locale='en' messages={messages['en']}><Container /></IntlProvider></Provider>,
document.getElementById('root'));
