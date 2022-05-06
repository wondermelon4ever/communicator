import markerDrawHelper, { initMarkerDrawHelper } from "./MarkerDrawHelper";

var markerHandler = undefined;

export default class MarkerHandler {

    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.opts = [];
        markerHandler = this;
    }

    mousedown (e, points) {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;

        this.tempContext.lineCap = 'round';
        markerDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

        // points[points.length] = ['line', [t.prevX, t.prevY, x, y], markerDrawHelper.getOptions()];
        points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

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
            markerDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

            // points[points.length] = ['line', [t.prevX, t.prevY, x, y], markerDrawHelper.getOptions()];
            points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

            t.prevX = x;
            t.prevY = y;
        }
    }

    updateOptionsChanged (options) {
        if(options.markerLineWidth) {
            this.opts[0] = options.markerLineWidth;
            markerDrawHelper.setLineWidth(options.markerLineWidth);
        }
        if(options.markerStrokeStyle) {
            this.opts[1] = options.markerStrokeStyle;
            markerDrawHelper.setStrokeStyle(options.markerStrokeStyle);
        }
        if(options.fillStyle) {
            this.opts[2] = options.fillStyle;
            markerDrawHelper.setFillStyle(options.fillStyle);
        }
        if(options.globalAlpha) {
            this.opts[3] = options.globalAlpha;
            markerDrawHelper.setGlobalAlpha(options.globalAlpha);
        }
        if(options.globalCompositeOperation) {
            this.opts[4] = options.globalCompositeOperation;
            markerDrawHelper.setGlobalCompositeOperation(options.globalCompositeOperation)
        }
        if(options.lineCap) {
            this.opts[5] = options.lineCap;
            markerDrawHelper.setLineCap(options.lineCap);
        }
        if(options.lineJoin) {
            this.opts[6] = options.lineJoin;
            markerDrawHelper.setLineJoin(options.lineJoin);
        }
        if(options.font) {
            this.opts[7] = options.font;
            markerDrawHelper.setFont(options.font);
        }
     }
}

const createMarkerHandler = (context, tempContext) => {
    if(markerHandler === undefined) {
        new MarkerHandler(context, tempContext);
    }

    return markerHandler;
}

const initMarkerOptions = (options) => {
    if(markerHandler === undefined) return;
    markerHandler.updateOptionsChanged(otpions);

}

const onMarkerOptionsChanged = (options) => {
    if(markerHandler === undefined) return;
    markerHandler.updateOptionsChanged(options);
}

export {
    createMarkerHandler,
    initMarkerOptions,
    onMarkerOptionsChanged
}
