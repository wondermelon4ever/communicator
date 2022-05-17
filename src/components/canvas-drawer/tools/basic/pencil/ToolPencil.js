import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import { createPencilHandlerSingleton } from './PencilHandler';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

const ToolPencil = (props) => {

    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool pencil was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createPencilHandlerSingleton(context.mainContext, context.tempContext, selected));
        }
        dispatch({
            kind: MEVENT_KINDS.PENCIL_TOOL_INITED,
            name: "",
            description: "",
            wevt: undefined,
            value: { }
        });
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
            if(mevent.value.shape !== 'pencil') setSelected(false);
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
                shape: "pencil"
            }
        });
    }

    const handleOnDoubleClick = (e) => {
        dispatch({
            kind: MEVENT_KINDS.PENCIL_ICON_DOUBLE_CLICKED,
            name: "",
            description: "",
            wevt: e,
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
