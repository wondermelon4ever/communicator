import React from 'react';
import { onOptionsChanged } from '../DrawHelper';
import '../../canvas-drawer-widget.css';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../mevent/MeventDispatcher';

const ColorPaletteConatiner = (props) => {

    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });
    const [strokeStyle, setStrokeStyle] = React.useState("#6c96c8");
    const [fillStyle, setFillStyle] = React.useState("#ffffff");

    React.useEffect(()=>{
        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.COLOR_PALETTE_ICON_CLICKED, (mevent)=>{
            var tooldiv = document.getElementById(mevent.value.toolIconId);
            var rect = tooldiv.getClientRects()[0];
            setOpen(!open);
            setPosition({
                left: (rect.x + 1) + 'px',
                top: (rect.y+rect.height+4) + 'px'
            });
            props.controlOpen("colorPaletteContainer");
        });
        apply();
    }, []);

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleStrokeStyleChanged = (e) => {
        setStrokeStyle(e.target.value);
    }

    const handleFillStyle = (e) => {
        setFillStyle(e.target.value);
    }

    const apply = () => {
        setOpen(false);
        onOptionsChanged({
            strokeStyle: strokeStyle,
            fillStyle: fillStyle
        });
    }

    return (
        <section 
            id="colors-container" 
            className="context-popup colors-container"
            style={{ 
                display: open ? "block": "none",
                top: position.top,
                left: position.left 
            }}
        >
            <div className="input-div">
                <label htmlFor="stroke-style">Stroke Style:</label>
                <input id="stroke-style" type="color" value={ strokeStyle } onChange={ handleStrokeStyleChanged }/>
            </div>

            <div className="input-div">
                <label htmlFor="fill-style">Fill Style:</label>
                <input id="fill-style" type="color" value={ fillStyle } onChange={ handleFillStyle }/>
            </div>
            <div id="colors-done" className="btn-007" onClick={ apply }>Done</div>
        </section>
    )
}

export default ColorPaletteConatiner;
