import drawHelper, { setImageHandler } from "../../common/helpers/DrawHelper";

var imageHandler = undefined;
export default class ImageHandler {

    constructor (context, tempContext, syncPoints) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;

        this.lastImageURL = null;
        this.lastImageIndex = 0;
        this.images = [];
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.syncPoints = syncPoints;
    }

    load = (width, height, points) => {
        var t = this;
        points[points.length] = ['image', [this.lastImageURL, t.prevX, t.prevY, width, height, this.lastImageIndex], drawHelper.getOptions()];
        document.getElementById('drag-last-path').click();

        // share to webrtc
        this.syncPoints(true);
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
            points[points.length] = ['image', [this.lastImageURL, t.prevX, t.prevY, x - t.prevX, y - t.prevY, this.lastImageIndex], drawHelper.getOptions()];
            t.ismousedown = false;
        }
    }

    mousemove = (e, points) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        if (this.ismousedown) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);
            drawHelper.image(this.tempContext, [this.lastImageURL, t.prevX, t.prevY, x - t.prevX, y - t.prevY, this.lastImageIndex]);
        }
    }
}

const createImageHandler = (context, tempContext, syncPoints) => {
    if(imageHandler === undefined) {
        imageHandler = new ImageHandler(context, tempContext, syncPoints);
        setImageHandler(imageHandler);
    }
    return imageHandler;
}

export {
    createImageHandler
}
