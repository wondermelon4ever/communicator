import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Crop32Icon from '@mui/icons-material/Crop32';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

const ToolRectangle = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.kind === MEVENT_KINDS.SELECTED_SHAPE && mevent.value.shape !== 'rect') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch({
            kind: MEVENT_KINDS.SELECTED_SHAPE,
            name: "",
            description: "",
            wevt: e,
            value: {
                shape: "rect"
            }
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
