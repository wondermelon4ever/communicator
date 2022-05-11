import drawHelper from "../../common/helpers/DrawHelper";

export default class DragHelper {

    constructor(context, tempContext, getIsControlKeyPressed, setIsControlKeypressed, copy, paste, getPoints) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.getIsControlKeyPressed = getIsControlKeyPressed;
        this.setIsControlKeypressed = setIsControlKeypressed;
        this.copy = copy;
        this.paste= paste;
        this.getPoints = getPoints
    }

    global = {
        prevX: 0,
        prevY: 0,
        ismousedown: false,
        pointsToMove: 'all',
        startingIndex: 0
    }

    mousedown = (e, points, isDragAllPaths, isDragLastPath) => {
        if (this.getIsControlKeyPressed()) {
            this.copy();
            this.paste();
            this.setIsControlKeypressed(false);
        }

        var g = this.global;

        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop;

        g.prevX = x;
        g.prevY = y;

        g.pointsToMove = 'all';

        if (points.length) {
            var p = points[points.length - 1],
                point = p[1];

            if (p[0] === 'line') {

                if (this.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'head';
                }

                if (this.isPointInPath(x, y, point[2], point[3])) {
                    g.pointsToMove = 'tail';
                }
            }

            if (p[0] === 'arrow') {

                if (this.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'head';
                }

                if (this.isPointInPath(x, y, point[2], point[3])) {
                    g.pointsToMove = 'tail';
                }
            }

            if (p[0] === 'rect') {

                if (this.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'stretch-first';
                }

                if (this.isPointInPath(x, y, point[0] + point[2], point[1])) {
                    g.pointsToMove = 'stretch-second';
                }

                if (this.isPointInPath(x, y, point[0], point[1] + point[3])) {
                    g.pointsToMove = 'stretch-third';
                }

                if (this.isPointInPath(x, y, point[0] + point[2], point[1] + point[3])) {
                    g.pointsToMove = 'stretch-last';
                }
            }

            if (p[0] === 'image') {

                if (this.isPointInPath(x, y, point[1], point[2])) {
                    g.pointsToMove = 'stretch-first';
                }

                if (this.isPointInPath(x, y, point[1] + point[3], point[2])) {
                    g.pointsToMove = 'stretch-second';
                }

                if (this.isPointInPath(x, y, point[1], point[2] + point[4])) {
                    g.pointsToMove = 'stretch-third';
                }

                if (this.isPointInPath(x, y, point[1] + point[3], point[2] + point[4])) {
                    g.pointsToMove = 'stretch-last';
                }
            }

            if (p[0] === 'pdf') {

                if (this.isPointInPath(x, y, point[1], point[2])) {
                    g.pointsToMove = 'stretch-first';
                }

                if (this.isPointInPath(x, y, point[1] + point[3], point[2])) {
                    g.pointsToMove = 'stretch-second';
                }

                if (this.isPointInPath(x, y, point[1], point[2] + point[4])) {
                    g.pointsToMove = 'stretch-third';
                }

                if (this.isPointInPath(x, y, point[1] + point[3], point[2] + point[4])) {
                    g.pointsToMove = 'stretch-last';
                }
            }

            if (p[0] === 'quadratic') {

                if (this.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'starting-points';
                }

                if (this.isPointInPath(x, y, point[2], point[3])) {
                    g.pointsToMove = 'control-points';
                }

                if (this.isPointInPath(x, y, point[4], point[5])) {
                    g.pointsToMove = 'ending-points';
                }
            }

            if (p[0] === 'bezier') {

                if (this.isPointInPath(x, y, point[0], point[1])) {
                    g.pointsToMove = 'starting-points';
                }

                if (dHelper.isPointInPath(x, y, point[2], point[3])) {
                    g.pointsToMove = '1st-control-points';
                }

                if (this.isPointInPath(x, y, point[4], point[5])) {
                    g.pointsToMove = '2nd-control-points';
                }

                if (this.isPointInPath(x, y, point[6], point[7])) {
                    g.pointsToMove = 'ending-points';
                }
            }
        }

        g.ismousedown = true;
    }

    mouseup = (e, points, isDragLastPath) => {
        var g = this.global;

        if (isDragLastPath) {
            this.tempContext.clearRect(0, 0, innerWidth, innerHeight);
            this.context.clearRect(0, 0, innerWidth, innerHeight);
            this.end(points);
        }

        g.ismousedown = false;
    }

    mousemove = (e, points, isDragAllPath, isDragLastPath) => {
        var x = e.pageX - this.canvas.offsetLeft,
            y = e.pageY - this.canvas.offsetTop,
            g = this.global;
        drawHelper.redraw(this.context, this.tempContext, points);

        if (g.ismousedown) {
            this.dragShape(x, y, isDragAllPath, isDragLastPath);
        }

        if (isDragLastPath) this.init(points);
    }

    init = (points) => {
        if (!points.length) return;

        var p = points[points.length - 1],
            point = p[1],
            g = this.global;

        if (g.ismousedown) this.tempContext.fillStyle = 'rgba(255,85 ,154,.9)';
        else this.tempContext.fillStyle = 'rgba(255,85 ,154,.4)';

        if (p[0] === 'quadratic') {

            this.tempContext.beginPath();

            this.tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            this.tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);
            this.tempContext.arc(point[4], point[5], 10, Math.PI * 2, 0, !1);

            this.tempContext.fill();
        }

        if (p[0] === 'bezier') {

            this.tempContext.beginPath();

            this.tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            this.tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);
            this.tempContext.arc(point[4], point[5], 10, Math.PI * 2, 0, !1);
            this.tempContext.arc(point[6], point[7], 10, Math.PI * 2, 0, !1);

            this.tempContext.fill();
        }

        if (p[0] === 'line') {

            this.tempContext.beginPath();

            this.tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            this.tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);

            this.tempContext.fill();
        }

        if (p[0] === 'arrow') {

            this.tempContext.beginPath();

            this.tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            this.tempContext.arc(point[2], point[3], 10, Math.PI * 2, 0, !1);

            this.tempContext.fill();
        }

        if (p[0] === 'text') {
            this.tempContext.font = "15px Verdana";
            this.tempContext.fillText(point[0], point[1], point[2]);
        }

        if (p[0] === 'rect') {

            this.tempContext.beginPath();
            this.tempContext.arc(point[0], point[1], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[0] + point[2], point[1], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[0], point[1] + point[3], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[0] + point[2], point[1] + point[3], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();
        }

        if (p[0] === 'image') {
            this.tempContext.beginPath();
            this.tempContext.arc(point[1], point[2], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[1] + point[3], point[2], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[1], point[2] + point[4], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[1] + point[3], point[2] + point[4], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();
        }

        if (p[0] === 'pdf') {
            this.tempContext.beginPath();
            this.tempContext.arc(point[1], point[2], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[1] + point[3], point[2], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[1], point[2] + point[4], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();

            this.tempContext.beginPath();
            this.tempContext.arc(point[1] + point[3], point[2] + point[4], 10, Math.PI * 2, 0, !1);
            this.tempContext.fill();
        }
    }

    isPointInPath = (x, y, first, second) => {
        return x > first - 10 && x < first + 10 && y > second - 10 && y < second + 10;
    }

    getPoint = (point, prev, otherPoint) => {
        if (point > prev) {
            point = otherPoint + (point - prev);
        } else {
            point = otherPoint - (prev - point);
        }

        return point;
    }

    getXYWidthHeight = (x, y, prevX, prevY, oldPoints) => {
        if (oldPoints.pointsToMove == 'stretch-first') {
            if (x > prevX) {
                oldPoints.x = oldPoints.x + (x - prevX);
                oldPoints.width = oldPoints.width - (x - prevX);
            } else {
                oldPoints.x = oldPoints.x - (prevX - x);
                oldPoints.width = oldPoints.width + (prevX - x);
            }

            if (y > prevY) {
                oldPoints.y = oldPoints.y + (y - prevY);
                oldPoints.height = oldPoints.height - (y - prevY);
            } else {
                oldPoints.y = oldPoints.y - (prevY - y);
                oldPoints.height = oldPoints.height + (prevY - y);
            }
        }

        if (oldPoints.pointsToMove == 'stretch-second') {
            if (x > prevX) {
                oldPoints.width = oldPoints.width + (x - prevX);
            } else {
                oldPoints.width = oldPoints.width - (prevX - x);
            }

            if (y < prevY) {
                oldPoints.y = oldPoints.y + (y - prevY);
                oldPoints.height = oldPoints.height - (y - prevY);
            } else {
                oldPoints.y = oldPoints.y - (prevY - y);
                oldPoints.height = oldPoints.height + (prevY - y);
            }
        }

        if (oldPoints.pointsToMove == 'stretch-third') {
            if (x > prevX) {
                oldPoints.x = oldPoints.x + (x - prevX);
                oldPoints.width = oldPoints.width - (x - prevX);
            } else {
                oldPoints.x = oldPoints.x - (prevX - x);
                oldPoints.width = oldPoints.width + (prevX - x);
            }

            if (y < prevY) {
                oldPoints.height = oldPoints.height + (y - prevY);
            } else {
                oldPoints.height = oldPoints.height - (prevY - y);
            }
        }

        return oldPoints;
    }

    dragShape = (x, y, isDragAllPaths, isDragLastPath) => {
        if (!this.global.ismousedown) return;

        this.tempContext.clearRect(0, 0, innerWidth, innerHeight);

        if (isDragLastPath) {
            this.dragLastPath(x, y, this.getPoints());
        }

        if (isDragAllPaths) {
            this.dragAllPaths(x, y, this.getPoints());
        }

        var g = this.global;

        g.prevX = x;
        g.prevY = y;
    }

    end = (points) => {
        if (!points.length) return;

        this.tempContext.clearRect(0, 0, innerWidth, innerHeight);

        var point = points[points.length - 1];
        drawHelper[point[0]](this.context, point[1], point[2]);
    }

    dragAllPaths = (x, y, points) => {
        var g = this.global,
            prevX = g.prevX,
            prevY = g.prevY,
            p, point,
            length = points.length,
            getPoint = this.getPoint,
            i = g.startingIndex;

        for (i; i < length; i++) {
            p = points[i];
            point = p[1];

            if (p[0] === 'line') {
                points[i] = [p[0],
                    [
                        getPoint(x, prevX, point[0]),
                        getPoint(y, prevY, point[1]),
                        getPoint(x, prevX, point[2]),
                        getPoint(y, prevY, point[3])
                    ], p[2]
                ];
            }

            if (p[0] === 'arrow') {
                points[i] = [p[0],
                    [
                        getPoint(x, prevX, point[0]),
                        getPoint(y, prevY, point[1]),
                        getPoint(x, prevX, point[2]),
                        getPoint(y, prevY, point[3])
                    ], p[2]
                ];
            }

            if (p[0] === 'text') {
                points[i] = [p[0],
                    [
                        point[0],
                        getPoint(x, prevX, point[1]),
                        getPoint(y, prevY, point[2])
                    ], p[2]
                ];
            }

            if (p[0] === 'arc') {
                points[i] = [p[0],
                    [
                        getPoint(x, prevX, point[0]),
                        getPoint(y, prevY, point[1]),
                        point[2],
                        point[3],
                        point[4]
                    ], p[2]
                ];
            }

            if (p[0] === 'rect') {
                points[i] = [p[0],
                    [
                        getPoint(x, prevX, point[0]),
                        getPoint(y, prevY, point[1]),
                        point[2],
                        point[3]
                    ], p[2]
                ];
            }

            if (p[0] === 'image') {
                points[i] = [p[0],
                    [
                        point[0],
                        getPoint(x, prevX, point[1]),
                        getPoint(y, prevY, point[2]),
                        point[3],
                        point[4],
                        point[5]
                    ], p[2]
                ];
            }

            if (p[0] === 'pdf') {
                points[i] = [p[0],
                    [
                        point[0],
                        getPoint(x, prevX, point[1]),
                        getPoint(y, prevY, point[2]),
                        point[3],
                        point[4],
                        point[5]
                    ], p[2]
                ];
            }

            if (p[0] === 'quadratic') {
                points[i] = [p[0],
                    [
                        getPoint(x, prevX, point[0]),
                        getPoint(y, prevY, point[1]),
                        getPoint(x, prevX, point[2]),
                        getPoint(y, prevY, point[3]),
                        getPoint(x, prevX, point[4]),
                        getPoint(y, prevY, point[5])
                    ], p[2]
                ];
            }

            if (p[0] === 'bezier') {
                points[i] = [p[0],
                    [
                        getPoint(x, prevX, point[0]),
                        getPoint(y, prevY, point[1]),
                        getPoint(x, prevX, point[2]),
                        getPoint(y, prevY, point[3]),
                        getPoint(x, prevX, point[4]),
                        getPoint(y, prevY, point[5]),
                        getPoint(x, prevX, point[6]),
                        getPoint(y, prevY, point[7])
                    ], p[2]
                ];
            }
        }
    }

    dragLastPath = (x, y, points) => {
        // if last past is undefined?
        if (!points[points.length - 1]) return;

        var g = this.global,
            prevX = g.prevX,
            prevY = g.prevY,
            p = points[points.length - 1],
            point = p[1],
            getPoint = this.getPoint,
            getXYWidthHeight = this.getXYWidthHeight,
            isMoveAllPoints = g.pointsToMove === 'all';

        if (p[0] === 'line') {

            if (g.pointsToMove === 'head' || isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === 'tail' || isMoveAllPoints) {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'arrow') {

            if (g.pointsToMove === 'head' || isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === 'tail' || isMoveAllPoints) {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'text') {

            if (g.pointsToMove === 'head' || isMoveAllPoints) {
                point[1] = getPoint(x, prevX, point[1]);
                point[2] = getPoint(y, prevY, point[2]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'arc') {
            point[0] = getPoint(x, prevX, point[0]);
            point[1] = getPoint(y, prevY, point[1]);

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'rect') {

            if (isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === 'stretch-first') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[0],
                    y: point[1],
                    width: point[2],
                    height: point[3],
                    pointsToMove: g.pointsToMove
                });

                point[0] = newPoints.x;
                point[1] = newPoints.y;
                point[2] = newPoints.width;
                point[3] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-second') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[0],
                    y: point[1],
                    width: point[2],
                    height: point[3],
                    pointsToMove: g.pointsToMove
                });

                point[1] = newPoints.y;
                point[2] = newPoints.width;
                point[3] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-third') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[0],
                    y: point[1],
                    width: point[2],
                    height: point[3],
                    pointsToMove: g.pointsToMove
                });

                point[0] = newPoints.x;
                point[2] = newPoints.width;
                point[3] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-last') {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'image') {

            if (isMoveAllPoints) {
                point[1] = getPoint(x, prevX, point[1]);
                point[2] = getPoint(y, prevY, point[2]);
            }

            if (g.pointsToMove === 'stretch-first') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[1],
                    y: point[2],
                    width: point[3],
                    height: point[4],
                    pointsToMove: g.pointsToMove
                });

                point[1] = newPoints.x;
                point[2] = newPoints.y;
                point[3] = newPoints.width;
                point[4] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-second') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[1],
                    y: point[2],
                    width: point[3],
                    height: point[4],
                    pointsToMove: g.pointsToMove
                });

                point[2] = newPoints.y;
                point[3] = newPoints.width;
                point[4] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-third') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[1],
                    y: point[2],
                    width: point[3],
                    height: point[4],
                    pointsToMove: g.pointsToMove
                });

                point[1] = newPoints.x;
                point[3] = newPoints.width;
                point[4] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-last') {
                point[3] = getPoint(x, prevX, point[3]);
                point[4] = getPoint(y, prevY, point[4]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'pdf') {

            if (isMoveAllPoints) {
                point[1] = getPoint(x, prevX, point[1]);
                point[2] = getPoint(y, prevY, point[2]);
            }

            if (g.pointsToMove === 'stretch-first') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[1],
                    y: point[2],
                    width: point[3],
                    height: point[4],
                    pointsToMove: g.pointsToMove
                });

                point[1] = newPoints.x;
                point[2] = newPoints.y;
                point[3] = newPoints.width;
                point[4] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-second') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[1],
                    y: point[2],
                    width: point[3],
                    height: point[4],
                    pointsToMove: g.pointsToMove
                });

                point[2] = newPoints.y;
                point[3] = newPoints.width;
                point[4] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-third') {
                var newPoints = getXYWidthHeight(x, y, prevX, prevY, {
                    x: point[1],
                    y: point[2],
                    width: point[3],
                    height: point[4],
                    pointsToMove: g.pointsToMove
                });

                point[1] = newPoints.x;
                point[3] = newPoints.width;
                point[4] = newPoints.height;
            }

            if (g.pointsToMove === 'stretch-last') {
                point[3] = getPoint(x, prevX, point[3]);
                point[4] = getPoint(y, prevY, point[4]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'quadratic') {

            if (g.pointsToMove === 'starting-points' || isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === 'control-points' || isMoveAllPoints) {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            if (g.pointsToMove === 'ending-points' || isMoveAllPoints) {
                point[4] = getPoint(x, prevX, point[4]);
                point[5] = getPoint(y, prevY, point[5]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }

        if (p[0] === 'bezier') {

            if (g.pointsToMove === 'starting-points' || isMoveAllPoints) {
                point[0] = getPoint(x, prevX, point[0]);
                point[1] = getPoint(y, prevY, point[1]);
            }

            if (g.pointsToMove === '1st-control-points' || isMoveAllPoints) {
                point[2] = getPoint(x, prevX, point[2]);
                point[3] = getPoint(y, prevY, point[3]);
            }

            if (g.pointsToMove === '2nd-control-points' || isMoveAllPoints) {
                point[4] = getPoint(x, prevX, point[4]);
                point[5] = getPoint(y, prevY, point[5]);
            }

            if (g.pointsToMove === 'ending-points' || isMoveAllPoints) {
                point[6] = getPoint(x, prevX, point[6]);
                point[7] = getPoint(y, prevY, point[7]);
            }

            points[points.length - 1] = [p[0], point, p[2]];
        }
    }
}
