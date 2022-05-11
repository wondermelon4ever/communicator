import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { blue, pink } from '@mui/material/colors';
import SvgIcon from '@mui/material/SvgIcon';

function EraserIcon (props) {
    return (
        <SvgIcon { ...props } >
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z"
            />
        </SvgIcon>
    );
}


const ToolEraser = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Pencil" sx={{ bgcolor: "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Pencil">
                <IconButton onClick={ handleOnClick }>
                    <EraserIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolEraser;