import React from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import ContextMenu from './ContextMenu';

export default class Rectangle extends React.Component {

    constructor(props) {
        super(props);
        this.id = props.id;
        this.isMouseDown = false;
        this.handleContextMenuOpen = undefined;
        this.prevMousePosition = undefined;
        this.isMouseInside = false;

        this.state = {
            anchorPosition: {
                x: props.position.x,
                y: props.position.y
            },
            offset: {
                x: props.offset.x,
                y: props.offset.y
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

            mouseCursor: "pointer",
            isSelected: false,
        }

        this.decideMouseCursor = this.decideMouseCursor.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseLeave= this.handleMouseLeave.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.openContextMenu = this.openContextMenu.bind(this);
    }

    openContextMenu = (event) => {
        console.log("open context menu !!!");
        this.handleContextMenuOpen(event);
        this.isMouseDown = false;
    }

    handleMouseDown = (event) => {
        event.preventDefault();
        this.isMouseDown = true;
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    decideMouseCursor = (event) => {
        // const posX = event.offsetX-this.state.offset.x, posY = event.clientY-this.state.offset.y;
        console.log("event.offsetX=>" + event.offsetX);
        const posX = event.offsetX, posY = event.clientY;
        var cursor = "move";
        if(posY < this.state.anchorPosition.y+20) {
            if(posX < this.state.anchorPosition.x+20) {
                cursor = "nw-resize";
            } else if(posX > this.state.anchorPosition.x+this.state.width-20) {
                cursor = "ne-resize";
            } else {
                cursor = "n-resize";
            }
        } else if(posY > this.state.anchorPosition.y+this.state.height-20) {
            if(posX < this.state.anchorPosition.x+20) {
                cursor = "sw-resize";
            } else if(posX > this.state.anchorPosition.x+this.state.width-20) {
                cursor = "se-resize";
            } else {
                cursor = "s-resize";
            }
        } else {
            if(posX < this.state.anchorPosition.x + 20) {
                cursor = "w-resize";
            } else if(posX > this.state.anchorPosition.x+this.state.width-20) {
                cursor = "e-resize";
            }
        }
 
        this.setState({
            ...this.state,
            mouseCursor: cursor
        })
    }

    handleMouseMove = (event) => {
        event.preventDefault();
        if(this.isMouseInside === true) {
            this.decideMouseCursor(event);
        }

        if(event.ctrlKey === false || this.isMouseDown === false) return;

        var moveX = this.prevMousePosition === undefined ? 0 : (event.offsetX-this.prevMousePosition.x), 
            moveY = this.prevMousePosition === undefined ? 0 : (event.offsetY-this.prevMousePosition.y);

        this.prevMousePosition = { x: event.offsetX, y: event.offsetY };

        this.setState({
            ...this.props,
            anchorPosition: {
                x: this.state.anchorPosition.x+moveX,
                y: this.state.anchorPosition.y+moveY
            }
        });
    }

    handleMouseUp = (event) => {
        event.preventDefault();
        this.isMouseDown = false;
        document.removeEventListener ('mousemove', this.handleMouseMove);
        this.prevMousePosition = undefined;
    }

    handleMouseOver = (event) => {
        this.isMouseInside = true;
    }

    handleMouseLeave = (event) => {
        this.setState({
            ...this.state,
            mouseCursor: "pointer"
        })
        this.isMouseInside = false;
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

                        cursor: this.state.mouseCursor
                    }}
                    onContextMenu={ this.openContextMenu }
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp }
                    onMouseOver={ this.handleMouseOver }
                    onMouseLeave={ this.handleMouseLeave }
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
