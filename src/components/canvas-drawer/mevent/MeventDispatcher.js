var meventDispatcher = undefined;

const MEvent = {
    kind: "",
    name: "",
    description: "",
    wevt: undefined,
    value: {

    }
}

const meventKinds = [
    "SELECTED_SHAPE",
    "POINTS_CHANGED",
    "MOUSE_DOWN",
    "MOUSE_UP",
    "MOUSE_MOVE",
    "CANVAS_INITED",
    "PENCIL_ICON_DOUBLE_CLICKED",
    "MARKER_ICON_DOUBLE_CLICKED",
    "ERASER_ICON_DOUBLE_CLICKED",
    "TEXT_ICON_DOUBLE_CLICKED",
    "COLOR_PALETTE_ICON_CLICKED",
    "LINE_WIDTH_ICON_CLICKED",
    "ADDITIONAL_OPTION_ICON_CLICKED",
    "MOUSE_DOWN",
    "MOUSE_MOVE",
    "MOUSE_UP",
    "KEY_PRESS",
    "PASTE",
    "CONTROL_KEY_PRESSED",
    "CONTROL_KEY_RELEASED",
    "RETURN_KEY_PRESSED",
    "BACK_SPACE_PRESSED",
    "CNTL_i_PRESSED",
    "CNTL_z_PRESSED",
    "CNTL_a_PRESSED",
    "CNTL_c_PRESSED",
    "CNTL_v_PRESSED",
    "CNTL_y_PRESSED",
    "TEXT_PASTED"
]

const MEVENT_KINDS = {
    SELECTED_SHAPE: "SELECTED_SHAPE",
    POINTS_CHANGED: "POINTS_CHANGED",
    MOUSE_DOWN: "MOUSE_DOWN",
    MOUSE_UP: "MOUSE_UP",
    MOUSE_MOVE: "MOUSE_MOVE",
    CANVAS_INITED: "CANVAS_INITED",
    PENCIL_ICON_DOUBLE_CLICKED: "PENCIL_ICON_DOUBLE_CLICKED",
    MARKER_ICON_DOUBLE_CLICKED: "MARKER_ICON_DOUBLE_CLICKED",
    ERASER_ICON_DOUBLE_CLICKED: "ERASER_ICON_DOUBLE_CLICKED",
    TEXT_ICON_DOUBLE_CLICKED: "TEXT_ICON_DOUBLE_CLICKED",
    COLOR_PALETTE_ICON_CLICKED: "COLOR_PALETTE_ICON_CLICKED",
    LINE_WIDTH_ICON_CLICKED: "LINE_WIDTH_ICON_CLICKED",
    ADDITIONAL_OPTION_ICON_CLICKED: "ADDITIONAL_OPTION_ICON_CLICKED",
    MOUSE_DOWN: "MOUSE_DOWN",
    MOUSE_MOVE: "MOUSE_MOVE",
    MOUSE_UP: "MOUSE_UP",
    KEY_PRESS: "KEY_PRESS",
    PASTE: "PASTE",
    CONTROL_KEY_PRESSED: "CONTROL_KEY_PRESSED",
    RETURN_KEY_PRESSED: "RETURN_KEY_PRESSED",
    CONTROL_KEY_RELEASED: "CONTROL_KEY_RELEASED",
    BACK_SPACE_PRESSED: "BACK_SPACE_PRESSED",
    CNTL_i_PRESSED: "CNTL_i_PRESSED",
    CNTL_z_PRESSED: "CNTL_z_PRESSED",
    CNTL_a_PRESSED: "CNTL_a_PRESSED",
    CNTL_c_PRESSED: "CNTL_c_PRESSED",
    CNTL_v_PRESSED: "CNTL_v_PRESSED",
    CNTL_y_PRESSED: "CNTL_y_PRESSED",
    TEXT_PASTED: "TEXT_PASTED"
}

class MeventDispatcher {

    constructor(defaultShape) {
        this.selectedShape = defaultShape ? defaultShape : "pencil";

        this.meventListeners = new Map();
        meventKinds.forEach((kind, index)=>{
            this.meventListeners.set(kind, []);
        });
        meventDispatcher = this;
    }

    addListener = (meventKind, callbackListener) => {
        var listeners = this.meventListeners.get(meventKind);
        if(!listeners)  this.meventListeners.set(meventKind, []);
        listeners.push(callbackListener);
    }

    dispatch = (mevent) => {
        this.meventListeners.get(mevent.kind).forEach((callbackListener, index)=>{
            callbackListener(mevent);
        });
    }
}

function createMeventDispatcherSingleton (defaultShape) {
    if(meventDispatcher === undefined) meventDispatcher = new MeventDispatcher(defaultShape);
    return meventDispatcher;
}

function dispatch(mevent) {
    if(meventDispatcher === undefined) meventDispatcher = new MeventDispatcher(defaultShape);
    meventDispatcher.dispatch(mevent);
}

export {
    createMeventDispatcherSingleton,
    dispatch,
    MEVENT_KINDS
}
