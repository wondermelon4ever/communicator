import React from 'react';
import './canvas-drawer-widget.css';

const PdfContainer = (props) => {

    React.useEffect(()=>{

    }, []);

    return(
        <section id="pdf-page-container">
            <img id="pdf-prev" />
            <select id="pdf-pages-list"></select>
            <img id="pdf-next" />
            <img id="pdf-close" />
        </section>
    )
}

export default PdfContainer;
