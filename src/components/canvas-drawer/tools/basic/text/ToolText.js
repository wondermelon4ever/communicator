import React from 'react';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createTextHandlerSingleton } from './TextHandler';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import initKeyboardEventListener from '../../KeyboardListener';

const ToolText = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool text was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createTextHandlerSingleton(context.mainContext, context.tempContext, selected));
        }
        initKeyboardEventListener();
        console.log("Keyboard event listener was loaded successfully.");
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
            if(mevent.value.shape !== 'text') setSelected(false);
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
                shape: "text"
            }
        });
    }

    const handleOnDoubleClick = (e) => {
        dispatch({
            kind: MEVENT_KINDS.TEXT_ICON_DOUBLE_CLICKED,
            name: "",
            description: "",
            wevt: e,
            value: {
                toolIconId: "text-icon"
            }
        });
    }

    return (
        <div id="text-icon" style={{ margine: "3px", padding: "3px" }}>
            <Avatar alt="Text" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Text">
                <IconButton onClick={ handleOnClick } onDoubleClick={ handleOnDoubleClick }>
                    <TextFieldsIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolText;
