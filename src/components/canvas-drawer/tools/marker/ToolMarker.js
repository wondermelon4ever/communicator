import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { createStatusDispatcherSingleton, dispatch, MESSAGE_TYPES } from '../../common/StatusDispatcher';

const ToolMarker = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createStatusDispatcherSingleton().addListener(MESSAGE_TYPES.SELECTED_SHAPE, (messageType, message) => {
            if(messageType === MESSAGE_TYPES.SELECTED_SHAPE && message !== 'marker') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch(MESSAGE_TYPES.SELECTED_SHAPE, "marker");
    }

    const handleOnDoubleClick = (e) => {
        console.log("double clicked !!");
    }

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Marker" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
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
