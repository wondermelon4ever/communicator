var statusDispatcher = undefined;

const messageTypes = [
    "SELECTED_SHAPE",
    "POINTS",

]

const MESSAGE_TYPES = {
    SELECTED_SHAPE: "SELECTED_SHAPE",
    POINTS: "POINTS"
}

class StatusDispatcher {

    constructor(defaultShape) {
        this.selectedShape = defaultShape ? defaultShape : "pencil";

        this.messageListeners = new Map();
        messageTypes.forEach((type, index)=>{
            this.messageListeners.set(type, []);
        });
        statusDispatcher = this;
    }

    addListener = (messageType, callbackListener) => {
        var listeners = this.messageListeners.get(messageType);
        if(!listeners) this.messageListeners.set(messageType, []);
        listeners.push(callbackListener);
    }

    dispatch = (messageType, message) => {
        this.messageListeners.get(messageType).forEach((callbackListener, index)=>{
            callbackListener(messageType, message);
        });
    }
}

function createStatusDispatcherSingleton (defaultShape) {
    if(statusDispatcher === undefined) statusDispatcher = new StatusDispatcher(defaultShape);
    return statusDispatcher;
}

function dispatch(messageType, message) {
    if(statusDispatcher === undefined) statusDispatcher = new StatusDispatcher(defaultShape);
    statusDispatcher.dispatch(messageType, message);
}

export {
    createStatusDispatcherSingleton,
    dispatch,
    MESSAGE_TYPES
}
