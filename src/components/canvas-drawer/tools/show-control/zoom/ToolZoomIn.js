import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ToolZoomIn = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Zoom in" sx={{ bgcolor: "#eeff41", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Zoom in">
                <IconButton onClick={ handleOnClick }>
                    <ZoomInIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolZoomIn;
