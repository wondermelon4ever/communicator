import React from 'react';
import TextFieldsIcon from '@mui/icons-material/TextFields';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { blue, pink } from '@mui/material/colors';

const ToolText = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Marker" sx={{ bgcolor: "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Marker">
                <IconButton onClick={ handleOnClick }>
                    <TextFieldsIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolText;
