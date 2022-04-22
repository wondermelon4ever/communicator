import React from 'react';
import "./css/bootstrap.min.css";
import "./room_dashboard.css";

const RoomDashboardHeader = (props) => {

    return (
        <header style={{ marginBottom: "20px", width: "100%" }}>
            <img className="logo" src="/logo.png" alt="RTCMultiConnection"/> 
            <span className="logo-text">Dashboard Example</span>

            <div style={{ float: "right", marginTop: "15px" }}>
                <button className="btn btn-primary" data-toggle="modal" data-target="#startRoomModel">Create A New Room</button>
                <button id="btn-show-join-hidden-room" className="top-span btn btn-secondary" data-toggle="modal" data-target="#joinRoomModel">Join A Room</button>
                <span className="top-span">Active rooms: <span id="active-rooms">0</span></span>
            </div>
        </header>
    )
}

export default RoomDashboardHeader;
