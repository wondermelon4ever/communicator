import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

const ToolSelectionDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));
  
const ToolSelectionDialogTitle = (props) => {
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
  
  ToolSelectionDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

const ToolSelection = (props) => {

    const [open, setOpen] = React.useState(false);
    const [selections, setSelections] = React.useState({
      pencil: props.selections.pencil,
      marker: props.selections.marker,
      eraser: props.selections.eraser,
      text: props.selections.text,
      image: props.selections.image,
      pdf: props.selections.pdf,
      dragLastPath: props.selections.dragLastPath,
      dragAllPaths: props.selections.dragAllPaths,
      line: props.selections.line,
      arrow: props.selections.arrow,
      zoomIn: props.selections.zoomIn,
      zoomOut: props.selections.zoomOut,
      arc: props.selections.arc,
      rectangle: props.selections.rectangle,
      quadraticCurve: props.selections.quadraticCurve,
      bezierCurve: props.selections.bezierCurve,
      undo: props.selections.undo,
      redo: props.selections.redo,
      lineWidthSet: props.selections.lineWidthSet,
      colorSet: props.selections.colorSet,
      additionalOptionSet: props.selections.additionalOptionSet,
      saveAs: props.selections.saveAs
    });

    React.useEffect(()=>{
        setOpen(props.show);
    }, [props.show]);
    
    const handleClose = () => {
        setOpen(false);
    };

    const saveChange = () => {
       props.saveChange(selections);
    }

    const handleChange = (event) => {
      console.log("selection.pencil=>" + selections.pencil);
      setSelections({
        ...selections,
        [event.target.name]: event.target.checked
      })
    }

    return (
        <ToolSelectionDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <ToolSelectionDialogTitle id="customized-dialog-title" onClose={ handleClose }>
                Drawing Tool Selection
            </ToolSelectionDialogTitle>
            <DialogContent dividers>
              <div style={{ display: "flex" }}>
              <FormGroup>
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.pencil} disabled name="pencil"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Peicil</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.marker} disabled name="marker"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Marker</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.eraser} disabled name="eraser"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Eraser</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.text} disabled name="text"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Text</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.image} disabled name="image"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Image</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.pdf} disabled name="pdf"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>PDF</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.dragLastPath} name="dragLastPath"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Drag and move last path</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.dragAllPaths} name="dragAllPaths"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Drag and move all paths</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.line} name="line"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Line</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.arrow} name="arrow"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Arrow</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.arc} name="arc"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Arc</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.rectangle} name="rectangle"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Rectangle</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.quadraticCurve} name="quadraticCurve"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Quadratic curve</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.bezierCurve} name="bezierCurve"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Bezier curve</Typography> } />
              </FormGroup>
              <FormGroup>
              <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.lineWidthSet} name="lineWidthSet"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Line width setting</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.colorSet} name="colorSet"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Color setting</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.additionalOptionSet} name="additionalOptionSet"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Additional option setting</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.undo} name="undo"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Undo</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.redo} name="redo"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Redo</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.zoomIn} name="zoomIn"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Zoom in</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.zoomOut} name="zoomOut"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Zoom out</Typography> } />
                <FormControlLabel 
                  control={ <Switch onChange={ handleChange } checked={selections.saveAs} disabled name="saveAs"/> } 
                  label={ <Typography style={{ fontSize: 16 }}>Save as image</Typography> } />
              </FormGroup>
              </div>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={ saveChange }>
                    Save changes
                </Button>
            </DialogActions>
        </ToolSelectionDialog>
    )
}

export default ToolSelection;
