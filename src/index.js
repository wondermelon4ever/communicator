import React from 'react';
import ReactDOM from 'react-dom';
import Communicator from './Communicator';
import CanvasDrawerWidget from './components/canvas-drawer/CanvasDrawerWidget';

const rootElement = document.getElementById('root');

ReactDOM.render(<CanvasDrawerWidget />, rootElement);
