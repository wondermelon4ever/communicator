import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { blue, pink } from '@mui/material/colors';
import SvgIcon from '@mui/material/SvgIcon';

const ToolPdf = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Marker" sx={{ bgcolor: "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Marker">
                <IconButton onClick={ handleOnClick }>
                    <PictureAsPdfIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolPdf;
