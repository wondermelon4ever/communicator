import React from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const ToolShowMoreOrLess = (props) => {

    const [expanded, setExpanded] = React.useState(props.expanded);

    const handleOnClick = () => {
        props.toggleExpanded();
    }

    React.useEffect(()=>{
        setExpanded(props.expanded);
    }, [props.expanded])

    return (
        <div style={{ margine: "3px", padding: "3px" }}>
            <IconButton onClick={ handleOnClick } sx={{ height: 32, width: 20, color: "#FFFFFF" }} >
            {
                expanded ? 
                <KeyboardArrowLeftIcon fontSize="medium" color="white"/>
                :
                <KeyboardArrowRightIcon fontSize="medium" color="white"/>
            }
            </IconButton>
        </div>
    )
}

export default ToolShowMoreOrLess;
