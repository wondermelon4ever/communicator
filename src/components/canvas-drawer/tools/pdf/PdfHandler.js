import * as pdfjsLib from 'pdfjs-dist';
import drawHelper, { setPdfHandler } from "../../common/helpers/DrawHelper";

var pdfHandler = undefined;
export default class PdfHandler {

    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;

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
    }

    getPage = (pageNumber, callback) => {
        this.pageNumber = parseInt(this.pageNumber) || 1;

        if (!this.pdf) {
            pdfjsLib.disableWorker = false;
            pdfjsLib.getDocument(this.lastPdfURL).then(function(pdf) {
                this.pdf = pdf;
                this.getPage(pageNumber, callback);
            });
            return;
        }

        var pdf = this.pdf;
        pdf.getPage(pageNumber).then(function(page) {
            pdfHandler.pageNumber = pageNumber;

            var scale = 1.5;
            var viewport = page.getViewport(scale);

            var cav = document.createElement('canvas');
            var ctx = cav.getContext('2d');
            cav.height = viewport.height;
            cav.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            if (pdfHandler.removeWhiteBackground === true) {
                renderContext.background = 'rgba(0,0,0,0)';
            }

            page.render(renderContext).then(function() {
                if (pdfHandler.removeWhiteBackground === true) {
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

                pdfHandler.lastPage = cav.toDataURL('image/png');
                callback(pdfHandler.lastPage, cav.width, cav.height, pdf.numPages);
            });
        });
    }

    load = (lastPdfURL) => {
        pdfHandler.lastPdfURL = lastPdfURL;
        pdfHandler.getPage(parseInt(pdfHandler.pdfPagesList.value || 1), function(lastPage, width, height, numPages) {
            pdfHandler.prevX = canvas.width - width - parseInt(width / 2);

            var t = pdfHandler;
            pdfHandler.lastIndex = pdfHandler.images.length;
            var point = [lastPage, 60, 20, width, height, pdfHandler.lastIndex];

            pdfHandler.lastPointIndex = points.length;
            points[points.length] = ['pdf', point, drawHelper.getOptions()];

            pdfHandler.pdfPagesList.innerHTML = '';
            for (var i = 1; i <= numPages; i++) {
                var option = document.createElement('option');
                option.value = i;
                option.innerHTML = 'Page #' + i;
                pdfHandler.pdfPagesList.appendChild(option);

                if (pdfHandler.pageNumber.toString() == i.toString()) {
                    option.selected = true;
                }
            }

            this.pdfPagesList.onchange = function() {
                pdfHandler.load(lastPdfURL);
            };

            this.pdfNext.onclick = function() {
                pdfHandler.pdfPagesList.selectedIndex++;
                pdfHandler.pdfPagesList.onchange();
            };

            this.pdfPrev.onclick = function() {
                pdfHandler.pdfPagesList.selectedIndex--;
                pdfHandler.pdfPagesList.onchange();
            };

            this.pdfClose.onclick = function() {
                pdfHandler.pdfPageContainer.style.display = 'none';
            };

            document.getElementById('drag-last-path').click();

            this.pdfPrev.src = data_uris.pdf_next;
            this.pdfNext.src = data_uris.pdf_prev;
            this.pdfClose.src = data_uris.pdf_close;

            this.pdfPageContainer.style.top = '20px';
            this.pdfPageContainer.style.left = (point[3] - parseInt(point[3] / 2)) + 'px';
            this.pdfPageContainer.style.display = 'block';

            // share to webrtc
            syncPoints(true);
        });
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
            if (points[this.lastPointIndex]) {
                points[this.lastPointIndex] = ['pdf', [this.lastPage, t.prevX, t.prevY, x - t.prevX, y - t.prevY, this.lastIndex], drawHelper.getOptions()];
            }

            t.ismousedown = false;
        }
    }

    mousemove = (e, points) => {
        var x = e.pageX - canvas.offsetLeft,
            y = e.pageY - canvas.offsetTop;

        var t = this;
        if (t.ismousedown) {
            tempContext.clearRect(0, 0, innerWidth, innerHeight);
            drawHelper.pdf(tempContext, [pdfHandler.lastPage, t.prevX, t.prevY, x - t.prevX, y - t.prevY, pdfHandler.lastIndex]);
        }
    }

    reset_pos = (x, y, points) => {
        this.pdfPageContainer.style.top = y + 'px';
        if (!points[pdfHandler.lastPointIndex]) return;
        var point = points[pdfHandler.lastPointIndex][1];
        pdfHandler.pdfPageContainer.style.left = (point[1] + point[3] - parseInt(point[3] / 2) - parseInt(pdfHandler.pdfPageContainer.clientWidth / 2)) + 'px';
    }

    end = () => {
        // pdfHandler.pdfPageContainer.style.display = 'none';
    }
}

const createPdfHandler = (context, tempContext) => {
    if(pdfHandler === undefined) {
        pdfHandler = new PdfHandler(context, tempContext);
        setPdfHandler(pdfHandler);
    }
    return pdfHandler;
}

export {
    createPdfHandler
}
