import drawHelper, { setArrowHandler } from "../../common/helpers/DrawHelper";

var arrowHandler = undefined;
export default class ArrowHandler {

    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.arrowSize = 10;
        arrowHandler = this;
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
            points[points.length] = ['arrow', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

            t.ismousedown = false;
        }
    }

    mousemove = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        var t = this;
        if (t.ismousedown) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);

            drawHelper.arrow(this.tempContext, [t.prevX, t.prevY, x, y], [], this);
        }
    }
}

const createArrowHandler = (context, tempContext) => {
    if(arrowHandler === undefined) {
        arrowHandler = new ArrowHandler(context, tempContext);
        setArrowHandler(arrowHandler);
    }

    return arrowHandler;
}

export {
    createArrowHandler
}