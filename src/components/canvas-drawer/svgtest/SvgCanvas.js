import React from 'react';
import LineEdgeCircle from './LineEdgeCircle';
import LineWithCircleVertex from './LineWithCircleVertex';

const commands = [
    ["Line", [50, 50], [300, 100]]   
];
const SvgCanvas = (props) => {
    
    return (
        <>
            <div>
                DEMO for SVG DRAWING
            </div>
            <svg width="1000" height="690">
                <LineWithCircleVertex 
                    lid="Line-1"
                    command={ commands[0] }
                    stroke="black"
                    strokeWidth="1"
                    fill="none"
                />
            </svg>
        </>
    )
}

export default SvgCanvas;
