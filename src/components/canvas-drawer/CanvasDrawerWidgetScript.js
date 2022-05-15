'use strict';
import * as pdfjsLib from 'pdfjs-dist';
import PencilHandler, { createPencilHandler } from './tools/basic/pencil/PencilHandler';
import MarkerHandler, { createMarkerHandler } from './tools/basic/marker/MarkerHandler';
import EraserHandler, { createEraserHandler } from './tools/basic/eraser/EraserHandler';
import TextHandler, { createTextHandler } from './tools/basic/text/TextHandler';
import drawHelper from './tools/DrawHelper';
import DragHelper from './tools/advanced/edit/DragHelper';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
import { getPoints } from './views/CanvasTemp';

import {
    addEvent,
    find,
    getContext,
    hideContainers,
} from './util/Utils'
import { createArcHandler } from './tools/advanced/arc/ArcHandler';
import { createArrowHandler } from './tools/advanced/arrow/ArrowHandler';
import { createLineHandler } from './tools/advanced/line/LineHandler';
import { createRectHandler } from './tools/advanced/rect/RectHandler';
import { createQuadraticHandler } from './tools/advanced/quadratic/QuadraticHandler';
import { createBezierHandler } from './tools/advanced/bezier/BezierHandler';
import { createZoomHandler } from './tools/show-control/zoom/ZoomHandler';
import { createImageHandler } from './tools/basic/image/ImageHandler';
import { createPdfHandler } from './tools/basic/pdf/PdfHandler';
import FileSelector from './tools/basic/image/FileSelector';
import Common from './common/Common';
import initToolbox from './toolbox/ToolboxInitializer';

