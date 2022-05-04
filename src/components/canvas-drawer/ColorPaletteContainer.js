import React from 'react';

const ColorPaletteConatiner = (props) => {

    React.useEffect(()=>{

    }, []);

    return (
        <section id="colors-container" className="context-popup colors-container">
            <div className="input-div">
                <label htmlFor="stroke-style">Stroke Style:</label>
                <input id="stroke-style" type="color" value="#6c96c8" onChange={ (e)=>console.log(e)}/>
            </div>

            <div className="input-div">
                <label htmlFor="fill-style">Fill Style:</label>
                <input id="fill-style" type="color" value="#ffffff" onChange={ (e)=>console.log(e)}/>
            </div>
            <div id="colors-done" className="btn-007">Done</div>
        </section>
    )
}

export default ColorPaletteConatiner;
