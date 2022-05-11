import React from 'react';
import { red } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SaveAsIcon from '@mui/icons-material/SaveAs';

var num = 0;
const SaveTool = (props) => {

    const [canvasName, setCanvasName] = React.useState(props.canvasName);
    const [saving, setSaving] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const [idx, setIdx] = React.useState(num++);

    const handleSave = async (e) => {
        await applyPosition(e.target);
        var canvas = document.getElementById(canvasName);
        canvas.toBlob( async (blob) => {
            const dirHandle = await window.showSaveFilePicker({ suggestedName: "canvas.jpg" });
            const writable  = await dirHandle.createWritable();
            setSaving(true);
            await writable.write(blob);
            await writable.close();
            setSaving(false);            
        });
    }

    const applyPosition = async () => {
        var ele = document.querySelector("#save-as-" + idx);
        const rect = ele.getBoundingClientRect();
        const parRect = ele.parentElement.getBoundingClientRect();
        setPosition({
            top: rect.top-parRect.top-3,
            left: rect.left-parRect.left-3
        })
    }

    return (
        <div id={ "save-as-" + idx }  style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Save as image" sx={{ bgcolor: "#FFFFFF", width: 32, height: 32 }} >
                <Tooltip title="Save as image">
                    <IconButton onClick={ handleSave }>
                        <SaveAsIcon fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Avatar>
            {
                saving && (
                    <CircularProgress 
                        size={48}
                        sx={{
                            color: red[500],
                            position: 'absolute',
                            top: position.top,
                            left: position.left,
                            zIndex: 1
                        }}
                    />
                )
            }
        </div>
    )
}

export default SaveTool;
