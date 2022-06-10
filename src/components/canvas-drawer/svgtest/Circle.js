import React from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import ContextMenu from './ContextMenu';

class Circle extends React.Component {
    
    static num = 0;

    constructor(props) {
        super(props);

        this.ismousedown = false;
        this.handleContextMenuOpen = undefined;        
        this.state = {
            id: props.cid === undefined ? "circle-"+(Circle.num)++ : props.cid,
            isTemp: props.isTemp === undefined ? false : props.isTemp
        };

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.openContextMenu = this.openContextMenu.bind(this);
    }

    componentDidMount () {
        console.log("Component circle was mounted :" + this.state.id);
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        // console.log("circle updated: " + this.state.id+", " + JSON.stringify(prevProps.position));
    }

    openContextMenu = (event) => {
        this.handleContextMenuOpen(event);
        this.ismousedown = false;
    }

    handleMouseDown = (event) => {
        event.preventDefault();
        this.ismousedown = true;
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    handleMouseUp = (event) => {
        console.log("circle mouse up !!!");
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
        });
        var temp = this.state;
        temp.isTemp = false;
        this.setState(temp);
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
                    fill={ isTemp === true ? "red" : fill }
                    onContextMenu={ this.openContextMenu }
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp }
                    style={{ display: show ? "block" : "none" }}
                    onClick={ this.props.toggleTempVertexShow }
                    pointerEvents="all"
                />
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

export default Circle;
