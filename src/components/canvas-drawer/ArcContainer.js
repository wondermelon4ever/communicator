import React from 'react';
import './canvas-drawer-widget.css';

const ArcContainer = (props) => {

    React.useEffect(()=>{

    }, []);

    return(
        <section id="arc-range-container" className="arc-range-container">
            <input id="arc-range" className="arc-range" type="text" value="2" onChange={ (e)=>console.log(e)}/>
            <input type="checkbox" id="is-clockwise" checked className="allow-select" onChange={ (e)=>console.log(e)}/>
            <label htmlFor="is-clockwise">Clockwise?</label>
            <div className="arc-range-container-guide">Use arrow keys ↑↓</div>
        </section>
    )
}

export default ArcContainer;
