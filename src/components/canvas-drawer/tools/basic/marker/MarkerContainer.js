import React from 'react';
import '../../../canvas-drawer-widget.css';
import {
    addEvent,
    colors,
    find,
    getContext,
    hexToRGBA,
    hideContainers
} from '../../../util/Utils';
import { onMarkerOptionsChanged } from './MarkerHandler';
import ColorPaletteAsTable from '../../../common/widgets/palette/ColorPaletteAsTable';
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

const MarkerContainer = (props) => {

    const [open, setOpen] = React.useState(props.open);
    const [info, setInfo] = React.useState({
       thickness: 12,
       color: "FF0000" 
    });
    const [paletteOpen, setPaletteOpen] = React.useState(false);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });

    var alpha = 0.7;
    React.useEffect(()=>{
        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.MARKER_ICON_DOUBLE_CLICKED, (mevent)=>{
            var tooldiv = document.getElementById(mevent.value.toolIconId);
            var rect = tooldiv.getClientRects()[0];
            setOpen(!open);
            setPosition({
                left: (rect.x + 1) + 'px',
                top: (rect.y+rect.height+4) + 'px'
            });
            props.controlOpen("markerContainer");
        });

        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.MARKER_TOOL_INITED, (mevent)=>{
            onMarkerOptionsChanged({
                markerLineWidth: info.thickness,
                markerStrokeStyle: hexToRGBA(info.color, alpha),
                fillStyle: 'rgba(0,0,0,0)',
                globalAlpha: alpha,
                globalCompositeOperation: 'source-over',
                lineCap: 'round',
                font: '15px "Arial',
                lineJoin: 'round'
            });
        });
    }, []);

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleThicknessChanged = (e) => {
        setInfo({
            ...info,
            thickness: e.target.value
        });
    }

    const handleColorChanged = (selectedColor) => {
        setInfo({
            ...info,
            color: selectedColor
        });

        setPaletteOpen(false);        
    }

    const applyChange = () => {
        setOpen(false);
        setPaletteOpen(false);
        onMarkerOptionsChanged({
            markerLineWidth: info.thickness,
            markerStrokeStyle: hexToRGBA(info.color, alpha)
        });
    }

    const showPalatte = () => {
        setPaletteOpen(true);
    }

    return (
        <section 
            id="marker-container" 
            className="context-popup colors-container" 
            style={{ 
                display: open ? "block" : "none",
                top: position.top,
                left: position.left  
            }}
        >
            <div className="input-div">
                <label htmlFor="marker-stroke-style">Thickness:</label>
                <select id="marker-stroke-style" value={ info.thickness } onChange={ handleThicknessChanged }>
                {
                    thicknessOptions.map(opt => 
                        <option key={ opt.value } value={ opt.value }>{ opt.label }</option>
                    )
                }
                </select>
            </div>
            <div className="input-div" id='marker-color-container'>
                <label htmlFor="marker-fill-style">Fill Color:</label>
                <div id="marker-selected-color" className='context-popup' style={{ backgroundColor: "#" + info.color }} onClick={ showPalatte }></div>
                <ColorPaletteAsTable 
                    id="marker-colors-list" 
                    prefix="marker"
                    colors={ colors } 
                    colorSelected={ handleColorChanged }
                    curColor= { info.color }
                    open={ paletteOpen }
                />
            </div>
            <div id="marker-done" className="btn-007" onClick={ applyChange }>Done</div>
        </section>
    );
}

export default MarkerContainer;
