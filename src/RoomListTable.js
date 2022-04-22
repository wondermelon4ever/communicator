import React from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

import RoomRow from './RoomRow';

const RoomListTable = (props) => {

    return (
        <TableContainer component={ Paper }>
            <Table sx={{ width: "100%", minHeight: "400px" }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">No</TableCell>
                        <TableCell align="center">Room Id</TableCell>
                        <TableCell align="center">Owner Id</TableCell>
                        <TableCell align="center">Session</TableCell>
                        <TableCell align="center">Extra Info</TableCell>
                        <TableCell align="center">Participants</TableCell>
                        <TableCell align="center">Join</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.rooms.map((row)=>{
                            <RoomRow 
                                roomId={ row.roomId }
                                ownerId={ row.ownerId }
                                session={ row.session }
                                extraInfo={ row.extraInfo }
                                participants= { row.participants }
                                isRoomFull={ row.isRoomFull }
                            />
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RoomListTable;
