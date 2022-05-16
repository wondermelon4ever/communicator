import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import drawHelper from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';
import { getPoints } from '../../../views/CanvasTemp';

var bezierHandler = undefined;
export default class BezierHandler extends ShapeHandler {

    constructor(context, tempContext, selected) {
        super(context, tempContext);

        this.selected = selected;
        this.addMeventListener();
        bezierHandler = this;
    }

    global = {
        ismousedown: false,
        prevX: 0,
        prevY: 0,

        firstControlPointX: 0,
        firstControlPointY: 0,
        secondControlPointX: 0,
        secondControlPointY: 0,

        isFirstStep: true,
        isSecondStep: false,
        isLastStep: false
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'bezier-curve') this.selected = false;
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

        if (!g.isLastStep && !g.isSecondStep) {
            g.prevX = x;
            g.prevY = y;
        }

        g.ismousedown = true;

        var points = getPoints();
        if (g.isLastStep && g.ismousedown) {
            this.end(x, y, points);
        }

        if (g.ismousedown && g.isSecondStep) {
            g.secondControlPointX = x;
            g.secondControlPointY = y;

            g.isSecondStep = false;
            g.isLastStep = true;
        }
        drawHelper.redraw(this.context, this.tempContext, points);
    }

    mouseup = (mevent) => {
        var g = this.global;

        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        if (g.ismousedown && g.isFirstStep) {
            g.firstControlPointX = x;
            g.firstControlPointY = y;

            g.isFirstStep = false;
            g.isSecondStep = true;
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
            drawHelper.bezier(this.tempContext, [g.prevX, g.prevY, x, y, x, y, x, y]);
        }

        if (g.ismousedown && g.isSecondStep) {
            drawHelper.bezier(this.tempContext, [g.prevX, g.prevY, g.firstControlPointX, g.firstControlPointY, x, y, x, y]);
        }

        if (g.isLastStep) {
            drawHelper.bezier(this.tempContext, [g.prevX, g.prevY, g.firstControlPointX, g.firstControlPointY, g.secondControlPointX, g.secondControlPointY, x, y]);
        }
    }

    end = (x, y, points) => {
        var g = this.global;

        if (!g.ismousedown) return;

        g.isLastStep = g.isSecondStep = false;

        g.isFirstStep = true;
        g.ismousedown = false;

        g.secondControlPointX = g.secondControlPointX || g.firstControlPointX;
        g.secondControlPointY = g.secondControlPointY || g.firstControlPointY;

        x = x || g.secondControlPointX;
        y = y || g.secondControlPointY;

        points[points.length] = ['bezier', [g.prevX, g.prevY, g.firstControlPointX, g.firstControlPointY, g.secondControlPointX, g.secondControlPointY, x, y], drawHelper.getOptions()];
    }
}

const createBezierHandlerSingleton = (context, tempContext, selected) => {
    if(bezierHandler === undefined) {
        bezierHandler = new BezierHandler(context, tempContext, selected);
    }
    return bezierHandler;
}

export {
    createBezierHandlerSingleton
}

