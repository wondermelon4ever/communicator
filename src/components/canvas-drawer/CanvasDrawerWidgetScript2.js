
    // var drawHelper = {
    //     redraw: function() {
    //         tempContext.clearRect(0, 0, innerWidth, innerHeight);
    //         context.clearRect(0, 0, innerWidth, innerHeight);

    //         var i, point, length = points.length;
    //         for (i = 0; i < length; i++) {
    //             point = points[i];
    //             // point[0] != 'pdf' && 
    //             if (point && point.length && this[point[0]]) {
    //                 this[point[0]](context, point[1], point[2]);
    //             }
    //             // else warn
    //         }
    //     },
    //     getOptions: function(opt) {
    //         opt = opt || {};
    //         return [
    //             opt.lineWidth || lineWidth,
    //             opt.strokeStyle || strokeStyle,
    //             opt.fillStyle || fillStyle,
    //             opt.globalAlpha || globalAlpha,
    //             opt.globalCompositeOperation || globalCompositeOperation,
    //             opt.lineCap || lineCap,
    //             opt.lineJoin || lineJoin,
    //             opt.font || font
    //         ];
    //     },
    //     handleOptions: function(context, opt, isNoFillStroke) {
    //         opt = opt || this.getOptions();

    //         context.globalAlpha = opt[3];
    //         context.globalCompositeOperation = opt[4];

    //         context.lineCap = opt[5];
    //         context.lineJoin = opt[6];
    //         context.lineWidth = opt[0];

    //         context.strokeStyle = opt[1];
    //         context.fillStyle = opt[2];

    //         context.font = opt[7];

    //         if (!isNoFillStroke) {
    //             context.stroke();
    //             context.fill();
    //         }
    //     },
    //     line: function(context, point, options) {
    //         context.beginPath();
    //         context.moveTo(point[0], point[1]);
    //         context.lineTo(point[2], point[3]);

    //         this.handleOptions(context, options);
    //     },
    //     marker: function(context, point, options) {
    //         context.beginPath();
    //         context.moveTo(point[0], point[1]);
    //         context.lineTo(point[2], point[3]);

    //         this.handleOptions(context, options);
    //     },
    //     arrow: function(context, point, options) {
    //         var mx = point[0];
    //         var my = point[1];

    //         var lx = point[2];
    //         var ly = point[3];

    //         var arrowSize = arrowHandler.arrowSize;

    //         if (arrowSize == 10) {
    //             arrowSize = (options ? options[0] : lineWidth) * 5;
    //         }

    //         var angle = Math.atan2(ly - my, lx - mx);

    //         context.beginPath();
    //         context.moveTo(mx, my);
    //         context.lineTo(lx, ly);

    //         this.handleOptions(context, options);

    //         context.beginPath();
    //         context.moveTo(lx, ly);
    //         context.lineTo(lx - arrowSize * Math.cos(angle - Math.PI / 7), ly - arrowSize * Math.sin(angle - Math.PI / 7));
    //         context.lineTo(lx - arrowSize * Math.cos(angle + Math.PI / 7), ly - arrowSize * Math.sin(angle + Math.PI / 7));
    //         context.lineTo(lx, ly);
    //         context.lineTo(lx - arrowSize * Math.cos(angle - Math.PI / 7), ly - arrowSize * Math.sin(angle - Math.PI / 7));

    //         this.handleOptions(context, options);
    //     },
    //     text: function(context, point, options) {
    //         this.handleOptions(context, options);
    //         context.fillStyle = textHandler.getFillColor(options[2]);
    //         context.fillText(point[0].substr(1, point[0].length - 2), point[1], point[2]);
    //     },
    //     arc: function(context, point, options) {
    //         context.beginPath();
    //         context.arc(point[0], point[1], point[2], point[3], 0, point[4]);

    //         this.handleOptions(context, options);
    //     },
    //     rect: function(context, point, options) {
    //         this.handleOptions(context, options, true);

    //         context.strokeRect(point[0], point[1], point[2], point[3]);
    //         context.fillRect(point[0], point[1], point[2], point[3]);
    //     },
    //     image: function(context, point, options) {
    //         this.handleOptions(context, options, true);

    //         var image = imageHandler.images[point[5]];
    //         if (!image) {
    //             var image = new Image();
    //             image.onload = function() {
    //                 var index = imageHandler.images.length;

    //                 imageHandler.lastImageURL = image.src;
    //                 imageHandler.lastImageIndex = index;

    //                 imageHandler.images.push(image);
    //                 context.drawImage(image, point[1], point[2], point[3], point[4]);
    //             };
    //             image.src = point[0];
    //             return;
    //         }

    //         context.drawImage(image, point[1], point[2], point[3], point[4]);
    //     },
    //     pdf: function(context, point, options) {
    //         this.handleOptions(context, options, true);

    //         var image = pdfHandler.images[point[5]];
    //         if (!image) {
    //             var image = new Image();
    //             image.onload = function() {
    //                 var index = imageHandler.images.length;

    //                 pdfHandler.lastPage = image.src;
    //                 pdfHandler.lastIndex = index;

    //                 pdfHandler.images.push(image);
    //                 context.drawImage(image, point[1], point[2], point[3], point[4]);
    //             };
    //             image.src = point[0];
    //             return;
    //         }

    //         context.drawImage(image, point[1], point[2], point[3], point[4]);
    //         pdfHandler.reset_pos(point[1], point[2]);
    //     },
    //     quadratic: function(context, point, options) {
    //         context.beginPath();
    //         context.moveTo(point[0], point[1]);
    //         context.quadraticCurveTo(point[2], point[3], point[4], point[5]);

    //         this.handleOptions(context, options);
    //     },
    //     bezier: function(context, point, options) {
    //         context.beginPath();
    //         context.moveTo(point[0], point[1]);
    //         context.bezierCurveTo(point[2], point[3], point[4], point[5], point[6], point[7]);

    //         this.handleOptions(context, options);
    //     }
    // };

    var dragHelper = {
        global: {
            prevX: 0,
            prevY: 0,
            ismousedown: false,
            pointsToMove: 'all',
            startingIndex: 0
        },
        mousedown: function(e) {
            if (isControlKeyPressed) {
                copy();
                paste();
                isControlKeyPressed = false;
            }

            var dHelper = dragHelper,
                g = dHelper.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            g.prevX = x;
            g.prevY = y;

            g.pointsToMove = 'all';

            if (points.length) {
                var p = points[points.length - 1],
                    point = p[1];

                if (p[0] === 'line') {

                    if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                        g.pointsToMove = 'head';
                    }

                    if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                        g.pointsToMove = 'tail';
                    }
                }

                if (p[0] === 'arrow') {

                    if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                        g.pointsToMove = 'head';
                    }

                    if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                        g.pointsToMove = 'tail';
                    }
                }

                if (p[0] === 'rect') {

                    if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                        g.pointsToMove = 'stretch-first';
                    }

                    if (dHelper.isPointInPath(x, y, point[0] + point[2], point[1])) {
                        g.pointsToMove = 'stretch-second';
                    }

                    if (dHelper.isPointInPath(x, y, point[0], point[1] + point[3])) {
                        g.pointsToMove = 'stretch-third';
                    }

                    if (dHelper.isPointInPath(x, y, point[0] + point[2], point[1] + point[3])) {
                        g.pointsToMove = 'stretch-last';
                    }
                }

                if (p[0] === 'image') {

                    if (dHelper.isPointInPath(x, y, point[1], point[2])) {
                        g.pointsToMove = 'stretch-first';
                    }

                    if (dHelper.isPointInPath(x, y, point[1] + point[3], point[2])) {
                        g.pointsToMove = 'stretch-second';
                    }

                    if (dHelper.isPointInPath(x, y, point[1], point[2] + point[4])) {
                        g.pointsToMove = 'stretch-third';
                    }

                    if (dHelper.isPointInPath(x, y, point[1] + point[3], point[2] + point[4])) {
                        g.pointsToMove = 'stretch-last';
                    }
                }

                if (p[0] === 'pdf') {

                    if (dHelper.isPointInPath(x, y, point[1], point[2])) {
                        g.pointsToMove = 'stretch-first';
                    }

                    if (dHelper.isPointInPath(x, y, point[1] + point[3], point[2])) {
                        g.pointsToMove = 'stretch-second';
                    }

                    if (dHelper.isPointInPath(x, y, point[1], point[2] + point[4])) {
                        g.pointsToMove = 'stretch-third';
                    }

                    if (dHelper.isPointInPath(x, y, point[1] + point[3], point[2] + point[4])) {
                        g.pointsToMove = 'stretch-last';
                    }
                }

                if (p[0] === 'quadratic') {

                    if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                        g.pointsToMove = 'starting-points';
                    }

                    if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                        g.pointsToMove = 'control-points';
                    }

                    if (dHelper.isPointInPath(x, y, point[4], point[5])) {
                        g.pointsToMove = 'ending-points';
                    }
                }

                if (p[0] === 'bezier') {

                    if (dHelper.isPointInPath(x, y, point[0], point[1])) {
                        g.pointsToMove = 'starting-points';
                    }

                    if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                        g.pointsToMove = '1st-control-points';
                    }

                    if (dHelper.isPointInPath(x, y, point[4], point[5])) {
                        g.pointsToMove = '2nd-control-points';
                    }

                    if (dHelper.isPointInPath(x, y, point[6], point[7])) {
                        g.pointsToMove = 'ending-points';
                    }
                }
            }

            g.ismousedown = true;
        },
        mouseup: function() {
            var g = this.global;

            if (is.isDragLastPath) {
                tempContext.clearRect(0, 0, innerWidth, innerHeight);
                context.clearRect(0, 0, innerWidth, innerHeight);
                this.end();
            }

            g.ismousedown = false;
        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop,
                g = this.global;

            drawHelper.redraw(context, tempContext, points);

            if (g.ismousedown) {
                this.dragShape(x, y);
            }

            if (is.isDragLastPath) this.init();
        },
        init: function() {
            if (!points.length) return;

            var p = points[points.length - 1],
                point = p[1],
                g = this.global;

            if (g.ismousedown) tempContext.fillStyle = 'rgba(255,85 ,154,.9)';
            else tempContext.fillStyle = 'rgba(255,85 ,154,.4)';

            if (p[0] === 'quadratic') {

                tempContext.beginPath();

                tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
                tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);
                tempContext.arc(point[4], point[5], 10, Math.PI * 2, 0, !1);

                tempContext.fill();
            }

            if (p[0] === 'bezier') {

                tempContext.beginPath();

                tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
                tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);
                tempContext.arc(point[4], point[5], 10, Math.PI * 2, 0, !1);
                tempContext.arc(point[6], point[7], 10, Math.PI * 2, 0, !1);

                tempContext.fill();
            }

            if (p[0] === 'line') {

                tempContext.beginPath();

                tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
                tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);

                tempContext.fill();
            }

            if (p[0] === 'arrow') {

                tempContext.beginPath();

                tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
                tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);

                tempContext.fill();
            }

            if (p[0] === 'text') {
                tempContext.font = "15px Verdana";
                tempContext.fillText(point[0], point[1], point[2]);
            }

            if (p[0] === 'rect') {

                tempContext.beginPath();
                tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
                tempContext.fill();

                tempContext.beginPath();
                tempContext.arc(point[0] + point[2], point[1], 10, Math.PI * 2, 0, !1);
                tempContext.fill();

                tempContext.beginPath();
                tempContext.arc(point[0], point[1] + point[3], 10, Math.PI * 2, 0, !1);
                tempContext.fill();

                tempContext.beginPath();
                tempContext.arc(point[0] + point[2], point[1] + point[3], 10, Math.PI * 2, 0, !1);
                tempContext.fill();
            }

            if (p[0] === 'image') {
                tempContext.beginPath();
                tempContext.arc(point[1], point[2], 10, Math.PI * 2, 0, !1);
                tempContext.fill();
