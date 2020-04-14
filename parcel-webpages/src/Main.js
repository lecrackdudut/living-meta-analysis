import React from "react";
import ReactDOM from 'react-dom';
import HelloMessage from './App';

let node = document.querySelector("#root");

ReactDOM.render(<HelloMessage name="Jacek" />, node);