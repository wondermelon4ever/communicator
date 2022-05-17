import React from 'react';
import { onOptionsChanged } from '../DrawHelper';
import '../../canvas-drawer-widget.css';
import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../mevent/MeventDispatcher';

const LineWidthContainer = (props) => {

    const [lineWidth, setLineWidth] = React.useState(5);
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });

    React.useEffect(()=>{
        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.LINE_WIDTH_ICON_CLICKED, (mevent)=>{
            var tooldiv = document.getElementById(mevent.value.toolIconId);
            var rect = tooldiv.getClientRects()[0];
            setOpen(!open);
            setPosition({
                left: (rect.x + 1) + 'px',
                top: (rect.y+rect.height+4) + 'px'
            });
            props.controlOpen("lineWidthContainer");
        });
        apply();
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
