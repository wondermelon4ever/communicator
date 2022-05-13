import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import { createStatusDispatcherSingleton, dispatch, MESSAGE_TYPES } from '../../common/StatusDispatcher';

const ToolPencil = (props) => {

    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createStatusDispatcherSingleton().addListener(MESSAGE_TYPES.SELECTED_SHAPE, (messageType, message) => {
            if(messageType === MESSAGE_TYPES.SELECTED_SHAPE && message !== 'pencil') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch(MESSAGE_TYPES.SELECTED_SHAPE, "pencil");
    }

    const handleOnDoubleClick = (e) => {
        console.log("double clicked !!");
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Pencil" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Pencil">
                <IconButton onClick={ handleOnClick } onDoubleClick={ handleOnDoubleClick }>
                    <EditIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolPencil;
