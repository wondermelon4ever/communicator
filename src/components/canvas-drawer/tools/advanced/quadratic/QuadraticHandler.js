import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import drawHelper from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';
import { getPoints } from '../../../views/CanvasTemp';

var quadraticHandler = undefined;
export default class QuadraticHandler extends ShapeHandler {

    global = {
        ismousedown: false,
        prevX: 0,
        prevY: 0,
        controlPointX: 0,
        controlPointY: 0,
        isFirstStep: true,
        isLastStep: false
    }

    constructor(context, tempContext, selected) {
        super(context, tempContext);

        this.selected = selected;
        this.addMeventListener();
        quadraticHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'quadratic-curve') this.selected = false;
            else this.selected = true;
        });
          
        dispatcher.addListener(MEVENT_KINDS.MOUSE_DOWN, (mevent) => {
            if(this.selected === false) return;
            this.mousedown(mevent);
        });
    
        dispatcher.addListener(MEVENT_KINDS.MOUSE_MOVE, (mevent) => {
            if(this.selected === false || !this.global.ismousedown) return;
            this.mousemove(mevent);
        });
    
        dispatcher.addListener(MEVENT_KINDS.MOUSE_UP, (mevent) => {
            if(this.selected === false) return;
            this.mouseup(mevent);
        });
    }

    mousedown = (mevent) => {
        var g = this.global;

        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        if (!g.isLastStep) {
            g.prevX = x;
            g.prevY = y;
        }

        g.ismousedown = true;
        var points = getPoints();
        
        if (g.isLastStep && g.ismousedown) {
            this.end(x, y, points);
        }
        drawHelper.redraw(this.context, this.tempContext, points);
    }

    mouseup = (mevent) => {
        var g = this.global;

        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        if (g.ismousedown && g.isFirstStep) {
            g.controlPointX = x;
            g.controlPointY = y;

            g.isFirstStep = false;
            g.isLastStep = true;
        }
        drawHelper.redraw(this.context, this.tempContext, getPoints());
        this.syncPoints(false);
    }

    mousemove = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var g = this.global;

        this.tempContext.clearRect(0, 0, innerWidth, innerHeight);

        if (g.ismousedown && g.isFirstStep) {
            drawHelper.quadratic(this.tempContext, [g.prevX, g.prevY, x, y, x, y]);
        }

        if (g.isLastStep) {
            drawHelper.quadratic(this.tempContext, [g.prevX, g.prevY, g.controlPointX, g.controlPointY, x, y]);
        }
    }

    end = (x, y, points) => {
        var g = this.global;

        if (!g.ismousedown) return;

        g.isLastStep = false;

        g.isFirstStep = true;
        g.ismousedown = false;

        x = x || g.controlPointX || g.prevX;
        y = y || g.controlPointY || g.prevY;

        points[points.length] = ['quadratic', [g.prevX, g.prevY, g.controlPointX, g.controlPointY, x, y], drawHelper.getOptions()];
    }
}

const createQuadraticHandlerSingleton = (context, tempContext, selected) => {
    if(quadraticHandler === undefined) {
        quadraticHandler = new QuadraticHandler(context, tempContext, selected);
    }
    return quadraticHandler;
}

export {
    createQuadraticHandlerSingleton
}
