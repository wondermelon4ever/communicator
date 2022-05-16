import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';

import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import { createBezierHandlerSingleton } from './BezierHandler';

function BezierCurveIcon (props) {
    return (
        <SvgIcon { ...props } >
            <svg xmlns="http://www.w3.org/2000/svg" id="bcsvg" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
                <circle id="p1" cx="10" cy="40" r="5" />
                <circle id="p3" cx="40" cy="10" r="5" />
                <path id="curve1" d="M10,40 Q10,25,25,25" stroke="black" strokeWidth="2" fill="none"/>
                <path id="curve2" d="M25,25 Q40,25,40,10" stroke="black" strokeWidth="2" fill="none"/>
            </svg>
        </SvgIcon>
    );
}


const ToolBezierCurve = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);
    const [context, setContext] = React.useState(undefined);
    const [handler, setHandler] = React.useState(undefined);

    React.useEffect(()=>{
        console.log("Tool quadratic-curve was loaded successfully.");
    }, []);

    React.useEffect(()=>{
        if(context !== undefined) { 
            setHandler(createBezierHandlerSingleton(context.mainContext, context.tempContext, selected));
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
            if(mevent.value.shape !== 'bezier-curve') setSelected(false);
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
                shape: "bezier-curve"
            }
        });
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Bezier curve" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Bezier curve">
                <IconButton onClick={ handleOnClick }>
                    <BezierCurveIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolBezierCurve;
