import { createMeventDispatcherSingleton, dispatch, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import { getPoints } from '../../../views/CanvasTemp';
import drawHelper from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';

var undoRedoHandler = undefined;
export default class UndoRedoHandler extends ShapeHandler {

    constructor(context, tempContext) {
        super(context, tempContext);

        this.stack = [];
        this.index = -1;

        this.addMeventListener();
        undoRedoHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.MOUSE_UP, (mevent) => {
            if(mevent.value.points.length > 0) {
                this.sendMevent (mevent.wevt, MEVENT_KINDS.EXIST_UNDO);
            }
            this.stack.length = 0;
            this.sendMevent (mevent.wevt, MEVENT_KINDS.NO_EXIST_REDO);
        });
    }

    sendMevent = (e, kind) => {
        dispatch({ 
            kind: kind,
            name: "",
            description: "",
            wevt: e,
            value: { }
        });
    }

    undo = (e) => { 
        var points = getPoints();
        if (points.length) {
            this.stack[++this.index] = points[points.length-1];

            points.length = points.length - 1;
            drawHelper.redraw(this.context, this.tempContext, points);
            this.sendMevent(undefined, MEVENT_KINDS.EXIST_REDO);
            if(points.length <= 0) this.sendMevent(undefined, MEVENT_KINDS.NO_EXIST_UNDO);
        } else {
            this.sendMevent(undefined, MEVENT_KINDS.NO_EXIST_UNDO);
        }
        this.syncPoints(true);
    }

    redo = (e) => {
        var points = getPoints();
        if(this.index >= 0) {
            points.push(this.stack[this.index--]);
            drawHelper.redraw(this.context, this.tempContext, points);
            this.sendMevent(undefined, MEVENT_KINDS.EXIST_UNDO);
        }

        if(this.index < 0) {
            this.sendMevent(undefined, MEVENT_KINDS.NO_EXIST_REDO);
        }
        this.syncPoints(true);
    }
}

const createUndoRedoHandlerSingleton = (context, tempContext) => {
    if(undoRedoHandler === undefined) {
        undoRedoHandler = new UndoRedoHandler(context, tempContext);
    }
    return undoRedoHandler;
}

export {
    createUndoRedoHandlerSingleton
}
