import React, { useEffect, useRef, useState } from "react";
import { unmountComponentAtNode } from "react-dom";

import Circle from './Circle';
import Node, { STATE } from "./Node";

import { calculateTwoCenterPoints, createPath } from './LineDrawHelper';
import LinePath from './LinePath';

var num = 0;
const radius = 4;
const LineWithCircleVertex = ( { lid, command, stroke, strokeWidth, fill, ...props } ) => {

    const [isMouseDown, setIsMouseDown] = React.useState(false);
    const [anchorPosition, setAnchorPosition] = React.useState({
        x: 100,
        y: 100
    })
    const [isMouseOver, setIsMouseOver] = React.useState(false);

    // const [lineId, setLineId] = useState(lid ? lineId : "LineWithCircleEdge-${num++}");
    const [lineId, setLineId] = React.useState(lid ? lid : "LineWithCircleEdge-"+(num)++);

    const [head, setHead] = useState(undefined);
    const [tail, setTail] = useState(undefined);
    const [pathList, setPathList] = useState([]);

    const [vertexList, setVertexList] = useState([]);
    const [showTempVertex, setShowTempVertex] = useState(false);
    // const [lineType, setLineType] = useState("Straight");
    const [lineType, setLineType] = useState("Curve");

    const nodeNum = useRef(0);

    const handleMove = useRef(function (event) {
        console.log("handle move !!!");
        setAnchorPosition({
            // x: event.offsetX,
            // y: event.offsetY
        })
    });

    useEffect(()=>{
        var cmd = command[0];
        if(cmd !== "Line") {
            unmountComponentAtNode(document.getElementById("root"));
        } else {
            const pos1 = { x: command[1][0], y: command[1][1] }, pos2 = { x: command[2][0], y: command[2][1] };
            var h = new Node(nodeNum.current++, pos1), t = new Node(nodeNum.current++, pos2);
            h.setState(STATE.DRAWABLE), t.setState(STATE.DRAWABLE);

            var temp = new Node(nodeNum.current++, {
                x: (pos1.x+pos2.x)/2,
                y: (pos1.y+pos2.y)/2
            });
            temp.setState(STATE.TEMP);
            temp.setRadius(3);

            h.append(temp); 
            h.append(t);
            setHead(h);
            setTail(t);
        }
        var element = document.getElementById(lineId);
        var rect = element.getBoundingClientRect();
        console.log("position of this line group=>" + JSON.stringify(rect));
    }, []);

    useEffect(()=>{
        draw(true);
    }, [head]);

    const draw = (isInit) => {
        if(head === undefined) return;

        var node = head, prev, next, vList = [], pList = [];
        var path = "";
        if(isInit) {
            prev = node, node = prev.next, next = node.next;
            path += "M"+prev.position.x+","+prev.position.y+" ";
            path += lineType==="Straight" ? "L" : "Q";
            path += node.position.x+","+node.position.y+","+next.position.x+","+next.position.y;
            pList.push(path);

            vList.push({ id: prev.id, position: prev.position, fill: prev.color, radius: radius, isTemp: false });
            vList.push({ id: node.id, position: node.position, fill: node.color, radius: radius, isTemp: true  });
            vList.push({ id: next.id, position: next.position, fill: next.color, radius: radius, isTemp: false });
        } else { 
            prev = head, node = prev.next, next = node.next;
            // 0번 Vertex 저장
            vList.push({ id: prev.id, position: prev.position, fill: prev.color, radius: radius, isTemp: prev.state === STATE.TEMP ? true : false });

            while(node !== undefined) {
                path += createPath(prev.position, node.controlPosition, next.position, lineType);
                pList.push(path);
                // This always should be temp node
                vList.push({
                    id: node.id,
                    position: node.position,
                    fill: node.color,
                    radius: radius,
                    isTemp: node.state === STATE.TEMP ? true : false
                });
                
                vList.push({
                    id: next.id,
                    position: next.position,
                    fill: next.color,
                    radius: radius,
                    isTemp: next.state === STATE.TEMP ? true : false
                });

                prev = next; node = prev.next;
                if(node !== undefined) next = node.next;
            }
        }
        setVertexList(vList);
        setPathList(pList);
    }

    const handleVertexPositionChanged = (vid, position) => {
        if(position === undefined) return;
        var h = head;
        var node = h.find(vid);
        node.position = position;
        if(node.state === STATE.TEMP) {
            node.state = STATE.DRAWABLE;
            node.color = "black";
            node.setRadius(4);
            var prev = node.prev, next = node.next;
            const centerPoints = calculateTwoCenterPoints(prev.position, node.position, next.position, lineType);
            const tpos1 = centerPoints[0], tpos2 = centerPoints[1];
            
            var temp1 = new Node(nodeNum.current++, { x: tpos1.x, y: tpos1.y });
            temp1.setColor("gray");
            temp1.setRadius(3);
            temp1.setState(STATE.TEMP);
            temp1.setControlPosition({ x: tpos1.cx, y: tpos1.cy });
            prev.insert(temp1);

            var temp2 = new Node(nodeNum.current++, { x: tpos2.x, y: tpos2.y });
            temp2.setColor("gray");
            temp2.setRadius(3);
            temp2.setState(STATE.TEMP);
            temp2.setControlPosition({ x: tpos2.cx, y: tpos2.cy });
            node.insert(temp2);
        } else {
            if(nodeNum.current < 4) {
                // 초기유지상태임: 기본노드 2개, 임시노드 1개 
                var temp;
                if(node.prev === undefined) temp = node.next;
                else temp = node.prev;
                temp.position = {
                    x: (temp.prev.position.x+temp.next.position.x)/2,
                    y: (temp.prev.position.y+temp.next.position.y)/2
                };
                temp.controlPosition = temp.position;
            } else {
                var lnode, cnode, rnode;
                if(node.prev === undefined) lnode = node, cnode = lnode.next.next, rnode = cnode.next.next;
                else if(node.next === undefined) rnode = node, cnode = rnode.prev.prev, lnode = cnode.prev.prev;
                else cnode = node, lnode = cnode.prev.prev, rnode = cnode.next.next;
                
                const centerPoints = calculateTwoCenterPoints(lnode.position, cnode.position, rnode.position, lineType);
                var ltemp = cnode.prev, rtemp = cnode.next;
                ltemp.position = { x: centerPoints[0].x, y: centerPoints[0].y };
                ltemp.controlPosition = { x: centerPoints[0].cx, y: centerPoints[0].cy };
                rtemp.position = { x: centerPoints[1].x, y: centerPoints[1].y };
                rtemp.controlPosition = { x: centerPoints[1].cx, y: centerPoints[1].cy };
            }
        }
        draw(false);
    }

    const toggleTempVertexShow = (event) => {
        setShowTempVertex(!showTempVertex);
    }

    // const handleMove = (event) => {
    //     console.log("handle move !!!");
    //     setAnchorPosition({
    //         x: event.offsetX,
    //         y: event.offsetY
    //     })
    // }

    const handleMouseDown = (event) => {
        event.preventDefault();
        console.log("handle mouse down ### !!!");
        document.addEventListener("mousemove", handleMove.current);
        setIsMouseDown(true);
    }

    const handleMouseUp = (event) => {
        event.preventDefault();
        console.log("handle mouse up ### !!!");
        document.removeEventListener("mousemove", handleMove.current);
        setIsMouseDown(false);
    }

    const handleMouseOver = (event) => {
        // setIsMouseOver(true);
    }

    const handleMouseLeave = (event) => {
        // setIsMouseOver(false);
    }

    return (
        <svg id={ lineId }
            // onMouseDown={ handleMouseDown }
            // onMouseUp={ handleMouseUp }
            // onMouseOver={ handleMouseOver }
            // onMouseLeave= { handleMouseLeave }
            // pointerEvents="bounding-box"
            // style={{
            //     cursor: isMouseOver ? "move" : "pointer",
            // }}
            // y={anchorPosition.y}
            // x={anchorPosition.x}
        >
            {
                pathList.map((path, index)=>{
                    return (
                        <path 
                            key={ index }
                            d={ path } 
                            stroke={ stroke } 
                            strokeWidth={ strokeWidth } 
                            fill="none" 
                            onClick={ toggleTempVertexShow }
                            
                        />
                    )
                })
            }
            {
                vertexList.map((node, index)=>{
                    return (
                        <Circle 
                            key={ node.id }
                            cid={ node.id }
                            position={ node.position }
                            radius={ node.radius }
                            stroke={ stroke} 
                            strokeWidth={ strokeWidth } 
                            fill={ node.fill } 
                            isTemp={ node.isTemp }
                            handlePositionChanged={ handleVertexPositionChanged }
                            show={ node.isTemp === false || showTempVertex ? true : false }
                            toggleTempVertexShow={ toggleTempVertexShow }
                        />
                    )
                })
            }
            <LinePath 
                lineKind="Curve"
                point1={{ x: 200, y: 200 }}
                point2={{ x: 400, y: 100 }}
                pointc={{ x: 200, y: 100 }}
                values={{
                    stroke: "red",
                    strokeWidth: "2",
                    fill: "none",
                }}
                handleOnLinePathClick={ () => console.log("handleon line path clicked !!!")}
                anchor={{
                    x: anchorPosition.x,
                    y: anchorPosition.y
                }}
            />
        </svg>
    )
}

export default LineWithCircleVertex;
