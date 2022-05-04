import React from 'react';
import '../canvas-drawer-widget.css';
import {
    addEvent
} from '../util/Utils';
import { listenEraserOptionsChanged } from './EraserHandler';

const thicknessOptions = [
    { label: 8,  value: 8  },
    { label: 9,  value: 9  },
    { label: 10, value: 10 },
    { label: 11, value: 11 },
    { label: 12, value: 12 },
    { label: 14, value: 14 },
    { label: 16, value: 16 },
    { label: 18, value: 18 },
    { label: 20, value: 20 },
    { label: 22, value: 22 },
    { label: 24, value: 24 },
    { label: 26, value: 26 },
    { label: 28, value: 28 },
    { label: 30, value: 30 },
    { label: 36, value: 36 },
    { label: 48, value: 48 },
    { label: 72, value: 72 },
];

const EraserContainer = (props) => {

    const [open, setOpen] = React.useState(props.open);
    const [thickness, setThickness] = React.useState(20);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });

    const toolIconId = props.toolIconId == undefined ? "eraser-icon" : props.toolIconId;
    var alpha = 0.2;
    React.useEffect(()=>{
        var canvas = document.getElementById(toolIconId);
        addEvent(canvas, 'dblclick', function() {
            setOpen(!open);
            setPosition({
                top: (canvas.offsetTop + 1) + 'px',
                left: (canvas.offsetLeft + canvas.clientWidth) + 'px'
            });
            props.controlOpen("eraserContainer");
        });
        return (()=>{

        });
    }, []);

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleThicknessChanged = (e) => {
        setThickness(e.target.value);
    }

    const applyChange = () => {
        setOpen(false);
        listenEraserOptionsChanged({
            eraserLineWidth: thickness
        });
    }

    return (
        <section 
            id="eraser-container" 
            className="context-popup colors-container" 
            style={{ 
                display: open ? "block" : "none",
                top: position.top,
                left: position.left  
            }}
        >
            <div className="input-div">
                <label htmlFor="eraser-stroke-style">Thickness:</label>
                <select id="eraser-stroke-style" value={ thickness } onChange={ handleThicknessChanged }>
                {
                    thicknessOptions.map(opt => 
                        <option key={ opt.value } value={ opt.value }>{ opt.label }</option>
                    )
                }
                </select>
            </div>
            <div id="marker-done" className="btn-007" onClick={ applyChange }>Done</div>
        </section>
    );
}

export default EraserContainer;