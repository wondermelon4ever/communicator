
    arcHandler.init();

    var lineHandler = {
        ismousedown: false,
        prevX: 0,
        prevY: 0,
        mousedown: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;

            t.prevX = x;
            t.prevY = y;

            t.ismousedown = true;
        },
        mouseup: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                points[points.length] = ['line', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

                t.ismousedown = false;
            }
        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;

            if (t.ismousedown) {
                tempContext.clearRect(0, 0, innerWidth, innerHeight);

                drawHelper.line(tempContext, [t.prevX, t.prevY, x, y]);
            }
        }
    };

    var arrowHandler = {
        ismousedown: false,
        prevX: 0,
        prevY: 0,
        arrowSize: 10,
        mousedown: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;

            t.prevX = x;
            t.prevY = y;

            t.ismousedown = true;
        },
        mouseup: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                points[points.length] = ['arrow', [t.prevX, t.prevY, x, y], drawHelper.getOptions()];

                t.ismousedown = false;
            }
        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;

            if (t.ismousedown) {
                tempContext.clearRect(0, 0, innerWidth, innerHeight);

                drawHelper.arrow(tempContext, [t.prevX, t.prevY, x, y]);
            }
        }
    };

    var rectHandler = {
        ismousedown: false,
        prevX: 0,
        prevY: 0,
        mousedown: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;

            t.prevX = x;
            t.prevY = y;

            t.ismousedown = true;
        },
        mouseup: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                points[points.length] = ['rect', [t.prevX, t.prevY, x - t.prevX, y - t.prevY], drawHelper.getOptions()];

                t.ismousedown = false;
            }

        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                tempContext.clearRect(0, 0, innerWidth, innerHeight);

                drawHelper.rect(tempContext, [t.prevX, t.prevY, x - t.prevX, y - t.prevY]);
            }
        }
    };

    var quadraticHandler = {
        global: {
            ismousedown: false,
            prevX: 0,
            prevY: 0,
            controlPointX: 0,
            controlPointY: 0,
            isFirstStep: true,
            isLastStep: false
        },
        mousedown: function(e) {
            var g = this.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            if (!g.isLastStep) {
                g.prevX = x;
                g.prevY = y;
            }

            g.ismousedown = true;

            if (g.isLastStep && g.ismousedown) {
                this.end(x, y);
            }
        },
        mouseup: function(e) {
            var g = this.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            if (g.ismousedown && g.isFirstStep) {
                g.controlPointX = x;
                g.controlPointY = y;

                g.isFirstStep = false;
                g.isLastStep = true;
            }
        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var g = this.global;

            tempContext.clearRect(0, 0, innerWidth, innerHeight);

            if (g.ismousedown && g.isFirstStep) {
                drawHelper.quadratic(tempContext, [g.prevX, g.prevY, x, y, x, y]);
            }

            if (g.isLastStep) {
                drawHelper.quadratic(tempContext, [g.prevX, g.prevY, g.controlPointX, g.controlPointY, x, y]);
            }
        },
        end: function(x, y) {
            var g = this.global;

            if (!g.ismousedown) return;

            g.isLastStep = false;

            g.isFirstStep = true;
            g.ismousedown = false;

            x = x || g.controlPointX || g.prevX;
            y = y || g.controlPointY || g.prevY;

            points[points.length] = ['quadratic', [g.prevX, g.prevY, g.controlPointX, g.controlPointY, x, y], drawHelper.getOptions()];
        }
    };

    var bezierHandler = {
        global: {
            ismousedown: false,
            prevX: 0,
            prevY: 0,

            firstControlPointX: 0,
            firstControlPointY: 0,
            secondControlPointX: 0,
            secondControlPointY: 0,

            isFirstStep: true,
            isSecondStep: false,
            isLastStep: false
        },
        mousedown: function(e) {
            var g = this.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            if (!g.isLastStep && !g.isSecondStep) {
                g.prevX = x;
                g.prevY = y;
            }

            g.ismousedown = true;

            if (g.isLastStep && g.ismousedown) {
                this.end(x, y);
            }

            if (g.ismousedown && g.isSecondStep) {
                g.secondControlPointX = x;
                g.secondControlPointY = y;

                g.isSecondStep = false;
                g.isLastStep = true;
            }
        },
        mouseup: function(e) {
            var g = this.global;

            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            if (g.ismousedown && g.isFirstStep) {
                g.firstControlPointX = x;
                g.firstControlPointY = y;

                g.isFirstStep = false;
                g.isSecondStep = true;
            }
        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var g = this.global;

            tempContext.clearRect(0, 0, innerWidth, innerHeight);

            if (g.ismousedown && g.isFirstStep) {
                drawHelper.bezier(tempContext, [g.prevX, g.prevY, x, y, x, y, x, y]);
            }

            if (g.ismousedown && g.isSecondStep) {
                drawHelper.bezier(tempContext, [g.prevX, g.prevY, g.firstControlPointX, g.firstControlPointY, x, y, x, y]);
            }

            if (g.isLastStep) {
                drawHelper.bezier(tempContext, [g.prevX, g.prevY, g.firstControlPointX, g.firstControlPointY, g.secondControlPointX, g.secondControlPointY, x, y]);
            }
        },
        end: function(x, y) {
            var g = this.global;

            if (!g.ismousedown) return;

            g.isLastStep = g.isSecondStep = false;

            g.isFirstStep = true;
            g.ismousedown = false;

            g.secondControlPointX = g.secondControlPointX || g.firstControlPointX;
            g.secondControlPointY = g.secondControlPointY || g.firstControlPointY;

            x = x || g.secondControlPointX;
            y = y || g.secondControlPointY;

            points[points.length] = ['bezier', [g.prevX, g.prevY, g.firstControlPointX, g.firstControlPointY, g.secondControlPointX, g.secondControlPointY, x, y], drawHelper.getOptions()];
        }
    };

    var zoomHandler = {
        scale: 1.0,
        up: function(e) {
            this.scale += .01;
            this.apply();
        },
        down: function(e) {
            this.scale -= .01;
            this.apply();
        },
        apply: function() {
            tempContext.scale(this.scale, this.scale);
            context.scale(this.scale, this.scale);
            drawHelper.redraw(context, tempContext, points);
        },
        icons: {
            up: function(ctx) {
                ctx.font = '22px Verdana';
                ctx.strokeText('+', 10, 30);
            },
            down: function(ctx) {
                ctx.font = '22px Verdana';
                ctx.strokeText('-', 15, 30);
            }
        }
    };

    var FileSelector = function() {
        var selector = this;

        selector.selectSingleFile = selectFile;
        selector.selectMultipleFiles = function(callback) {
            selectFile(callback, true);
        };

        function selectFile(callback, multiple, accept) {
            var file = document.createElement('input');
            file.type = 'file';

            if (multiple) {
                file.multiple = true;
            }

            file.accept = accept || 'image/*';

            file.onchange = function() {
                if (multiple) {
                    if (!file.files.length) {
                        console.error('No file selected.');
                        return;
                    }
                    callback(file.files);
                    return;
                }

                if (!file.files[0]) {
                    console.error('No file selected.');
                    return;
                }

                callback(file.files[0]);

                file.parentNode.removeChild(file);
            };
            file.style.display = 'none';
            (document.body || document.documentElement).appendChild(file);
            fireClickEvent(file);
        }

        function fireClickEvent(element) {
            var evt = new window.MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                button: 0,
                buttons: 0,
                mozInputSource: 1
            });

            var fired = element.dispatchEvent(evt);
        }
    };

    var imageHandler = {
        lastImageURL: null,
        lastImageIndex: 0,
        images: [],

        ismousedown: false,
        prevX: 0,
        prevY: 0,
        load: function(width, height) {
            var t = imageHandler;
            points[points.length] = ['image', [imageHandler.lastImageURL, t.prevX, t.prevY, width, height, imageHandler.lastImageIndex], drawHelper.getOptions()];
            document.getElementById('drag-last-path').click();

            // share to webrtc
            syncPoints(true);
        },
        mousedown: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;

            t.prevX = x;
            t.prevY = y;

            t.ismousedown = true;
        },
        mouseup: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                points[points.length] = ['image', [imageHandler.lastImageURL, t.prevX, t.prevY, x - t.prevX, y - t.prevY, imageHandler.lastImageIndex], drawHelper.getOptions()];

                t.ismousedown = false;
            }

        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                tempContext.clearRect(0, 0, innerWidth, innerHeight);

                drawHelper.image(tempContext, [imageHandler.lastImageURL, t.prevX, t.prevY, x - t.prevX, y - t.prevY, imageHandler.lastImageIndex]);
            }
        }
    };

    var pdfHandler = {
        lastPdfURL: null,
        lastIndex: 0,
        lastPointIndex: 0,
        removeWhiteBackground: false,
        pdfPageContainer: document.getElementById('pdf-page-container'),
        pdfPagesList: document.getElementById('pdf-pages-list'),
        pdfNext: document.getElementById('pdf-next'),
        pdfPrev: document.getElementById('pdf-prev'),
        pdfClose: document.getElementById('pdf-close'),
        pageNumber: 1,

        images: [],
        ismousedown: false,
        prevX: 0,
        prevY: 0,
        getPage: function(pageNumber, callback) {
            pageNumber = parseInt(pageNumber) || 1;

            if (!pdfHandler.pdf) {
                pdfjsLib.disableWorker = false;
                pdfjsLib.getDocument(pdfHandler.lastPdfURL).then(function(pdf) {
                    pdfHandler.pdf = pdf;
                    pdfHandler.getPage(pageNumber, callback);
                });
                return;
            }

            var pdf = pdfHandler.pdf;
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
        },
        load: function(lastPdfURL) {
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

                pdfHandler.pdfPagesList.onchange = function() {
                    pdfHandler.load(lastPdfURL);
                };

                pdfHandler.pdfNext.onclick = function() {
                    pdfHandler.pdfPagesList.selectedIndex++;
                    pdfHandler.pdfPagesList.onchange();
                };

                pdfHandler.pdfPrev.onclick = function() {
                    pdfHandler.pdfPagesList.selectedIndex--;
                    pdfHandler.pdfPagesList.onchange();
                };

                pdfHandler.pdfClose.onclick = function() {
                    pdfHandler.pdfPageContainer.style.display = 'none';
                };

                document.getElementById('drag-last-path').click();

                pdfHandler.pdfPrev.src = data_uris.pdf_next;
                pdfHandler.pdfNext.src = data_uris.pdf_prev;
                pdfHandler.pdfClose.src = data_uris.pdf_close;

                pdfHandler.pdfPageContainer.style.top = '20px';
                pdfHandler.pdfPageContainer.style.left = (point[3] - parseInt(point[3] / 2)) + 'px';
                pdfHandler.pdfPageContainer.style.display = 'block';

                // share to webrtc
                syncPoints(true);
            });
        },
        mousedown: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;

            t.prevX = x;
            t.prevY = y;

            t.ismousedown = true;
        },
        mouseup: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                if (points[pdfHandler.lastPointIndex]) {
                    points[pdfHandler.lastPointIndex] = ['pdf', [pdfHandler.lastPage, t.prevX, t.prevY, x - t.prevX, y - t.prevY, pdfHandler.lastIndex], drawHelper.getOptions()];
                }

                t.ismousedown = false;
            }
        },
        mousemove: function(e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop;

            var t = this;
            if (t.ismousedown) {
                tempContext.clearRect(0, 0, innerWidth, innerHeight);
                drawHelper.pdf(tempContext, [pdfHandler.lastPage, t.prevX, t.prevY, x - t.prevX, y - t.prevY, pdfHandler.lastIndex]);
            }
        },
