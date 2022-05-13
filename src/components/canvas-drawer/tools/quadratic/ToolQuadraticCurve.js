import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import { createStatusDispatcherSingleton, dispatch, MESSAGE_TYPES } from '../../common/StatusDispatcher';

function QuadraticCurveIcon (props) {
    return (
        <SvgIcon { ...props } >
            <svg xmlns="http://www.w3.org/2000/svg" id="qcsvg" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
                <circle id="p1" cx="10" cy="40" r="5" />
                <circle id="p2" cx="40" cy="10" r="5" />
                <path id="curve" d="M10,40 Q10,10,40,10" stroke="black" strokeWidth="2" fill="none"/>
            </svg>
        </SvgIcon>
    );
}


const ToolQuadraticCurve = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createStatusDispatcherSingleton().addListener(MESSAGE_TYPES.SELECTED_SHAPE, (messageType, message) => {
            if(messageType === MESSAGE_TYPES.SELECTED_SHAPE && message !== 'quadratic-curve') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch(MESSAGE_TYPES.SELECTED_SHAPE, "quadratic-curve");
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="Quadratic curve" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="Quadratic curve">
                <IconButton onClick={ handleOnClick }>
                    <QuadraticCurveIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolQuadraticCurve;
