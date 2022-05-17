import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

import eraserDrawHelper from "./EraserDrawHelper";
import ShapeHandler from '../../ShapeHandler';

var eraserHandler = undefined;

export default class EraserHandler extends ShapeHandler {

    constructor (context, tempContext, selected) {
        super(context, tempContext);

        this.selected = selected;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.opts = [];

        this.addMeventListener();
        eraserHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'eraser') this.selected = false;
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

    mousedown (mevent) {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var points = mevent.value.points;

        var t = this;
        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;

        this.tempContext.lineCap = 'round';
        eraserDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

        points[points.length] = ['line', [t.prevX, t.prevY, x, y], eraserDrawHelper.getOptions()];

        t.prevX = x;
        t.prevY = y;

        eraserDrawHelper.redraw(this.context, this.tempContext, points);
    }

    mousemove (mevent) {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;
        
            var points = mevent.value.points;
        var t = this;

        if (t.ismousedown) {
            this.tempContext.lineCap = 'round';
            eraserDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

            points[points.length] = ['line', [t.prevX, t.prevY, x, y], eraserDrawHelper.getOptions()];

            t.prevX = x;
            t.prevY = y;
        }
    }

    mouseup (mevent) {
        this.ismousedown = false;
        eraserDrawHelper.redraw(this.context, this.tempContext, mevent.value.points);
        this.syncPoints(false);
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

const createEraserHandlerSingleton = (context, tempContext, selected) => {
    if(eraserHandler === undefined) {
        eraserHandler = new EraserHandler(context, tempContext, selected);
    }

    return eraserHandler;
}

const onEraserOptionsChanged = (options) => {
    if(eraserHandler === undefined) return;
    eraserHandler.updateOptionsChanged(options);
}

export {
    createEraserHandlerSingleton,
    onEraserOptionsChanged
}
