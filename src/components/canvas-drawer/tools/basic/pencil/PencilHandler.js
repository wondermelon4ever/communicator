import { setPencilHandler } from "../../DrawHelper";
import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

import pencilDrawHelper from "./PencilDrawHelper";
import ShapeHandler from '../../ShapeHandler';

var pencilHandler = undefined;

export default class PencilHandler extends ShapeHandler {

    constructor(context, tempContext) {
        super(context, tempContext);
        
        this.selected = false;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.opts = [];
        this.addMeventListener();
        pencilHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'pencil') this.selected = false;
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

        // make sure that pencil is drawing shapes even if mouse is down but mouse isn't moving
        this.tempContext.lineCap = 'round';
        pencilDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

        points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

        t.prevX = x;
        t.prevY = y;

        pencilDrawHelper.redraw(this.context, this.tempContext, points);
    }

    mousemove (mevent) {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var points = mevent.value.points;
        var t = this;

        if (t.ismousedown) {
            this.tempContext.lineCap = 'round';
            pencilDrawHelper.line(this.tempContext, [t.prevX, t.prevY, x, y]);

            points[points.length] = ['line', [t.prevX, t.prevY, x, y], this.opts];

            t.prevX = x;
            t.prevY = y;
        }
    }

    mouseup (mevent) {
        this.ismousedown = false;
        pencilDrawHelper.redraw(this.context, this.tempContext, mevent.value.points);
        this.syncPoints(false);
    }

    updateOptions (options) {
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

const createPencilHandler = (context, tempContext, selected) => {
    if(pencilHandler === undefined) {
        pencilHandler = new PencilHandler(context, tempContext);
        pencilHandler.selected = selected;
        setPencilHandler(pencilHandler);
    }

    return pencilHandler;
}

const initPencilOptions = (options) => {
    if(pencilHandler === undefined) return;
    pencilHandler.updateOptions(options);

}

const onPencilOptionsChanged = (options) => {
    if(pencilHandler === undefined) return;
    pencilHandler.updateOptions(options);
}

export {
    createPencilHandler,
    initPencilOptions,
    onPencilOptionsChanged
}
