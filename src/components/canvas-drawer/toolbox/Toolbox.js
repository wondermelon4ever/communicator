import React from 'react';
import '../canvas-drawer-widget.css';

const Toolbox = (props) => {

    const [shows, setShows] = React.useState({
        pencil: props.shows.pencil,
        marker: props.shows.marker,
        eraser: props.shows.eraser,
        text: props.shows.text,
        image: props.shows.image,
        pdf: props.shows.pdf,
        dragLastPath: props.shows.dragLastPath,
        dragAllPath: props.shows.dragAllPath,
        line: props.shows.line,
        arrow: props.shows.arrow,
        zoomIn: props.shows.zoomIn,
        zoomOut: props.shows.zoomOut,
        arc: props.shows.arc,
        rectangle: props.shows.rectangle,
        quadraticCurve: props.shows.quadraticCurve,
        bezierCurve: props.shows.bezierCurve,
        undo: props.shows.undo,
        lineWidth: props.shows.lineWidth,
        colors: props.shows.colors,
        additional: props.shows.additional
    });

    const [direction, setDirection] = React.useState("vertical");

    React.useEffect(()=>{

    }, []);

    return (
        <section id="tool-box" className="tool-box">
            {/* <canvas id="pencil-icon" 
                    width="40" 
                    height="40" 
                    title="Pancil" 
                    style={{ 
                        display: shows.pencil ? "block" : "none" 
                    }}></canvas> */}
            {/* <IconPencil id="pencil-icon" show={ true }/> */}

            {/* <canvas id="marker-icon" 
                    width="40" 
                    height="40" 
                    title="Marker"
                    style={{ 
                        display: shows.marker ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="eraser-icon" 
                    width="40" 
                    height="40" 
                    title="Erase drawings"
                    style={{ 
                        display: shows.eraser ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="text-icon" 
                    width="40" 
                    height="40" 
                    title="Write text"
                    style={{ 
                        display: shows.text ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="image-icon" 
                    width="40" 
                    height="40" 
                    title="Add image"
                    style={{ 
                        display: shows.image ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="pdf-icon" 
                    width="40" 
                    height="40" 
                    title="Add pdf"
                    style={{ 
                        display: shows.pdf ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="drag-last-path" 
                    width="40" 
                    height="40" 
                    title="Drag/move last path"
                    style={{ 
                        display: shows.dragLastPath ? "block" : "none" 
                    }}></canvas> */}
            {/* <canvas id="drag-all-paths" 
                    width="40" 
                    height="40" 
                    title="Drag/move all paths"
                    style={{ 
                        display: shows.dragAllPath ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="line" 
                    width="40" 
                    height="40" 
                    title="Draw Lines"
                    style={{ 
                        display: shows.line ? "block" : "none" 
                    }}></canvas> */}
            {/* <canvas id="arrow" 
                    width="40" 
                    height="40" 
                    title="Draw Arrows"
                    style={{ 
                        display: shows.arrow ? "block" : "none" 
                    }}></canvas> */}

            <canvas id="zoom-up" 
                    width="40" 
                    height="40" 
                    title="Zoon-In"
                    style={{ 
                        display: shows.zoomIn ? "block" : "none" 
                    }}></canvas>

            <canvas id="zoom-down" 
                    width="40" 
                    height="40" 
                    title="Zoom-Out"
                    style={{ 
                        display: shows.zoomOut ? "block" : "none" 
                    }}></canvas>

            {/* <canvas id="arc" 
                    width="40" 
                    height="40" 
                    title="Arc"
                    style={{ 
                        display: shows.arc ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="rectangle" 
                    width="40" 
                    height="40" 
                    title="Rectangle"
                    style={{ 
                        display: shows.rectangle ? "block" : "none" 
                    }}></canvas> */}

            <canvas id="quadratic-curve" 
                    width="40" 
                    height="40" 
                    title="Quadratic curve"
                    style={{ 
                        display: shows.quadraticCurve ? "block" : "none" 
                    }}></canvas>

            <canvas id="bezier-curve" 
                    width="40" 
                    height="40" 
                    title="Bezier curve"
                    style={{ 
                        display: shows.bezierCurve ? "block" : "none" 
                    }}></canvas>

            <canvas id="undo" 
                    width="40" 
                    height="40" 
                    title="Undo: Remove recent shapes"
                    style={{ 
                        display: shows.undo ? "block" : "none" 
                    }}></canvas>

            {/* <canvas id="line-width" 
                    width="40" 
                    height="40" 
                    title="Set line-width"
                    style={{ 
                        display: shows.lineWidth ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="colors" 
                    width="40" 
                    height="40" 
                    title="Set foreground and background colors"
                    style={{ 
                        display: shows.colors ? "block" : "none" 
                    }}></canvas> */}

            {/* <canvas id="additional" 
                    width="40" 
                    height="40" 
                    title="Extra options"
                    style={{ 
                        display: shows.additional ? "block" : "none" 
                    }}></canvas> */}
        </section>
    )
}

export default Toolbox;
