import arcDrawHelper from './ArcDrawHelper';
import {
    addEvent,
    colors,
    find,
    getContext,
    hexToRGBA,
    hideContainers
} from '../util/Utils';

var arcHandler = undefined;
export default class ArcHandler  {
    global = {
        ismousedown : false,
        prevX : 0,
        prevY : 0,
        prevRadius : 0,
        isCircleDrawn : false,
        isCircleEnded : false,
        isClockwise : false,
        arcRangeContainer : null,
        arcRange : null,
    }

    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        // this.ismousedown = false;
        // this.prevX = 0, this.prevY = 0;
        // this.prevRadius = 0;
        // this.isCircleDrawn = false;
        // this.isCircleEnded = false;
        // this.isClockwise = false;
        // this.arcRangeContainer = null;
        // this.arcRange = null;
    }

    mousedown = (e, points) => {
        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        g.prevX = x, g.prevY = y;
        g.ismousedown = true;

    }
    
    mouseup = (e, points) => {
        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft, y = e.pageY - this.canvas.offsetTop;

        if (g.ismousedown) {
            if (!g.isCircleDrawn && g.isCircleEnded) {
                var prevX = g.prevX,
                    prevY = g.prevY,
                    radius = ((x - prevX) + (y - prevY)) / 3;

                g.prevRadius = radius;
                g.isCircleDrawn = true;
                g.isCircleEnded = false;

                var c = (2 * Math.PI * radius) / 21,
                    angle,
                    xx = prevX > x ? prevX - x : x - prevX,
                    yy = prevY > y ? prevY - y : y - prevY;

                angle = (xx + yy) / (2 * c);
                points[points.length] = ['arc', [prevX + radius, prevY + radius, radius, angle, 1], arcDrawHelper.getOptions()];

                var arcRange = g.arcRange,
                    arcRangeContainer = g.arcRangeContainer;

                arcRangeContainer.style.display = 'block';
                arcRange.focus();

                arcRangeContainer.style.top = (y + this.canvas.offsetTop + 20) + 'px';
                arcRangeContainer.style.left = x + 'px';

                arcRange.value = 2;
            } else if (g.isCircleDrawn && !g.isCircleEnded) {
                this.end(points);
            }
        }
        g.ismousedown = false;
        this.fixAllPoints(points);
    }
    
    mousemove = (e, points) => {
        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var ismousedown = g.ismousedown,
            isCircleDrawn = g.isCircleDrawn,
            isCircleEnded = g.isCircleEnded;

        if (ismousedown) {
            if (!isCircleDrawn && isCircleEnded) {
                var prevX = g.prevX,
                    prevY = g.prevY,
                    radius = ((x - prevX) + (y - prevY)) / 3;

                this.tempContext.clearRect(0, 0, 2000, 2000);

                if(radius >= 0) {
                    arcDrawHelper.arc(this.tempContext, [prevX + radius, prevY + radius, radius, Math.PI * 2, true]);
                }
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
    
    init = (points) => {
        var markIsClockwise = find('is-clockwise'),
            g = this.global;

        g.arcRangeContainer = find('arc-range-container');
        g.arcRange = find('arc-range');

        addEvent(markIsClockwise, 'change', (e) => {
            g.isClockwise = markIsClockwise.checked;

            g.arcRange.value = this.toFixed(g.arcRange.value);
            g.arcRange.focus();

            this.handleArcRange(e, points);

            if (!points.length) return;

            var p = points[points.length - 1],
                point = p[1];

            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);
            drawHelper.arc(this.tempContext, [point[0], point[1], point[2], point[3], point[4]]);
        });

        var arcRange = g.arcRange;
        addEvent(arcRange, 'keydown', (e) => this.handleArcRange(e, points));
        addEvent(arcRange, 'focus',   (e) => this.handleArcRange(e, points));
    }
        
    handleArcRange = (e, points) => {
        if(points === undefined) return;

        var g = arcHandler.global,
            arcRange = g.arcRange;

        var key = e.keyCode,
            value = + arcRange.value;
        if (key == 39 || key == 40) arcRange.value = (value < 2.0 ? value : 1.98) + .02;
        if (key == 37 || key == 38) arcRange.value = (value > 0.0 ? value : 0.02) - .02;

        if (!key || key == 13 || key == 39 || key == 40 || key == 37 || key == 38) {
            var range = Math.PI * this.toFixed(value);
            var p = points[points.length - 1];

            if (p[0] === 'arc') {
                var point = p[1];
                points[points.length - 1] = ['arc', [point[0], point[1], point[2], range, g.isClockwise ? 1 : 0], p[2]];

                arcDrawHelper.redraw(this.context, this.tempContext, points, this);
            }
        }
    }

    toFixed = (input) => {
        return Number(input).toFixed(1);
    }

    end = (points) => {
        var g = this.global;

        g.arcRangeContainer.style.display = 'none';
        g.arcRange.value = 2.0;

        g.isCircleDrawn = false;
        g.isCircleEnded = true;

        arcDrawHelper.redraw(this.context, this.tempContext, points, this);
    }
}

const createArcHandler = (context, tempContext) => {
    if(arcHandler === undefined) arcHandler = new ArcHandler(context, tempContext);
    return arcHandler;
}

const onArcRangeKeyDowned = (keyCode) => {
    // to be later...
}

const onIsClockwiseChanged = (isClockwise) => {
    if(arcHandler === undefined) return;
    arcHandler.global.isClockwise = isClockwise;
}

export {
    createArcHandler,
    onArcRangeKeyDowned,
    onIsClockwiseChanged
}
