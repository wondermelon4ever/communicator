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
    const [isCurve, setIsCurve] = React.useState(false);

    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const [svgmousedown, setSvgmousedown] = React.useState(false);

    React.useEffect(()=>{
        drawCircles(true);
    }, []);

    React.useEffect(()=>{
        drawLines();
    }, [circles]);

    const getControlPoints = (x0, y0, x1, y1, x2, y2, t) => {
        var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
        var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        var fa=t*d01/(d01+d12);
        var fb=t-fa;
        var p1x=x1+fa*(x0-x2), p1y=y1+fa*(y0-y2);
        var p2x=x1-fb*(x0-x2), p2y=y1-fb*(y0-y2);
        return [p1x,p1y,p2x,p2y];
    };

    const getCenterQuadraticPoint = (x0, y0, cx1, cy1, x1, y1) => {
        var qu = 20;
        var bp = new Array();
        var t=1/qu;
        bp.push({ x: x0, y: y0});
        for(var k=1;k<qu;k++) {
            t+=1/qu;
            var x = (1-t)*((1-t)*x0+t*cx1)+t*((1-t)*cx1+t*x1), y = (1-t)*((1-t)*y0+t*cy1)+t*((1-t)*cy1+t*y1);
            bp.push({ x: x, y: y });
        }
        return bp[11];
    };

    const drawLines = () => {
        var linePaths = [];
        var i, bi = 0, curve = circles.length >= 3 ? true : false;
        for(i = 1; i < circles.length; i++) {
            if(circles[i].isTemp === true) continue;
            var path = "M" + circles[bi].position.x+","+circles[bi].position.y+" ";
            if(isCurve && i < circles.length-1) {
                path += "Q";
                var points = getControlPoints(
                    circles[bi].position.x, circles[bi].position.y, 
                    circles[i].position.x, circles[i].position.y, 
                    circles[i+1].position.x, circles[i+1].position.y,
                    0.5
                );
                path += points[0]+","+points[1]+","+circles[i].position.x+","+circles[i].position.y;
                path += " Q";
                path += points[2]+","+points[3]+","+circles[i+1].position.x+","+circles[i+1].position.y;
            } else {
                if(!isCurve) path += "L"+circles[i].position.x+","+circles[i].position.y;
                else {
                    path += "Q";
                    var points = getControlPoints(
                        circles[i-2].position.x, circles[i-2].position.y, 
                        circles[i-1].position.x, circles[i-1].position.y, 
                        circles[i].position.x, circles[i].position.y,
                        0.5
                    );
                    path += points[2]+","+points[3]+","+circles[i].position.x+","+circles[i].position.y;
                }
            }
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

    const handleCirclePositionChanged = (cidx, position, mouseUp) => {
        var newCircles = [];
        var newIdx = 0;
        circles.forEach((cir, index)=>{
            var isTemp = cir.cidx === cidx && cir.isTemp ? true : false;
            cir.cidx = newIdx++;
            if(cir.cidx===cidx) {
                cir.position.x = position.x;
                cir.position.y = position.y;
                if(cir.isTemp === true) {
                    if(mouseUp) newIdx--;
                    setIsCurve(true);
                    cir.isTemp = false;
                    var tdx = cir.cidx, pdx = tdx-1, ndx = tdx+1;
                    var prevPoints = circles[pdx].position, currPoints = cir.position, nextPoints = circles[ndx].position;
                    // var centerPoint = getCenterQuadraticPoint (prevPoints.x, prevPoints.y, currPoints.x, currPoints.y, nextPoints.x, nextPoints.y);
                    if(mouseUp) {
                         newCircles.push({
                            cidx: newIdx++, 
                            position: {
                                x: (prevPoints.x + currPoints.x)>>1,
                                y: (prevPoints.y + currPoints.y)>>1
                            },
                            radius: 4, 
                            fill: "red",
                            isTemp: true
                        });
                        cir.cidx = newIdx++;
                    }

                    newCircles.push(cir);
                    
                    if(mouseUp) {
                        newCircles.push({
                            cidx: newIdx++, 
                            position: {
                                x: (currPoints.x + nextPoints.x)>>1,
                                y: (currPoints.y + nextPoints.y)>>1
                            },
                            radius: 4, 
                            fill: "red",
                            isTemp: true
                        });
                    }
                } else {
                    newCircles.push(cir);
                }
            } else {
                if(cir.isTemp === true) {
                    var tdx = cir.cidx, pdx = tdx-1, ndx = tdx+1;
                    // if(isCurve) {
    
                    // } else {
                        if(pdx >= 0 && ndx < circles.length) {
                            var prev = newCircles[pdx], next = circles[ndx];
                            cir.position.x = (prev.position.x + next.position.x)>>1;
                            cir.position.y = (prev.position.y + next.position.y)>>1;
                        }
                    // }
                }
    
                newCircles.push(cir);
            }
            
            
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
                    console.log(index + "=>" + JSON.stringify(cir));
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
