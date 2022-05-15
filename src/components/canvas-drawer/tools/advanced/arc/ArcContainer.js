import React from 'react';
import '../../../canvas-drawer-widget.css';
import { onArcRangeKeyDowned, onIsClockwiseChanged } from './ArcHandler';

const ArcContainer = (props) => {

    const [arcRange, setArcRange] = React.useState(1);
    const [isClockwise, setIsClockwise] = React.useState(false);

    React.useEffect(()=>{
        
    }, []);

    const handleIsClockwiseChanged = (e) => {
        onIsClockwiseChanged(!isClockwise);
        setIsClockwise(!isClockwise);
    }

    const handleKeydown = (e) => {
        // var key = e.keyCode;
        // if (key == 39 || key == 40) setArcRange((arcRange < 2 ? arcRange : 1.98) + .02);
        // if (key == 37 || key == 38) setArcRange((arcRange > 0 ? arcRange : 0.02) - .02);
        onArcRangeKeyDowned(e.keyCode);
    }

    return(
        <section 
            id="arc-range-container" 
            className="arc-range-container">
            <input 
                id="arc-range" 
                className="arc-range" 
                type="text" 
                value={ arcRange } 
                // onKeyDown={ handleKeydown } 
                onChange={ (e)=>console.log(e) }
            />
            <input 
                type="checkbox" 
                id="is-clockwise" 
                checked={ isClockwise } 
                className="allow-select" 
                onChange={ handleIsClockwiseChanged }
            />
            &nbsp;
            <label htmlFor="is-clockwise">Clockwise?</label>
            <div className="arc-range-container-guide">Use arrow keys ↑↓</div>
        </section>
    )
}

export default ArcContainer;
