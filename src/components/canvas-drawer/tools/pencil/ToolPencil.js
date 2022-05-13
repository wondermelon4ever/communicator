import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import { createEventDispatcherSingleton, dispatch, EVENT_KINDS } from '../../common/EventDispatcher';

const ToolPencil = (props) => {

    const [selected, setSelected] = React.useState(props.selected);
    const [mainContext, setMainContext] = React.useState(undefined);
    const [tempContext, setTempContext] = React.useState(undefined);
    const [points, setPoints] = React.useState([]);

    React.useEffect(()=>{
        createEventDispatcherSingleton().addListener(EVENT_KINDS.SELECTED_SHAPE, (event) => {
            if(event.kind === EVENT_KINDS.SELECTED_SHAPE && event.value !== 'pencil') setSelected(false);
            else setSelected(true);
        });
        createEventDispatcherSingleton().addListener(EVENT_KINDS.CANVAS_INITED, (event) => {
            setMainContext(event.value.mainContext);
            setTempContext(event.value.tempContext);
            // handler를 초기화 해야 함
        });
        createEventDispatcherSingleton().addListener(EVENT_KINDS.POINTS_CHANGED, (event) => {
            setPoints(event.value);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch({
            kind: EVENT_KINDS.SELECTED_SHAPE,
            name: "",
            description: "",
            value: "pencil"
        });
    }

    const handleOnDoubleClick = (e) => {
        dispatch({
            kind: EVENT_KINDS.PENCIL_ICON_DOUBLE_CLICKED,
            name: "",
            description: "",
            value: {
                toolIconId: "pencil-icon"
            }
        });
    }

    return (
        <div id="pencil-icon" style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
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
