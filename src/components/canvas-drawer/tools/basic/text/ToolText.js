import React from 'react';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import initKeyboardEventListener from '../../KeyboardListener';

const ToolText = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createMeventDispatcherSingleton().addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.kind === MEVENT_KINDS.SELECTED_SHAPE && mevent.value.shape !== 'text') setSelected(false);
            else setSelected(true);
        });
        console.log("Tool text was loaded successfully.");
        initKeyboardEventListener();
        console.log("Keyboard event listener was loaded successfully.");
    }, []);
    
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
