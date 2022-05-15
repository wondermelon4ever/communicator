import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

const ToolZoomOut = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Zoom out" sx={{ bgcolor: "#eeff41", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Zoom out">
                <IconButton onClick={ handleOnClick }>
                    <ZoomOutIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolZoomOut;
