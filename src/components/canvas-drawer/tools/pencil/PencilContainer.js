import React from 'react';
import '../../canvas-drawer-widget.css';
import {
    addEvent,
    colors,
    find,
    getContext,
    hexToRGBA,
    hideContainers
} from '../../util/Utils';

import { onPencilOptionsChanged } from './PencilHandler';
import ColorPaletteAsTable from '../../common/palette/ColorPaletteAsTable';

const thicknessOptions = [
    { label: 1,  value: 1  },
    { label: 2,  value: 2  },
    { label: 3,  value: 3  },
    { label: 4,  value: 4  },
    { label: 5,  value: 5  },
    { label: 6,  value: 6  },
    { label: 7,  value: 7  },
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
    { label: 36, value: 36 },
    { label: 48, value: 48 },
    { label: 72, value: 72 },
];

const PencilContainer = (props) => {

    const [open, setOpen] = React.useState(props.open);
    const [info, setInfo] = React.useState({
        thickness: 5,
        color: "6699FF"
    });
    const [paletteOpen, setPaletteOpen] = React.useState(false);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });
    
    const toolIconId = props.toolIconId == undefined ? "pencil-icon" : props.toolIconId;
    var alpha = 0.2;

    React.useEffect(()=>{
        var canvas = document.getElementById(toolIconId);
        addEvent(canvas, 'dblclick', function() {
            setOpen(!open);
            setPosition({
                top: (canvas.offsetTop + 1) + 'px',
                left: (canvas.offsetLeft + canvas.clientWidth) + 'px'
            });
            props.controlOpen("pencilContainer");
        });
        return (()=>{

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

    const showPalatte = () => {
        setPaletteOpen(true);
    }

    const applyChange = () => {
        setOpen(false);
        setPaletteOpen(false);
        onPencilOptionsChanged({
            pencilLineWidth: info.thickness,
            pencilStrokeStyle: hexToRGBA(info.color, alpha)
        });
    }

    return (
        <section 
            id="pencil-container" 
            className="context-popup colors-container" 
            style={{ 
                display: open ? "block": "none",
                top: position.top,
                left: position.left 
            }}
        >
            <div className="input-div">
                <label htmlFor="pencil-stroke-style">Thickness:</label>
                <select id="pencil-stroke-style" value={ info.thickness } onChange={ handleThicknessChanged } >
                    {
                    thicknessOptions.map(opt => 
                        <option key={ opt.value } value={ opt.value }>{ opt.label }</option>
                    )
                    }
                </select>
            </div>
            <div className="input-div" id='pencil-color-container'>
                <label htmlFor="pencil-fill-style">Fill Color:</label>
                <div id="pencil-selected-color" className='context-popup' style={{ backgroundColor: "#" + info.color }} onClick={ showPalatte }></div>
                <ColorPaletteAsTable 
                    id="pencil-colors-list" 
                    prefix="pencil"
                    colors={ colors } 
                    colorSelected={ handleColorChanged }
                    curColor= { info.color }
                    open={ paletteOpen }
                />
            </div>
            <div id="pencil-done" className="btn-007" onClick={ applyChange }>Done</div>
        </section>
    )
}

export default PencilContainer;
