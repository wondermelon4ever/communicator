import React from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';

class Circle extends React.Component {
    
    static num = 0;

    constructor(props) {
        super(props);

        this.ismousedown = false;
        
        this.state = {
            id: props.cid === undefined ? "circle-"+(Circle.num)++ : props.cid,
            contextMenuOpen: false,
            contextMenuAnchorPoint: { 
                x: 10, y: 10
            },
            isTemp: props.isTemp === undefined ? false : props.isTemp
        };

        this.handleContextMenuOpen = this.handleContextMenuOpen.bind(this);
        this.handleContextMenuClose = this.handleContextMenuClose.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount () {
        console.log("component circle was mounted :" + this.state.id);
    }

    handleContextMenuOpen = (event) => {
        event.preventDefault();
        var temp = this.state;
        temp.contextMenuAnchorPoint = {
            x: event.pageX,
            y: event.pageY
        };
        temp.contextMenuOpen = true;
        this.setState(temp);
        this.ismousedown = false;
    }

    handleMouseDown = (event) => {
        event.preventDefault();
        this.ismousedown = true;
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    handleMouseUp = (event) => {
        event.preventDefault();
        this.ismousedown = false;
        document.removeEventListener ('mousemove', this.handleMouseMove);
    }

    handleMouseMove = (event) => {
        event.preventDefault();
        if(!this.ismousedown) return;
        this.props.handlePositionChanged(this.props.cid, {
            x: event.offsetX,
            y: event.offsetY
        }, false);
        var temp = this.state;
        temp.isTemp = false;
        this.setState(temp);
    }

    handleContextMenuClose = () => {
        this.setState({
            ...this.state,
            contextMenuOpen: false
        })
    }

    render () {
        const { id, 
                position, 
                radius, 
                stroke, 
                strokeWidth, 
                fill, 
                isTemp, 
                show } = this.props;
        return(
            <>
                <circle 
                    id={ id } 
                    cx={ position.x }
                    cy={ position.y }
                    r={ radius } 
                    stroke={ stroke } 
                    strokeWidth={ strokeWidth } 
                    fill={ isTemp === true ? "gray" : fill }
                    onContextMenu={ this.handleContextMenuOpen }
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp }
                    style={{ display: show ? "block" : "none" }}
                    onClick={ this.props.toggleTempVertexShow }
                />
                <Menu
                    open={ this.state.contextMenuOpen }
                    onClose={ this.handleContextMenuClose }
                    anchorReference="anchorPosition"
                    anchorPosition={
                        { top: this.state.contextMenuAnchorPoint.y, left: this.state.contextMenuAnchorPoint.x }
                    }
                >
                    <MenuItem onClick={ this.handleContextMenuClose }>Curve</MenuItem>
                    <MenuItem onClick={ this.handleContextMenuClose }>Straight</MenuItem>
                    <Divider />
                    <MenuItem onClick={ this.handleContextMenuClose }>Delete</MenuItem>
                </Menu>
            </>
        );
    }
}

export default Circle;
