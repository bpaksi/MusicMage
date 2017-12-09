import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './nav/navBar';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <NavBar />, 
    document.getElementById('root'));

registerServiceWorker();
