import React from 'react';
import ReactDOM from 'react-dom';
import Communicator from './Communicator';
// import CanvasDrawerWidget from './components/canvas-drawer/CanvasDrawerWidget';
import SvgCanvas from './components/canvas-drawer/svgtest/SvgCanvas';

const rootElement = document.getElementById('root');

// ReactDOM.render(<CanvasDrawerWidget />, rootElement);
ReactDOM.render(<SvgCanvas />, rootElement);
