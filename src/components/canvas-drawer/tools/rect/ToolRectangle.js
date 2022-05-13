import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Crop32Icon from '@mui/icons-material/Crop32';
import { createEventDispatcherSingleton, dispatch, EVENT_KINDS } from '../../common/EventDispatcher';

const ToolRectangle = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createEventDispatcherSingleton().addListener(EVENT_KINDS.SELECTED_SHAPE, (event) => {
            if(event.kind === EVENT_KINDS.SELECTED_SHAPE && event.value !== 'rect') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch({
            kind: EVENT_KINDS.SELECTED_SHAPE,
            name: "",
            description: "",
            value: "rect"
        });
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Rectangle" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Rectangle">
                <IconButton onClick={ handleOnClick }>
                    <Crop32Icon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolRectangle;
