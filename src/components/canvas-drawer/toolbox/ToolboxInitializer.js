import {
    addEvent,
    colors,
    find,
    hideContainers,
    syncData
} from '../util/Utils'
import data_uris from './ToolboxImages';
import FileSelector from '../tools/file/FileSelector';

const initToolbox = (params) => {
    var imageHandler= params.imageHandler;
    var pdfHandler  = params.pdfHandler;
    var textHandler = params.textHandler;
    var zoomHandler = params.zoomHandler;
    var dragHelper  = params.dragHelper;
    var lineCap     = params.lineCap;
    var lineJoin    = params.lineJoin;
    var strokeStyle = params.strokeStyle;
    var fillStyle   = params.fillStyle;
    var lineWidth   = params.lineWidth;
    var setSelection= params.setSelection;
    var tools       = params.tools;
    var common      = params.common;
    var getPoints   = params.getPoints;
    var endLastPath = params.endLastPath;
    var syncPoints  = params.syncPoints;

    var cache = {};

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
            if (textHandler.text.length) {
                textHandler.appendPoints(getPoints());
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
                            imageHandler.load(image.clientWidth, image.clientHeight, getPoints());
                        };
                        image.style = 'position: absolute; top: -99999999999; left: -999999999;';
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
    }

    function decorateUndo() {
        var contextUndo = getContext('undo');

        var image = new Image();
        image.onload = function() {
            contextUndo.drawImage(image, 4, 4, 32, 32);

            document.querySelector('#undo').onclick = function() {
                var points = getPoint();
                if (points.length) {
                    points.length = points.length - 1;
                    drawHelper.redraw(context, tempContext, points);
                }
                syncPoints(true);
            };
        };
        image.src = data_uris.undo;
    }

    if (tools.undo === true) {
        decorateUndo();
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

    if (tools.arrow === true) decorateArrow();

    function decorateZoomUp() {
        var context = getContext('zoom-up');
        addEvent(context.canvas, 'click', function() {
            zoomHandler.up();
        });

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
        };
        image.src = data_uris.zoom_in;
    }

    function decorateZoomDown() {
        var context = getContext('zoom-down');
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
        decorateZoomUp();
        decorateZoomDown();
    }

    function decoratePencil() {
        var context = getContext('pencil-icon');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Pencil');
        };
        image.src = data_uris.pencil;
    }

    if (tools.pencil === true) decoratePencil();

    function decorateMarker() {
        var context = getContext('marker-icon');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Marker');
        };
        image.src = data_uris.marker;
    }

    if (tools.marker === true) decorateMarker();

    function decorateEraser() {
        var context = getContext('eraser-icon');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Eraser');
        };
        image.src = data_uris.eraser;
    }

    if (tools.eraser === true) decorateEraser();

    function decorateText() {
        var context = getContext('text-icon');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Text');
        };
        image.src = data_uris.text;
    }

    if (tools.text === true) decorateText();

    function decorateImage() {
        var context = getContext('image-icon');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Image');
        };
        image.src = data_uris.image;
    }

    if (tools.image === true) decorateImage();

    function decoratePDF() {
        var context = getContext('pdf-icon');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Pdf');
        };
        image.src = data_uris.pdf;
    }

    if (tools.pdf === true) decoratePDF();

    function decorateArc() {
        var context = getContext('arc');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Arc');
        };
        image.src = data_uris.arc;
    }

    if (tools.arc === true) decorateArc();

    function decorateRect() {
        var context = getContext('rectangle');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Rectangle');
        };
        image.src = data_uris.rectangle;
    }

    if (tools.rectangle === true) decorateRect();

    function decorateQuadratic() {
        var context = getContext('quadratic-curve');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'QuadraticCurve');
        };
        image.src = data_uris.quadratic;
    }

    if (tools.quadratic === true) decorateQuadratic();

    function decorateBezier() {
        var context = getContext('bezier-curve');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
            bindEvent(context, 'Bezier');
        };
        image.src = data_uris.bezier;
    }

    if (tools.bezier === true) decorateBezier();

    function decorateLineWidth() {
        var context = getContext('line-width');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
        };
        image.src = data_uris.lineWidth;
    }

    if (tools.lineWidth === true) decorateLineWidth();

    function decorateColors() {
        var context = getContext('colors');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
        };
        image.src = data_uris.colorsPicker;
    }

    if (tools.colorsPicker === true) decorateColors();

    function decorateAdditionalOptions() {
        var context = getContext('additional');

        var image = new Image();
        image.onload = function() {
            context.drawImage(image, 4, 4, 32, 32);
        };
        image.src = data_uris.extraOptions;
    }

    if (tools.extraOptions === true) decorateAdditionalOptions();

    var designPreview = find('design-preview'), codePreview = find('code-preview');

    window.selectBtn = (btn, isSkipWebRTCMessage) => {
        codePreview.className = designPreview.className = '';

        if (btn == designPreview) designPreview.className = 'preview-selected';
        else codePreview.className = 'preview-selected';

        if (!isSkipWebRTCMessage && window.connection && connection.numberOfConnectedUsers >= 1) {
            connection.send({
                btnSelected: btn.id
            });
        } else {
            // to sync buttons' UI-states
            if (btn == designPreview) btnDesignerPreviewClicked();
            else btnCodePreviewClicked();
        }
    };

    addEvent(designPreview, 'click', function() {
        selectBtn(designPreview);
        btnDesignerPreviewClicked();
    });

    function btnDesignerPreviewClicked() {
        codeText.parentNode.style.display = 'none';
        optionsContainer.style.display = 'none';

        hideContainers();
        endLastPath();
    }

    addEvent(codePreview, 'click', () => {
        selectBtn(codePreview);
        btnCodePreviewClicked(getPoints());
    });

    function btnCodePreviewClicked() {
        codeText.parentNode.style.display = 'block';
        optionsContainer.style.display = 'block';

        codeText.focus();
        common.updateTextArea(getPoints());

        setHeightForCodeAndOptionsContainer();

        hideContainers();
        endLastPath();
    }

    var codeText = find('code-text'), optionsContainer = find('options-container');

    function setHeightForCodeAndOptionsContainer() {
        codeText.style.width = (innerWidth - optionsContainer.clientWidth - 30) + 'px';
        codeText.style.height = (innerHeight - 40) + 'px';

        codeText.style.marginLeft = (optionsContainer.clientWidth) + 'px';
        optionsContainer.style.height = (innerHeight) + 'px';
    }

    var isAbsolute = find('is-absolute-points'), isShorten  = find('is-shorten-code');

    addEvent(isShorten,  'change', common.updateTextArea);
    addEvent(isAbsolute, 'change', common.updateTextArea);
}

export default initToolbox;
