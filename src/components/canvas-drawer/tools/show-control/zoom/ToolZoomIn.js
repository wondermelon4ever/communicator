import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import { getPoints } from "../../../views/CanvasTemp";
import { createZoomHandlerSingleton } from './ZoomHandler';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

const ToolZoomIn = (props) => {

    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool zoom-in was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createZoomHandlerSingleton(context.mainContext, context.tempContext));
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
    }

    addMeventListener();
    
    const handleOnClick = (e) => {
        handler.up(e, getPoints());
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Zoom in" sx={{ bgcolor: "#eeff41", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Zoom in">
                <IconButton onClick={ handleOnClick }>
                    <ZoomInIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolZoomIn;
