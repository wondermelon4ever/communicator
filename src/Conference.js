import React from 'react';
import * as io from 'socket.io-client';
window.io = io;
import * as RTCMultiConnection from 'rtcmulticonnection';
import CanvasDesigner from 'canvas-designer/canvas-designer-widget';

import "./css/emojionearea.min.css";
import "./conference.css";
import { CancelScheduleSend, SettingsBrightnessRounded } from '@mui/icons-material';

const Conference = (props) => {

    React.useEffect(()=>{
        initialize();
    }, [])

    var connection;
    var params = {};
    var designer;

    const initialize = () => {
        connection = new RTCMultiConnection();
        extractParams();
        connection.socketURL = "https://localhost:9001/";
        connection.extra.userFullName = params.userFullName;
        connection.publicRoomIdentifier = params.publicRoomIdentifier;
        connection.socketMessageEvent = 'canvas-dashbord-demo';
        connection.autoCloseEntireSession = true;
        connection.maxParticipantsAllowed = 1000;

        designer = new CanvasDesigner();
        designer.widgetHtmlURL = "https://localhost:9001/node_modules/canvas-desinger/widget.html";
        designer.widgetJsURL = "https://localhost:9001/node_modules/canvas-desinger/widget.min.js";

        designer.addSyncListener((data)=>{
            connection.send(data);
        })
        designer.setSelected('pencil');
        designer.setTools({
            pencil: true,
            text: true,
            image: true,
            pdf: true,
            eraser: true,
            line: true,
            arrow: true,
            dragSingle: true,
            dragMultiple: true,
            arc: true,
            rectangle: true,
            quadratic: false,
            bezier: true,
            marker: true,
            zoom: false,
            lineWidth: false,
            colorsPicker: false,
            extraOptions: false,
            code: false,
            undo: true
        });

        connection.chunkSize = 16000;
        connection.enableFileSharing = true;
        connection.session = {
            audio: true,
            video: true,
            data: true
        }
        connection.onUserStatusChanged = (event) => {
            var infoBar = document.getElement
        }
    }

    const extractParams = () => {
        var r =  /([^&=]+)=?([^&]*)/g;

    }

    return (
        <div>
            <div id="widget-container" style={{ position: "fixed", bottom: "0", right: "0", left: "20%", height: "100%", border: "1px solid black", bordeTtop: "0px", borderBottom: "0px" }} >
            </div>
            <video id="screen-viewer" controls playsinline autoplay></video>

            <div style={{ width: "20%", height: "100%", position: "absolute", left: "0px" }}>
                <video id="main-video" controls playsinline autoplay></video>
                <div id="other-videos"></div>
                <hr/>
                <div style={{ padding: "5px 10px" }}>
                    <div id="onUserStatusChanged"></div>
                </div>

                <div style={{ marginTop: "20px", position: "absolute", bottom: "0px", background: "white", paddingBottom: "20px", width: "94%" }} >
                    <div id="conversation-panel"></div>
                    <div id="key-press" style={{ textAlign: "right", display: "none", fontSize: "11px" }}>
                        <span style={{ verticalAlign: "middle" }}></span>
                        <img src="https://www.webrtc-experiment.com/images/key-press.gif" style={{ height: "12px", verticalAlign: "middle" }} />
                    </div>
                    <textarea id="txt-chat-message"></textarea>
                    <button className="btn btn-primary" id="btn-chat-message" disabled>Send</button>
                    <img id="btn-attach-file" src="https://www.webrtc-experiment.com/images/attach-file.png" title="Attach a File" />
                    <img id="btn-share-screen" src="https://www.webrtc-experiment.com/images/share-screen.png" title="Share Your Screen" />
                </div>

                <canvas id="temp-stream-canvas" style={{ display: "none" }} ></canvas>
            </div>
        </div>
    );
}

export default Conference;
