import drawHelper from "../helpers/DrawHelper";

export default class EraserHandler {

    constructor (context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
    }

    mousedown (e, points) {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;

        this.tempContext.lineCap = 'round';
        drawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

        points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

        t.prevX = x;
        t.prevY = y;
    }

    mouseup (e, points) {
        this.ismousedown = false;
    }

    mousemove (e, points) {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        if (t.ismousedown) {
            this.tempContext.lineCap = 'round';
            drawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

            points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

            t.prevX = x;
            t.prevY = y;
        }
    }
}
