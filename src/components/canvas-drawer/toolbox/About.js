import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

const About = (props) => {

    const [open, setOpen] = React.useState(false);

    React.useEffect(()=>{
        setOpen(props.show);
    }, [props.show])

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ fontSize: 16 }}>
                {"My canvas designer"}
            </DialogTitle>
            <DialogContent>
                <div style={{ display: "flex" }}>
                    <Avatar 
                        alt="My Canvas Designer" 
                        src="about-logo-2.png" 
                        sx={{ width: 48, height: 48 }}
                    />
                    <Typography fontSize={ 28 } sx={{ marginLeft: 2 }}>My Canvas Designer</Typography>
                </div>
                <div style={{ marginTop: 1 }}>
                    <Typography fontSize={ 14 } sx={{ marginLeft: 8 }}>
                        { "Version: 0.0.1 (Alpha)" }
                    </Typography>
                    <Typography fontSize={ 14 } sx={{ marginLeft: 8 }}>
                        { "Commit: 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7" }
                    </Typography>
                    <Typography fontSize={ 14 } sx={{ marginLeft: 8 }}>
                        { "Date: 2022-06-17T07:46:01075Z (1 MON AGO)" }
                    </Typography>
                    <Typography fontSize={ 14 } sx={{ marginLeft: 8 }}>
                        { "Node.js: 16.13.0" }
                    </Typography>
                    <Typography fontSize={ 14 } sx={{ marginLeft: 8 }}>
                        { "Material UI: 16.13.0 - https://www.mui.com/" }
                    </Typography>
                    <Typography fontSize={ 14 } sx={{ marginLeft: 8 }}>
                        { "Author: lucky.sugar.park@gmail.com" }
                    </Typography>
                </div>
                <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
                    You can use this wonderful 'My canvas designer' without any limitation.
                    Please let me know if any question or advice for developing better free software.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} autoFocus>Close</Button>
            </DialogActions>
      </Dialog>
    );
}

export default About;
