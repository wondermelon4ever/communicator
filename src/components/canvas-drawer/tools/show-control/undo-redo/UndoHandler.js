import { getPoints } from '../../../views/CanvasTemp';
import drawHelper from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';

var undoHandler = undefined;
export default class UndoHandler extends ShapeHandler {

    constructor(context, tempContext) {
        super(context, tempContext);
    }

    undo = (e) => {
        var points = getPoints();
        if (points.length) {
            points.length = points.length - 1;

            drawHelper.redraw(this.context, this.tempContext, points);
        }
        this.syncPoints(true);
    }
}

const createUndoHandlerSingleton = (context, tempContext) => {
    if(undoHandler === undefined) {
        undoHandler = new UndoHandler(context, tempContext);
    }
    return undoHandler;
}

export {
    createUndoHandlerSingleton
}
