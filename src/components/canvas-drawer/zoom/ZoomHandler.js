import drawHelper from "../helpers/DrawHelper";

var zoomHandler = undefined;
export default class ZoomHandler {

    constructor (context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.scale = 1.0;
    }

    up = (e, points) => {
        this.scale += .01;
        this.apply(points);
    }

    down = (e, points) => {
        this.scale -= .01;
        this.apply(points);
    }
    
    apply = (points) => {
        this.tempContext.scale(this.scale, this.scale);
        this.context.scale(this.scale, this.scale);
        drawHelper.redraw(this.context, this.tempContext, points);
    }
    
    icons = {
        up :(ctx) => {
            ctx.font = '22px Verdana';
            ctx.strokeText('+', 10, 30);
        },

        down : (ctx) => {
            ctx.font = '22px Verdana';
            ctx.strokeText('-', 15, 30);
        }
    }
}

const createZoomHandler = (context, tempContext) => {
    if(zoomHandler === undefined) zoomHandler = new ZoomHandler(context, tempContext);
    return zoomHandler;
}

export {
    createZoomHandler
}