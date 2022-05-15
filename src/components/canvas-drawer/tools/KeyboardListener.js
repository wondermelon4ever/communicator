import { addEvent, find } from '../util/Utils'
import { dispatch, MEVENT_KINDS } from '../mevent/MeventDispatcher';

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_RETURN = 13;
const KEY_SHIFT = 16;
const KEY_CONTROL = 17;
const KEY_ALT = 18;
const KEY_PAUSE = 19;
const KEY_CAPS_LOCK = 20;
const KEY_ESC = 27;
const KEY_DELETE = 46;
const KEY_a = 65;
const KEY_c = 67;
const KEY_i = 73;
const KEY_v = 86;
const KEY_y = 89;
const KEY_z = 90;

var keyboardListener = undefined;
class KeyboardListener {

    constructor() {
        console.log("key board listener started...");
        this.isControlKeyPressed = false;
        this.keyCode;
        this.inited = false;
        keyboardListener = this;

        this.addKeyboardEventListener();
    }

    addKeyboardEventListener () {
        if(this.inited === true) return;
    
        addEvent(document, 'keydown', this.onKeyDown);
        addEvent(document, 'keyup', this.onKeyUp);
        addEvent(document, 'keypress', this.onKeyPress);
        addEvent(document, 'paste', this.onTextFromClipboard);
    
        this.inited = true;
    }

    onKeyDown (e) {
        this.keyCode = e.which || e.keyCode || 0;
        if (this.keyCode == KEY_BACKSPACE || this.keyCode == KEY_DELETE) {
            if (isBackKey(e, this.keyCode));
            return;
        }
        if (e.metaKey) {
            this.isControlKeyPressed = true;
            this.keyCode = KEY_CONTROL;
        }
    
        if (!this.isControlKeyPressed && this.keyCode === KEY_CONTROL) {
            this.isControlKeyPressed = true;
            dispatch(makeMevent(e, MEVENT_KINDS.CONTROL_KEY_PRESSED, this.keyCode));
        }
    }

    onKeyUp (e) {
        if (e.which == null && (e.charCode != null || e.keyCode != null)) {
            e.which = e.charCode != null ? e.charCode : e.keyCode;
        }
        
        this.keyCode = e.which || e.keyCode || 0;
        if (this.keyCode === KEY_RETURN) {
            dispatch(makeMevent(e, MEVENT_KINDS.RETURN_KEY_PRESSED, this.keyCode));
            return;
        }

        if (this.keyCode == KEY_BACKSPACE || this.keyCode == KEY_DELETE) {
            if (isBackKey(e, this.keyCode)) {
                dispatch(makeMevent(e, MEVENT_KINDS.BACK_SPACE_PRESSED, this.keyCode));
            }
            return;
        }

        if (this.isControlKeyPressed && this.keyCode === KEY_a) {
            dispatch(makeMevent(e, MEVENT_KINDS.CNTL_a_PRESSED, this.keyCode));
        }
    
        if (this.isControlKeyPressed && this.keyCode === KEY_c) {
            dispatch(makeMevent(e, MEVENT_KINDS.CNTL_c_PRESSED, this.keyCode));
        }

        if (this.isControlKeyPressed && this.keyCode === KEY_i) {
            dispatch(makeMevent(e, MEVENT_KINDS.CNTL_i_PRESSED, this.keyCode));
            return;
        }
    
        if (this.isControlKeyPressed && this.keyCode === KEY_v) {
            dispatch(makeMevent(e, MEVENT_KINDS.CNTL_v_PRESSED, this.keyCode));
        }

        if (this.isControlKeyPressed && this.keyCode === KEY_y) {
            dispatch(makeMevent(e, MEVENT_KINDS.CNTL_y_PRESSED, this.keyCode));
        }

        if (this.isControlKeyPressed && this.keyCode === KEY_z) {
            dispatch(makeMevent(e, MEVENT_KINDS.CNTL_z_PRESSED, this.keyCode));
        }
    
        if (typeof e.metaKey !== 'undefined' && e.metaKey === false) {
            this.isControlKeyPressed = false;
            this.keyCode = KEY_CONTROL;
        }
    
        if (this.keyCode === KEY_CONTROL) {
            this.isControlKeyPressed = false;
            dispatch(makeMevent(e, MEVENT_KINDS.CONTROL_KEY_RELEASED, this.keyCode));
        }
    }

    onKeyPress (e) {
        if (e.which == null && (e.charCode != null || e.keyCode != null)) {
            e.which = e.charCode != null ? e.charCode : e.keyCode;
        }
    
        this.keyCode = e.which || e.keyCode || 0;
    
        var inp = String.fromCharCode(this.keyCode);
        if (/[a-zA-Z0-9-_ !?|\/'",.=:;(){}\[\]`~@#$%^&*+-]/.test(inp)) {
            dispatch({
                kind: MEVENT_KINDS.KEY_PRESS,
                name: "",
                description: "",
                wevt: e,
                value: {
                    keyCode: this.keyCode,
                    charactor: inp
                }
            });
        }
    }

    onTextFromClipboard(e) {
        var pastedText = undefined;
        if (window.clipboardData && window.clipboardData.getData) { // IE
            pastedText = window.clipboardData.getData('Text');
        } else if (e.clipboardData && e.clipboardData.getData) {
            pastedText = e.clipboardData.getData('text/plain');
        }
        if (pastedText && pastedText.length) {
            dispatch({
                kind: MEVENT_KINDS.TEXT_PASTED,
                name: "",
                description: "",
                wevt: e,
                value: {
                    pastedText: pastedText,
                }
            });
        }
    }
}

function makeMevent(e, kind, keyCode) {
    return {
        kind: kind,
        name: "",
        description: "",
        wevt: e,
        value: {
            keyCode: keyCode
        }
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

function initKeyboardEventListener () {
    if(keyboardListener === undefined) keyboardListener = new KeyboardListener();
    keyboardListener.addKeyboardEventListener();
}

export default initKeyboardEventListener;