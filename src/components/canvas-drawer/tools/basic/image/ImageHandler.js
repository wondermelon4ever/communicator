import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

import { getPoints } from '../../../views/CanvasTemp';
import drawHelper from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';
import FileSelector from "./FileSelector";

var imageHandler = undefined;
export default class ImageHandler extends ShapeHandler {

    constructor (context, tempContext) {
        super(context, tempContext);

        this.selected = false;
        this.ismousedown = false;
        this.lastImageURL = null;
        this.lastImageIndex = 0;
        this.images = [];
        this.prevX = 0;
        this.prevY = 0;
        this.addMeventListener();
        imageHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'image') this.selected = false;
            else this.selected = true;
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_DOWN, (mevent) => {
            if(this.selected === false) return;
            this.mousedown(mevent);
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_MOVE, (mevent) => {
            if(this.selected === false || this.ismousedown == false) return;
            this.mousemove(mevent);
        });
    
        dispatcher.addListener(MEVENT_KINDS.MOUSE_UP, (mevent) => {
            if(this.selected === false) return;
            this.mouseup(mevent);
        });
    }

    onIconClicked = () => {
        var selector = new FileSelector();
        selector.accept = 'image/*';
        selector.selectSingleFile( (file) => {
            if (!file) return;

            var reader = new FileReader();
            reader.onload = (event) => {
                var image = new Image();
                image.onload =  () => {
                    var index = this.images.length;

                    this.lastImageURL = image.src;
                    this.lastImageIndex = index;

                    this.images.push(image);
                    this.load(image.clientWidth, image.clientHeight, getPoints());
                };
                image.style = 'position: absolute; top: -99999999999; left: -999999999;';
                document.body.appendChild(image);
                image.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    load = (width, height, points) => {
        var t = this;
        points[points.length] = ['image', [this.lastImageURL, t.prevX, t.prevY, width, height, this.lastImageIndex], drawHelper.getOptions()];
        document.getElementById('drag-last-path').click();

        // share to webrtc
        this.syncPoints(true);
    }
    
    mousedown = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var t = this;

        t.prevX = x;
        t.prevY = y;

        t.ismousedown = true;
    }

    mouseup = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var points = mevent.value.points;
        var t = this;
        if (t.ismousedown) {
            points[points.length] = ['image', [this.lastImageURL, t.prevX, t.prevY, x - t.prevX, y - t.prevY, this.lastImageIndex], drawHelper.getOptions()];
            t.ismousedown = false;
        }
    }

    mousemove = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var t = this;
        if (this.ismousedown) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);
            drawHelper.image(this.tempContext, [this.lastImageURL, t.prevX, t.prevY, x - t.prevX, y - t.prevY, this.lastImageIndex]);
        }
    }
}

const createImageHandlerSingleton = (context, tempContext) => {
    if(imageHandler === undefined) {
        imageHandler = new ImageHandler(context, tempContext);
    }
    return imageHandler;
}

export {
    createImageHandlerSingleton
}
