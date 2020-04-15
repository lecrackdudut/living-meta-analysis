import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


if(document.getElementById('page-1')) {
    console.log("page1")
    ReactDOM.render(
        <App page="1" />,
        document.getElementById('page-1')
    );
}

if(document.getElementById('page-2')) {
    console.log("page2")
    ReactDOM.render(
        <App page="2" />,
        document.getElementById('page-2')
    );
}

