var colors = [
    ['FFFFFF', '006600', '000099', 'CC0000', '8C4600'],
    ['CCCCCC', '00CC00', '6633CC', 'FF0000', 'B28500'],
    ['666666', '66FFB2', '006DD9', 'FF7373', 'FF9933'],
    ['333333', '26FF26', '6699FF', 'CC33FF', 'FFCC99'],
    ['000000', 'CCFF99', 'BFDFFF', 'FFBFBF', 'FFFF33']
];

function addEvent(element, eventType, callback) {
    if (eventType.split(' ').length > 1) {
        var events = eventType.split(' ');
        for (var i = 0; i < events.length; i++) {
            addEvent(element, events[i], callback);
        }
        return;
    }

    if (element.addEventListener) {
        element.addEventListener(eventType, callback, !1);
        return true;
    } else if (element.attachEvent) {
        return element.attachEvent('on' + eventType, callback);
    } else {
        element['on' + eventType] = callback;
    }
    return this;
}

function find(selector) {
    return document.getElementById(selector);
}

function getContext(id) {
    var canv = find(id), ctx = canv.getContext('2d');

    canv.setAttribute('width' , innerWidth);
    canv.setAttribute('height', innerHeight);

    // ctx.lineWidth = lineWidth;
    ctx.lineWidth = 2;
    // ctx.strokeStyle = strokeStyle;
    ctx.strokeStyle = '#6c96c8';
    // ctx.fillStyle = fillStyle;
    ctx.fillStyle = 'rgba(0,0,0,0)';
        // ctx.font = font;
    ctx.font = '15px "Arial"';

    return ctx;
}

function clone(obj) {
    if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}

function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

function hexToR(h) {
    return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h) {
    return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h) {
    return parseInt((cutHex(h)).substring(4, 6), 16)
}

function hexToRGB(h) {
    return [
        hexToR(h),
        hexToG(h),
        hexToB(h)
    ]
}

function hexToRGBA(h, alpha) {
    return 'rgba(' + hexToRGB(h).join(',') + ',1)';
}

function hideContainers() {
    var additionalContainer = find('additional-container'),
        colorsContainer = find('colors-container'),
        markerContainer = find('marker-container'),
        markerColorContainer = find('marker-fill-colors'),
        pencilContainer = find('pencil-container'),
        pencilColorContainer = find('pencil-fill-colors'),
        lineWidthContainer = find('line-width-container');

    additionalContainer.style.display =
        colorsContainer.style.display =
        markerColorContainer.style.display =
        markerContainer.style.display =
        pencilColorContainer.style.display =
        pencilContainer.style.display =
        lineWidthContainer.style.display = 'none';
}

var uid;

function syncData(data) {
    console.log("$$$$$$ data.uid=>" + data.uid);
    window.parent.postMessage({
        canvasDesignerSyncData: data,
        uid: uid
    }, '*');
}


export {
    addEvent,
    clone,
    colors,
    find,
    getContext,
    hexToRGB,
    hexToRGBA,
    hideContainers,
    // syncData
}
