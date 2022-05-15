import drawHelper, { setQuadraticHandler} from "../../DrawHelper";

var quadraticHandler = undefined;
export default class QuadraticHandler {

    global = {
        ismousedown: false,
        prevX: 0,
        prevY: 0,
        controlPointX: 0,
        controlPointY: 0,
        isFirstStep: true,
        isLastStep: false
    }

    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        quadraticHandler = this;
    }

    mousedown = (e, points) => {
        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        if (!g.isLastStep) {
            g.prevX = x;
            g.prevY = y;
        }

        g.ismousedown = true;

        if (g.isLastStep && g.ismousedown) {
            this.end(x, y, points);
        }
    }

    mouseup = (e, points) => {
        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        if (g.ismousedown && g.isFirstStep) {
            g.controlPointX = x;
            g.controlPointY = y;

            g.isFirstStep = false;
            g.isLastStep = true;
        }
    }

    mousemove = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

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

const createQuadraticHandler = (context, tempContext) => {
    if(quadraticHandler === undefined) {
        quadraticHandler = new QuadraticHandler(context, tempContext);
        setQuadraticHandler(quadraticHandler);
    }
    return quadraticHandler;
}

export {
    createQuadraticHandler
}