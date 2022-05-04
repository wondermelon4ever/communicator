import React from 'react';

const FontSizeSelector = (props) => {

    const [fontSize, setFontSize] = React.useState(15);

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value);
    }

    React.useEffect(()=>{

    }, []);

    return (
        <ul className="fontSizeUl" 
            style={{ 
                display: "none", 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: 
                "50px", 
                textAlign: "center" 
            }}
        >
            <li>15</li>
            <li>17</li>
            <li>19</li>
            <li>20</li>
            <li>22</li>
            <li>25</li>
            <li>30</li>
            <li>35</li>
            <li>42</li>
            <li>48</li>
            <li>60</li>
            <li>72</li>
        </ul>
    )
}

export default FontSizeSelector;
