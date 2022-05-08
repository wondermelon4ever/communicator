import React from 'react';
import { onOptionsChanged } from '../helpers/DrawHelper';
import '../../canvas-drawer-widget.css';
import {
    addEvent,
    colors,
    find,
    getContext,
    hexToRGBA,
    hideContainers
} from '../../util/Utils';

const LineWidthContainer = (props) => {

    const [lineWidth, setLineWidth] = React.useState(2);
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });

    const toolIconId = props.toolIconId == undefined ? "line-width" : props.toolIconId;
    React.useEffect(()=>{
        var canvas = document.getElementById(toolIconId);
        addEvent(canvas, 'click', function() {
            setOpen(!open);
            setPosition({
                top: (canvas.offsetTop + 1) + 'px',
                left: (canvas.offsetLeft + canvas.clientWidth) + 'px'
            });
            props.controlOpen("lineWidthContainer");
        });
        return (()=>{

        });
    }, []);

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleLineWidthChanged = (e) => {
        setLineWidth(e.target.value);
    }

    const apply = () => {
        setOpen(false);
        onOptionsChanged({
            lineWidth: lineWidth
        });
    }

    return (
        <section 
            id="line-width-container" 
            className="context-popup"
            style={{ 
                display: open ? "block": "none",
                top: position.top,
                left: position.left 
            }}
        >
            <label htmlFor="line-width-text">Line Width:</label>
            <input id="line-width-text" 
                   className="line-width-text" 
                   type="text" 
                   value={ lineWidth } 
                   onChange={ handleLineWidthChanged }
            />
            <div id="line-width-done" className="btn-007" onClick={ apply }>Done</div>
        </section>
    )
}

export default LineWidthContainer;
