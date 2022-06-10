import React, { useEffect, useState } from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import ContextMenu from './ContextMenu';

import { createPath } from './LineDrawHelper';

const LinePath = ( props ) => {
    const id = props.id;
    let handleContextMenuOpen = undefined;
    let handleContextMenuclose = undefined;
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
        var newPath = createPath(point1, pointc, point2, lineKind);
        setPath(newPath);
    }

    const changeLineKind = (lineKind) => {
        setLineKind(lineKind);
        handleContextMenuclose();
    }

    const handleOnClick = (event) => {
        props.handleOnLinePathClick(event);
    }

    const openContextMenu = (event) => {
        handleContextMenuOpen(event);
    }

    return (
        <>
            <path 
                id={ id } 
                d={ path }
                stroke={ values.stroke }
                strokeWidth={ values.strokeWidth }
                fill={ values.fill }

                onContextMenu={ openContextMenu }
                onClick={ handleOnClick }

                style={{
                    zIndex: 1000
                }}
                pointerEvents="visiblePainted"
            />
            <ContextMenu
                render={ ( open, anchorPosition, onContextMenuOpen, onContextMenuClose ) => (
                    handleContextMenuOpen = onContextMenuOpen, handleContextMenuclose = onContextMenuClose,
                    <Menu
                        open={ open }
                        onClose={ onContextMenuClose }
                        anchorReference="anchorPosition"
                        anchorPosition={
                            { top: anchorPosition.y, left: anchorPosition.x }
                        }
                    >
                        <MenuItem onClick={ () => changeLineKind ("Curve") }>Curve</MenuItem>
                        <MenuItem onClick={ () => changeLineKind ("Straight") }>Straight</MenuItem>
                        <Divider />
                        <MenuItem onClick={ onContextMenuClose }>Change attributes</MenuItem>
                    </Menu>
                )}
            />
        </>
    )
}

export default LinePath;
