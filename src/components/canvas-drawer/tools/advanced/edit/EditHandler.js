import { getPoints } from '../../../views/CanvasTemp';
import drawHelper from '../../DrawHelper';
import ShapeHandler from '../../ShapeHandler';
import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import { createDragHelper } from './DragHelper';

var editHandler = undefined;
export default class EditHandler extends ShapeHandler{

    constructor(context, tempContext) {
        super(context, tempContext);

        this.selected = false;
        this.selectedShape = "";
        this.isControlKeyPressed = false;
        this.dragHelper = 
            createDragHelper(context, tempContext, this.getIsControlKeyPressed, this.setIsControlKeyPressed, this.copy, this.paste, getPoints);
        this.addMeventListener();
    }

    getIsControlKeyPressed () {
        return this.isControlKeyPressed;
    }

    setIsControlKeyPressed (isControlKeyPressed) {
        this.isControlKeyPressed = isControlKeyPressed;
    }

    copy() {

    }

    paste() {

    }

    endLastPath() {

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
            console.log("mouse down in the drag handler !!!");
            this.dragHelper.mousedown(
                mevent.wevt, 
                mevent.value.points, 
                this.selectedShape === "dragAllPaths" ? true : false,
                this.selectedShape === "dragLastPath" ? true : false);
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_MOVE, (mevent) => {
            if(this.selected === false) return;
            // console.log("mouse move in the drag handler !!!");
            this.dragHelper.mousemove(
                mevent.wevt,
                mevent.value.points,
                this.selectedShape === "dragAllPaths" ? true : false,
                this.selectedShape === "dragLastPath" ? true : false);
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_UP, (mevent) => {
            if(this.selected === false) return;
            console.log("mouse up in the drag handler !!!");
            this.dragHelper.mouseup(mevent.wevt, mevent.value.points, this.selectedShape === "dragLastPath" ? true : false);
        });

        dispatcher.addListener(MEVENT_KINDS.CONTROL_KEY_PRESSED, (mevent) => {
            if(this.selected === false) return;
            this.isControlKeyPressed = true;
            console.log("control key pressed in the drag handler !!!");
        });

        dispatcher.addListener(MEVENT_KINDS.CONTROL_KEY_RELEASED, (mevent) => {
            if(this.selected === false) return;
            this.isControlKeyPressed = false;
            console.log("control key released in the drag handler !!!");
        });

        dispatcher.addListener(MEVENT_KINDS.CNTL_a_PRESSED, (mevent) => {
            // control + a 키는 dragAllPaths 일 경우에만 유효함
            if(this.selected === false || "dragAllPaths" !== this.selectedShape) return;
            console.log("control + a key pressed in the drag handler !!!");
            this.dragHelper.global.startingIndex = 0;
            endLastPath();
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
            this.sharePoints(this.selected);
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

const createEditHandler = (context, tempContext, selected) => {
    if(editHandler === undefined) editHandler = new EditHandler(context, tempContext);
    editHandler.selected = selected;
    return editHandler;
} 

export { createEditHandler };