import React from 'react';

const CodeContainerOptionContainer = (props) => {

    const [absolutePoint, setAbsolutePoint] = React.useState(true);
    const [shortenCode, setShortenCode] = React.useState(true);

    React.useEffect(()=>{

    }, []);

    const handleAbsolutePointChanged = () => {
        setAbsolutePoint(!absolutePoint);
    }

    const handleShortenCodeChanged = () => {
        setShortenCode(!shortenCode);
    }

    return (
        <section id="options-container" className="options-container">
            <div>
                <input type="checkbox" id="is-absolute-points" checked={ absolutePoint } onChange={ handleAbsolutePointChanged }/>
                <label htmlFor="is-absolute-points">Absolute Points</label>
            </div>
            <div>
                <input type="checkbox" id="is-shorten-code"  checked={ shortenCode } onChange={ handleShortenCodeChanged }/>
                <label htmlFor="is-shorten-code">Shorten Code</label>
            </div>
        </section>
    )
}

export default CodeContainerOptionContainer;
