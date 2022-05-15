import React from 'react';

const CopyPathContainer = (props) => {

    React.useEffect(()=>{

    }, []);

    return (
        <section 
            id="copy-container" 
            className="context-popup"
        >
            <div>
                <input type="checkbox" id="copy-last" checked onChange={ (e)=>console.log(e)}/>
                <label htmlFor="copy-last">Copy last path</label>
            </div>
            <div style={{ marginTop: "5px" }}>
                <input type="checkbox" id="copy-all" onChange={ (e)=>console.log(e)}/>
                <label htmlFor="copy-all">Copy all paths</label>
            </div>
        </section>
    )
}

export default CopyPathContainer;
