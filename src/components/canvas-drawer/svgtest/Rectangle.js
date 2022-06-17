import React from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import ContextMenu from './ContextMenu';
import withMouse from './MouseHoc';

const decideMouseCursor = (event, rect) => {
    const posX = event.clientX, posY = event.clientY;
    var cursor = "move";
    if(posY < rect.y+15) {
        if(posX < rect.x+15) {
            cursor = "nw-resize";
        } else if(posX > rect.x+rect.width-15) {
            cursor = "ne-resize";
        } else {
            cursor = "n-resize";
        }
    } else if(posY > rect.y+rect.height-15) {
        if(posX < rect.x+15) {
            cursor = "sw-resize";
        } else if(posX > rect.x+rect.width-15) {
            cursor = "se-resize";
        } else {
            cursor = "s-resize";
        }
    } else {
        if(posX < rect.x + 15) {
            cursor = "w-resize";
        } else if(posX > rect.x+rect.width-15) {
            cursor = "e-resize";
        }
    }
    return cursor;
}

class Rectangle extends React.Component {

    constructor(props) {
        super(props);
        this.id = props.id;
        this.isMouseInside = props.isMouseInside;
        this.isMouseInsideDown = props.isMouseInsideDown;
        this.isMouseDown = false;
        this.handleContextMenuOpen = undefined;
        this.prevMousePosition = undefined;
        this.offset = undefined;
        
        this.state = {
            anchorPosition: {
                x: props.position.x,
                y: props.position.y
            },
            rx: props.rx,
            ry: props.ry,
            width: props.width,
            height: props.height,
            stroke: props.stroke,
            strokeOpacity: props.strokeOpacity,
            strokeWidth: props.strokeWidth,
            fill: props.fill,
            fillOpacity: props.fillOpacity,
            title: props.title,
        }

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.openContextMenu = this.openContextMenu.bind(this);
        this.resize = this.resize.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.isMouseInside !== this.props.isMouseInside) {
            this.isMouseInside = this.props.isMouseInside;
        }

        if(prevProps.isMouseInsideDown !== this.props.isMouseInsideDown) {
            this.isMouseInsideDown = this.props.isMouseInsideDown;
        }

        if(prevProps.mouse.x !== this.props.mouse.x || prevProps.mouse.y !== this.props.mouse.y) {
            this.resize(this.props.mouse, this.props.cursor);
        }
    }
    
    resize = (mouse, cursor) => {
        if(!this.isMouseInside || !this.isMouseInsideDown) return;

        var apos   = this.state.anchorPosition, 
            width  = this.state.width,
            height = this.state.height;
        if(cursor !== "move") {
            if(mouse.y < apos.y) height += apos.y-mouse.y-this.offset.y-3;
            else height -= mouse.y-apos.y-this.offset.y-3;
    
            if(mouse.x < apos.x) width += apos.x-mouse.x-5;
            else width -= mouse.x-apos.x-5;
        }

        if (cursor === "nw-resize") {
            this.setState({
                ...this.state,
                anchorPosition: {
                    x: mouse.x-5, y: mouse.y-28,
                },
                height: height,
                width: width
            });
        } else if(cursor === "ne-resize") {
            this.setState({
                ...this.state,
                anchorPosition: {
                    x: apos.x, y: mouse.y-28,
                },
                height: height,
                width: mouse.x+5-apos.x,
            });
        } else if(cursor === "n-resize") {
            this.setState({
                ...this.state,
                anchorPosition: {
                    x: apos.x, y: mouse.y-28
                },
                height: height
            });
        } else if(cursor === "sw-resize") {
            this.setState({
                ...this.state,
                anchorPosition: {
                    x: mouse.x-5, y: apos.y
                },
                height: mouse.y-apos.y,
                width: width
            });
            
        } else if(cursor === "se-resize") {
            this.setState({
                ...this.state,
                height: mouse.y-apos.y,
                width: mouse.x-apos.x+5
            })
            
        } else if(cursor === "s-resize") {
            this.setState({
                ...this.state,
                height: mouse.y+3-apos.y,
            });
        } else if(cursor === "w-resize") {
            this.setState({
                ...this.state,
                anchorPosition: {
                    x: mouse.x-5, y: apos.y
                },
                width: width
            });

        } else if(cursor === "e-resize") {
            this.setState({
                ...this.state,
                width: mouse.x+3-apos.x,
            });
        }
    }

    openContextMenu = (event) => {
        this.handleContextMenuOpen(event);
        this.isMouseDown = false;
    }

    handleMouseDown = (event) => {
        event.preventDefault();
        this.isMouseDown = true;
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    handleMouseMove = (event) => {
        event.preventDefault();
        if(this.offset === undefined) {
            this.offset = {
                x: event.clientX-event.offsetX, y: event.clientY-event.offsetY
            }
        }

        if(event.ctrlKey === false || this.isMouseDown === false) return;

        var moveX = this.prevMousePosition === undefined ? 0 : (event.offsetX-this.prevMousePosition.x), 
            moveY = this.prevMousePosition === undefined ? 0 : (event.offsetY-this.prevMousePosition.y);

        this.prevMousePosition = { x: event.offsetX, y: event.offsetY };
        var apos = this.state.anchorPosition;
        this.setState({
            ...this.state,
            anchorPosition: {
                x: apos.x+moveX,
                y: apos.y+moveY
            }
        });
    }

    handleMouseUp = (event) => {
        event.preventDefault();
        this.isMouseDown = false;
        document.removeEventListener ('mousemove', this.handleMouseMove);
        this.prevMousePosition = undefined;
    }

    render () {
        return (
           <>
                <rect
                    id={ this.id }
                    x={ this.state.anchorPosition.x } 
                    y={ this.state.anchorPosition.y } 
                    rx={ this.state.rx }
                    ry={ this.state.ry }
                    width={ this.state.width } 
                    height={ this.state.height }
                    style={{
                        fill: this.state.fill,
                        stroke: this.state.stroke,
                        strokeWidth: this.state.strokeWidth,
                        fillOpacity: this.state.fillOpacity,
                        strokeOpacity: this.state.strokeOpacity,
                        cursor: this.props.cursor
                    }}
                    onContextMenu={ this.openContextMenu }
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp }
                >
                    <title>
                        { this.props.title }
                    </title>
                </rect>
                <ContextMenu 
                    render={ ( open, anchorPosition, handleContextMenuOpen, handleContextMenuClose ) => (
                        this.handleContextMenuOpen = handleContextMenuOpen,
                        <Menu
                            open={ open }
                            onClose={ handleContextMenuClose }
                            anchorReference="anchorPosition"
                            anchorPosition={
                                { top: anchorPosition.y, left: anchorPosition.x }
                            }
                        >
                            <MenuItem onClick={ handleContextMenuClose }>Curve</MenuItem>
                            <MenuItem onClick={ handleContextMenuClose }>Straight</MenuItem>
                            <Divider />
                            <MenuItem onClick={ handleContextMenuClose }>Delete</MenuItem>
                        </Menu>
                    )}
                /> 
           </>
        );
    }
}

export default withMouse("Rectangle", decideMouseCursor)(Rectangle);
