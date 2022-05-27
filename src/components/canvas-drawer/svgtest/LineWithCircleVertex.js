import React, { useEffect, useRef, useState } from "react";
import { unmountComponentAtNode } from "react-dom";

import Circle from './Circle';
import Node, { STATE } from "./Node";

var num = 0;
const radius = 4;
const LineWithCircleVertex = ( { lid, command, stroke, strokeWidth, fill, ...props } ) => {

    const [lineId, setLineId] = useState(lid ? lineId : "LineWithCircleEdge-${num++}");
    // const [lineId, setLineId] = React.useState(lid ? lid : "LineWithCircleEdge-"+(num)++);

    const [head, setHead] = useState(undefined);
    const [tail, setTail] = useState(undefined);
    const [path, setPath] = useState("");

    const [vertexList, setVertexList] = useState([]);
    const [showTempVertex, setShowTempVertex] = useState(false);
    const [lineType, setLineType] = useState("Curve");

    const nodeNum = useRef(0);

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
            console.log(h.print());
            setHead(h);
            setTail(t);
        }
    }, []);

    useEffect(()=>{
        draw(true);
    }, [head]);

    const draw = (isInit) => {
        if(head === undefined) return;

        var node = head, vList = [];
        var path = "M"+node.position.x+","+node.position.y+" ";
        path += isInit ? "L" : "L";

        while(node !== undefined) {
            const { id, position, radius, color } = node;
            const isTemp = node.state === STATE.TEMP ? true : false;
            const posTemp = position;
            if(isTemp) {
                posTemp.x = (node.prev.position.x+node.next.position.x)/2;
                posTemp.y = (node.prev.position.y+node.next.position.y)/2;
            } else {
                path += position.x+","+position.y+ ( node.next ? "," : "" );
            }
            vList.push({
                id: id,
                position: posTemp,
                fill: color,
                radius: radius,
                isTemp: isTemp,
            });
            node = node.next;
        }
        setVertexList(vList);
        setPath(path);
    }

    const handleVertexPositionChanged = (vid, position, mouseUp) => {
        var h = head;
        var node = h.find(vid);
        node.position = position;
        if(node.state === STATE.TEMP) {
            node.state = STATE.DRAWABLE;
            node.color = "black";
            node.setRadius(4);
            var prev = node.prev, next = node.next;
            const tpos1 = {
                x: (prev.position.x+node.position.x)/2,
                y: (prev.position.y+node.position.y)/2
            }
            const tpos2 = {
                x: (node.position.x+next.position.x)/2,
                y: (node.position.y+next.position.y)/2
            }
            
            var temp1 = new Node(nodeNum.current++, tpos1);
            temp1.setColor("gray");
            temp1.setRadius(3);
            temp1.setState(STATE.TEMP);

            prev.insert(temp1);

            var temp2 = new Node(nodeNum.current++, tpos2);
            temp2.setColor("gray");
            temp2.setRadius(3);
            temp2.setState(STATE.TEMP);

            node.insert(temp2);
        }
        draw(false);
    }

    const toggleTempVertexShow = (event) => {
        setShowTempVertex(!showTempVertex);
    }

    return (
        <svg id={ lineId } >
            <path 
                d={ path } 
                stroke={ stroke } 
                strokeWidth={ strokeWidth } 
                fill="none" 
                onClick={ toggleTempVertexShow }
            />
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
        </svg>
    )
}

export default LineWithCircleVertex;
