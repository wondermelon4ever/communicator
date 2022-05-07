import drawHelper from "../helpers/DrawHelper";

var lineHandler = undefined;
export default class LineHandler {
    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.prevX = 0;
        this.prevY = 0;
        this.ismousedown = false;
        lineHandler = this;
    }

    mousedown = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;
    }
        
    mouseup = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;
        if (t.ismousedown) {
            points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

            t.ismousedown = false;
        }
    }

    mousemove = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        if (t.ismousedown) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);

            drawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);
        }
    }
}

const createLineHandler = (context, tempContext) => {
    if(lineHandler === undefined) new LineHandler(context, tempContext);
    return lineHandler;
}

export {
    createLineHandler
}