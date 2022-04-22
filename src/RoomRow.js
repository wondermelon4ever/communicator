import React from 'react';

import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import InputIcon from '@mui/icons-material/Input';

const RoomRow = (props) => {

    const { key, roomId, ownerId, session, extraInfo, participants, isRoomFull } = props;
    var num = 1;
    return (
        <TableRow
            key={key}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">{ num++ }</TableCell>
            <TableCell align="center">{ roomId }</TableCell>
            <TableCell align="center">{ ownerId }</TableCell>
            <TableCell align="center">{ session }</TableCell>
            <TableCell align="center">{ extraInfo }</TableCell>
            <TableCell align="center">{ participants }</TableCell>
            <TableCell align="center">
                {
                    isRoomFull == true ?
                    "Room is full"
                    :
                    <Button variant="outlined" startIcon={ <InputIcon />}>Join</Button>
                }
            </TableCell>
        </TableRow>
    );
}

export default RoomRow;
