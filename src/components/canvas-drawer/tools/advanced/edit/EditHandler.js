import { getPoints, setPoints } from '../../../views/CanvasTemp';
import drawHelper from '../../DrawHelper';
import ShapeHandler from '../../ShapeHandler';
import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import { createDragHelper } from './DragHelper';

var editHandler = undefined;
const SHAPE_DRAG_LAST_PATH = "dragLastPath";
const SHAPE_DRAG_ALL_PATHS = "dragAllPaths";

export default class EditHandler extends ShapeHandler{

    constructor(context, tempContext, selected) {
        super(context, tempContext);

        this.selected = selected;
        this.selectedShape = "";
        this.isControlKeyPressed = false;
        var copiedStuff = [];
        this.addMeventListener();
        this.dragHelper = createDragHelper(context, tempContext, this, getPoints);
    }

    getIsControlKeyPressed () {
        return this.isControlKeyPressed;
    }

    setIsControlKeyPressed (isControlKeyPressed) {
        this.isControlKeyPressed = isControlKeyPressed;
    }

    copy() {
        this.endLastPath();
        var points = getPoints();
        this.dragHelper.global.startingIndex = 0;
        if(this.selectedShape === SHAPE_DRAG_LAST_PATH) {
            this.copiedStuff = points[points.length - 1];
        } else {
            this.copiedStuff = points;
        }
    }

    paste() {
        this.endLastPath();
        var points = getPoints();
        this.dragHelper.global.startingIndex = 0;

        if(this.selectedShape === SHAPE_DRAG_LAST_PATH) {            
            points[points.length] = this.copiedStuff;

            this.dragHelper.global = {
                prevX: 0,
                prevY: 0,
                startingIndex: points.length - 1
            };
            this.dragHelper.dragAllPaths(0, 0, points);
        } else {
            this.dragHelper.global.startingIndex = points.length;
            // var point;
            // var length = points.length;
            // for(var i = 0; i < length; i++) {
            //     point = points[i];
            //     points.push(point);
            // }
            // concat를 하면 전혀 다른 객체가 생성됨. setPoints를 해 줘야 하는 이유
            points = points.concat(this.copiedStuff);
            setPoints(points);
        }
    }

    endLastPath() {
        var points = getPoints();
        dispatch({
            kind: MEVENT_KINDS.DRAWING_END,
            name: "",
            description: "",
            wevt: undefined,
            value: {
                points: points
            }
        });

        drawHelper.redraw(this.context, this.tempContext, points);
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'dragAllPaths' && mevent.value.shape !== 'dragLastPath') this.selected = false;
            else {
                this.selected = true;
                this.selectedShape = mevent.value.shape;
            }
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_DOWN, (mevent) => {
            if(this.selected === false) return;
            console.log("mouse down in the edit handler !!!");
            this.dragHelper.mousedown(
                mevent.wevt, 
                mevent.value.points, 
                this.selectedShape === "dragAllPaths" ? true : false,
                this.selectedShape === "dragLastPath" ? true : false);
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_MOVE, (mevent) => {
            if(this.selected === false) return;
            this.dragHelper.mousemove(
                mevent.wevt,
                mevent.value.points,
                this.selectedShape === "dragAllPaths" ? true : false,
                this.selectedShape === "dragLastPath" ? true : false);
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_UP, (mevent) => {
            if(this.selected === false) return;
            console.log("mouse up in the edit handler !!!");
            this.dragHelper.mouseup(mevent.wevt, mevent.value.points, this.selectedShape === "dragLastPath" ? true : false);
        });

        dispatcher.addListener(MEVENT_KINDS.CONTROL_KEY_PRESSED, (mevent) => {
            // if(this.selected === false) return;
            this.isControlKeyPressed = true;
            console.log("control key pressed in the drag handler !!!");
        });

        dispatcher.addListener(MEVENT_KINDS.CONTROL_KEY_RELEASED, (mevent) => {
            // if(this.selected === false) return;
            this.isControlKeyPressed = false;
            console.log("control key released in the drag handler !!!");
        });

        dispatcher.addListener(MEVENT_KINDS.CNTL_a_PRESSED, (mevent) => {
            // control + a 키는 dragAllPaths 일 경우에만 유효함
            if(this.selected === false || "dragAllPaths" !== this.selectedShape) return;
            console.log("control + a key pressed in the drag handler !!!");
            this.dragHelper.global.startingIndex = 0;
            this.endLastPath();
        });

        dispatcher.addListener(MEVENT_KINDS.CNTL_c_PRESSED, (mevent) => {
            if(this.selected === false) return;
            console.log("control + c key pressed in the drag handler !!!");
            this.copy();
        });

        dispatcher.addListener(MEVENT_KINDS.CNTL_v_PRESSED, (mevent) => {
            if(this.selected === false) return;
            console.log("control + v key pressed in the drag handler !!!");
            this.paste();
            this.syncPoints(this.selected);
        });

        dispatcher.addListener(MEVENT_KINDS.CNTL_y_PRESSED, (mevent) => {
            if(this.selected === false) return;
            console.log("control + y key pressed in the drag handler !!!");
            // control + y
        });

        dispatcher.addListener(MEVENT_KINDS.CNTL_z_PRESSED, (mevent) => {
            if(this.selected === false) return;
            console.log("control + z key pressed in the drag handler !!!");
            var points = getPoints();
            if (points.length) {
                points.length = points.length - 1;
                drawHelper.redraw(this.context, this.tempContext, points);
                this.syncPoints(this.selected);
            }
        });
    }
}

const createEditHandlerSingleton = (context, tempContext, selected) => {
    if(editHandler === undefined) editHandler = new EditHandler(context, tempContext, selected);
    editHandler.selected = selected;
    return editHandler;
} 

export { createEditHandlerSingleton };
