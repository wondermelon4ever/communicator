import drawHelper from "../helpers/DrawHelper";

var bezierHandler = undefined;
export default class BezierHandler {

    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
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

    mousedown = (e, points) => {
        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        if (!g.isLastStep && !g.isSecondStep) {
            g.prevX = x;
            g.prevY = y;
        }

        g.ismousedown = true;

        if (g.isLastStep && g.ismousedown) {
            this.end(x, y);
        }

        if (g.ismousedown && g.isSecondStep) {
            g.secondControlPointX = x;
            g.secondControlPointY = y;

            g.isSecondStep = false;
            g.isLastStep = true;
        }
    }

    mouseup = (e, points) => {
        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        if (g.ismousedown && g.isFirstStep) {
            g.firstControlPointX = x;
            g.firstControlPointY = y;

            g.isFirstStep = false;
            g.isSecondStep = true;
        }
    }

    mousemove = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

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

const createBezierHandler = (context, tempContext) => {
    if(bezierHandler === undefined) bezierHandler = new BezierHandler(context, tempContext);
    return bezierHandler;
}

export {
    createBezierHandler
}

