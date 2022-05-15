import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import KeyboardOptionKeyIcon from '@mui/icons-material/KeyboardOptionKey';
import { dispatch, MEVENT_KINDS } from '../../mevent/MeventDispatcher';

const OptionAdditional = (props) => {

    React.useEffect(()=>{
        console.log("Addtional options icon was loaded successfully !");
    }, [])
    
    const handleOnClick = (e) => {
        dispatch({
            kind: MEVENT_KINDS.ADDITIONAL_OPTION_ICON_CLICKED,
            name: "",
            description: "",
            wevt: e,
            value: {
                toolIconId: "additional"
            }
        });
    }

    return (
        <div id="additional" style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Options" sx={{ bgcolor: "#eeff41", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Additional options">
                <IconButton onClick={ handleOnClick }>
                    <KeyboardOptionKeyIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default OptionAdditional;
