import React from "react";
import { unmountComponentAtNode } from "react-dom";

import Circle from './Circle';
import LinePath from './LinePath'
import Node, { STATE } from "./Node"

import { calculateTwoCenterPoints, createPath } from './LineDrawHelper';

var num = 0;
const radius = 4;
export default class LineWithCircleVertex extends React.Component {

    static nodeNum = 0;
    constructor(props) {
        super(props);

        this.head = undefined, this.tail = undefined;
        this.childLeftTopMost = {
            left: 0, top: 0
        }

        this.prevMousePosition = { x: 0, y: 0 };

        this.state = {
            lineId: this.props.lid ? this.props.lid : "LineWithCircleEdge-"+(num)++,
            isMouseDown: false,
            anchorPosition: {
                x: 0, y: 0
            },
            isMouseOver: false,

            pathList: [],
            vertexList: [],
            showTempVertex: false,
            lineKind: "Curve",
            lineNum: 0
        }

        this.draw = this.draw.bind(this);
        this.handleOnVertexPositionChanged = this.handleOnVertexPositionChanged.bind(this);
        this.toggleTempVertexShow = this.toggleTempVertexShow.bind(this);

        this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
        this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
        this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
        this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
        this.handleOnMouseLeave =  this.handleOnMouseLeave.bind(this);
    }

    componentDidMount () {
        var command = this.props.command;
        var cmd = command[0];
        if(cmd !== "Line") {
            unmountComponentAtNode(document.getElementById("root"));
            return;
        }
        const pos1 = { x: command[1][0], y: command[1][1] }, pos2 = { x: command[2][0], y: command[2][1] };

        if(pos1.x < pos2.x) this.childLeftTopMost.left = pos1.x;
        else this.childLeftTopMost.left = pos2.x;
        if(pos1.y < pos2.y) this.childLeftTopMost.top = pos1.y;
        else this.childLeftTopMost.top = pos2.y;

        var h = new Node(LineWithCircleVertex.nodeNum++, pos1), t = new Node(LineWithCircleVertex.nodeNum++, pos2);
        h.setState(STATE.DRAWABLE), t.setState(STATE.DRAWABLE);

        var temp = new Node(LineWithCircleVertex.nodeNum++, {
            x: (pos1.x+pos2.x)/2,
            y: (pos1.y+pos2.y)/2
        });
        temp.setState(STATE.TEMP);
        temp.setRadius(3);

        h.append(temp); 
        h.append(t);

        this.head = h;
        this.draw(true);
    }

