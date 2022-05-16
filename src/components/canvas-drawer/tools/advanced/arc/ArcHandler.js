import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import drawHelper from "../../DrawHelper";
import { addEvent, find } from '../../../util/Utils';
import ShapeHandler from '../../ShapeHandler';
import { getPoints } from '../../../views/CanvasTemp';

var arcHandler = undefined;
export default class ArcHandler extends ShapeHandler {

    constructor(context, tempContext, selected) {
        super(context, tempContext);

        this.selected = selected;
        this.ismousedown = false;
        this.prevX = 0, this.prevY = 0;
        this.prevRadius = 0;
        this.isCircleDrawn = false;
        this.isCircleEnded = true;
        this.isClockwise = false;
        this.arcRangeContainer = null;
        this.arcRange = null;
        
        this.addMeventListener();
        this.init();
        arcHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'arc') this.selected = false;
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

    mousedown = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        this.prevX = x, this.prevY = y;
        this.ismousedown = true;
        drawHelper.redraw(this.context, this.tempContext, getPoints());
    }
    
    mouseup = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft, 
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var points = getPoints();
        if (this.ismousedown) {
            if (!this.isCircleDrawn && this.isCircleEnded) {
                var prevX = this.prevX,
                    prevY = this.prevY,
                    radius = ((x - prevX) + (y - prevY)) / 3;

                this.prevRadius = radius;
                this.isCircleDrawn = true;
                this.isCircleEnded = false;

                var c = (2 * Math.PI * radius) / 21,
                    angle,
                    xx = prevX > x ? prevX - x : x - prevX,
                    yy = prevY > y ? prevY - y : y - prevY;

                angle = (xx + yy) / (2 * c);
                points[points.length] = ['arc', [prevX + radius, prevY + radius, radius, angle, 1], drawHelper.getOptions()];

                this.arcRangeContainer.style.display = 'block';
                this.arcRange.focus();

                this.arcRangeContainer.style.top = (y + this.canvas.offsetTop + 20) + 'px';
                this.arcRangeContainer.style.left = x + 'px';

                this.arcRange.value = 2;
            } else if (this.isCircleDrawn && !this.isCircleEnded) {
                this.end(points);
            }
            drawHelper.redraw(this.context, this.tempContext, getPoints());
        }
        this.ismousedown = false;
        this.fixAllPoints(points);
        this.syncPoints(false);
    }
    
    mousemove = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        if (this.ismousedown) {
            if (!this.isCircleDrawn && this.isCircleEnded) {
                var prevX = this.prevX,
                    prevY = this.prevY,
                    radius = ((x - prevX) + (y - prevY)) / 3;

                this.tempContext.clearRect(0, 0, 2000, 2000);
                drawHelper.arc(this.tempContext, [prevX + radius, prevY + radius, radius, Math.PI * 2, true]);
            }
        }
    }

    fixAllPoints = (points) => {
        var toFixed = this.toFixed;

        for (var i = 0; i < points.length; i++) {
            var p = points[i],
                point;
            if (p[0] === 'arc') {
                point = p[1];
                points[i] = ['arc', [toFixed(point[0]), toFixed(point[1]), toFixed(point[2]), toFixed(point[3]), point[4]], p[2] ];
            }
        }
    }
    
    init = () => {
        var markIsClockwise = find('is-clockwise');

        this.arcRangeContainer = find('arc-range-container');
        this.arcRange = find('arc-range');

        addEvent(markIsClockwise, 'change', (e) => {
            this.isClockwise = markIsClockwise.checked;
            this.arcRange.value = this.toFixed(this.arcRange.value);
            this.arcRange.focus();
            var points = getPoints();
            this.handleArcRange(e, points);

            if (!points.length) return;

            var p = points[points.length - 1],
                point = p[1];

            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);
            drawHelper.arc(this.tempContext, [point[0], point[1], point[2], point[3], point[4]]);
        });

        addEvent(this.arcRange, 'keydown', (e) => this.handleArcRange(e, getPoints()));
        addEvent(this.arcRange, 'focus',   (e) => this.handleArcRange(e, getPoints()));
    }
        
    handleArcRange = (e, points) => {
        if(points === undefined) return;

        var key = e.keyCode, value =+ this.arcRange.value;

        if (key == 39 || key == 40) this.arcRange.value = (value < 2 ? value : 1.98) + .02;
        if (key == 37 || key == 38) this.arcRange.value = (value > 0 ? value : 0.02) - .02;

        if (!key || key == 13 || key == 39 || key == 40 || key == 37 || key == 38) {
            var range = Math.PI * this.toFixed(this.arcRange.value);
            var p = points[points.length - 1];

            if (p[0] === 'arc') {
                var point = p[1];
                points[points.length - 1] = ['arc', [point[0], point[1], point[2], range, this.isClockwise ? 1 : 0], p[2]];
                drawHelper.redraw(this.context, this.tempContext, points, this);
            }
        }
    }

    toFixed = (input) => {
        return Number(input).toFixed(1);
    }

    end = (points) => {
        this.arcRangeContainer.style.display = 'none';
        this.arcRange.value = 2;

        this.isCircleDrawn = false;
        this.isCircleEnded = true;

        drawHelper.redraw(this.context, this.tempContext, points, this);
    }
}

const createArcHandlerSingleton = (context, tempContext, selected) => {
    if(arcHandler === undefined) {
        arcHandler = new ArcHandler(context, tempContext, selected);
    }
    return arcHandler;
}

const onArcRangeKeyDowned = (keyCode) => {
    // to be later...
}

const onIsClockwiseChanged = (isClockwise) => {
    if(arcHandler === undefined) return;
    console.log("isClockwise from UI ==>" + isClockwise);
    arcHandler.isClockwise = isClockwise;
}

export {
    createArcHandlerSingleton,
    onArcRangeKeyDowned,
    onIsClockwiseChanged
}
