import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { blue, pink } from '@mui/material/colors';
import SvgIcon from '@mui/material/SvgIcon';

const ToolMarker = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Marker" sx={{ bgcolor: "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Marker">
                <IconButton onClick={ handleOnClick }>
                    <DriveFileRenameOutlineIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolMarker;
