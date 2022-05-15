
var selector = undefined;
export default class FileSelector {

    constructor () {
        this.selector = this;
        this.selector.selectSingleFile = this.selectFile;
        this.selector.selectMultipleFiles = (callback) => {
            selectFile(callback, true);
        }
    }

    selectFile = (callback, multiple, accept) => {
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
        this.fireClickEvent(file);
    }

    fireClickEvent = (element) => {
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
}
