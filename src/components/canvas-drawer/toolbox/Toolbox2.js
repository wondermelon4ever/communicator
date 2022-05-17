import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List'
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';

import Draggable from 'react-draggable';

import About from './About';
import OptionAdditional from '../tools/tool-options/OptionAdditional';
import OptionColorPalette from '../tools/tool-options/OptionColorPalette';
import OptionLineWidth from '../tools/tool-options/OptionLineWidth';
import SaveTool from '../tools/save/SaveTool';
import ToolArc from '../tools/advanced/arc/ToolArc';
import ToolArrow from '../tools/advanced/arrow/ToolArrow';
import ToolBezierCurve from '../tools/advanced/bezier/ToolBezierCurve';
import ToolDragLastPath from '../tools/advanced/edit/ToolDragLastPath';
import ToolDragAllPaths from '../tools/advanced/edit/ToolDragAllPaths';
import ToolEraser from '../tools/basic/eraser/ToolEraser';
import ToolImage from '../tools/basic/image/ToolImage';
import ToolLine from '../tools/advanced/line/ToolLine';
import ToolMarker from '../tools/basic/marker/ToolMarker';
import ToolPdf from '../tools/basic/pdf/ToolPdf';
import ToolPencil from '../tools/basic/pencil/ToolPencil';
import ToolQuadraticCurve from '../tools/advanced/quadratic/ToolQuadraticCurve';
import ToolRectangle from '../tools/advanced/rect/ToolRectangle';
import ToolRedo from '../tools/show-control/undo-redo/ToolRedo';
import ToolSelection from './ToolSelection';
import ToolShowMoreOrLess from './ToolShowMoreOrLess';
import ToolText from '../tools/basic/text/ToolText';
import ToolUndo from '../tools/show-control/undo-redo/ToolUndo';
import ToolZoomIn from '../tools/show-control/zoom/ToolZoomIn';
import ToolZoomOut from '../tools/show-control/zoom/ToolZoomOut';
import { getContext } from '../util/Utils'

import { dispatch, MEVENT_KINDS } from '../mevent/MeventDispatcher';

