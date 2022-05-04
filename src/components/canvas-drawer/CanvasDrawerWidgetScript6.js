        reset_pos: function(x, y) {
            pdfHandler.pdfPageContainer.style.top = y + 'px';
            if (!points[pdfHandler.lastPointIndex]) return;
            var point = points[pdfHandler.lastPointIndex][1];
            pdfHandler.pdfPageContainer.style.left = (point[1] + point[3] - parseInt(point[3] / 2) - parseInt(pdfHandler.pdfPageContainer.clientWidth / 2)) + 'px';
        },
        end: function() {
            // pdfHandler.pdfPageContainer.style.display = 'none';
        }
    };

    var icons = {};
    if (params.icons) {
        try {
            icons = JSON.parse(params.icons);
        } catch (e) {
            icons = {};
        }
    }

    var datas_uris = {
      // 직접 넣어야 함. 너무 큼
    };


    var tools = {
        line: true,
        arrow: true,
        pencil: true,
        marker: true,
        dragSingle: true,
        dragMultiple: true,
        eraser: true,
        rectangle: true,
        arc: true,
        bezier: true,
        quadratic: true,
        text: true,
        image: true,
        pdf: true,
        zoom: true,
        lineWidth: true,
        colorsPicker: true,
        extraOptions: true,
        code: true,
        undo: true
    };

    if (params.tools) {
        try {
            var t = JSON.parse(params.tools);
            tools = t;
        } catch (e) {}
    }

    if (tools.code === true) {
        document.querySelector('.preview-panel').style.display = 'block';
    }

    function setSelection(element, prop) {
        endLastPath();
        hideContainers();

        is.set(prop);

        var selected = document.getElementsByClassName('selected-shape')[0];
        if (selected) selected.className = selected.className.replace(/selected-shape/g, '');

        if (!element.className) {
            element.className = '';
        }

        element.className += ' selected-shape';
    }

    /* Default: setting default selected shape!! */
    is.set(window.selectedIcon);

    function setDefaultSelectedIcon() {
        var toolBox = document.getElementById('tool-box');
        var canvasElements = toolBox.getElementsByTagName('canvas');
        var shape = window.selectedIcon.toLowerCase();

        var firstMatch;
        for (var i = 0; i < canvasElements.length; i++) {
            if (!firstMatch && (canvasElements[i].id || '').indexOf(shape) !== -1) {
                firstMatch = canvasElements[i];
            }
        }
        if (!firstMatch) {
            window.selectedIcon = 'Pencil';
            firstMatch = document.getElementById('pencil-icon');
        }

        setSelection(firstMatch, window.selectedIcon);
    }

    window.addEventListener('load', function() {
        setDefaultSelectedIcon();
    }, false);

    (function() {
        var cache = {};

        var lineCapSelect = find('lineCap-select');
        var lineJoinSelect = find('lineJoin-select');

        function getContext(id) {
            var context = find(id).getContext('2d');
            context.lineWidth = 2;
            context.strokeStyle = '#6c96c8';
            return context;
        }

        function bindEvent(context, shape) {
            if (shape === 'Pencil' || shape === 'Marker') {
                lineCap = lineJoin = 'round';
            }

            addEvent(context.canvas, 'click', function() {
                // pdfHandler.pdfPageContainer.style.display = 'none';

                if (textHandler.text.length) {
                    textHandler.appendPoints();
                }

                if (shape === 'Text') {
                    textHandler.onShapeSelected();
                } else {
                    textHandler.onShapeUnSelected();
                }

                if (shape === 'Pencil' || shape === 'Marker') {
                    lineCap = lineJoin = 'round';
                }

                dragHelper.global.startingIndex = 0;

                setSelection(this, shape);

                if (this.id === 'drag-last-path') {
                    find('copy-last').checked = true;
                    find('copy-all').checked = false;
                } else if (this.id === 'drag-all-paths') {
                    find('copy-all').checked = true;
                    find('copy-last').checked = false;
                }

                if (this.id === 'image-icon') {
                    var selector = new FileSelector();
                    selector.accept = 'image/*';
                    selector.selectSingleFile(function(file) {
                        if (!file) return;

                        var reader = new FileReader();
                        reader.onload = function(event) {
                            var image = new Image();
                            image.onload = function() {
                                var index = imageHandler.images.length;

                                imageHandler.lastImageURL = image.src;
                                imageHandler.lastImageIndex = index;

                                imageHandler.images.push(image);
                                imageHandler.load(image.clientWidth, image.clientHeight);
                            };
                            image.style = 'position: absolute; top: -99999999999; left: -999999999;'
                            document.body.appendChild(image);
                            image.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    });
                }

                if (this.id === 'pdf-icon') {
                    var selector = new FileSelector();
                    selector.selectSingleFile(function(file) {
                        if (!file) return;

                        function onGettingPdf() {
                            var reader = new FileReader();
                            reader.onload = function(event) {
                                pdfHandler.pdf = null; // to make sure we call "getDocument" again
                                pdfHandler.load(event.target.result);
                            };
                            reader.readAsDataURL(file);
                        }
                        onGettingPdf();
                    }, null, 'application/pdf');
                }

                if (this.id === 'pencil-icon' || this.id === 'eraser-icon' || this.id === 'marker-icon') {
                    cache.lineCap = lineCap;
                    cache.lineJoin = lineJoin;

                    lineCap = lineJoin = 'round';
                } else if (cache.lineCap && cache.lineJoin) {
                    lineCap = cache.lineCap;
                    lineJoin = cache.lineJoin;
                }

                if (this.id === 'eraser-icon') {
                    cache.strokeStyle = strokeStyle;
                    cache.fillStyle = fillStyle;
                    cache.lineWidth = lineWidth;

                    strokeStyle = 'White';
                    fillStyle = 'White';
                    lineWidth = 10;
                } else if (cache.strokeStyle && cache.fillStyle && typeof cache.lineWidth !== 'undefined') {
                    strokeStyle = cache.strokeStyle;
                    fillStyle = cache.fillStyle;
                    lineWidth = cache.lineWidth;
                }
            });
        }

        var toolBox = find('tool-box');
        toolBox.style.height = (innerHeight) + 'px'; // -toolBox.offsetTop - 77

        function decorateDragLastPath() {
            var context = getContext('drag-last-path');

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);
                bindEvent(context, 'DragLastPath');
            };
            image.src = data_uris.dragSingle;
        }

        decorateDragLastPath();

        if (tools.dragSingle === true) {
            // document.getElementById('drag-last-path').style.display = 'block';
        }

        function decorateDragAllPaths() {
            var context = getContext('drag-all-paths');

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);
                bindEvent(context, 'DragAllPaths');
            };
            image.src = data_uris.dragMultiple;
        }

        decorateDragAllPaths();

        if (tools.dragMultiple === true) {
            // document.getElementById('drag-all-paths').style.display = 'block';
        }

        function decorateLine() {
            var context = getContext('line');

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);
                bindEvent(context, 'Line');
            };
            image.src = data_uris.line;
        }

        if (tools.line === true) {
            decorateLine();
            // document.getElementById('line').style.display = 'block';
        }

        function decorateUndo() {
            var context = getContext('undo');

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);

                document.querySelector('#undo').onclick = function() {
                    if (points.length) {
                        points.length = points.length - 1;
                        drawHelper.redraw(context, tempContext, points);
                    }

                    // share to webrtc
                    syncPoints(true);
                };
            };
            image.src = data_uris.undo;
        }

        if (tools.undo === true) {
            decorateUndo();
            // document.getElementById('undo').style.display = 'block';
        }

        function decorateArrow() {
            var context = getContext('arrow');

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);
                bindEvent(context, 'Arrow');
            };
            image.src = data_uris.arrow;
        }

        if (tools.arrow === true) {
            decorateArrow();
            // document.getElementById('arrow').style.display = 'block';
        }

        function decoreZoomUp() {
            var context = getContext('zoom-up');
            // zoomHandler.icons.up(context);
            addEvent(context.canvas, 'click', function() {
                zoomHandler.up();
            });

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);
            };
            image.src = data_uris.zoom_in;
        }

        function decoreZoomDown() {
            var context = getContext('zoom-down');
            // zoomHandler.icons.down(context);
            addEvent(context.canvas, 'click', function() {
                zoomHandler.down();
            });

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);
            };
            image.src = data_uris.zoom_out;
        }

        if (tools.zoom === true) {
            decoreZoomUp();
            decoreZoomDown();

            // document.getElementById('zoom-up').style.display = 'block';
            // document.getElementById('zoom-down').style.display = 'block';
        }

        function decoratePencil() {

            function hexToRGBA(h, alpha) {
                return 'rgba(' + hexToRGB(h).join(',') + ',1)';
            }

            var colors = [
                ['FFFFFF', '006600', '000099', 'CC0000', '8C4600'],
                ['CCCCCC', '00CC00', '6633CC', 'FF0000', 'B28500'],
                ['666666', '66FFB2', '006DD9', 'FF7373', 'FF9933'],
                ['333333', '26FF26', '6699FF', 'CC33FF', 'FFCC99'],
                ['000000', 'CCFF99', 'BFDFFF', 'FFBFBF', 'FFFF33']
            ];

            var context = getContext('pencil-icon');

            var image = new Image();
            image.onload = function() {
                context.drawImage(image, 4, 4, 32, 32);
                bindEvent(context, 'Pencil');
            };
            image.src = data_uris.pencil;

            var pencilContainer = find('pencil-container'),
                pencilColorContainer = find('pencil-fill-colors'),
                strokeStyleText = find('pencil-stroke-style'),
                pencilColorsList = find("pencil-colors-list"),
                fillStyleText = find('pencil-fill-style'),
                pencilSelectedColor = find('pencil-selected-color'),
                pencilSelectedColor2 = find('pencil-selected-color-2'),
                btnPencilDone = find('pencil-done'),
                canvas = context.canvas,
                alpha = 0.2;
