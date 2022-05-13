import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ImageIcon from '@mui/icons-material/Image';
import { createStatusDispatcherSingleton, dispatch, MESSAGE_TYPES } from '../../common/StatusDispatcher';

const ToolImage = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createStatusDispatcherSingleton().addListener(MESSAGE_TYPES.SELECTED_SHAPE, (messageType, message) => {
            if(messageType === MESSAGE_TYPES.SELECTED_SHAPE && message !== 'image') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch(MESSAGE_TYPES.SELECTED_SHAPE, "image");
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Image" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Image">
                <IconButton onClick={ handleOnClick }>
                    <ImageIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolImage;