const Toolbox2 = (props) => {

    const [count, setCount] = React.useState([ 2, 6, 2, 3, 4 ]);
    const [expanded, setExpanded] = React.useState(false);
    const [toolbarShow, setToolbarShow] = React.useState(true);
    const [checkViewShow, setCheckViewShow] = React.useState(false);
    const [checkedList, setCheckedList] = React.useState({
        pencil: true,
        marker: true,
        eraser: true,
        text: true,
        image: true,
        pdf: true,
        dragLastPath: true,
        dragAllPaths: true,
        line: true,
        arrow: true,
        zoomIn: true,
        zoomOut: true,
        arc: true,
        rectangle: true,
        quadraticCurve: true,
        bezierCurve: true,
        undo: true,
        redo: true,
        lineWidthSet: true,
        colorSet: true,
        additionalOptionSet: true,
        saveAs: true
    });
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [mainContext, setMainContext] = React.useState(undefined);
    const [tempContext, setTempContext] = React.useState(undefined);
    const [aboutShow, setAboutShow] = React.useState(false);

    React.useEffect(()=>{
        setMainContext(getContext(props.mainCanvasName));
        setTempContext(getContext(props.tempCanvasName));
        dispatch({
            kind: MEVENT_KINDS.CANVAS_INITED,
            name: "",
            description: "",
            value: {
                mainContext: getContext(props.mainCanvasName),
                tempContext: getContext(props.tempCanvasName)
            }
        });
        
    }, []);

    const trackPos = (e, data) => {
        setPosition({ x: data.x, y: data.y });
    }

    const handleOnStart = (e, data) => {
        // console.log("handle start !!");
    }

    const handleDrag = (e, data) => {
        // console.log("handle drag !!");
        trackPos(e, data);
    }

    const handleStop = (e, data) => {
        // console.log("handle stop !!");
    }

    const handleToolbarToggle = () => {
        setToolbarShow(!toolbarShow);
    }

    const saveChange = (sels) => {
        var count = [ 0, 0, 0, 0, 0 ];
        if(sels.image === true) count[0]++;
        if(sels.pdf === true) count[0]++;

        if(sels.line === true) count[1]++;
        if(sels.arrow === true) count[1]++;
        if(sels.arc === true) count[1]++;
        if(sels.rectangle === true) count[1]++;
        if(sels.quadraticCurve === true) count[1]++;
        if(sels.bezierCurve === true) count[1]++;

        if(sels.dragLastPath === true) count[2]++;
        if(sels.dragAllPaths === true) count[2]++;

        if(sels.lineWidthSet === true) count[3]++;
        if(sels.colorSet === true) count[3]++;
        if(sels.additionalOptionSet === true) count[3]++;

        if(sels.undo === true) count[4]++;
        if(sels.redo === true) count[4]++;
        if(sels.zoomIn === true) count[4]++;
        if(sels.zoomOut === true) count[4]++;

        setCount(count);
        setCheckedList(sels);
        setCheckViewShow(false);
    }

    const openToolCheckView = () => {
        setCheckViewShow(!checkViewShow);
    }

    const handleAboutClose = () => {
        setAboutShow(false);
    }

    const handleAboutOpen = () => {
        setAboutShow(true);
    }

    return (
        <div>
        <Draggable 
            handle="strong"
            onStart={ handleOnStart }
            onDrag={ handleDrag }
            onStop={ handleStop }
            position={{
                x: position.x,
                y: position.y
            }}
        >
            <div style={{ position: 'absolute', top: "5px", left: '5px', backgroundColor: "#01579b", opacity: 0.75 }}>
                <strong>
                    <div style={{ cursor: "move", height: 24, minWidth: 250, display: "flex" }} >
                        <Box sx={{ display: 'flex', flexGrow: 1 }} m={0} pt={ 0 } pl={ 0 }>
                            <Typography sx={{ paddingLeft: 1, fontSize: 14, color: "#FFFFFF" }}>
                                Drawing Tools
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box
                                item
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                                pr="5px"
                            >
                                <Tooltip title="" style={{ padding: 1, margin: 0 }}>
                                    <IconButton onClick={ handleAboutOpen }>
                                        <InfoIcon sx={{ color: "#FFFFFF", width: 16, height: 16 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="" style={{ padding: 1, margin: 0 }}>
                                    <IconButton >
                                        <HelpIcon sx={{ color: "#FFFFFF", width: 16, height: 16 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="" style={{ padding: 1, margin: 0 }}>
                                    <IconButton onClick={ openToolCheckView }>
                                        <SettingsIcon sx={{ color: "#FFFFFF", width: 16, height: 16 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Toolbar show or hide" style={{ padding: 1, margin: 0 }}>
                                    <IconButton onClick={ handleToolbarToggle } sx={{ width: "25px" }}>
                                    {
                                        toolbarShow ? 
                                        <ArrowDropUpIcon   sx={{ color: "#bdbdbd", width: 32, height: 32 }}/> 
                                        : 
                                        <ArrowDropDownIcon sx={{ color: "#bdbdbd", width: 32, height: 32 }}/>
                                    }
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </div>
                </strong>
                <Divider />
                <div 
                    style={{
                        display: toolbarShow ? "block" : "none"
                    }}
                >
                    <div style={{ display: "flex" }} >
                        {/* <List sx={{ display: "flex", flexDirection: "row", margin: '3px', padding: "3px", border: '1px solid white' }}> */}
                        <List sx={{ display: "flex", flexDirection: "row", margin: '1px', padding: "1px" }} >
                            <ToolPencil show={ checkedList.pencil } selected={ true } />
                            <ToolMarker show={ checkedList.marker } selected={ false }/>
                            <ToolEraser show={ checkedList.eraser } selected={ false }/>
                            <ToolText show={ checkedList.text } selected={ false }/>

                            <Divider style={{ marginLeft: 5, marginRight: 5, display : count[0] > 0 ? "block" : "none" }} orientation="vertical"/>
                            <ToolImage show={ checkedList.image } selected={ false }/>
                            <ToolPdf show={ checkedList.pdf } selected={ false }/>

                            <Divider 
                                style={{ marginLeft: 5, marginRight: 5, display: expanded && count[1] > 0 ? "block": "none" }} 
                                orientation="vertical"/>
                            <ToolLine show={ checkedList.line && expanded } selected={ false }/>
                            <ToolArrow show={ checkedList.arrow && expanded } selected={ false }/>
                            <ToolArc show={ checkedList.arc && expanded } selected={ false }/>
                            <ToolRectangle show={ checkedList.rectangle && expanded } selected={ false }/>
                            <ToolQuadraticCurve show={ checkedList.quadraticCurve && expanded } selected={ false }/>
                            <ToolBezierCurve show={ checkedList.bezierCurve && expanded } selected={ false }/>

                            <Divider 
                                style={{ marginLeft: 5, marginRight: 5, display: expanded && count[2] > 0 ? "block": "none" }} 
                                orientation="vertical"/>
                            <ToolDragLastPath show={ checkedList.dragLastPath && expanded } selected={ false }/>
                            <ToolDragAllPaths show={ checkedList.dragAllPaths && expanded } selected={ false }/>

                            <Divider 
                                style={{ marginLeft: 5, marginRight: 5, display: expanded && count[3] > 0 ? "block": "none" }} 
                                orientation="vertical"/>
                            <OptionLineWidth show={ checkedList.lineWidthSet && expanded } selected={ false }/>
                            <OptionColorPalette show={ checkedList.colorSet && expanded } selected={ false }/>
                            <OptionAdditional show={ checkedList.additionalOptionSet && expanded } selected={ false }/>

                            <Divider 
                                style={{ marginLeft: 5, marginRight: 5, display: expanded && count[4] > 0 ? "block": "none" }} 
                                orientation="vertical"/>
                            <ToolZoomIn show={ checkedList.zoomIn && expanded } selected={ false }/>
                            <ToolZoomOut show={ checkedList.zoomOut && expanded } selected={ false }/>
                            <ToolUndo show={ checkedList.undo && expanded } selected={ false }/>
                            <ToolRedo show={ checkedList.redo && expanded } selected={ false }/>

                            <Divider style={{ marginLeft: 5, marginRight: 5 }} orientation="vertical"/>
                            <SaveTool canvasName="main-canvas" />
                            <ToolShowMoreOrLess 
                                expanded={ expanded }
                                toggleExpanded={()=>{
                                    setExpanded(!expanded);
                                }}
                            />
                        </List>
                    </div>
                </div>              
            </div>
        </Draggable>
        <ToolSelection show={ checkViewShow } saveChange={ saveChange } selections={ checkedList }/>
        <About show={ aboutShow } onClose={ handleAboutClose } />
        </div>
    );
}

export default Toolbox2;
