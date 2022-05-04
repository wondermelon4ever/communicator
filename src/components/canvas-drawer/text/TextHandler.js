
class TextHandler {
    constructor(props) {
        this.tempContext = props.tempContext;
        this.fillStyle = props.fillStyle;
        this.blinkCursorInterval = undefined;
        this.index = 0;
        this.fontFamilyBox = document.querySelector(props.fontFamilyBoxName === undefined ? '.fontSelectUl' : props.fontFamilyBoxName);
        this.fontSizeBox   = document.querySelector(props.fontSizeBoxName === undefined ? '.fontSizeUl' : props.fontSizeBoxName);
        this.text = "";
        this.x = 0, this.y = 0, this.pageX = 0, this.pageY = 0;
    }

    onShapeSelected = function() {
        tempContext.canvas.style.cursor = 'text';
        this.x = this.y = this.pageX = this.pageY = 0;
        this.text = '';
    }

    onShapeUnSelected = function() {
        this.text = '';
        this.showOrHideTextTools('hide');
        this.tempContext.canvas.style.cursor = 'default';

        if (typeof this.blinkCursorInterval !== 'undefined') {
            clearInterval(this.blinkCursorInterval);
        }
    }

    getFillColor = function(color) {
        color = (color || this.fillStyle).toLowerCase();

        if (color == 'rgba(255, 255, 255, 0)' || color == 'transparent' || color === 'white') {
            return 'black';
        }

        return color;
    }

    writeText = (keyPressed, isBackKeyPressed, isText = false) => {
        if (!isText) return;

        if (isBackKeyPressed) {
            this.text = this.text.substr(0, textHandler.text.length - 1);
            this.fillText(this.text);
            return;
        }

        this.text += keyPressed;
        this.fillText(this.text, isText);
    }

    fillText = function(text, isText = false) {
        if (!isText) return;

        this.tempContext.clearRect(0, 0, this.tempContext.canvas.width, this.tempContext.canvas.height);

        var options = this.getOptions();
        drawHelper.handleOptions(tempContext, options);
        this.tempContext.fillStyle = textHandler.getFillColor(options[2]);
        this.tempContext.font = textHandler.selectedFontSize + 'px "' + textHandler.selectedFontFamily + '"';

        tempContext.fillText(text, textHandler.x, textHandler.y);
    }

    blinkCursor = function() {
        textHandler.index++;
        if (textHandler.index % 2 == 0) {
            textHandler.fillText(textHandler.text + '|');
        } else {
            textHandler.fillText(textHandler.text);
        }
    }

    getOptions = function() {
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
    }

    appendPoints = function() {
        var options = textHandler.getOptions();
        points[points.length] = ['text', ['"' + textHandler.text + '"', textHandler.x, textHandler.y], drawHelper.getOptions(options)];
    }

    mousedown = function(e) {
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
    }

    mouseup = function(e) {}
    mousemove = function(e) {}

    showOrHideTextTools = function(show) {
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
    }

    showTextTools = function() {
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
    }

    eachFontFamily = function(callback) {
        var childs = this.fontFamilyBox.querySelectorAll('li');
        for (var i = 0; i < childs.length; i++) {
            callback(childs[i]);
        }
    }
    unselectAllFontFamilies = function() {
        this.eachFontFamily(function(child) {
            child.className = '';
            if (child.innerHTML === textHandler.selectedFontFamily) {
                child.className = 'font-family-selected';
            }
        });
    }

    eachFontSize = function(callback) {
        var childs = this.fontSizeBox.querySelectorAll('li');
        for (var i = 0; i < childs.length; i++) {
            callback(childs[i]);
        }
    }

    unselectAllFontSizes = function() {
        this.eachFontSize(function(child) {
            child.className = '';
            if (child.innerHTML === textHandler.selectedFontSize) {
                child.className = 'font-size-selected';
            }
        });
    }

    onReturnKeyPressed = function() {
        if (!textHandler.text || !textHandler.text.length) return;
        var fontSize = parseInt(textHandler.selectedFontSize) || 15;
        this.mousedown({
            pageX: this.pageX,
            // pageY: parseInt(tempContext.measureText(textHandler.text).height * 2) + 10
            pageY: this.pageY + fontSize + 5
        });
        drawHelper.redraw();
    }
}
