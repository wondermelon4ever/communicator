import React from 'react';

const ContextMenu = ( { render, props }) => {

    const [open, setOpen] = React.useState(false);
    const [anchorPosition, setAnchorPosition] = React.useState({
        x: 0, y: 0 
    });

    const handleContextMenuOpen = (event) => {
        event.preventDefault();
        setOpen(true);
        setAnchorPosition({
            x: event.pageX,
            y: event.pageY
        });
    }

    const handleContextMenuClose = () => {
        setOpen(false);
    }

    return (
        render ( open, anchorPosition, handleContextMenuOpen, handleContextMenuClose )
    )
}

export default ContextMenu;
