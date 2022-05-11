import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';

const ToolPencil = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Pencil" sx={{ bgcolor: "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Pencil">
                <IconButton onClick={ handleOnClick }>
                    <EditIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolPencil;
