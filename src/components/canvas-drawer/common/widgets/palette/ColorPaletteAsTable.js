import React from 'react';
import '../../../canvas-drawer-widget.css';

const ColorPaletteAsTable = (props) => {

    const [color, setColor] = React.useState(props.curColor);

    const handleOnClick = (e) => {
        var elColor = e.target.getAttribute('data-color');
        setColor(elColor);
        props.colorSelected(elColor);
    }

    const handleMouseOver = (e) => {
        setColor(e.target.getAttribute('data-color'));
    }

    return (
        <div id={ props.prefix + "-fill-colors"} className='context-popup' style={{ display: props.open === true ? "block" : "none" }}>
            <div className="top">
                <div id={ props.prefix+"-selected-color-2" } style={{ backgroundColor: "#"+color }}></div>
                <input id={ props.prefix + "-fill-style" } type="text" value={ color } onChange={ (e)=>console.log(e)} />
            </div>
            <table id={ props.id } >
                <tbody>
                {
                props.colors.map((colorsRow, index) => {
                    return (
                        <tr key={index}>
                            {
                                colorsRow.map((color, idx)=>{
                                    return(
                                        <td 
                                            key={ idx }
                                            style={{ 
                                                backgroundColor: "#"+color 
                                            }} 
                                            data-color={ color } 
                                            onMouseOver={ handleMouseOver }
                                            onClick={ handleOnClick }>
                                        </td>
                                    )
                                })
                            }
                        </tr>
                    )
                })
                }
                </tbody>
            </table>
        </div>
    )
}

export default ColorPaletteAsTable;
