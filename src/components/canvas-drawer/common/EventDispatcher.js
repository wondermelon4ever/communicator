var eventDispatcher = undefined;

const Event = {
    kind: "",
    name: "",
    description: "",
    value: ""
}

const eventKinds = [
    "SELECTED_SHAPE",
    "POINTS_CHANGED",
    "MOUSE_DOWN",
    "MOUSE_UP",
    "MOUSE_MOVE",
    "CANVAS_INITED",
    "PENCIL_ICON_DOUBLE_CLICKED",
    "MARKER_ICON_DOUBLE_CLICKED",
]

const EVENT_KINDS = {
    SELECTED_SHAPE: "SELECTED_SHAPE",
    POINTS_CHANGED: "POINTS_CHANGED",
    MOUSE_DOWN: "MOUSE_DOWN",
    MOUSE_UP: "MOUSE_UP",
    MOUSE_MOVE: "MOUSE_MOVE",
    CANVAS_INITED: "CANVAS_INITED",
    PENCIL_ICON_DOUBLE_CLICKED: "PENCIL_ICON_DOUBLE_CLICKED",
    MARKER_ICON_DOUBLE_CLICKED: "MARKER_ICON_DOUBLE_CLICKED"
}

class EventDispatcher {

    constructor(defaultShape) {
        this.selectedShape = defaultShape ? defaultShape : "pencil";

        this.eventListeners = new Map();
        eventKinds.forEach((kind, index)=>{
            this.eventListeners.set(kind, []);
        });
        eventDispatcher = this;
    }

    addListener = (eventKind, callbackListener) => {
        var listeners = this.eventListeners.get(eventKind);
        if(!listeners)  this.eventListeners.set(eventKind, []);
        listeners.push(callbackListener);
    }

    dispatch = (event) => {
        this.eventListeners.get(event.kind).forEach((callbackListener, index)=>{
            callbackListener(event);
        });
    }
}

function createEventDispatcherSingleton (defaultShape) {
    if(eventDispatcher === undefined) eventDispatcher = new EventDispatcher(defaultShape);
    return eventDispatcher;
}

function dispatch(event) {
    if(eventDispatcher === undefined) eventDispatcher = new EventDispatcher(defaultShape);
    eventDispatcher.dispatch(event);
}

export {
    createEventDispatcherSingleton,
    dispatch,
    EVENT_KINDS
}
