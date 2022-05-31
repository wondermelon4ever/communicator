import React from "react";
import { unmountComponentAtNode } from "react-dom";

import Circle from './Circle';
import LinePath from './LinePath'
import Node, { STATE } from "./Node"

import { calculateTwoCenterPoints, createPath } from './LineDrawHelper';
import LinePath from './LinePath';

var num = 0;
const radius = 4;
export default class LineWithCircleVertex extends React.Component {

    static nodeNum = 0;
    constructor(props) {
        super(props);

        this.head = undefined, this.tail = undefined;

        this.state = {
            lineId: this.props.lid ? lid : "LineWithCircleEdge-"+(num)++,
            isMouseDown: false,
            anchorPosition: {
                x: 100, y: 100
            },
            isMouseOver: false,

            pathList: [],
            vertexList: [],
            showTempVertex: false,
            lineType: "Curve"
        }

        this.draw = this.draw.bind(this);
        this.handleVertexPositionChanged = this.handleVertexPositionChanged.bind(this);
        this.toggleTempVertexShow = this.toggleTempVertexShow.bind(this);

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseLeave =  this.handleMouseLeave.bind(this);
    }

    componentDidMount () {
        var command = props.command;
        if(cmd !== "Line") {
            unmountComponentAtNode(document.getElementById("root"));
            return;
        }
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

        this.head = h;
        draw(true);

        // var element = document.getElementById(lineId);
        // var rect = element.getBoundingClientRect();
        // console.log("position of this line group=>" + JSON.stringify(rect));
    }

    draw (isInit) { 
        
    }

    handleVertexPositionChanged (vid, position) {
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

    toggleTempVertexShow (event) {
        this.setState({
            ...this.state,
            showTempVertex: !this.state.showTempVertex
        })
    }

    handleMouseMove (event) {
        // console.log("handle move !!!");
        // setAnchorPosition({
        //     x: event.offsetX,
        //     y: event.offsetY
        // })
    }

    handleMouseDown (event) {
        // event.preventDefault();
        // console.log("handle mouse down ### !!!");
        // document.addEventListener("mousemove", handleMove.current);
        // setIsMouseDown(true);
    }

    handleMouseUp = (event) => {
        // event.preventDefault();
        // console.log("handle mouse up ### !!!");
        // document.removeEventListener("mousemove", handleMove.current);
        // setIsMouseDown(false);
    }

    handleMouseOver (event) {
        // setIsMouseOver(true);
    }

    handleMouseLeave (event) {
        // setIsMouseOver(false);
    }

    render () {
        return(
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
                    this.state.pathList.map((line, index)=>{
                        return (
                            <LinePath 
                                id={ line.id }
                                point1={ line.point1 }
                                point2={ line.point2 }
                                pointc={ line.pointc }
                                values={{
                                    stroke: line.stroke,
                                    strokewidth: line.strokeWidth,
                                    fill: line.fill
                                }}
                                lineKind={ line.lineKind }
                            />
                        )
                    })
                }
                {
                    this.state.vertexList.map((node, index)=>{
                        return (
                            <Circle 
                                key={ node.id }
                                cid={ node.id }
                                position={ node.position }
                                radius={ node.radius }
                                stroke={ this.props.stroke} 
                                strokeWidth={ this.props.strokeWidth } 
                                fill={ node.fill } 
                                isTemp={ node.isTemp }
                                handlePositionChanged={ this.handleVertexPositionChanged }
                                show={ node.isTemp === false || this.state.showTempVertex ? true : false }
                                toggleTempVertexShow={ this.toggleTempVertexShow }
                            />
                        )
                    })
                }
            </svg>
        )
    }
}
