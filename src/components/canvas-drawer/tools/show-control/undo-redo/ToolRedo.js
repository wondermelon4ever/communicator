import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RedoIcon from '@mui/icons-material/Redo';

import { createUndoRedoHandlerSingleton } from './UndoRedoHandler';
import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

const ToolRedo = (props) => {

    const [existRedo, setExistRedo] = React.useState(false);
    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool undoredo was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createUndoRedoHandlerSingleton(context.mainContext, context.tempContext, selected));
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

        dispatcher.addListener(MEVENT_KINDS.NO_EXIST_REDO, (mevent) => {
            setExistRedo(false);
        });

        dispatcher.addListener(MEVENT_KINDS.EXIST_REDO, (mevent) => {
            setExistRedo(true);
        });
    }

    addMeventListener();
    
    const handleOnClick = (e) => {
        e.preventDefault();
        handler.redo(e);
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Redo" sx={{ bgcolor: "#f0f4c3", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Redo">
                <span>
                <IconButton onClick={ handleOnClick } disabled={ existRedo ? false : true }>
                    <RedoIcon fontSize="large" color={ existRedo ? "action" : "disabled" } />
                </IconButton>
                </span>
            </Tooltip>
            
            </Avatar>
        </div>
    )
}

export default ToolRedo;
