import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormGroup,
    FormControlLabel,
    IconButton,
    TextField,
    Typography,
 } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

const CustomDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
  
    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            ) : null}
        </DialogTitle>
    );
};

CustomDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

const RoomDialog = (props) => {
    const [open, setOpen] = React.useState(props.open);
    const [showMoreOption, setShowMoreOption] = React.useState(false);
    const [roomInfo, setRoomInfo] = React.useState({
        roomId: "",
        userId: "",
        roomPassword: "",
        isRoomPassword: false,
        isHiddenRoom: false
    });

    const action = props.action;

    React.useEffect(()=>{
        setOpen(props.open);
    }, [props.open]);

    const handleClose = () => {
        setOpen(false);
        action("CLOSED");
    }

    const toggleShowMoreOption = () => {
        setShowMoreOption(!showMoreOption);
    }

    const doSubmit = (command) => {
        console.log("command=>" + command);
        action(command, roomInfo);
    }

    return (
        <div>
            <CustomDialog onClose={ handleClose } open={ open } >
                <CustomDialogTitle id="" onClose={ handleClose }>
                    { props.title }
                </CustomDialogTitle>
                <DialogContent dividers >
                    <div>
                        <div style={{ width: "400px", padding: "0px", margin: "0px" }}>
                            <TextField 
                                id="roomId" 
                                label="Room ID" 
                                variant="outlined"
                                onChange={(event)=>{
                                    setRoomInfo({
                                        ...roomInfo,
                                        roomId: event.target.value
                                    });
                                }}
                                sx={{ width: "400px", height: "70px", margin: "0px", padding: "0px"  }}
                            />
                            <TextField 
                                id="yourName" 
                                label="Enter your name" 
                                variant="outlined"
                                onChange={(event)=>{
                                    setRoomInfo({
                                        ...roomInfo,
                                        userId: event.target.value
                                    });
                                }}
                                sx={{ width: "400px", height: "70", margin: "0px", paddingBottom: "6px" }}
                            />
                        </div>
                        {
                            props.command === "CREATE" ?
                        <div style={{ display: 'flex', justifyContent: "flex-end", paddingTop: "5px" }}>
                            <Typography onClick={ toggleShowMoreOption } style={{ cursor: "pointer", margin: "0px", padding: "0px" }}>Show more options</Typography>
                        </div>
                            :
                            ""
                        }
                        
                        <div style={{ display: showMoreOption ? "block" : "none" }}>
                            <TextField 
                                id="roomPassword" 
                                label="Enter room password" 
                                variant="outlined"
                                disabled={ roomInfo.isRoomPassword == true ? false : true }
                                onChange={(event)=>{
                                    setRoomInfo({
                                        ...roomInfo,
                                        roomPassword: event.target.value
                                    });
                                }}
                                sx={{ width: "400px", height: "70px", margin: "0px", paddingTop: "6px"  }}
                            />
                            <FormGroup>
                                <FormControlLabel 
                                    control={<Checkbox 
                                                onChange={(event)=>{
                                                    console.log("event.target.checked=>" + event.target.checked);
                                                    setRoomInfo({
                                                        ...roomInfo,
                                                        isRoomPassword: event.target.checked
                                                    });
                                                }}
                                             />} 
                                    label="Set Room Password?" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox 
                                                onChange={(event)=>{
                                                    setRoomInfo({
                                                        ...roomInfo,
                                                        isHiddenRoom: event.target.checked
                                                    });
                                                }}
                                             />} 
                                    label="HiddenRoom? (Hide from the list)" 
                                />
                            </FormGroup>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleClose }>Close</Button>
                    <Button autoFocus onClick={ () => doSubmit(props.command) }>
                        { props.command === "CREATE" ? "Create" : "Join" }
                    </Button>
                </DialogActions>
            </CustomDialog>
        </div>
    )
}

export default RoomDialog;
