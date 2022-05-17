import React from 'react';

import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../mevent/MeventDispatcher';

var points = [];

const CanvasTemp = (props) => {

    const [name, setName] = React.useState(props.name);

    React.useEffect(()=>{
        console.log("temp canvas context is created successfully !");
    }, []);

    const handleMouseDown = (e) => {
        dispatch({
            kind: MEVENT_KINDS.MOUSE_DOWN,
            name: "",
            description: "",
            wevt: e,
            value: {
                points: points
            }
        });
    }

    const handleTouchStart = (e) => {
        handleMouseDown(e);
    }

    const handleMouseMove = (e) => {
        dispatch({
            kind: MEVENT_KINDS.MOUSE_MOVE,
            name: "",
            description: "",
            wevt: e,
            value: {
                points: points
            }
        });
    }

    const handleTouchMove = (e) => {
        handleMouseMove(e);
    }

    const handleMouseUp = (e) => {
        dispatch({
            kind: MEVENT_KINDS.MOUSE_UP,
            name: "",
            description: "",
            wevt: e,
            value: {
                points: points
            }
        });
    }

    const handleTouchEnd = (e) => {
        handleMouseUp(e);
    }

    return(
        <canvas 
            id={ props.name }
            onMouseDown  ={ handleMouseDown }
            onTouchStart ={ handleTouchStart }
            onMouseMove  ={ handleMouseMove }
            onTouchMove  ={ handleTouchMove }
            onMouseUp    ={ handleMouseUp }
            onTouchCancel={ handleTouchEnd }
            onTouchEnd   ={ handleTouchEnd }
        >
        </canvas>
    )
}

const getPoints = () => {
    return points;
}

const setPoints = (pts) => {
    points = pts;
}

export default CanvasTemp;

export {
    getPoints,
    setPoints
}
