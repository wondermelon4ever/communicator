import React from 'react';
import { Menu, MenuItem } from '@mui/material';

var num = 0;
var handleMouseDrag = undefined;
const Circle = (props) => {

    const [id, setId] = React.useState(props.id === undefined ? "circle-"+(num)++ : props.id);
    const [position, setPosition] = React.useState(props.position);
    const [radius, setRadius] =  React.useState(props.radius);
    const [stroke, setStroke] = React.useState(props.stroke);
    const [strokeWidth, setStrokeWidth] = React.useState(props.strokeWidth);
    const [fill, setFill] = React.useState(props.fill);

    const [contextMenuOpen, setContextMenuOpen] = React.useState(false);
    const [contextMenuAnchorPoint, setContextMenuAnchorPoint] = React.useState({ x: 10, y: 10 });

    const [isTemp, setIsTemp] = React.useState(props.isTemp === undefined ? false : props.isTemp);
    const [ismousedown, setIsmousedown] = React.useState(false);

    React.useEffect(()=>{
        console.log("component circle was mounted :" + id);
    }, []);

    React.useEffect(()=>{
        setPosition(props.position);
    }, [props.position]);

    const handleContextMenuOpen = (event) => {
        event.preventDefault();
        setContextMenuAnchorPoint({
            x: event.pageX,
            y: event.pageY
        });
        setContextMenuOpen(true);
        setIsmousedown(false);
    }

    const handleMouseDown = (event) => {
        setIsmousedown(true);
        handleMouseDrag = handleMouseMove;
        document.addEventListener('mousemove', handleMouseDrag);
    }

    const handleMouseUp = (event) => {
        document.removeEventListener ('mousemove', handleMouseDrag, false);
        setIsmousedown(false);
    }

    const handleMouseMove = (event) => {
        props.handlePositionChanged(props.cidx, {
            x: event.offsetX,
            y: event.offsetY
        });
        setIsTemp(false);
    }

    const handleContextMenuClose = () => {
        setContextMenuOpen(false);
    }

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
                onContextMenu={ handleContextMenuOpen }
                onMouseDown={ handleMouseDown }
                onMouseUp={ handleMouseUp }
            />
            <Menu
                open={ contextMenuOpen !== false }
                onClose={ handleContextMenuClose }
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenuOpen !== false
                    ? { top: contextMenuAnchorPoint.y, left: contextMenuAnchorPoint.x }
                    : undefined
                }
            >
                <MenuItem onClick={ handleContextMenuClose }>Delete</MenuItem>
                <MenuItem onClick={ handleContextMenuClose }>Delete</MenuItem>
            </Menu>
        </>
    );
}

export default Circle;
