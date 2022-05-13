import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import LineWeightIcon from '@mui/icons-material/LineWeight';

function LineWidthIcon (props) {
    return (
        <SvgIcon { ...props } >
            <svg xmlns="http://www.w3.org/2000/svg" id="bcsvg" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
                <line id="l1" x1="7" y1="15" x2="43" y2="15" stroke="black" strokeWidth="2" />
                <line id="l2" x1="7" y1="25" x2="43" y2="25" stroke="black" strokeWidth="3" />
                <line id="l3" x1="7" y1="35" x2="43" y2="35" stroke="black" strokeWidth="4" />
            </svg>
        </SvgIcon>
    );
}

const OptionLineWidth = (props) => {
    
    const handleOnClick = (e) => {

    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Options" sx={{ bgcolor: "#eeff41", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Additional options">
                <IconButton onClick={ handleOnClick }>
                    <LineWeightIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default OptionLineWidth;
