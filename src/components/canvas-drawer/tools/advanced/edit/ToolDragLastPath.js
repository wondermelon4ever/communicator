import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import { createEditHandler } from './EditHandler';

function DragLastPathIcon (props) {
    return (
        <SvgIcon { ...props } >
            <circle id="p1" cx="17" cy="15" r="3" />
            <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52 2.25 8.184z"/>
        </SvgIcon>
    );
}

const ToolDragLastPath = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool Drag last path was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createEditHandler(context.mainContext, context.tempContext, selected));
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
            if(mevent.value.shape !== 'dragLastPath') setSelected(false);
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
                shape: "dragLastPath"
            }
        });
    }

    return (
        <div id="drag-last-path" style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Drag Last Path" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Drag and move last path">
                <IconButton onClick={ handleOnClick }>
                    <DragLastPathIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolDragLastPath;
