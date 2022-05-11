import React from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List'
import Draggable from 'react-draggable';
import SaveTool from './SaveTool';
import ToolPencil from '../tools/pencil/ToolPencil';
import ToolMarker from '../tools/marker/ToolMarker';
import ToolEraser from '../tools/eraser/ToolEraser';
import ToolText from '../tools/text/ToolText';
import ToolImage from '../tools/file/ToolImage';
import ToolPdf from '../tools/pdf/ToolPdf';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ToolShowMoreOrLess from './ToolShowMoreOrLess';

const Toolbox2 = (props) => {

    const [toolbarShow, setToolbarShow] = React.useState(true);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

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

    return (
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
            <div style={{ position: 'absolute', top: "10px", left: '500px', backgroundColor: "#01579b", opacity: 0.75 }}>
                <strong>
                    <div style={{ cursor: "move", height: 20, minWidth: 250, display: "flex" }} >
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
                                <Tooltip title="Toolbar show or hide">
                                    <IconButton onClick={ handleToolbarToggle } sx={{ width: "25px" }}>
                                    {
                                        toolbarShow ? 
                                        <ArrowDropUpIcon   sx={{ color: "#FFFFFF", width: 32, height: 32 }}/> 
                                        : 
                                        <ArrowDropDownIcon sx={{ color: "#FFFFFF", width: 32, height: 32 }}/>
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
                            <ToolPencil />
                            <ToolMarker />
                            <ToolEraser />
                            <ToolText />
                            <Divider style={{ marginLeft: 5, marginRight: 5 }} orientation="vertical"/>
                            <ToolImage />
                            <ToolPdf />
                            <Divider style={{ marginLeft: 5, marginRight: 5 }} orientation="vertical"/>
                            <SaveTool canvasName="main-canvas" />
                            <ToolShowMoreOrLess />
                        </List>
                    </div>
                </div>              
            </div>
        </Draggable>
    );
}

export default Toolbox2;
