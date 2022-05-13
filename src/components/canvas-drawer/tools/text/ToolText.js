import React from 'react';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createEventDispatcherSingleton, dispatch, EVENT_KINDS } from '../../common/EventDispatcher';

const ToolText = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createEventDispatcherSingleton().addListener(EVENT_KINDS.SELECTED_SHAPE, (event) => {
            if(event.kind === EVENT_KINDS.SELECTED_SHAPE && event.value !== 'text') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch({
            kind: EVENT_KINDS.SELECTED_SHAPE,
            name: "",
            description: "",
            value: "text"
        });
    }

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Text" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Text">
                <IconButton onClick={ handleOnClick }>
                    <TextFieldsIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolText;
