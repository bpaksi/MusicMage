import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router} from 'react-router-dom'

import './index.css';
import App from './components/app';
import Store from './state/store'

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router><Provider store={Store}><App /></Provider></Router>, document.getElementById('root'));
registerServiceWorker();
