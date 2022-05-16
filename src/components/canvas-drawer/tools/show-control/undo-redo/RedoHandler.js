import { getPoints } from '../../../views/CanvasTemp';
import drawHelper from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';

var redoHandler = undefined;
export default class RedoHandler extends ShapeHandler {

    constructor(context, tempContext) {
        super(context, tempContext);
    }

    redo = (e) => {
        console.log("redo handler's redo => to be developed in later.")
        // var points = getPoints();
        // if (points.length) {
        //     points.length = points.length - 1;

        //     drawHelper.redraw(this.context, this.tempContext, points);
        // }
        // this.syncPoints(true);
    }
}

const createRedoHandlerSingleton = (context, tempContext) => {
    if(redoHandler === undefined) {
        redoHandler = new RedoHandler(context, tempContext);
    }
    return redoHandler;
}

export {
    createRedoHandlerSingleton
}