import { ConstructionOutlined } from "@mui/icons-material";
import drawHelper from "../helpers/DrawHelper";

var textHandler = undefined;

export default class TextHandler {
    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        
        this.text = "";
        this.selectedFontFamily = 'Arial';
        this.selectedFontSize = '15';
        this.textColor = '#000000';

        this.fillStyle = "#000000";
        this.blinkCursorInterval = undefined;
        this.index = 0;
        
        this.x = 0, this.y = 0, this.pageX = 0, this.pageY = 0;
        textHandler = this;
    }

    setSelectedFontFamily = (font) => {
        this.selectedFontFamily = font;
    }

    setSelectedFontSize = (fontSize) => {
        this.selectedFontSize = fontSize;
    }

    setSelectedTextColor = (color) => {
        this.textColor = "#"+color;
        this.fillStyle = "#"+color;
    }

    onShapeSelected = () => {
        this.tempContext.canvas.style.cursor = 'text';
        this.x = this.y = this.pageX = this.pageY = 0;
        this.text = '';
    }

    onShapeUnSelected = () => {
        this.text = '';
        this.showOrHideTextTools('hide');
        this.tempContext.canvas.style.cursor = 'default';

        if (typeof this.blinkCursorInterval !== 'undefined') {
            clearInterval(this.blinkCursorInterval);
        }
    }

    updateOptions = (options) => {
        this.setSelectedFontFamily(options.font);
        this.setSelectedFontSize(options.fontSize);
        this.setSelectedTextColor(options.textColor);
    }

    getFillColor = (color) => {
        color = (color || this.fillStyle).toLowerCase();

        if (color == 'rgba(255, 255, 255, 0)' || color == 'transparent' || color === 'white') {
            return 'black';
        }

        return color;
    }

    writeText = (keyPressed, isBackKeyPressed, isText = false) => {
        if (!isText) return;

        if (isBackKeyPressed) {
            this.text = this.text.substr(0, this.text.length - 1);
            this.fillText(this.text, isText);
            return;
        }

        this.text += keyPressed;
        this.fillText(this.text, isText);
    }

    fillText = (text, isText = false) => {
        if (!isText) return;

        this.tempContext.clearRect(0, 0, this.tempContext.canvas.width, this.tempContext.canvas.height);

        var options = this.getOptions();
        drawHelper.handleOptions(this.tempContext, options);
        this.tempContext.fillStyle = this.getFillColor(options[2]);
        this.tempContext.font = this.selectedFontSize + 'px "' + this.selectedFontFamily + '"';

        this.tempContext.fillText(text, this.x, this.y);
    }

    blinkCursor = (isText = false) => {
        this.index++;
        if (this.index % 2 == 0) {
            this.fillText(this.text + '|', isText);
        } else {
            this.fillText(this.text, isText);
        }
    }

    getOptions = () => {
        var options = {
            font: this.selectedFontSize + 'px "' + this.selectedFontFamily + '"',
            fillStyle: this.getFillColor(),
            strokeStyle: '#6c96c8',
            globalCompositeOperation: 'source-over',
            globalAlpha: 1,
            lineJoin: 'round',
            lineCap: 'round',
            lineWidth: 2
        };
        this.font = options.font;
        return options;
    }

    appendPoints = (points) => {
        var options = this.getOptions();
        points[points.length] = ['text', ['"' + this.text + '"', this.x, this.y], drawHelper.getOptions(options)];
    }

    mousedown = (e, points, isText = false) => {
        if (!isText) return;

        if (this.text.length) {
            this.appendPoints(points);
        }

        this.x = this.y = 0;
        this.text = '';

        this.pageX = e.pageX;
        this.pageY = e.pageY;

        this.x = e.pageX - this.canvas.offsetLeft - 5;
        this.y = e.pageY - this.canvas.offsetTop + 10;

        if (typeof this.blinkCursorInterval !== 'undefined') {
            clearInterval(this.blinkCursorInterval);
        }

        this.blinkCursor(isText);
        this.blinkCursorInterval = setInterval(() =>  this.blinkCursor(isText), 700);

        this.showTextTools();
    }

    mouseup = function(e) {}
    mousemove = function(e) {}

    showOrHideTextTools = (show) => {
        var infobox = document.getElementById("text-infobox");
        if(!infobox) {
            infobox = document.createElement('div');
            infobox.id = "text-infobox";
            infobox.style.left = this.x + 'px';
            infobox.style.top = (this.y+5) + 'px';
            infobox.style.zIndex = 100000;
            infobox.innerHTML = this.selectedFontFamily + ", " + this.selectedFontSize + ", " + this.fillStyle;
        }

        if(show === 'hide') infobox.style.display = 'none';
        else infobox.style.display = 'block';

        console.log(infobox.id + ", " + show);
    }

    showTextTools = () => {
        // if (!this.fontFamilyBox || !this.fontSizeBox) return;

        // this.unselectAllFontFamilies();
        // this.unselectAllFontSizes();

        this.showOrHideTextTools('show');

        // this.eachFontFamily( child => {
        //     child.onclick =  (e) => {
        //         e.preventDefault();

        //         this.showOrHideTextTools('hide');

        //         this.selectedFontFamily = this.innerHTML;
        //         this.className = 'font-family-selected';
        //     };
        //     child.style.fontFamily = child.innerHTML;
        // });

        // this.eachFontSize(child => {
        //     child.onclick = (e) => {
        //         e.preventDefault();

        //         this.showOrHideTextTools('hide');

        //         this.selectedFontSize = this.innerHTML;
        //         this.className = 'font-family-selected';
        //     };
        //     // child.style.fontSize = child.innerHTML + 'px';
        // });
    }

    eachFontFamily = (callback) => {
        // var childs = this.fontFamilyBox.querySelectorAll('li');
        // for (var i = 0; i < childs.length; i++) {
        //     callback(childs[i]);
        // }
    }

    unselectAllFontFamilies = () => {
        // this.eachFontFamily((child) => {
        //     child.className = '';
        //     if (child.innerHTML === this.selectedFontFamily) {
        //         child.className = 'font-family-selected';
        //     }
        // });
    }

    eachFontSize = (callback) => {
        // var childs = this.fontSizeBox.querySelectorAll('li');
        // for (var i = 0; i < childs.length; i++) {
        //     callback(childs[i]);
        // }
    }

    unselectAllFontSizes = () => {
        // this.eachFontSize((child) => {
        //     child.className = '';
        //     if (child.innerHTML === this.selectedFontSize) {
        //         child.className = 'font-size-selected';
        //     }
        // });
    }

    onReturnKeyPressed = (points, isText) => {
        if (!this.text || !this.text.length) return;
        var fontSize = parseInt(this.selectedFontSize) || 15;
        this.mousedown({
            pageX: this.pageX,
            pageY: this.pageY + fontSize + 5,
        }, points, isText);
        drawHelper.redraw(this.context, this.tempContext, points, this);
    }
}

const createTextHandler = (context, tempContext) => {
    if(textHandler === undefined) new TextHandler(context, tempContext);
    return textHandler;
}

const onFontChanged = (font) => {
    textHandler.setSelectedFontFamily(font);
}

const onFontSizeChanged = (fontSize) => {
    textHandler.setSelectedFontSize(fontSize);
}

const onTextColorChanged = (textColor) => {
    textHandler.setSelectedTextColor(textColor);
}

const onTextOptionsChanged = (options) => {
    console.log(JSON.stringify(options));
    textHandler.updateOptions(options);
}

export {
    createTextHandler,
    onFontChanged,
    onFontSizeChanged,
    onTextColorChanged,
    onTextOptionsChanged
}