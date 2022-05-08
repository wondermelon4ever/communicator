import drawHelper, { setRectHandler } from "../../common/helpers/DrawHelper";

var rectHandler = undefined;

export default class RectHandler {
    
    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        rectHandler = this;
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
            points[points.length] = ['rect', [t.prevX, t.prevY, x - t.prevX, y - t.prevY], drawHelper.getOptions()];

            t.ismousedown = false;
        }
    }
     
    mousemove = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;
        if (t.ismousedown) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);

            drawHelper.rect(this.tempContext, [t.prevX, t.prevY, x - t.prevX, y - t.prevY]);
        }
    }
}

const createRectHandler = (context, tempContext) => {
    if(rectHandler === undefined) {
        rectHandler = new RectHandler(context, tempContext);
        setRectHandler(rectHandler);
    }
    return rectHandler;
}

export {
    createRectHandler
}