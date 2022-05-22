import React from 'react';

const Line = (props) => {
    
    const [id, setId] = React.useState(props.id);
    const [circleShow, setCircleShow] = React.useState(false);
    const [point1, setPoint1] = React.useState(props.point1);
    const [point2, setPoint2] = React.useState(props.point2);
    // const [circle1, setCircle1]
    const [path, setPath] = React.useState("");
    const [stroke, setStroke] = React.useState(props.stroke);
    const [strokeWidth, setStrokeWidth] = React.useState(props.strokeWidth);
    const [fill, setFill] = React.useState(props.fill);
    const [ismousedown, setIsmousedown] = React.useState(false);

    React.useEffect(()=>{
        var path = "M"+point1.x+","+point1.y+" "+"L"+point2.x+","+point2.y+" ";
        setPath(path)
    }, [])

    function handleOnClick (event) {
        setIsmousedown(true);
        setCircleShow(!circleShow);
    }
    
    return(
        <svg>
            <path 
                id={ props.id } 
                d={ path } 
                stroke={ stroke } 
                strokeWidth={ strokeWidth }
                fill={ fill }
                onClick={ handleMousedown }
            />
            <circle 
                id="circle1"
                cx={ point1.x }
                cy={ point1.y }
                r="4"
                stroke="black"
                strokeWidth="2"
                fill="black"
                style={{ display: circleShow ? "block": "none" }}
                // onClick={}
            />
            <circle 
                id="circle2"
                cx={ point2.x }
                cy={ point2.y }
                r="4"
                stroke="black"
                strokeWidth="2"
                fill="black"
                style={{ display: circleShow ? "block": "none" }}
            />
        </svg>
    );
}

export default Line;
