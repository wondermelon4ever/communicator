import React from 'react';

const CodeContainer = (props) => {

    React.useEffect(()=>{

    }, []);

    return(
        <section className="code-container">
            <textarea id="code-text" className="code-text allow-select"></textarea>
        </section>
    )
}

export default CodeContainer;
