import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import { createArrowHandlerSingleton } from './ArrowHandler';

const ToolArrow = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool arrow was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createArrowHandlerSingleton(context.mainContext, context.tempContext, selected));
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
            if(mevent.value.shape !== 'arrow') setSelected(false);
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
                shape: "arrow"
            }
        });
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Arrow" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Arrow">
                <IconButton onClick={ handleOnClick }>
                    <ArrowUpwardIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolArrow;