    draw (isInit) { 
        if(this.head === undefined) return;

        var node = this.head, prev, next, vList = [], pList = [];
        var path = "";
        if(isInit) {
            prev = node, node = prev.next, next = node.next;
            path += "M"+prev.position.x+","+prev.position.y+" ";
            path += this.state.lineType==="Straight" ? "L" : "Q";
            path += node.position.x+","+node.position.y+","+next.position.x+","+next.position.y;
            // pList.push(path);

            pList.push({
                id: this.state.lineId + "-" + this.state.lineNum++,
                point1: prev.position,
                point2: next.position,
                pointc: node.position,
                lineKind: this.state.lineKind,
                values: {
                    stroke: this.props.stroke,
                    strokeWidth: this.props.strokeWidth,
                    fill: this.props.fill
                }
            });

            vList.push({ id: prev.id, position: prev.position, fill: prev.color, radius: radius, isTemp: false });
            vList.push({ id: node.id, position: node.position, fill: node.color, radius: radius, isTemp: true  });
            vList.push({ id: next.id, position: next.position, fill: next.color, radius: radius, isTemp: false });
        } else { 
            prev = this.head, node = prev.next, next = node.next;
            // 0번 Vertex 저장
            vList.push({ id: prev.id, position: prev.position, fill: prev.color, radius: radius, isTemp: prev.state === STATE.TEMP ? true : false });

            while(node !== undefined) {
                // path += createPath(prev.position, node.controlPosition, next.position, this.state.lineType);
                // pList.push(path);
                pList.push({
                    id: this.state.lineId + "-" + this.state.lineNum++,
                    point1: prev.position,
                    point2: next.position,
                    pointc: node.controlPosition,
                    lineKind: this.state.lineKind,
                    values: {
                        stroke: this.props.stroke,
                        strokeWidth: this.props.strokeWidth,
                        fill: this.props.fill
                    }
                });
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
        this.setState({
            ...this.state,
            vertexList: vList,
            pathList: pList
        })
    }

    handleOnVertexPositionChanged (vid, position) {
        if(position === undefined) return;
        if(position.x < this.childLeftTopMost.left) this.childLeftTopMost.left = position.x;
        if(position.y < this.childLeftTopMost.top)  this.childLeftTopMost.top  = position.y;

        var h = this.head;
        var node = h.find(vid);
        node.position = position;
        if(node.state === STATE.TEMP) {
            node.state = STATE.DRAWABLE;
            node.color = "black";
            node.setRadius(4);
            var prev = node.prev, next = node.next;
            const centerPoints = calculateTwoCenterPoints(prev.position, node.position, next.position, this.state.lineKind);
            const tpos1 = centerPoints[0], tpos2 = centerPoints[1];
            
            var temp1 = new Node(LineWithCircleVertex.nodeNum++, { x: tpos1.x, y: tpos1.y });
            temp1.setColor("gray");
            temp1.setRadius(3);
            temp1.setState(STATE.TEMP);
            temp1.setControlPosition({ x: tpos1.cx, y: tpos1.cy });
            prev.insert(temp1);

            var temp2 = new Node(LineWithCircleVertex.nodeNum++, { x: tpos2.x, y: tpos2.y });
            temp2.setColor("gray");
            temp2.setRadius(3);
            temp2.setState(STATE.TEMP);
            temp2.setControlPosition({ x: tpos2.cx, y: tpos2.cy });
            node.insert(temp2);
        } else {
            if(LineWithCircleVertex.nodeNum < 4) {
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
                
                const centerPoints = calculateTwoCenterPoints(lnode.position, cnode.position, rnode.position, this.state.lineKind);
                var ltemp = cnode.prev, rtemp = cnode.next;
                ltemp.position = { x: centerPoints[0].x, y: centerPoints[0].y };
                ltemp.controlPosition = { x: centerPoints[0].cx, y: centerPoints[0].cy };
                rtemp.position = { x: centerPoints[1].x, y: centerPoints[1].y };
                rtemp.controlPosition = { x: centerPoints[1].cx, y: centerPoints[1].cy };
            }
        }
        this.draw(false);
    }

    toggleTempVertexShow (event) {
        this.setState({
            ...this.state,
            showTempVertex: !this.state.showTempVertex
        })
    }

    handleOnMouseMove (event) {
        event.preventDefault();
        if(event.ctrlKey === false || this.state.isMouseDown === false) return;
        
        this.setState({
            ...this.state,
            anchorPosition: {
                x: this.state.anchorPosition.x+(event.clientX-this.prevMousePosition.x),
                y: this.state.anchorPosition.y+(event.clientY-this.prevMousePosition.y)
            }
        })
        this.prevMousePosition = { x: event.clientX, y: event.clientY };
    }

    handleOnMouseDown (event) {
        event.preventDefault();
        this.prevMousePosition = {
            x: event.clientX, y: event.clientY
        }

        document.addEventListener("mousemove", this.handleOnMouseMove);
        this.setState({
            ...this.state,
            isMouseDown: true
        })
    }

    handleOnMouseUp = (event) => {
        event.preventDefault();
        document.removeEventListener("mousemove", this.handleOnMouseMove);
        this.prevMousePosition = { x: 0, y : 0 };
        this.setState({
            ...this.state,
            isMouseDown: false
        });
    }

    handleOnMouseOver (event) {
        this.setState({
            ...this.state,
            isMouseOver: true
        })
    }

    handleOnMouseLeave (event) {
        this.setState({
            ...this.state,
            isMouseOver: false
        })
    }

    handleOnLinePathClicked (event) {
        console.log("handle on line path click !!!");
    }

    render () {
        return(
            <svg id={ this.state.lineId }
                onMouseDown={ this.handleOnMouseDown }
                onMouseUp={ this.handleOnMouseUp }
                onMouseOver={ this.handleOnMouseOver }
                onMouseLeave= { this.handleOnMouseLeave }
                pointerEvents="bounding-box"
                style={{
                    cursor: this.state.isMouseOver ? "move" : "pointer",
                    zIndex: 0
                }}
                y={ this.state.anchorPosition.y}
                x={ this.state.anchorPosition.x}
            >
                {
                    this.state.pathList.map((line, index)=>{
                        return (
                            <LinePath 
                                key={ line. id }
                                id={ line.id }
                                point1={ line.point1 }
                                point2={ line.point2 }
                                pointc={ line.pointc }
                                values={{
                                    stroke: line.values.stroke,
                                    strokeWidth: line.values.strokeWidth,
                                    fill: line.values.fill
                                }}
                                lineKind={ line.lineKind }
                                handleOnLinePathClick={ this.handleOnLinePathClicked }
                                offset={ this.state.anchorPosition }
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
                                handlePositionChanged={ this.handleOnVertexPositionChanged }
                                show={ node.isTemp === false || this.state.showTempVertex ? true : false }
                                toggleTempVertexShow={ this.toggleTempVertexShow }
                                offset={ this.state.anchorPosition }
                            />
                        )
                    })
                }
            </svg>
        )
    }
}
