import React from 'react';

const LineWidthContainer = (props) => {

    const [lineWidth, setLineWidth] = React.useState(2);

    const handleLineWidthChanged = (e) => {
        setLineWidth(e.target.value);
    }

    React.useEffect(()=>{

    }, []);

    return (
        <section id="line-width-container" className="context-popup">
            <label htmlFor="line-width-text">Line Width:</label>
            <input id="line-width-text" 
                   className="line-width-text" 
                   type="text" 
                   value={ lineWidth } 
                   onChange={ handleLineWidthChanged }
            />
            <div id="line-width-done" className="btn-007">Done</div>
        </section>
    )
}

export default LineWidthContainer;
