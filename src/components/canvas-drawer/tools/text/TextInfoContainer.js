import React from 'react';
import '../../canvas-drawer-widget.css';

const TextInfoContainer = (props) => {

    React.useEffect(()=>{

    }, []);

    return (
        <div 
            id="text-infobox"
            className="fontSelectUl"
            style={{ 
                display: "none", 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "250px",
            }}
        >
        </div>
    )
}

export default TextInfoContainer; 