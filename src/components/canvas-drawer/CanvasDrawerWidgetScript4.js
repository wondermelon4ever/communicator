
    // var markerHandler = {
    //     ismousedown: false,
    //     prevX: 0,
    //     prevY: 0,
    //     mousedown: function(e) {
    //         var x = e.pageX - canvas.offsetLeft,
    //             y = e.pageY - canvas.offsetTop;

    //         var t = this;

    //         t.prevX = x;
    //         t.prevY = y;

    //         t.ismousedown = true;

    //         // make sure that pencil is drawing shapes even 
    //         // if mouse is down but mouse isn't moving
    //         tempContext.lineCap = 'round';
    //         markerDrawHelper.line(tempContext, [t.prevX, t.prevY, x, y]);

    //         points[points.length] = ['line', [t.prevX, t.prevY, x, y], markerDrawHelper.getOptions()];

    //         t.prevX = x;
    //         t.prevY = y;
    //     },
    //     mouseup: function(e) {
    //         this.ismousedown = false;
    //     },
    //     mousemove: function(e) {
    //         var x = e.pageX - canvas.offsetLeft,
    //             y = e.pageY - canvas.offsetTop;

    //         var t = this;

    //         if (t.ismousedown) {
    //             tempContext.lineCap = 'round';
    //             markerDrawHelper.line(tempContext, [t.prevX, t.prevY, x, y]);

    //             points[points.length] = ['line', [t.prevX, t.prevY, x, y], markerDrawHelper.getOptions()];

    //             t.prevX = x;
    //             t.prevY = y;
    //         }
    //     }
    // }

    var markerLineWidth = document.getElementById('marker-stroke-style').value,
        markerStrokeStyle = '#' + document.getElementById('marker-fill-style').value,
        markerGlobalAlpha = 0.7;
    
    var markerHandler = createMarkerHandler(context, tempContext);
    var moptions = {
        markerLineWidth: markerLineWidth,
        markerStrokeStyle: markerStrokeStyle,
        fillStyle: fillStyle,
        globalAlpha: markerGlobalAlpha,
        globalCompositeOperation: globalCompositeOperation,
        lineCap: lineCap,
        lineJoin: lineJoin,
        font: font
    }
    markerHandler.updateOptionsChanged(moptions);

    // var markerDrawHelper = clone(drawHelper);

    // markerDrawHelper.getOptions = function() {
    //     return [markerLineWidth, markerStrokeStyle, fillStyle, markerGlobalAlpha, globalCompositeOperation, lineCap, lineJoin, font];
    // }

    // var eraserHandler = {
    //     ismousedown: false,
    //     prevX: 0,
    //     prevY: 0,
    //     mousedown: function(e) {
    //         var x = e.pageX - canvas.offsetLeft,
    //             y = e.pageY - canvas.offsetTop;

    //         var t = this;

    //         t.prevX = x;
    //         t.prevY = y;

    //         t.ismousedown = true;

    //         tempContext.lineCap = 'round';
    //         drawHelper.line(tempContext, [t.prevX, t.prevY, x, y]);

    //         points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

    //         t.prevX = x;
    //         t.prevY = y;
    //     },
    //     mouseup: function(e) {
    //         this.ismousedown = false;
    //     },
    //     mousemove: function(e) {
    //         var x = e.pageX - canvas.offsetLeft,
    //             y = e.pageY - canvas.offsetTop;

    //         var t = this;

    //         if (t.ismousedown) {
    //             tempContext.lineCap = 'round';
    //             drawHelper.line(tempContext, [t.prevX, t.prevY, x, y]);

    //             points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

    //             t.prevX = x;
    //             t.prevY = y;
    //         }
    //     }
    // };

    var eraserHandler = new EraserHandler(context, tempContext);

    var textHandler = {
        text: '',
        selectedFontFamily: 'Arial',
        selectedFontSize: '15',
        lastFillStyle: '',
        onShapeSelected: function() {
            tempContext.canvas.style.cursor = 'text';
            this.x = this.y = this.pageX = this.pageY = 0;
            this.text = '';
        },
        onShapeUnSelected: function() {
            this.text = '';
            this.showOrHideTextTools('hide');
            tempContext.canvas.style.cursor = 'default';

            if (typeof this.blinkCursorInterval !== 'undefined') {
                clearInterval(this.blinkCursorInterval);
            }
        },
        getFillColor: function(color) {
            color = (color || fillStyle).toLowerCase();

            if (color == 'rgba(255, 255, 255, 0)' || color == 'transparent' || color === 'white') {
                return 'black';
            }

            return color;
        },
        writeText: function(keyPressed, isBackKeyPressed) {
            if (!is.isText) return;

            if (isBackKeyPressed) {
                textHandler.text = textHandler.text.substr(0, textHandler.text.length - 1);
                textHandler.fillText(textHandler.text);
                return;
            }

            textHandler.text += keyPressed;
            textHandler.fillText(textHandler.text);
        },
        fillText: function(text) {
            if (!is.isText) return;

            tempContext.clearRect(0, 0, tempContext.canvas.width, tempContext.canvas.height);

            var options = textHandler.getOptions();
            drawHelper.handleOptions(tempContext, options);
            tempContext.fillStyle = textHandler.getFillColor(options[2]);
            tempContext.font = textHandler.selectedFontSize + 'px "' + textHandler.selectedFontFamily + '"';

            tempContext.fillText(text, textHandler.x, textHandler.y);
        },
        blinkCursorInterval: null,
        index: 0,
        blinkCursor: function() {
            textHandler.index++;
            if (textHandler.index % 2 == 0) {
                textHandler.fillText(textHandler.text + '|');
            } else {
                textHandler.fillText(textHandler.text);
            }
        },
        getOptions: function() {
            var options = {
                font: textHandler.selectedFontSize + 'px "' + textHandler.selectedFontFamily + '"',
                fillStyle: textHandler.getFillColor(),
                strokeStyle: '#6c96c8',
                globalCompositeOperation: 'source-over',
                globalAlpha: 1,
                lineJoin: 'round',
                lineCap: 'round',
                lineWidth: 2
            };
            font = options.font;
            return options;
        },
        appendPoints: function() {
            var options = textHandler.getOptions();
            points[points.length] = ['text', ['"' + textHandler.text + '"', textHandler.x, textHandler.y], drawHelper.getOptions(options)];
        },
        mousedown: function(e) {
            if (!is.isText) return;

            if (textHandler.text.length) {
                this.appendPoints();
            }

            textHandler.x = textHandler.y = 0;
            textHandler.text = '';

            textHandler.pageX = e.pageX;
            textHandler.pageY = e.pageY;

            textHandler.x = e.pageX - canvas.offsetLeft - 5;
            textHandler.y = e.pageY - canvas.offsetTop + 10;

            if (typeof textHandler.blinkCursorInterval !== 'undefined') {
                clearInterval(textHandler.blinkCursorInterval);
            }

            textHandler.blinkCursor();
            textHandler.blinkCursorInterval = setInterval(textHandler.blinkCursor, 700);

            this.showTextTools();
        },
        mouseup: function(e) {},
        mousemove: function(e) {},
        showOrHideTextTools: function(show) {
            if (show === 'hide') {
                if (this.lastFillStyle.length) {
                    fillStyle = this.lastFillStyle;
                    this.lastFillStyle = '';
                }
            } else if (!this.lastFillStyle.length) {
                this.lastFillStyle = fillStyle;
                fillStyle = 'black';
            }

            this.fontFamilyBox.style.display = show == 'show' ? 'block' : 'none';
            this.fontSizeBox.style.display = show == 'show' ? 'block' : 'none';

            this.fontSizeBox.style.left = this.x + 'px';
            this.fontFamilyBox.style.left = (this.fontSizeBox.clientWidth + this.x) + 'px';

            this.fontSizeBox.style.top = this.y + 'px';
            this.fontFamilyBox.style.top = this.y + 'px';
        },
        showTextTools: function() {
            if (!this.fontFamilyBox || !this.fontSizeBox) return;

            this.unselectAllFontFamilies();
            this.unselectAllFontSizes();

            this.showOrHideTextTools('show');

            this.eachFontFamily(function(child) {
                child.onclick = function(e) {
                    e.preventDefault();

                    textHandler.showOrHideTextTools('hide');

                    textHandler.selectedFontFamily = this.innerHTML;
                    this.className = 'font-family-selected';
                };
                child.style.fontFamily = child.innerHTML;
            });

            this.eachFontSize(function(child) {
                child.onclick = function(e) {
                    e.preventDefault();

                    textHandler.showOrHideTextTools('hide');

                    textHandler.selectedFontSize = this.innerHTML;
                    this.className = 'font-family-selected';
                };
                // child.style.fontSize = child.innerHTML + 'px';
            });
        },
        eachFontFamily: function(callback) {
            var childs = this.fontFamilyBox.querySelectorAll('li');
            for (var i = 0; i < childs.length; i++) {
                callback(childs[i]);
            }
        },
        unselectAllFontFamilies: function() {
            this.eachFontFamily(function(child) {
                child.className = '';
                if (child.innerHTML === textHandler.selectedFontFamily) {
                    child.className = 'font-family-selected';
                }
            });
        },
        eachFontSize: function(callback) {
            var childs = this.fontSizeBox.querySelectorAll('li');
            for (var i = 0; i < childs.length; i++) {
                callback(childs[i]);
            }
        },
        unselectAllFontSizes: function() {
            this.eachFontSize(function(child) {
                child.className = '';
                if (child.innerHTML === textHandler.selectedFontSize) {
                    child.className = 'font-size-selected';
                }
            });
        },
        onReturnKeyPressed: function() {
            if (!textHandler.text || !textHandler.text.length) return;
            var fontSize = parseInt(textHandler.selectedFontSize) || 15;
            this.mousedown({
                pageX: this.pageX,
                // pageY: parseInt(tempContext.measureText(textHandler.text).height * 2) + 10
                pageY: this.pageY + fontSize + 5
            });
            drawHelper.redraw(context, tempContext, points);
        },
        fontFamilyBox: document.querySelector('.fontSelectUl'),
        fontSizeBox: document.querySelector('.fontSizeUl')
    };

    var arcHandler = {
        global: {
            ismousedown: false,
            prevX: 0,
            prevY: 0,
            prevRadius: 0,
            isCircleDrawn: false,
            isCircledEnded: true,
            isClockwise: false,
            arcRangeContainer: null,
            arcRange: null
        },
        mousedown: function(e) {
            var g = this.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            g.prevX = x;
            g.prevY = y;

            g.ismousedown = true;
        },
        mouseup: function(e) {
            var g = this.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            if (g.ismousedown) {
                if (!g.isCircleDrawn && g.isCircledEnded) {
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
                    points[points.length] = ['arc', [prevX + radius, prevY + radius, radius, angle, 1], drawHelper.getOptions()];

                    var arcRange = g.arcRange,
                        arcRangeContainer = g.arcRangeContainer;

                    arcRangeContainer.style.display = 'block';
                    arcRange.focus();

                    arcRangeContainer.style.top = (y + canvas.offsetTop + 20) + 'px';
                    arcRangeContainer.style.left = x + 'px';

                    arcRange.value = 2;
                } else if (g.isCircleDrawn && !g.isCircleEnded) {
                    this.end();
                }
            }

            g.ismousedown = false;

            this.fixAllPoints();
        },
        mousemove: function(e) {
            var g = this.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var ismousedown = g.ismousedown,
                isCircleDrawn = g.isCircleDrawn,
                isCircleEnded = g.isCircledEnded;

            if (ismousedown) {
                if (!isCircleDrawn && isCircleEnded) {
                    var prevX = g.prevX,
                        prevY = g.prevY,
                        radius = ((x - prevX) + (y - prevY)) / 3;

                    tempContext.clearRect(0, 0, 2000, 2000);

                    drawHelper.arc(tempContext, [prevX + radius, prevY + radius, radius, Math.PI * 2, true]);
                }
            }
        },
        fixAllPoints: function() {
            var toFixed = this.toFixed;

            for (var i = 0; i < points.length; i++) {
                var p = points[i],
                    point;
                if (p[0] === 'arc') {
                    point = p[1];
                    points[i] = ['arc', [toFixed(point[0]), toFixed(point[1]), toFixed(point[2]), toFixed(point[3]), point[4]],
                        p[2]
                    ];
                }
            }
        },
        init: function() {
            var markIsClockwise = find('is-clockwise'),
                g = this.global;

            g.arcRangeContainer = find('arc-range-container');
            g.arcRange = find('arc-range');

            addEvent(markIsClockwise, 'change', function(e) {
                g.isClockwise = markIsClockwise.checked;

                g.arcRange.value = arcHandler.toFixed(g.arcRange.value);
                g.arcRange.focus();

                arcHandler.arcRangeHandler(e);

                if (!points.length) return;

                var p = points[points.length - 1],
                    point = p[1];

                tempContext.clearRect(0, 0, innerWidth, innerHeight);
                drawHelper.arc(tempContext, [point[0], point[1], point[2], point[3], point[4]]);
            });

            var arcRange = g.arcRange;
            addEvent(arcRange, 'keydown', this.arcRangeHandler);
            addEvent(arcRange, 'focus', this.arcRangeHandler);
        },
        arcRangeHandler: function(e) {
            var g = arcHandler.global,
                arcRange = g.arcRange;

            var key = e.keyCode,
                value = +arcRange.value;
            if (key == 39 || key == 40) arcRange.value = (value < 2 ? value : 1.98) + .02;
            if (key == 37 || key == 38) arcRange.value = (value > 0 ? value : .02) - .02;

            if (!key || key == 13 || key == 39 || key == 40 || key == 37 || key == 38) {
                var range = Math.PI * arcHandler.toFixed(value);
                var p = points[points.length - 1];

                if (p[0] === 'arc') {
                    var point = p[1];
                    points[points.length - 1] = ['arc', [point[0], point[1], point[2], range, g.isClockwise ? 1 : 0],
                        p[2]
                    ];

                    drawHelper.redraw(context, tempContext, points);
                }
            }
        },
        toFixed: function(input) {
            return Number(input).toFixed(1);
        },
        end: function() {
            var g = this.global;

            g.arcRangeContainer.style.display = 'none';
            g.arcRange.value = 2;

            g.isCircleDrawn = false;
            g.isCircleEnded = true;

            drawHelper.redraw();
        }
    };
