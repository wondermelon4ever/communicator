import React from 'react';
import '../../../canvas-drawer-widget.css';

import { listenEraserOptionsChanged } from './EraserHandler';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

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
    const [thicknessOpen, setThicknessOpen] = React.useState(true);
    const [thickness, setThickness] = React.useState(20);
    const [manner, setManner] = React.useState("free");
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });

    var alpha = 0.2;
    React.useEffect(()=>{
        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.ERASER_ICON_DOUBLE_CLICKED, (mevent)=>{
            var tooldiv = document.getElementById(mevent.value.toolIconId);
            var rect = tooldiv.getClientRects()[0];
            setOpen(!open);
            setPosition({
                left: (rect.x + 1) + 'px',
                top: (rect.y+rect.height+4) + 'px'
            });
            props.controlOpen("eraserContainer");
        });
    }, []);

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleThicknessChanged = (e) => {
        setThickness(e.target.value);
    }

    const handleMannerChanged = (e) => {
        if("scope" === e.target.value) {
            setManner("scope");
            setThicknessOpen(false);
        } else {
            setManner("free");
            setThicknessOpen(true);
        }
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
            <div style={{ width: 143, margin: 0, padding: 0 }}>
                <fieldset style={{ margin: 1, padding: 1, border: '1px solid #E5E5E5' }}>
                    <legend>&nbsp;&nbsp;Select manner:</legend>
                    <div>
                        <label htmlFor="free">&nbsp;&nbsp;By free</label>
                        <input 
                            style={{ margin: 0, padding: 0, width: 30 }} 
                            type="radio" id="free" name="erase-manner" value="free" defaultChecked
                            onChange={ handleMannerChanged }
                        />
                    </div>
                    <div>
                        <label htmlFor="scope">&nbsp;&nbsp;By scope</label>
                        <input 
                            style={{ margin: 0, padding: 0, width: 30 }} 
                            type="radio" id="scope" name="erase-manner" value="scope"
                            onChange={ handleMannerChanged }
                        />
                    </div>
                </fieldset>
            </div>
            
            <div className="input-div" style={{ display: thicknessOpen ? "block" : "none", paddingTop: 5 }}>
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