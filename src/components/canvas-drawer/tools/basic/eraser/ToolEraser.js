import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';

import { createEraserHandler } from './EraserHandler';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

function EraserIcon (props) {
    return (
        <SvgIcon { ...props } >
            {/* <circle id="p1" cx="17" cy="17" r="3" /> */}
            <path d="M5,15 L5,19,19,19,19,5,13,5" strokeDasharray="1,1" stroke="gray" strokeWidth="1" fill="none"/>
            <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
        </SvgIcon>
    );
}

const ToolEraser = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool eraser was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createEraserHandler(context.mainContext, context.tempContext, selected));
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
            if(mevent.value.shape !== 'eraser') setSelected(false);
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
                shape: "eraser"
            }
        });
    }

    const handleOnDoubleClick = (e) => {
        dispatch({
            kind: MEVENT_KINDS.ERASER_ICON_DOUBLE_CLICKED,
            name: "",
            description: "",
            wevt: e,
            value: {
                toolIconId: "eraser-icon"
            }
        });
    }

    return (
        <div id="eraser-icon" style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Eraser" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Eraser">
                <IconButton onClick={ handleOnClick } onDoubleClick={ handleOnDoubleClick }>
                    <EraserIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolEraser;
