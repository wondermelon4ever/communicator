import React, { useEffect, useState } from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';

const LinePath = ( props ) => {
    const id = props.id;
    const [lineKind, setLineKind] = useState(props.lineKind);
    const [point1, setPoint1] = useState(props.point1);
    const [point2, setPoint2] = useState(props.point2);
    const [pointc, setPointc] = useState(props.pointc);

    // 나중에 path별로 변경할 수 있는 속성들 (컨텍스트 메뉴에서 특정 라인만 변경할 수도 있음)
    const [values, setValues] = useState({
        stroke: props.values.stroke,
        strokeWidth: props.values.strokeWidth,
        fill: props.values.fill,
    });
    const [path, setPath] = useState("");
       
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuAnchorPoint, setContextMenuAnchorPoint] = useState({
        x: 10, y: 10
    });

    useEffect(()=>{
        makePath();
    }, []);

    useEffect(()=>{
        makePath();
        setPoint1(props.point1);
    }, [props.point1]);

    useEffect(()=>{
        makePath();
        setPoint2(props.point2);
    }, [props.point2]);

    useEffect(()=>{
        makePath();
        setPointc(props.pointc);
    }, [props.point2]);

    useEffect(()=>{
        makePath();
    }, [lineKind]);

    const makePath = () => {
        var newPath = "M"+point1.x+","+point1.y+" ";
        if(lineKind === "Straight") {
            newPath += "L"+point1.x+","+point1.y+","+point2.x+","+point2.y;
        } else if(lineKind === "Curve") {
            newPath += "Q"+pointc.x+","+pointc.y+","+point2.x+","+point2.y;
        } else {
            newPath = "";
        }
        setPath(newPath);
    }

    const changeLineKind = (lineKind) => {
        setLineKind(lineKind);
        setContextMenuOpen(false);
    }


    const handleContextMenuClose = () => {
        setContextMenuOpen(false);
    }

    const handleOnClick = (event) => {
        props.handleOnLinePathClick(event);
    }

    const handleContextMenuOpen = (event) => {
        event.preventDefault();
        setContextMenuOpen(true);
        setContextMenuAnchorPoint({
            x: event.pageX,
            y: event.pageY
        });
    }

    return (
        <>
            <path 
                id={ id } 
                d={ path }
                stroke={ values.stroke }
                strokeWidth={ values.strokeWidth }
                fill={ values.fill }

                onContextMenu={ handleContextMenuOpen }
                onClick={ handleOnClick }
            />
            <Menu
                open={ contextMenuOpen }
                onClose={ handleContextMenuClose }
                anchorReference="anchorPosition"
                anchorPosition={
                    { top: contextMenuAnchorPoint.y, left: contextMenuAnchorPoint.x }
                }
            >
                <MenuItem onClick={ () => changeLineKind ("Curve") }>Curve</MenuItem>
                <MenuItem onClick={ () => changeLineKind ("Straight") }>Straight</MenuItem>
                <Divider />
                <MenuItem onClick={ handleContextMenuClose }>Change attributes</MenuItem>
            </Menu>
        </>
    )
}

export default LinePath;
