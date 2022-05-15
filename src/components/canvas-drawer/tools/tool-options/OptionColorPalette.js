import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PaletteIcon from '@mui/icons-material/Palette';
import { dispatch, MEVENT_KINDS } from '../../mevent/MeventDispatcher';

const OptionColorPalette = (props) => {

    React.useEffect(()=>{
        console.log("Color palette icon was loaded successfully !");
    }, [])
    
    const handleOnClick = (e) => {
        dispatch({
            kind: MEVENT_KINDS.COLOR_PALETTE_ICON_CLICKED,
            name: "",
            description: "",
            wevt: e,
            value: {
                toolIconId: "colors"
            }
        });
    }

    return (
        <div id="colors" style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Color set" sx={{ bgcolor: "#eeff41", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Color set">
                <IconButton onClick={ handleOnClick }>
                    <PaletteIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default OptionColorPalette;