function initWidget (shows) {
    var is = {
        isLine: false,
        isArrow: false,
        isArc: false,
        isDragLastPath: false,
        isDragAllPaths: false,
        isRectangle: false,
        isQuadraticCurve: false,
        isBezierCurve: false,
        isPencil: false,
        isMarker: true,
        isEraser: false,
        isText: false,
        isImage: false,
        isPdf: false,

        set: function(shape) {
            var cache = this;

            cache.isLine = cache.isArrow = cache.isArc = cache.isDragLastPath = cache.isDragAllPaths = cache.isRectangle = cache.isQuadraticCurve = cache.isBezierCurve = cache.isPencil = cache.isMarker = cache.isEraser = cache.isText = cache.isImage = cache.isPdf = false;
            cache['is' + shape] = true;
        }
    };

    var points = getPoints(),
        textarea = find('code-text'),
        lineWidth = 2,
        strokeStyle = '#6c96c8',
        fillStyle = 'rgba(0,0,0,0)',
        globalAlpha = 1,
        globalCompositeOperation = 'source-over',
        lineCap = 'round',
        font = '15px "Arial"',
        lineJoin = 'round';

    var context = getContext('main-canvas'), tempContext = getContext('temp-canvas');
    var common = new Common(textarea);
    var dragHelper = new DragHelper(context, tempContext, getIsControlKeyPressed, setIsControlKeypressed, copy, paste, getPoints);

    function endLastPath() {
        var cache = is;

        if (cache.isArc) arcHandler.end(points);
        else if (cache.isQuadraticCurve) quadraticHandler.end(points);
        else if (cache.isBezierCurve) bezierHandler.end(points);

        drawHelper.redraw(context, tempContext, points);

        if (textHandler.text && textHandler.text.length) {
            textHandler.appendPoints();
            textHandler.onShapeUnSelected();
        }
        textHandler.showOrHideTextTools('hide');
    }

    var copiedStuff = [],
        isControlKeyPressed;

    function getIsControlKeyPressed() {
        return isControlKeyPressed;
    }

    function setIsControlKeypressed(isPressed) {
        isControlKeyPressed = isPressed;
    }

    function copy() {
        endLastPath();

        dragHelper.global.startingIndex = 0;

        if (find('copy-last').checked) {
            copiedStuff = points[points.length - 1];
            setSelection(find('drag-last-path'), 'DragLastPath');
        } else {
            copiedStuff = points;
            setSelection(find('drag-all-paths'), 'DragAllPaths');
        }
    }

    function paste() {
        endLastPath();

        dragHelper.global.startingIndex = 0;

        if (find('copy-last').checked) {
            points[points.length] = copiedStuff;

            dragHelper.global = {
                prevX: 0,
                prevY: 0,
                startingIndex: points.length - 1
            };

            dragHelper.dragAllPaths(0, 0, points);
            setSelection(find('drag-last-path'), 'DragLastPath');
        } else {

            dragHelper.global.startingIndex = points.length;
            points = points.concat(copiedStuff);
            setSelection(find('drag-all-paths'), 'DragAllPaths');
        }
    }

    var pencilHandler = createPencilHandler(context, tempContext);
    var pencilLineWidth = document.getElementById('pencil-stroke-style').value,
        pencilStrokeStyle = '#' + document.getElementById('pencil-fill-style').value;
    var options = {
        pencilLineWidth: pencilLineWidth,
        pencilStrokeStyle: pencilStrokeStyle,
        fillStyle: fillStyle,
        globalAlpha: globalAlpha,
        globalCompositeOperation: globalCompositeOperation,
        lineCap: lineCap,
        lineJoin: lineJoin,
        font: font
    }
    pencilHandler.updateOptions(options);

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

    var eraserHandler = createEraserHandler(context, tempContext);
    var textHandler = createTextHandler(context, tempContext);

    var arcHandler = createArcHandler(context, tempContext, getPoints);
    arcHandler.init(points);

    var lineHandler = createLineHandler(context, tempContext);
    var arrowHandler = createArrowHandler(context, tempContext);
    var rectHandler = createRectHandler(context, tempContext);
    var quadraticHandler = createQuadraticHandler(context, tempContext);
    var bezierHandler = createBezierHandler(context, tempContext);
    var zoomHandler = createZoomHandler(context, tempContext);
    var imageHandler = createImageHandler(context, tempContext, syncPoints);
    var pdfHandler = createPdfHandler(context, tempContext, getPoints, syncPoints);

    var icons = {};
    if (params.icons) {
        try {
            icons = JSON.parse(params.icons);
        } catch (e) {
            icons = {};
        }
    }

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
        // 얘 때문에 아이콘 영역보다 더 크게 흰색이 그려짐
        // element.className += ' selected-shape';
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

    initToolbox({
        imageHandler: imageHandler,
        pdfHandler: pdfHandler,
        textHandler: textHandler,
        zoomHandler: zoomHandler,
        dragHelper: dragHelper,
        lineCap: lineCap,
        lineJoin: lineJoin,
        strokeStyle: strokeStyle,
        fillStyle: fillStyle,
        lineWidth: lineWidth,
        setSelection: setSelection,
        tools: tools,
        common: common,
        getPoints: getPoints,
        endLastPath: endLastPath,
        syncPoints: syncPoints
    });

    // function getPoints () {
    //     return points;
    // }

    function setTemporaryLine() {
        var arr = ["line", [139, 261, 170, 219],
            [1, "rgba(0,0,0,0)", "rgba(0,0,0,0)", 1, "source-over", "round", "round", "15px \"Arial\""]
        ];
        points.push(arr);
        drawHelper.redraw(context, tempContext, points);

        setTimeout(function() {
            setSelection(document.getElementById('line'), 'Line');
        }, 1000);

        setTimeout(setDefaultSelectedIcon, 2000);
    }

    var canvas = tempContext.canvas,
        isTouch = 'createTouch' in document;

    addEvent(canvas, isTouch ? 'touchstart mousedown' : 'mousedown', function(e) {
        if (isTouch) e = e.pageX ? e : e.touches.length ? e.touches[0] : {
            pageX: 0,
            pageY: 0
        };

        var cache = is;

        if (cache.isLine) lineHandler.mousedown(e, points);
        else if (cache.isArc) arcHandler.mousedown(e, points);
        else if (cache.isRectangle) rectHandler.mousedown(e, points);
        else if (cache.isQuadraticCurve) quadraticHandler.mousedown(e, points);
        else if (cache.isBezierCurve) bezierHandler.mousedown(e, points);
        // else if (cache.isDragLastPath || cache.isDragAllPaths) dragHelper.mousedown(e, points, is.isDragAllPaths, is.isDragLastPath);
        // else if (cache.isPencil) pencilHandler.mousedown(e, points);
        // else if (cache.isEraser) eraserHandler.mousedown(e, points);
        // else if (cache.isText) textHandler.mousedown(e, points, shows.text);
        else if (cache.isImage) imageHandler.mousedown(e, points);
        else if (cache.isPdf) pdfHandler.mousedown(e,points);
        else if (cache.isArrow) arrowHandler.mousedown(e, points);
        // else if (cache.isMarker) markerHandler.mousedown(e, points);

        // !cache.isPdf && drawHelper.redraw(context, tempContext, points);

        // preventStopEvent(e);
    });

    function preventStopEvent(e) {
        if (!e) {
            return;
        }

        if (typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        if (typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
    }

    addEvent(canvas, isTouch ? 'touchend touchcancel mouseup' : 'mouseup', function(e) {
        if (isTouch && (!e || !('pageX' in e))) {
            if (e && e.touches && e.touches.length) {
                e = e.touches[0];
            } else if (e && e.changedTouches && e.changedTouches.length) {
                e = e.changedTouches[0];
            } else {
                e = {
                    pageX: 0,
                    pageY: 0
                }
            }
        }

        var cache = is;

        if (cache.isLine) lineHandler.mouseup(e, points);
        else if (cache.isArc) arcHandler.mouseup(e, points);
        else if (cache.isRectangle) rectHandler.mouseup(e, points);
        else if (cache.isQuadraticCurve) quadraticHandler.mouseup(e, points);
        else if (cache.isBezierCurve) bezierHandler.mouseup(e, points);
        // else if (cache.isDragLastPath || cache.isDragAllPaths) dragHelper.mouseup(e, points, is.isDragLastPath);
        // else if (cache.isPencil) pencilHandler.mouseup(e, points);
        // else if (cache.isEraser) eraserHandler.mouseup(e, points);
        // else if (cache.isText) textHandler.mouseup(e, points);
        else if (cache.isImage) imageHandler.mouseup(e, points);
        else if (cache.isPdf) pdfHandler.mousedown(e, points);
        else if (cache.isArrow) arrowHandler.mouseup(e, points);
        // else if (cache.isMarker) markerHandler.mouseup(e, points);

        // !cache.isPdf && drawHelper.redraw(context, tempContext, points);

        // syncPoints(is.isDragAllPaths || is.isDragLastPath ? true : false);

        // preventStopEvent(e);
    });

    addEvent(canvas, isTouch ? 'touchmove mousemove' : 'mousemove', function(e) {
        if (isTouch) e = e.pageX ? e : e.touches.length ? e.touches[0] : {
            pageX: 0,
            pageY: 0
        };

        var cache = is;

        if (cache.isLine) lineHandler.mousemove(e, points);
        else if (cache.isArc) arcHandler.mousemove(e, points);
        else if (cache.isRectangle) rectHandler.mousemove(e, points);
        else if (cache.isQuadraticCurve) quadraticHandler.mousemove(e, points);
        else if (cache.isBezierCurve) bezierHandler.mousemove(e, points);
        // else if (cache.isDragLastPath || cache.isDragAllPaths) dragHelper.mousemove(e, points, is.isDragAllPaths, is.isDragLastPath);
        // else if (cache.isPencil) pencilHandler.mousemove(e, points);
        // else if (cache.isEraser) eraserHandler.mousemove(e, points);
        // else if (cache.isText) textHandler.mousemove(e, points);
        else if (cache.isImage) imageHandler.mousemove(e, points);
        else if (cache.isPdf) pdfHandler.mousedown(e, points);
        else if (cache.isArrow) arrowHandler.mousemove(e, points);
        // else if (cache.isMarker) markerHandler.mousemove(e, points);

        // preventStopEvent(e);
    });

    var keyCode;

    function onkeydown(e) {
        keyCode = e.which || e.keyCode || 0;

        if (keyCode == 8 || keyCode == 46) {
            if (isBackKey(e, keyCode)) {
                // back key pressed
            }
            return;
        }

        if (e.metaKey) {
            isControlKeyPressed = true;
            keyCode = 17;
        }

        if (!isControlKeyPressed && keyCode === 17) {
            isControlKeyPressed = true;
        }
    }

    function isBackKey(e, keyCode) {
        var doPrevent = false;
        var d = e.srcElement || e.target;
        if ((d.tagName.toUpperCase() === 'INPUT' &&
                (
                    d.type.toUpperCase() === 'TEXT' ||
                    d.type.toUpperCase() === 'PASSWORD' ||
                    d.type.toUpperCase() === 'FILE' ||
                    d.type.toUpperCase() === 'SEARCH' ||
                    d.type.toUpperCase() === 'EMAIL' ||
                    d.type.toUpperCase() === 'NUMBER' ||
                    d.type.toUpperCase() === 'DATE')
            ) ||
            d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        } else {
            doPrevent = true;
        }

        if (doPrevent) {
            e.preventDefault();
        }
        return doPrevent;
    }

    addEvent(document, 'keydown', onkeydown);

    function onkeyup(e) {
        if (e.which == null && (e.charCode != null || e.keyCode != null)) {
            e.which = e.charCode != null ? e.charCode : e.keyCode;
        }

        keyCode = e.which || e.keyCode || 0;

        if (keyCode === 13 && shows.text) {
            // textHandler.onReturnKeyPressed(points, shows.text);
            return;
        }

        if (keyCode == 8 || keyCode == 46) {
            if (isBackKey(e, keyCode)) {
                // textHandler.writeText(textHandler.lastKeyPress, true, shows.text);
            }
            return;
        }

        // Ctrl + t
        if (isControlKeyPressed && keyCode === 84 && shows.text) {
            // textHandler.showTextTools();
            return;
        }

        // Ctrl + z
        if (isControlKeyPressed && keyCode === 90) {
            if (points.length) {
                points.length = points.length - 1;
                drawHelper.redraw(context, tempContext, points);

                syncPoints(is.isDragAllPaths || is.isDragLastPath ? true : false);
            }
        }

        // Ctrl + a
        if (isControlKeyPressed && keyCode === 65) {
            dragHelper.global.startingIndex = 0;

            endLastPath();

            setSelection(find('drag-all-paths'), 'DragAllPaths');
        }

        // Ctrl + c
        if (isControlKeyPressed && keyCode === 67 && points.length) {
            copy();
        }

        // Ctrl + v
        if (isControlKeyPressed && keyCode === 86 && copiedStuff.length) {
            paste();

            syncPoints(is.isDragAllPaths || is.isDragLastPath ? true : false);
        }

        // Ending the Control Key
        if (typeof e.metaKey !== 'undefined' && e.metaKey === false) {
            isControlKeyPressed = false;
            keyCode = 17;
        }

        if (keyCode === 17) {
            isControlKeyPressed = false;
        }
    }

    addEvent(document, 'keyup', onkeyup);

    function onkeypress(e) {
        if (e.which == null && (e.charCode != null || e.keyCode != null)) {
            e.which = e.charCode != null ? e.charCode : e.keyCode;
        }

        keyCode = e.which || e.keyCode || 0;

        var inp = String.fromCharCode(keyCode);
        if (/[a-zA-Z0-9-_ !?|\/'",.=:;(){}\[\]`~@#$%^&*+-]/.test(inp)) {
            // textHandler.writeText(String.fromCharCode(keyCode), false, shows.text);
        }
    }

    addEvent(document, 'keypress', onkeypress);

    function onTextFromClipboard(e) {
        if (!is.isText) return;
        var pastedText = undefined;
        if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
        } else if (e.clipboardData && e.clipboardData.getData) {
            pastedText = e.clipboardData.getData('text/plain');
        }
        if (pastedText && pastedText.length) {
            // textHandler.writeText(pastedText, false, shows.text);
        }
    }

    addEvent(document, 'paste', onTextFromClipboard);

    var lastPointIndex = 0;

    var uid;

    window.addEventListener('message', (event) => {
        if (!event.data) return;

        if (!uid) {
            uid = event.data.uid;
        }

        if (event.data.captureStream) {
            webrtcHandler.createOffer(function(sdp) {
                sdp.uid = uid;
                window.parent.postMessage(sdp, '*');
            });
            return;
        }

        if (event.data.renderStream) {
            setTemporaryLine();
            return;
        }

        if (event.data.sdp) {
            webrtcHandler.setRemoteDescription(event.data);
            return;
        }

        if (event.data.genDataURL) {
            var dataURL = context.canvas.toDataURL(event.data.format, 1);
            window.parent.postMessage({
                dataURL: dataURL,
                uid: uid
            }, '*');
            return;
        }

        if (event.data.undo && points.length) {
            var index = event.data.index;

            if (index === 'all') {
                points = [];
                drawHelper.redraw(context, tempContext, points);
                syncPoints(true);
                return;
            }

            if (index.numberOfLastShapes) {
                try {
                    points.length -= index.numberOfLastShapes;
                } catch (e) {
                    points = [];
                }

                drawHelper.redraw(context, tempContext, points);
                syncPoints(true);
                return;
            }

            if (index === -1) {
                points.length = points.length - 1;
                drawHelper.redraw();
                syncPoints(true);
                return;
            }

            if (points[index]) {
                var newPoints = [];
                for (var i = 0; i < points.length; i++) {
                    if (i !== index) {
                        newPoints.push(points[i]);
                    }
                }
                points = newPoints;
                drawHelper.redraw(context, tempContext, points);
                syncPoints(true);
            }
            return;
        }

        if (event.data.syncPoints) {
            syncPoints(true);
            return;
        }

        if (event.data.clearCanvas) {
            points = [];
            drawHelper.redraw(context, tempContext, points);
            return;
        }

        if (!event.data.canvasDesignerSyncData) return;

        // drawing is shared here (array of points)
        var d = event.data.canvasDesignerSyncData;

        if (d.startIndex !== 0) {
            for (var i = 0; i < d.points.length; i++) {
                points[i + d.startIndex] = d.points[i];
            }
        } else {
            points = d.points;
        }

        lastPointIndex = points.length;

        // redraw the <canvas> surfaces
        drawHelper.redraw(context, tempContext, points);
    }, false);

    function syncPoints(isSyncAll) {
        
        if (isSyncAll) {
            lastPointIndex = 0;
        }

        if (lastPointIndex == points.length) return;
        
        var pointsToShare = [];
        for (var i = lastPointIndex; i < points.length; i++) {
            pointsToShare[i - lastPointIndex] = points[i];
        }

        if (pointsToShare.length) {
            syncData({
                points: pointsToShare || [],
                startIndex: lastPointIndex
            });
        }

        if (!pointsToShare.length && points.length) return;

        lastPointIndex = points.length;
    }

    function syncData(data) {
        window.parent.postMessage({
            canvasDesignerSyncData: data,
            uid: uid
        }, '*');
    }
}
export default initWidget;

