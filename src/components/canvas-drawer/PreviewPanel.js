import React from 'react';

const PreviewPanel = (props) => {

    React.useEffect(()=>{

    }, []);

    return (
        <section className="preview-panel" style={{ display: "none" }}>
            <div id="design-preview" className="preview-selected">Preview</div>
            <div id="code-preview">Code</div>
        </section>
    )
}

export default PreviewPanel;
