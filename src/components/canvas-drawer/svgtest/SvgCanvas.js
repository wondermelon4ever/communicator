import React from 'react';
import LineEdgeCircle from './LineEdgeCircle';
import LineWithCircleVertex from './LineWithCircleVertex';
import Rectangle from './Rectangle';
// import Shape from './Shape';

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
                <Rectangle 
                    id="Rectangle-01"
                    position={{
                        x: 300,
                        y: 300
                    }}
                    rx={5}
                    ry={5}
                    width={100}
                    height={100}
                    stroke="black"
                    strokeOpacity={0.7}
                    strokeWidth={2}
                    fill="yellow"
                    fillOpacity="0.7"
                    title="sample rectangle"
                />
            </svg>
            
        </>
    )
}

export default SvgCanvas;
