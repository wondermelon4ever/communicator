import React from 'react';
import '../canvas-drawer-widget.css';
import FontSelector from './FontSelector';
import FontSizeSelector from './FontSizeSelector';
import ColorPaletteAsTable from '../palette/ColorPaletteAsTable';
import { onTextOptionsChanged } from './TextHandler';
import {
    addEvent,
    colors,
    find,
    getContext,
    hexToRGBA,
    hideContainers
} from '../util/Utils';

const fontList = [
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana"
]

const fontSizeList = [ "8", "9", "10", "11", "12", "14", "15", "16", "18", "20", "24", "28", "32", "36", "40", "44", "48", "54", "60", "72" ]

const TextContainer = (props) => {

    const [open, setOpen] = React.useState(props.open);
    const [info, setInfo] = React.useState({
        font: "Arial",
        fontSize: "15",
        color: "000000"
    });
    const [paletteOpen, setPaletteOpen] = React.useState(false);
    const [position, setPosition] = React.useState({
        top: "0px",
        left: "0px"
    });

    const toolIconId = props.toolIconId == undefined ? "text-icon" : props.toolIconId;
    var alpha = 0.2;
    React.useEffect(()=>{
        var canvas = document.getElementById(toolIconId);
        addEvent(canvas, 'dblclick', function() {
            setOpen(!open);
            setPosition({
                top: (canvas.offsetTop + 1) + 'px',
                left: (canvas.offsetLeft + canvas.clientWidth) + 'px'
            });
            props.controlOpen("textContainer");
        });
        return (()=>{

        });
    }, []);

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleFontChanged = (e) => {
        setInfo({
            ...info,
            font: e.target.value
        });
    }

    const handleFontSizeChanged = (e) => {
        setInfo({
            ...info,
            fontSize: e.target.value
        });
    }

    const handleTextColorChanged = (selectedColor) => {
        setInfo({
            ...info,
            color: selectedColor
        });

        setPaletteOpen(false);
    }

    const applyChange = () => {
        setOpen(false);
        setPaletteOpen(false);
        onTextOptionsChanged({
            font: info.font,
            fontSize: info.fontSize,
            // textColor: hexToRGBA(info.color, alpha)
            textColor:info.color
        });
    }

    const showPalatte = () => {
        setPaletteOpen(true);
    }

    return (
       <section 
            id="text-container" 
            className="context-popup colors-container" 
            style={{ 
                display: open ? "block": "none",
                top: position.top,
                left: position.left 
            }}
        >
            <div className="input-div">
                <label htmlFor="text-font">Font Kind:</label>
                <select id="text-font" value={ info.font } onChange={ handleFontChanged } >
                    {fontList.map((font, index) => {
                        return(
                            <option key={ index } value={ font }>{ font }</option>
                        )
                    })}
                </select>
            </div>
            <div className="input-div">
                <label htmlFor="text-font-size">Font Size:</label>
                <select id="text-font-size" value={ info.fontSize } onChange={ handleFontSizeChanged } >
                    {fontSizeList.map((fontSize, index) => {
                        return (
                            <option key={ index } value={ fontSize }>{ fontSize }</option>
                        )
                    })}
                </select>
            </div>
            <div className="input-div" id='text-color-container'>
                <label htmlFor="text-fill-style">Text Color:</label>
                <div 
                    id="text-selected-color" 
                    className='context-popup' 
                    style={{ 
                        backgroundColor: "#" + info.color, 
                    }} 
                    onClick={ showPalatte }></div>
                <ColorPaletteAsTable 
                    id="text-colors-list" 
                    prefix="text"
                    colors={ colors } 
                    colorSelected={ handleTextColorChanged }
                    curColor= { info.color }
                    open={ paletteOpen }
                />
            </div>
            <div id="text-done" className="btn-007" onClick={ applyChange }>Done</div>
        </section>
    )
}

export default TextContainer;