
var arcHandler   = undefined;
var arrowHandler = undefined;
var bezierHandler= undefined;
var eraserHandler= undefined;
var imageHandler = undefined;
var lineHandler  = undefined;
var markerHandler= undefined;
var pdfHandler   = undefined;
var pencilHandler= undefined;
var quadraticHandler = undefined;
var rectHandler  = undefined;
var textHandler  = undefined;
var zoomHandler  = undefined;

var drawHelper = {

    _lineWidth: 5,
    _strokeStyle: "round",
    _fillStyle : "rgba(0,0,0,0)",
    _globalAlpha: 1,
    _globalCompositeOperation: "source-over",
    _lineCap: "round",
    _lineJoin: "round",
    _font: "15px Arial",

    redraw : function (context, tempContext, points) {
        tempContext.clearRect(0, 0, innerWidth, innerHeight);
        context.clearRect(0, 0, innerWidth, innerHeight);
        var i, point, length = points.length;
        for (i = 0; i < length; i++) {
            point = points[i];
            // point[0] != 'pdf' && 
            if (point && point.length && this[point[0]]) {
                this[point[0]](context, point[1], point[2]);
            }
            // else warn
        }
    },

    setLineWidth : function (lineWidth) {
        this._lineWidth = lineWidth;
    },

    setStrokeStyle: function (strokeStyle) {
        this._strokeStyle = strokeStyle;
    },

    setFillStyle: function (fillStyle) {
        this._fillStyle = fillStyle;
    },

    setGlobalAlpha: function (globalAlpha) {
        this._globalAlpha = globalAlpha;
    },

    setGlobalCompositeOperation : function (globalCompositeOperation) {
        this._globalCompositeOperation = globalCompositeOperation;
    },

    setLineCap : function (lineCap) {
        this._lineCap = lineCap;
    },

    setLineJoin : function(lineJoin) {
        this._lineJoin = lineJoin;
    },

    setFont : function (font) {
        this._font = font;
    },

    getOptions : function (opt) {
        opt = opt || {};
        return [
            opt.lineWidth || this._lineWidth,
            opt.strokeStyle || this._strokeStyle,
            opt.fillStyle || this._fillStyle,
            opt.globalAlpha || this._globalAlpha,
            opt.globalCompositeOperation || this._globalCompositeOperation,
            opt.lineCap || this._lineCap,
            opt.lineJoin || this._lineJoin,
            opt.font || this._font
        ];
    },

    handleOptions : function (context, opt, isNoFillStroke) {
        opt = opt || this.getOptions();
        context.globalAlpha = opt[3];
        context.globalCompositeOperation = opt[4];

        context.lineCap = opt[5];
        context.lineJoin = opt[6];
        context.lineWidth = opt[0];
        context.strokeStyle = opt[1];
        context.fillStyle = opt[2];
        context.font = opt[7];

        if (!isNoFillStroke) {
            context.stroke();
            context.fill();
        }
    },

    line : function(context, point, options) {
        context.beginPath();
        context.moveTo(point[0], point[1]);
        context.lineTo(point[2], point[3]);

        this.handleOptions(context, options);
    },

    marker : function(context, point, options) {
        context.beginPath();
        context.moveTo(point[0], point[1]);
        context.lineTo(point[2], point[3]);

        this.handleOptions(context, options);
    },

    arrow : function(context, point, options) {
        var mx = point[0];
        var my = point[1];

        var lx = point[2];
        var ly = point[3];

        var arrowSize = arrowHandler.arrowSize;

        if (arrowSize == 10) {
            arrowSize = (options ? options[0] : lineWidth) * 5;
        }

        var angle = Math.atan2(ly - my, lx - mx);

        context.beginPath();
        context.moveTo(mx, my);
        context.lineTo(lx, ly);

        this.handleOptions(context, options);

        context.beginPath();
        context.moveTo(lx, ly);
        context.lineTo(lx - arrowSize * Math.cos(angle - Math.PI / 7), ly - arrowSize * Math.sin(angle - Math.PI / 7));
        context.lineTo(lx - arrowSize * Math.cos(angle + Math.PI / 7), ly - arrowSize * Math.sin(angle + Math.PI / 7));
        context.lineTo(lx, ly);
        context.lineTo(lx - arrowSize * Math.cos(angle - Math.PI / 7), ly - arrowSize * Math.sin(angle - Math.PI / 7));

        this.handleOptions(context, options);
    },

    text : function(context, point, options) {
        this.handleOptions(context, options);
        if(textHandler) context.fillStyle = textHandler.getFillColor(options[2]);
        context.fillText(point[0].substr(1, point[0].length - 2), point[1], point[2]);
    },

    arc : function (context, points, options) {
        context.beginPath();
        if(points[2] >= 0) context.arc(points[0], points[1], points[2], points[3], 0, points[4]);
        this.handleOptions(context, options);
    },

    rect : function(context, point, options) {
        this.handleOptions(context, options, true);
        context.strokeRect(point[0], point[1], point[2], point[3]);
        context.fillRect(point[0], point[1], point[2], point[3]);
    }, 

    image : function(context, point, options) {
        this.handleOptions(context, options, true);

        var image = imageHandler.images[point[5]];
        if (!image) {
            var image = new Image();
            image.onload = function() {
                var index = imageHandler.images.length;

                imageHandler.lastImageURL = image.src;
                imageHandler.lastImageIndex = index;

                imageHandler.images.push(image);
                context.drawImage(image, point[1], point[2], point[3], point[4]);
            };
            image.src = point[0];
            return;
        }

        context.drawImage(image, point[1], point[2], point[3], point[4]);
    },

    pdf : function(context, point, options) {
        this.handleOptions(context, options, true);

        var image = pdfHandler.images[point[5]];
        if (!image) {
            var image = new Image();
            image.onload = function() {
                var index = imageHandler.images.length;

                pdfHandler.lastPage = image.src;
                pdfHandler.lastIndex = index;

                pdfHandler.images.push(image);
                context.drawImage(image, point[1], point[2], point[3], point[4]);
            };
            image.src = point[0];
            return;
        }

        context.drawImage(image, point[1], point[2], point[3], point[4]);
        pdfHandler.reset_pos(point[1], point[2]);
    },

    quadratic : function(context, point, options) {
        context.beginPath();
        context.moveTo(point[0], point[1]);
        context.quadraticCurveTo(point[2], point[3], point[4], point[5]);

        this.handleOptions(context, options);
    },

    bezier : function(context, point, options) {
        context.beginPath();
        context.moveTo(point[0], point[1]);
        context.bezierCurveTo(point[2], point[3], point[4], point[5], point[6], point[7]);

        this.handleOptions(context, options);
    }
};

