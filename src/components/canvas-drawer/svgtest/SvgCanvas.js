import React from 'react';
import LineEdgeCircle from './LineEdgeCircle';

const commands = [
    ["Line", [100, 100], [300, 100]]   
];
const SvgCanvas = (props) => {
    
    return (
        <div>
            <div>
                DEMO for SVG DRAWING
            </div>
            <svg width="1000" height="1000">
                <LineEdgeCircle 
                    commands={ commands }
                    stroke="black"
                    strokeWidth="1"
                    fill="none"
                />
            </svg>
        </div>
    )
}

export default SvgCanvas;