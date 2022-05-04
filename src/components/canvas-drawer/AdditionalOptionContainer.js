import React from 'react';

const AdditionalOptionContainier = (props) => {

    React.useEffect(()=>{

    }, []);

    return (
        <section id="additional-container" className="context-popup additional-container">
            <div>
                <label htmlFor="lineCap-select">Line Cap:</label>
                <select id="lineCap-select" value="round" onChange={(e)=>console.log(e)}>
                    <option value="round">round</option>
                    <option value="butt">butt</option>
                    <option value="square">square</option>
                </select>
            </div>
            <div>
                <label htmlFor="lineJoin-select">Line Join:</label>
                <select id="lineJoin-select" value="round" onChange={(e)=>console.log(e)}>
                    <option value="round">round</option>
                    <option value="bevel">bevel</option>
                    <option value="miter">miter</option>
                </select>
            </div>

            <div>
                <label htmlFor="globalAlpha-select">globalAlpha:</label>
                <select id="globalAlpha-select" value="0.7" onChange={(e)=>console.log(e)}>
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
                <select id="globalCompositeOperation-select" value="source-over" onChange={(e)=>console.log(e)}>
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
            <div id="additional-close" className="btn-007">Done</div>
        </section>
    )
}

export default AdditionalOptionContainier;
