import React from 'react';
import Circle from './Circle';

var num = 0;
const LineEdgeCircle = (props) => {
    
    const [id, setId] = React.useState(props.id === undefined ? "line-"+(num)++ : props.id);
    const [commands, setCommands] = React.useState(props.commands);
    const [stroke, setStroke] = React.useState(props.stroke === undefined ? "black" : props.stroke);
    const [strokeWidth, setStrokeWidth] = React.useState(props.strokeWidth === undefined ? "2" : props.strokeWidth);
    const [fill, setFill] = React.useState(props.fill === undefined ? "none" : props.fill);
    const [linePaths, setLinePaths] = React.useState([]);
    
    const [circles, setCircles] = React.useState([]);

    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const [svgmousedown, setSvgmousedown] = React.useState(false);

    React.useEffect(()=>{
        drawCircles(true);
    }, []);

    React.useEffect(()=>{
        drawLines();
    }, [circles]);

    const drawLines = () => {
        var linePaths = [];
        var i, bi = 0;
        for(i = 1; i < circles.length; i++) {
            if(circles[i].isTemp === true) continue;
            var path = "M" + circles[bi].position.x+","+circles[bi].position.y+" ";
            path += "L"+circles[i].position.x+","+circles[i].position.y;
            linePaths.push(path);
            bi = i;
        }
        setLinePaths(linePaths);
    }

    const drawCircles = (isInit) => {
        
        var circles = [];
        var cidx = 0;
        commands.forEach( (command, index) => {
            var lineKind = "L";
            if(command[0] === "curve") lineKind = "Q";
            var path = "M"+command[1][0]+","+command[1][1]+" ";    
            path += lineKind+command[1][0]+","+command[1][1]+","+command[2][0]+","+command[2][1];

            linePaths.push(path);

            circles.push({ 
                cidx: cidx++, 
                position: {
                    x: command[1][0],
                    y: command[1][1]
                },
                radius: 4, 
                fill: "red",
                isTemp: false
            });
            
            circles.push({ 
                cidx: cidx++,
                position: {
                    x: (command[1][0]+command[2][0])/2, 
                    y: (command[1][1]+command[2][1])/2, 
                },
                radius: 4, 
                fill: "red",
                isTemp: true 
            });
            if(isInit || index+1 === linePaths.length) {
                circles.push({ 
                    cidx: cidx++, 
                    position: {
                        x: command[2][0],
                        y: command[2][1]
                    },
                    radius: 4, 
                    fill: "red",
                    isTemp: false
                });
            }
        });
        setCircles(circles);
    }

    const handleCirclePositionChanged = (cidx, position) => {
        var newCircles = [];
        circles.forEach((cir, index)=>{
            var isTemp = cir.cidx === cidx && cir.isTemp ? true : false;
            if(cir.cidx===cidx) {
                cir.position.x = position.x;
                cir.position.y = position.y;
                if(cir.isTemp === true) {
                    cir.isTemp = false;
                    var tdx = cir.cidx, pdx = tdx-1, ndx = tdx+1;
                    newCircles.push({
                        // cidx: cidx++, 
                        // position: {
                        //     x: command[1][0],
                        //     y: command[1][1]
                        // },
                        // radius: 4, 
                        // fill: "red",
                        // isTemp: true
                    });  
                }
            }
            
            if(cir.isTemp === true) {
                var tdx = cir.cidx, pdx = tdx-1, ndx = tdx+1;
                if(pdx >= 0 && ndx < circles.length) {
                    var prev = newCircles[pdx], next = circles[ndx];
                    cir.position.x = (prev.position.x + next.position.x)>>1;
                    cir.position.y = (prev.position.y + next.position.y)>>1;
                }
            }

            if(isTemp === true) {

            }
            newCircles.push(cir);
        });

        setCircles(newCircles);
    }

    const handleSvgOnMouseDown = (event) => {
        console.log("handleSvgOnMouseDown !!!");
        setSvgmousedown(true);
        document.addEventListener('mousemove', handleSvgOnMouseMove, false);
    }

    const handleSvgOnMouseUp = (event) => {
        console.log("handleSvgOnMouseUp !!!");
        setSvgmousedown(false);
        document.removeEventListener('mousemove', handleSvgOnMouseMove, false);
    }

    const handleSvgOnMouseMove = (event) => {
        if(svgmousedown === true) {
            console.log("mouse move");
            trackPos(event, {x: event.pageX, y: event.pageY});
        }
    }

    const handleOnStart = (e, data) => {
        console.log("handle start !!");
    }

    const handleDrag = (e, data) => {
        console.log("handle drag !!");
        // trackPos(e, data);
    }

    const handleStop = (e, data) => {
        console.log("handle stop !!");
    }

    const trackPos = (e, data) => {
        console.log("position: " + JSON.stringify(position));
        setPosition({ x: data.x, y: data.y });
    }

    return (
        <svg
            id={ id }
        >
            {/* <g 
                style={{ outline: 'thick solid black', outlineOffset: '10px' }}
                transform={`translate(${position.x},${position.y})`} 
                onMouseDown={ handleSvgOnMouseDown }
                onMouseUp={ handleSvgOnMouseUp }
            >
                <circle cx="100" cy="100" r="30" fill="red"/>
                <circle cx="200" cy="100" r="30" fill="red"/>
            </g> */}
            {
                linePaths.map((path, index) => {
                    return(
                        <path 
                            key={ index } 
                            d={path} 
                            stroke={stroke} 
                            strokeWidth={ strokeWidth } 
                            fill={ fill } 
                        />
                    )
                })
            }
            {
                circles.map((cir, index)=>{
                    return(
                        <Circle 
                            key={ index }
                            cidx={ cir.cidx }
                            position={{
                                x: cir.position.x,
                                y: cir.position.y
                            }}
                            radius={ cir.radius }
                            stroke={ stroke} 
                            strokeWidth={ strokeWidth } 
                            fill={ cir.fill } 
                            isTemp={ cir.isTemp === undefined ? false : cir.isTemp }
                            handlePositionChanged={ handleCirclePositionChanged }
                        />
                    )
                })
            }
            {/* <path id={ id } d={ linePath } stroke={ stroke } strokeWidth={ strokeWidth } fill={ fill } /> */}
        </svg>
    )
}

export default LineEdgeCircle;