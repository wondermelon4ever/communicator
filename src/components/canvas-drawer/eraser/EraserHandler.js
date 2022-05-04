import eraserDrawHelper from "./EraserDrawHelper";

var eraserHandler = undefined;

export default class EraserHandler {

    constructor (context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.opts = [];
        eraserHandler = this;
    }

    mousedown (e, points) {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;

        this.tempContext.lineCap = 'round';
        eraserDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

        points[points.length] = ['line', [t.prevX, t.prevY, x, y], eraserDrawHelper.getOptions()];

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
            eraserDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

            points[points.length] = ['line', [t.prevX, t.prevY, x, y], eraserDrawHelper.getOptions()];

            t.prevX = x;
            t.prevY = y;
        }
    }

    updateOptionsChanged (options) {
        if(options.eraserLineWidth) {
            this.opts[0] = options.eraserLineWidth;
            eraserDrawHelper.setLineWidth(options.eraserLineWidth);
        }
        if(options.eraserStrokeStyle) {
            this.opts[1] = options.eraserStrokeStyle;
            eraserDrawHelper.setStrokeStyle(options.eraserStrokeStyle);
        }
        if(options.fillStyle) {
            this.opts[2] = options.fillStyle;
            eraserDrawHelper.setFillStyle(options.fillStyle);
        }
        if(options.globalAlpha) {
            this.opts[3] = options.globalAlpha;
            eraserDrawHelper.setGlobalAlpha(options.globalAlpha);
        }
        if(options.globalCompositeOperation) {
            this.opts[4] = options.globalCompositeOperation;
            eraserDrawHelper.setGlobalCompositeOperation(options.globalCompositeOperation)
        }
        if(options.lineCap) {
            this.opts[5] = options.lineCap;
            eraserDrawHelper.setLineCap(options.lineCap);
        }
        if(options.lineJoin) {
            this.opts[6] = options.lineJoin;
            eraserDrawHelper.setLineJoin(options.lineJoin);
        }
        if(options.font) {
            this.opts[7] = options.font;
            eraserDrawHelper.setFont(options.font);
        }
     }
}

const createEraserHandler = (context, tempContext) => {
    if(eraserHandler === undefined) {
        new EraserHandler(context, tempContext);
    }

    return eraserHandler;
}

const listenEraserOptionsChanged = (options) => {
    if(eraserHandler === undefined) return;
    eraserHandler.updateOptionsChanged(options);
}

export {
    createEraserHandler,
    listenEraserOptionsChanged
}