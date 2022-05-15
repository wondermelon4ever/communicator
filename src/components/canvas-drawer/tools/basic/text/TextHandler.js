import { getPoints } from '../../../views/CanvasTemp';

import drawHelper, { setTextHandler} from "../../DrawHelper";
import ShapeHandler from '../../ShapeHandler';
import { createMeventDispatcherSingleton, MEVENT_KINDS } from '../../../mevent/MeventDispatcher';

var textHandler = undefined;

export default class TextHandler extends ShapeHandler {
    constructor(context, tempContext) {
        super(context, tempContext);
        
        this.selected = false;
        this.controlKeyPressed = false;
        this.infoboxOpen = false;

        this.text = "";
        this.selectedFontFamily = 'Arial';
        this.selectedFontSize = '15';
        this.textColor = '#000000';

        this.fillStyle = "#000000";
        this.blinkCursorInterval = undefined;
        this.index = 0;

        this.x = 0, this.y = 0, this.pageX = 0, this.pageY = 0;
        this.addMeventListener();
        textHandler = this;
    }

    addMeventListener () {
        var dispatcher = createMeventDispatcherSingleton();
        dispatcher.addListener(MEVENT_KINDS.SELECTED_SHAPE, (mevent) => {
            if(mevent.value.shape !== 'text') {
                this.selected = false;
                this.showTextTools();
            } else this.selected = true;
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_DOWN, (mevent) => {
            if(this.selected === false) return;
            this.mousedown(mevent);
        });

        dispatcher.addListener(MEVENT_KINDS.MOUSE_MOVE, (mevent) => {
            if(this.selected === false) return;
            this.mousemove(mevent);
        });
    
        dispatcher.addListener(MEVENT_KINDS.MOUSE_UP, (mevent) => {
            if(this.selected === false) return;
            this.mouseup(mevent);
        });

        dispatcher.addListener(MEVENT_KINDS.CONTROL_KEY_PRESSED, (mevent) => {
            if(this.selected === false) return;
            this.controlKeyPressed = true;
        });

        dispatcher.addListener(MEVENT_KINDS.CONTROL_KEY_RELEASED, (mevent) => {
            if(this.selected === false) return;
            this.controlKeyPressed = false;
        });

        dispatcher.addListener(MEVENT_KINDS.RETURN_KEY_PRESSED, (mevent) => {
            if(this.selected === false) return;
            this.onReturnKeyPressed(mevent, getPoints());
        });

        dispatcher.addListener(MEVENT_KINDS.BACK_SPACE_PRESSED, (mevent) => {
            if(this.selected === false) return;
            this.writeText('', true, this.selected);
        });

        dispatcher.addListener(MEVENT_KINDS.KEY_PRESS, (mevent) => {
            if(this.selected === false) return;
            this.writeText(mevent.value.charactor, false, this.selected);
        });

        dispatcher.addListener(MEVENT_KINDS.CNTL_i_PRESSED, (mevent) => {
            if(this.selected === false) return;
            this.showTextTools();
        });

        dispatcher.addListener(MEVENT_KINDS.TEXT_PASTED, (mevent) => {
            if(this.selected === false) return;
            this.writeText(mevent.value.pastedText, false, this.selected);
        });
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

    writeText = (keyPressed, isBackKeyPressed, selected = false) => {
        if (!selected) return;

        if (isBackKeyPressed) {
            this.text = this.text.substr(0, this.text.length - 1);
            this.fillText(this.text, selected);
            return;
        }

        this.text += keyPressed;
        this.fillText(this.text, selected);
    }

    fillText = (text, selected = false) => {
        if (!selected) return;

        this.tempContext.clearRect(0, 0, this.tempContext.canvas.width, this.tempContext.canvas.height);

        var options = this.getOptions();
        drawHelper.handleOptions(this.tempContext, options);
        this.tempContext.fillStyle = this.getFillColor(options[2]);
        this.tempContext.font = this.selectedFontSize + 'px "' + this.selectedFontFamily + '"';

        this.tempContext.fillText(text, this.x, this.y);
    }

    blinkCursor = (selected = false) => {
        this.index++;
        if (this.index % 2 == 0) {
            this.fillText(this.text + '|', selected);
        } else {
            this.fillText(this.text, selected);
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

    mousedown = (mevent) => {
        if (!this.selected) return;

        var points = getPoints();

        if (this.text.length) {
            this.appendPoints(points);
            drawHelper.redraw(this.context, this.tempContext, getPoints());
        }

        this.x = this.y = 0;
        this.text = '';

        this.pageX = mevent.wevt.pageX;
        this.pageY = mevent.wevt.pageY;

        this.x = mevent.wevt.pageX - this.canvas.offsetLeft - 5;
        this.y = mevent.wevt.pageY - this.canvas.offsetTop + 10;

        if (typeof this.blinkCursorInterval !== 'undefined') {
            clearInterval(this.blinkCursorInterval);
        }

        this.blinkCursor(this.selected);
        this.blinkCursorInterval = setInterval(() =>  this.blinkCursor(this.selected), 700);

        this.showTextTools(true);
    }

    mouseup = function(mevent) {}
    mousemove = function(mevent) {}

    showOrHideTextTools = (show) => {
        var infobox = document.getElementById("text-infobox");
        if(!infobox) return;

        infobox.id = "text-infobox";
        infobox.style.left = this.x + 'px';
        infobox.style.top = (this.y+5) + 'px';
        infobox.style.backgroundColor = '#000000';
        infobox.style.color = '#FFFFFF';
        infobox.innerHTML = "Type you want. Your choices are <br/>";
        infobox.innerHTML += "<b>" + this.selectedFontFamily + ", " + this.selectedFontSize + ", " + this.fillStyle + "</b>";

        this.infoboxOpen = !this.infoboxOpen;
        if(show === 'hide') infobox.style.display = 'none';
        else infobox.style.display = 'block';
    }

    showTextTools = (show) => {
        // if (!this.fontFamilyBox || !this.fontSizeBox) return;

        // this.unselectAllFontFamilies();
        // this.unselectAllFontSizes();

        this.showOrHideTextTools(show || (this.selected && this.infoboxOpen === false) ? 'show' : 'hide');

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

    onReturnKeyPressed = (mevent) => {
        if (!this.text || !this.text.length) return;
        var fontSize = parseInt(this.selectedFontSize) || 15;
        mevent.wevt.pageX = this.pageX;
        mevent.wevt.pageY = this.pageY + fontSize + 5;
        this.mousedown(mevent);
        drawHelper.redraw(this.context, this.tempContext, getPoints());
    }
}

const createTextHandler = (context, tempContext) => {
    if(textHandler === undefined) {
        textHandler = new TextHandler(context, tempContext);
        setTextHandler(textHandler);
    }
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
    textHandler.updateOptions(options);
}

export {
    createTextHandler,
    onFontChanged,
    onFontSizeChanged,
    onTextColorChanged,
    onTextOptionsChanged
}