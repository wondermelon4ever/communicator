import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import drawHelper from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';
import { getPoints } from '../../../views/CanvasTemp';

var lineHandler = undefined;
export default class LineHandler extends ShapeHandler {

    constructor(context, tempContext, selected) {
        super(context, tempContext);

        this.selected = selected;
        this.prevX = 0;
        this.prevY = 0;
        this.ismousedown = false;

        this.addMeventListener();
        lineHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'line') this.selected = false;
            else this.selected = true;
        });
          
        dispatcher.addListener(MEVENT_KINDS.MOUSE_DOWN, (mevent) => {
            if(this.selected === false) return;
            this.mousedown(mevent);
        });
    
        dispatcher.addListener(MEVENT_KINDS.MOUSE_MOVE, (mevent) => {
            if(this.selected === false || !this.ismousedown) return;
            this.mousemove(mevent);
        });
    
        dispatcher.addListener(MEVENT_KINDS.MOUSE_UP, (mevent) => {
            if(this.selected === false) return;
            this.mouseup(mevent);
        });
    }

    mousedown = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;
        drawHelper.redraw(this.context, this.tempContext, getPoints());
    }
        
    mouseup = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;
        var points = getPoints();
        var t = this;
        if (t.ismousedown) {
            points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];
            t.ismousedown = false;
            drawHelper.redraw(this.context, this.tempContext, points);
        }
    }

    mousemove = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var t = this;

        if (t.ismousedown) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);

            drawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);
        }
    }
}

const createLineHandlerSingleton = (context, tempContext, selected) => {
    if(lineHandler === undefined) {
        lineHandler = new LineHandler(context, tempContext, selected);
    }
    return lineHandler;
}

export {
    createLineHandlerSingleton
}
