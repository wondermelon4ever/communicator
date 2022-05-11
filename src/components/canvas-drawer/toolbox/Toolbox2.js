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

const Toolbox2 = (props) => {

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
            <div style={{ position: 'absolute', top: "10px", left: '500px', backgroundColor: "#455a64", opacity: 0.75 }}>
                <strong>
                    <div style={{ cursor: "move", height: 20 }} >
                        
                    </div>
                </strong>
                <Divider />
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
                    </List>
                </div>                
            </div>
        </Draggable>
    );
}

export default Toolbox2;
