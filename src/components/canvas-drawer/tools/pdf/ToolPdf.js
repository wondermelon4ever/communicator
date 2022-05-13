import React from 'react';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { createEventDispatcherSingleton, dispatch, EVENT_KINDS } from '../../common/EventDispatcher';

const ToolPdf = (props) => {
    
    const [selected, setSelected] = React.useState(props.selected);

    React.useEffect(()=>{
        createEventDispatcherSingleton().addListener(EVENT_KINDS.SELECTED_SHAPE, (event) => {
            if(event.kind === EVENT_KINDS.SELECTED_SHAPE && event.value !== 'pdf') setSelected(false);
            else setSelected(true);
        });
    }, []);
    
    const handleOnClick = (e) => {
        setSelected(true);
        dispatch({
            kind: EVENT_KINDS.SELECTED_SHAPE,
            name: "",
            description: "",
            value: "pdf"
        });
    }

    return (
        <div style={{ display: props.show ? "block" : "none", margine: "3px", padding: "3px" }}>
            <Avatar alt="PDF" sx={{ bgcolor: selected ? "#f57f17" : "#FFFFFF", width: 32, height: 32 }} variant="rounded">
            <Tooltip title="PDF">
                <IconButton onClick={ handleOnClick }>
                    <PictureAsPdfIcon fontSize="large" />
                </IconButton>
            </Tooltip>
            </Avatar>
        </div>
    )
}

export default ToolPdf;
