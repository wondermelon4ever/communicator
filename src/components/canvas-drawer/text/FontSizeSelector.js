import React from 'react';
import { onFontSizeChanged } from './TextHandler';

const fontSizeList = [ "8", "9", "10", "11", "12", "14", "15", "16", "18", "20", "24", "28", "32", "36", "40", "44", "48", "54", "60", "72" ]

const FontSizeSelector = (props) => {

    const [fontSize, setFontSize] = React.useState("15");

    const handleFontSizeChange = (index) => {
        setFontSize(fontSizeList[index]);
        onFontSizeChanged(fontSizeList[index]);
    }

    React.useEffect(()=>{

    }, []);

    return (
        <ul className="fontSizeUl" 
            style={{ 
                display: "none", 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "50px", 
                textAlign: "center" 
            }}
        >
            {
                fontSizeList.map((size, index)=>{
                    return(
                        <li key={ index } onClick={ ()=>handleFontSizeChange(index) }>{ size }</li>
                    )
                })
            }
        </ul>
    )
}

export default FontSizeSelector;
