import React from 'react';

const FontSelector = (props) => {

    React.useEffect(()=>{

    }, []);

    return (
        <ul className="fontSelectUl" style={{ display: "none", position: "absolute", top: 0, left: 0, width: "166px" }}>
            <li>Arial</li>
            <li>Arial Black</li>
            <li>Comic Sans MS</li>
            <li>Courier New</li>
            <li>Georgia</li>
            <li>Tahoma</li>
            <li>Times New Roman</li>
            <li>Trebuchet MS</li>
            <li>Verdana</li>
        </ul>
    )
}

export default FontSelector;
