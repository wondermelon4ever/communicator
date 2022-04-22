import React from 'react';
import { Link } from 'react-router-dom';
import * as io from 'socket.io-client';
window.io = io;
import * as RTCMultiConnection from 'rtcmulticonnection';
import "./room_dashboard.css";
import RoomDashboardHeader from './RoomDashboardHeader';
import RoomDialog from './RoomDialog';
import RoomListTable from './RoomListTable';
import { WindowSharp } from '@mui/icons-material';

const RoomDashboard = (props) => {
    const [rooms, setRooms] = React.useState([]);
    const [roomCount, setRoomCount] = React.useState(0);
    const [showCreateDialog, setShowCreateDialog] = React.useState(false);
    const [showJoinDialog, setShowJoinDialog] = React.useState(false);
    // const [webRtcConnection, setWebRtcConnection] = React.useState(undefined);

    React.useEffect(()=>{
        initialize();
    }, []);

    var connection = new RTCMultiConnection();
    var publicRoomIdentifier = 'dashboard';

    const initialize = () => {
        console.log("webrtc signaling server connection initializ...");
        var publicRoomIdentifier = 'dashboard';
        // var connection = new RTCMultiConnection();
        // setWebRtcConnection(connection);
        connection.socketURL = "http://127.0.0.1:9001/";
        connection.publicRoomIdentifier = publicRoomIdentifier;
        connection.socketMessageEvent = publicRoomIdentifier;
        connection.autoCloseEntireSession = true;
        connection.connectSocket((socket)=>{
            
            looper();
            socket.on('disconnect', ()=>{
                console.log("Disconnected!");
                location.reload();
            });
            socket.onAny((message)=> {
                console.log("message from signaling server => " + message);
            });
        });
        
    }

    const looper = () => {
        console.log("Looper is being executed")
        // if(rooms.length <= 0) return;
        connection.socket.emit('get-public-rooms', publicRoomIdentifier, (listOfRooms) => {
            updateListOfRooms(listOfRooms);
            setTimeout(looper, 5000);
        });
    }

    const updateListOfRooms = (rooms) => {
        setRoomCount(rooms.length);
        var roomList = [];
        rooms.forEach((room, idx) => {
            roomList.push({
                roomId: rooms.roomId,
                ownerId: room.ownerId,
                session: room.session,
                extraInfo: room.extraInfo,
                participants: room.participants,
                isRoomFull: room.isRoomFull
            })
        });
        setRooms(roomList);
    }

    const openRoomCreationDialog = () => {
        setShowCreateDialog(true);
        window.open("/conference", "_blank");
    }

    const openRoomJoinDialog = () => {
        setShowJoinDialog(true);
        window.open("/conference", "_blank");
    }

    const doActionRoomCreation = (command, roomInfo) => {
        if(command === "CLOSED") setShowCreateDialog(false);
        else {
            setShowCreateDialog(false);
            if(roomInfo.roomId === undefined || roomInfo.roomId === "") {
                alert("Please enter room-id. Room ID is required");
                return;
            }
            if(roomInfo.userId === undefined || roomInfo.userId === "") {
                alert("Please enter your name. Your name is required");
                return;
            }
            if(roomInfo.isRoomPassword === tru) {
                if(roomInfo.isRoomPassword === "") {
                    alert("Please enter room password.");
                    return;
                }
                connection.password = roomInfo.roomPassword;
            }
            // should create new room.

        }
    }

    const doActionRoomJoin = (command, roomInfo) => {
        if(command === "CLOSED") setShowJoinDialog(false);
        else {
            setShowJoinDialog(false);
            console.log("should join into a room=>" + JSON.stringify(roomInfo));
        }
    }

    return (
        <div style={{ width: "100%" }}>
            <header style={{ marginBottom: "20px", width: "100%" }}>
                <img className="logo" src="/logo.png" alt="RTCMultiConnection"/> 
                <span className="logo-text">Dashboard Example</span>

                <div style={{ float: "right", marginTop: "15px" }}>
                    <button className="btn btn-primary" onClick={ openRoomCreationDialog }>Create A New Room</button>
                    <button className="top-span btn btn-secondary" onClick={ openRoomJoinDialog } >Join A Room</button>
                    <span className="top-span">Active rooms: <span id="active-rooms">{ roomCount }</span></span>
                    <a href="http://www.naver.com" target="_blank">Naver</a>
                    <Link to="/conference" target="_blank">Canvas Designer</Link>
                </div>
            </header>
            <RoomDialog command="CREATE" title="Room Creation" open={ showCreateDialog } action={ doActionRoomCreation } />
            <RoomDialog command="JOIN" title="Room Join" open={ showJoinDialog } action={ doActionRoomJoin }/>

            {/* <div id="confirm-box-topper" style={{ display: "none", zIndex: "99999999", top: "0", left: "0", bottom: "0", right: "0", width: "100%", height: "100%", position: "fixed", background: "#000000ad" }}>   
            </div>
            <div id="alert-box" className="modal fade" style={{ display: "none", zIndex: "999999999999999"}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="alert-title">Alert</h5>
                            <button type="button" className="close btn-alert-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div id="alert-message" className="model-list"></div>
                        </div>
                        <div className="modal-footer">
                            <p id="alert-special"></p>
                                <button className="btn btn-primary btn-alert-close">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="confirm-box" className="modal fade" style={{ display: "none", zIndex: 999999999999999 }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirm-title">Please Confirm</h5>
                            <button type="button" className="close btn-confirm-close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div id="confirm-message" className="modal-body"></div>

                        <div className="modal-footer">
                            <button className="btn btn-confirm-close" id="btn-confirm-close">Cancel</button>
                            <button className="btn btn-primary" id="btn-confirm-action">Confirm</button>
                        </div>
                    </div>
                </div>
            </div> */}
            
            <RoomListTable rooms={[]}/>
            <footer style={{ textAlign: "center" }}>Dashboard + Video Conferencing + Chat + File Sharing</footer>
        </div>
    );
}

export default RoomDashboard;
