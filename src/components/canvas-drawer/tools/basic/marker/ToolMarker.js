import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { createMarkerHandler } from './MarkerHandler';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

const ToolMarker = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool marker was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createMarkerHandler(context.mainContext, context.tempContext, selected));
        }
    }, [context]);

    const addMeventListener = () => {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.CANVAS_INITED, (mevent) => {
            setContext({
                mainContext: mevent.value.mainContext,
                tempContext: mevent.value.tempContext
            });
        });
        
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'marker') setSelected(false);
            else setSelected(true);
        });
    }

    addMeventListener();
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch({
            kind: MEVENT_KINDS.SELECTED_SHAPE,
            name: "",
            description: "",
            wevt: e,
            value: {
                shape: "marker"
            }
        });
    }

    const handleOnDoubleClick = (e) => {
        dispatch({
            kind: MEVENT_KINDS.MARKER_ICON_DOUBLE_CLICKED,
            name: "",
            description: "",
            wevt: e,
            value: {
                toolIconId: "marker-icon"
            }
        });
    }

    return (
        <div id="marker-icon" style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Marker" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Marker">
                <IconButton onClick={ handleOnClick } onDoubleClick={ handleOnDoubleClick }>
                    <DriveFileRenameOutlineIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolMarker;
