import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';
import * as pdfjsLib from 'pdfjs-dist';
import drawHelper from "../../DrawHelper";
import data_uris from '../../../toolbox/ToolboxImages';

import { getPoints } from '../../../views/CanvasTemp';
import ShapeHandler from '../../ShapeHandler';
import FileSelector from "../image/FileSelector";

var pdfHandler = undefined;
export default class PdfHandler extends ShapeHandler {

    constructor(context, tempContext, selected) {
        super(context, tempContext);

        this.selected = selected;
        this.lastPdfURL = null;
        this.lastIndex = 0;
        this.lastPointIndex = 0;
        this.removeWhiteBackground = false;
        this.pdfPageContainer = document.getElementById('pdf-page-container');
        this.pdfPagesList = document.getElementById('pdf-pages-list');
        this.pdfNext = document.getElementById('pdf-next');
        this.pdfPrev = document.getElementById('pdf-prev');
        this.pdfClose = document.getElementById('pdf-close');
        this.pageNumber = 1;
    
        this.images = [];
        this.ismousedown = false;
        this.prevX = 0;
        this.prevY = 0;
        this.pdf = undefined;

        this.addMeventListener();
        pdfHandler = this;
    }

    onIconClicked () {
        var selector = new FileSelector();
        selector.selectSingleFile((file) => {
            if (!file) return;
            
            var reader = new FileReader();
            reader.onload =  (event) => {
                this.pdf = null; // to make sure we call "getDocument" again
                this.load(event.target.result);
            };
            reader.readAsDataURL(file);
        }, null, 'application/pdf');
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'pdf') this.selected = false;
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

    getPage = (pageNumber, callback) => {
        this.pageNumber = parseInt(this.pageNumber) || 1;

        if (!this.pdf) {
            pdfjsLib.disableWorker = false;
            pdfjsLib.getDocument(this.lastPdfURL).promise.then( pdfDocument => {
                this.pdf = pdfDocument;
                this.getPage(pageNumber, callback);
            });
            return;
        }

        var pdf = this.pdf;
        pdf.getPage(pageNumber).then( page => {
            this.pageNumber = pageNumber;

            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale });

            var cav = document.createElement('canvas');
            var ctx = cav.getContext('2d');
            cav.height = viewport.height;
            cav.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            if (this.removeWhiteBackground === true) {
                this.background = 'rgba(0,0,0,0)';
            }

            page.render(renderContext).promise.then( () => {
                if (this.removeWhiteBackground === true) {
                    var imgd = ctx.getImageData(0, 0, cav.width, cav.height);
                    var pix = imgd.data;
                    var newColor = {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0
                    };

                    for (var i = 0, n = pix.length; i < n; i += 4) {
                        var r = pix[i],
                            g = pix[i + 1],
                            b = pix[i + 2];

                        if (r == 255 && g == 255 && b == 255) {
                            pix[i] = newColor.r;
                            pix[i + 1] = newColor.g;
                            pix[i + 2] = newColor.b;
                            pix[i + 3] = newColor.a;
                        }
                    }
                    ctx.putImageData(imgd, 0, 0);
                }

                this.lastPage = cav.toDataURL('image/png');
                callback(this.lastPage, cav.width, cav.height, pdf.numPages);
            });
        });
    }

    load = (lastPdfURL) => {
        this.lastPdfURL = lastPdfURL;
        this.getPage(parseInt(this.pdfPagesList.value || 1), (lastPage, width, height, numPages) => {
            this.prevX = this.canvas.width - width - parseInt(width / 2);

            var points = getPoints();
            this.lastIndex = this.images.length;
            var point = [lastPage, 60, 20, width, height, this.lastIndex];

            this.lastPointIndex = points.length;
            points[points.length] = ['pdf', point, drawHelper.getOptions()];

            this.pdfPagesList.innerHTML = '';
            for (var i = 1; i <= numPages; i++) {
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = 'Page #' + i;
                this.pdfPagesList.appendChild(option);

                if (this.pageNumber.toString() == i.toString()) {
                    option.selected = true;
                }
            }

            this.pdfPagesList.onchange = () => {
                this.load(lastPdfURL);
            };

            this.pdfNext.onclick = () => {
                this.pdfPagesList.selectedIndex++;
                this.pdfPagesList.onchange();
            };

            this.pdfPrev.onclick = () => {
                this.pdfPagesList.selectedIndex--;
                this.pdfPagesList.onchange();
            };

            this.pdfClose.onclick = () => {
                this.pdfPageContainer.style.display = 'none';
            };

            document.getElementById('drag-last-path').click();

            this.pdfPrev.src = data_uris.pdf_next;
            this.pdfNext.src = data_uris.pdf_prev;
            this.pdfClose.src = data_uris.pdf_close;

            this.pdfPageContainer.style.top = '20px';
            this.pdfPageContainer.style.left = (point[3] - parseInt(point[3] / 2)) + 'px';
            this.pdfPageContainer.style.display = 'block';

            // share to webrtc
            this.syncPoints(true);
        });
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

        var points = getPoints();
        var t = this;
        if (t.ismousedown) {
            if (points[this.lastPointIndex]) {
                points[this.lastPointIndex] = ['pdf', [this.lastPage, t.prevX, t.prevY, x - t.prevX, y - t.prevY, this.lastIndex], drawHelper.getOptions()];
            }

            t.ismousedown = false;
        }
    }

    mousemove = (mevent) => {
        var x = mevent.wevt.pageX - this.canvas.offsetLeft,
            y = mevent.wevt.pageY - this.canvas.offsetTop;

        var t = this;
        if (t.ismousedown) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);
            drawHelper.pdf(this.tempContext, [this.lastPage, t.prevX, t.prevY, x - t.prevX, y - t.prevY, this.lastIndex]);
        }
    }

    reset_pos = (x, y) => {
        var points = getPoints();
        this.pdfPageContainer.style.top = y + 'px';
        if (!points[this.lastPointIndex]) return;
        var point = points[this.lastPointIndex][1];
        this.pdfPageContainer.style.left = (point[1] + point[3] - parseInt(point[3] / 2) - parseInt(this.pdfPageContainer.clientWidth / 2)) + 'px';
    }

    end = () => {
        // pdfHandler.pdfPageContainer.style.display = 'none';
    }
}

const createPdfHandlerSingleton = (context, tempContext, selected) => {
    if(pdfHandler === undefined) {
        pdfHandler = new PdfHandler(context, tempContext, selected);
    }
    return pdfHandler;
}

export {
    createPdfHandlerSingleton
}
