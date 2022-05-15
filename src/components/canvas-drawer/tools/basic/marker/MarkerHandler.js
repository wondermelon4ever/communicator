import { setMarkerHandler } from "../../DrawHelper";
import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

import markerDrawHelper from "./MarkerDrawHelper";
import ShapeHandler from '../../ShapeHandler';

var markerHandler = undefined;

export default class MarkerHandler extends ShapeHandler {

    constructor(context, tempContext) {
        super(context, tempContext);

        this.selected = false;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.opts = [];

        this.addMeventListener();
        markerHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'marker') this.selected = false;
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
        markerDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

        // points[points.length] = ['line', [t.prevX, t.prevY, x, y], markerDrawHelper.getOptions()];
        points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

        t.prevX = x;
        t.prevY = y;

        markerDrawHelper.redraw(this.context, this.tempContext, points);
    }

    mousemove (mevent) {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var points = mevent.value.points;
        var t = this;

        if (t.ismousedown) {
            this.tempContext.lineCap = 'round';
            markerDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

            points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

            t.prevX = x;
            t.prevY = y;
        }
    }

    mouseup (mevent) {
        this.ismousedown = false;
        markerDrawHelper.redraw(this.context, this.tempContext, mevent.value.points);
        this.syncPoints(false);
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
        markerHandler = new MarkerHandler(context, tempContext);
        setMarkerHandler(markerHandler);
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
