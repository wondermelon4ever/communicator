import React from 'react';
import '../canvas-drawer-widget.css';
import { onFontChanged } from './TextHandler';

const fontList = [
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
];

const FontSelector = (props) => {

    const [font, setFont] = React.useState("Arial");

    React.useEffect(()=>{

    }, []);

    const handleFontChanged = (index) => {
        setFont(fontList[index]);
        onFontChanged(fontList[index]);
    }

    return (
        <ul className="fontSelectUl" 
            style={{ 
                display: "none", 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "166px" 
            }}
        >
            {
                fontList.map((font, index)=>{
                    return(
                        <li key={ index } onClick={ ()=>handleFontChanged(index) }>{ font }</li>
                    )
                })
            }
        </ul>
    )
}

export default FontSelector;
