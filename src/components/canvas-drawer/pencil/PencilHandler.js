import pencilDrawHelper from "./PencilDrawHelper";

var pencilHandler = undefined;

export default class PencilHandler {

    constructor(context, tempContext) {
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.tempContext = tempContext;
        this.context = context;
        this.canvas = tempContext.canvas;
        this.opts = [];
        pencilHandler = this;
    }

    mousedown (e, points) {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;

        // make sure that pencil is drawing shapes even if mouse is down but mouse isn't moving
        this.tempContext.lineCap = 'round';
        pencilDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

        points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

        t.prevX = x;
        t.prevY = y;
    }

    mouseup (e) {
        this.ismousedown = false;
    }

    mousemove (e, points) {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        if (t.ismousedown) {
            this.tempContext.lineCap = 'round';
            pencilDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

            points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

            t.prevX = x;
            t.prevY = y;
        }
    }

    updateOptionsChanged (options) {
       if(options.pencilLineWidth) {
           this.opts[0] = options.pencilLineWidth;
           pencilDrawHelper.setLineWidth(options.pencilLineWidth);
       }
       if(options.pencilStrokeStyle) {
           this.opts[1] = options.pencilStrokeStyle;
           pencilDrawHelper.setStrokeStyle(options.pencilStrokeStyle);
       }
       if(options.fillStyle) {
           this.opts[2] = options.fillStyle;
           pencilDrawHelper.setFillStyle(options.fillStyle);
       }
       if(options.globalAlpha) {
           this.opts[3] = options.globalAlpha;
           pencilDrawHelper.setGlobalAlpha(options.globalAlpha);
       }
       if(options.globalCompositeOperation) {
           this.opts[4] = options.globalCompositeOperation;
           pencilDrawHelper.setGlobalCompositeOperation(options.globalCompositeOperation)
       }
       if(options.lineCap) {
           this.opts[5] = options.lineCap;
           pencilDrawHelper.setLineCap(options.lineCap);
       }
       if(options.lineJoin) {
           this.opts[6] = options.lineJoin;
           pencilDrawHelper.setLineJoin(options.lineJoin);
       }
       if(options.font) {
           this.opts[7] = options.font;
           pencilDrawHelper.setFont(options.font);
       }
    }
}

const createPencilHandler = (context, tempContext) => {
    if(pencilHandler === undefined) {
        new PencilHandler(context, tempContext);
    }

    return pencilHandler;
}

const initPencilOptions = (options) => {
    if(pencilHandler === undefined) return;
    pencilHandler.updateOptionsChanged(otpions);

}

const listenPencilOptionsChanged = (options) => {
    if(pencilHandler === undefined) return;
    pencilHandler.updateOptionsChanged(options);
}

export {
    createPencilHandler,
    initPencilOptions,
    listenPencilOptionsChanged
}