const onOptionsChanged = (options) => {
    if(options.lineWidth) drawHelper.setLineWidth(options.lineWidth);
    if(options.lineCap) drawHelper.setLineCap(options.lineCap);
    if(options.lineJoin) drawHelper.setLineJoin(options.lineJoin);
    if(options.globalAlpha) drawHelper.setGlobalAlpha(options.globalAlpha);
    if(options.globalCompositeOperation) drawHelper.setGlobalCompositeOperation(options.globalCompositeOperation);
    if(options.strokeStyle) drawHelper.setStrokeStyle(options.strokeStyle);
    if(options.fillStyle) drawHelper.setFillStyle(options.fillStyle);
}

const setArcHandler = (handler) => {
    arcHandler = handler;
}

const setArrowHandler = (handler) => {
    arrowHandler = handler;
}

const setBezierHandler = (handler) => {
    bezierHandler = handler;
}

const setEraserHandler = (handler) => {
    eraserHandler = handler;
}

const setImageHandler = (handler) => {
    imageHandler = handler;
}

const setLineHandler = (handler) => {
    lineHandler = handler;
}

const setMarkerHandler = (handler) => {
    markerHandler = handler;
}

const setPdfHandler = (handler) => {
    pdfHandler = handler;
}

const setPencilHandler = (handler) => {
    pencilHandler = handler;
}

const setQuadraticHandler = (handler) => {
    quadraticHandler = handler;
}

const setRectHandler = (handler) => {
    rectHandler = handler;
}

const setTextHandler = (handler) => {
    textHandler = handler;
}

const setZoomHandler = (handler) => {
    zoomHandler = handler;
}

export default drawHelper;
export {
    onOptionsChanged,
    setArcHandler,
    setArrowHandler,
    setBezierHandler,
    setEraserHandler,
    setImageHandler,
    setLineHandler,
    setMarkerHandler,
    setPdfHandler,
    setPencilHandler,
    setQuadraticHandler,
    setRectHandler,
    setTextHandler,
    setZoomHandler
}