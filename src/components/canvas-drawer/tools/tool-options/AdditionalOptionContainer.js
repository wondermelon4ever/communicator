import React from 'react';
import { onOptionsChanged } from '../DrawHelper';
import '../../canvas-drawer-widget.css';

import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../mevent/MeventDispatcher';

const AdditionalOptionContainier = (props) => {

    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });

    const [lineCap, setLineCap] = React.useState("round");
    const [lineJoin, setLineJoin] = React.useState("round");
    const [globalAlpha, setGlobalAlpha] = React.useState("1");
    const [globalCompositeOperation, setGlobalCompositeOperation] = React.useState("source-over");

    React.useEffect(()=>{
        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.ADDITIONAL_OPTION_ICON_CLICKED, (mevent)=>{
            var tooldiv = document.getElementById(mevent.value.toolIconId);
            var rect = tooldiv.getClientRects()[0];
            setOpen(!open);
            setPosition({
                left: (rect.x + 1) + 'px',
                top: (rect.y+rect.height+4) + 'px'
            });
            props.controlOpen("additionalOptionContainer");
        });
        apply();
    }, []);

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleLineCapChanged = (e) => {
        setLineCap(e.target.value);
    }

    const handleLineJoinChanged = (e) => {
        setLineJoin(e.target.value);
    }

    const handleGlobalAlphaChanged = (e) => {
        setGlobalAlpha(e.target.value);
    }

    const handleGlobalCompositeOperation = (e) => {
        setGlobalCompositeOperation(e.target.value);
    }

    const apply = () => {
        setOpen(false);
        onOptionsChanged({
            lineCap: lineCap,
            lineJoin: lineJoin,
            globalAlpha: globalAlpha,
            globalCompositeOperation: globalCompositeOperation
        });
    }

    return (
        <section 
            id="additional-container" 
            className="context-popup additional-container"
            style={{ 
                display: open ? "block": "none",
                top: position.top,
                left: position.left 
            }}
        >
            <div>
                <label htmlFor="lineCap-select">Line Cap:</label>
                <select id="lineCap-select" value={ lineCap } onChange={ handleLineCapChanged }>
                    <option value="round">round</option>
                    <option value="butt">butt</option>
                    <option value="square">square</option>
                </select>
            </div>
            <div>
                <label htmlFor="lineJoin-select">Line Join:</label>
                <select id="lineJoin-select" value={ lineJoin } onChange={ handleLineJoinChanged }>
                    <option value="round">round</option>
                    <option value="bevel">bevel</option>
                    <option value="miter">miter</option>
                </select>
            </div>

            <div>
                <label htmlFor="globalAlpha-select">globalAlpha:</label>
                <select id="globalAlpha-select" value={ globalAlpha } onChange={ handleGlobalAlphaChanged }>
                    <option value="1.0">1.0</option>
                    <option value="0.9">0.9</option>
                    <option value="0.8">0.8</option>
                    <option value="0.7">0.7</option>
                    <option value="0.6">0.6</option>
                    <option value="0.5">0.5</option>
                    <option value="0.4">0.4</option>
                    <option value="0.3">0.3</option>
                    <option value="0.2">0.2</option>
                    <option value="0.1">0.1</option>
                    <option value="0.0">0.0</option>
                </select>
            </div>

            <div>
                <label htmlFor="globalCompositeOperation-select">globalCompositeOperation:</label>
                <select id="globalCompositeOperation-select" value={ globalCompositeOperation } onChange={ handleGlobalCompositeOperation }>
                    <option value="source-atop">source-atop</option>
                    <option value="source-in">source-in</option>
                    <option value="source-out">source-out</option>
                    <option value="source-over">source-over</option>
                    <option value="destination-atop">destination-atop</option>
                    <option value="destination-in">destination-in</option>
                    <option value="destination-out">destination-out</option>
                    <option value="destination-over">destination-over</option>
                    <option value="lighter">lighter</option>
                    <option value="copy">copy</option>
                    <option value="xor">xor</option>
                </select>
            </div>
            <div id="additional-close" className="btn-007" onClick={ apply }>Done</div>
        </section>
    )
}

export default AdditionalOptionContainier;
