import { getPoints } from '../views/CanvasTemp';
import drawHelper from './DrawHelper';

export default class ShapeHandler {

    static lastPointIndex = 0;
    static uid;

    constructor(context, tempContext) {
        this.context = context;
        this.tempContext = tempContext;
        this.canvas = tempContext.canvas;
        this.init();
    }

    init () {
        window.addEventListener('message', (event) => {
            if (!event.data) return;
            if (!ShapeHandler.uid) ShapeHandler.uid = event.data.uid;
    
            if (event.data.captureStream) {
                // webrtcHandler.createOffer(function(sdp) {
                //     sdp.uid = uid;
                //     window.parent.postMessage(sdp, '*');
                // });
                return;
            }
    
            if (event.data.renderStream) {
                this.setTemporaryLine();
                return;
            }
    
            if (event.data.sdp) {
                // webrtcHandler.setRemoteDescription(event.data);
                return;
            }
    
            if (event.data.genDataURL) {
                var dataURL = context.canvas.toDataURL(event.data.format, 1);
                window.parent.postMessage({
                    dataURL: dataURL,
                    uid: uid
                }, '*');
                return;
            }
            
            var points = getPoints();
            if (event.data.undo && points.length) {
                var index = event.data.index;
    
                if (index === 'all') {
                    points = [];
                    drawHelper.redraw(this.context, this.tempContext, points);
                    this.syncPoints(true);
                    return;
                }
    
                if (index.numberOfLastShapes) {
                    try {
                        points.length -= index.numberOfLastShapes;
                    } catch (e) {
                        points = [];
                    }
    
                    drawHelper.redraw(this.context, this.tempContext, points);
                    this.syncPoints(true);
                    return;
                }
    
                if (index === -1) {
                    points.length = points.length - 1;
                    drawHelper.redraw();
                    this.syncPoints(true);
                    return;
                }
    
                if (points[index]) {
                    var newPoints = [];
                    for (var i = 0; i < points.length; i++) {
                        if (i !== index) {
                            newPoints.push(points[i]);
                        }
                    }
                    points = newPoints;
                    drawHelper.redraw(this.context, this.tempContext, points);
                    this.syncPoints(true);
                }
                return;
            }
    
            if (event.data.syncPoints) {
                this.syncPoints(true);
                return;
            }
    
            if (event.data.clearCanvas) {
                points = [];
                drawHelper.redraw(this.context, this.tempContext, points);
                return;
            }
    
            if (!event.data.canvasDesignerSyncData) return;
    
            // drawing is shared here (array of points)
            var d = event.data.canvasDesignerSyncData;
    
            if (d.startIndex !== 0) {
                for (var i = 0; i < d.points.length; i++) {
                    points[i + d.startIndex] = d.points[i];
                }
            } else {
                points = d.points;
            }
    
            ShapeHandler.lastPointIndex = points.length;
    
            // redraw the <canvas> surfaces
            drawHelper.redraw(this.context, this.tempContext, points);
        }, false);
    }

    setTemporaryLine() {
        var arr = ["line", [139, 261, 170, 219],
            [1, "rgba(0,0,0,0)", "rgba(0,0,0,0)", 1, "source-over", "round", "round", "15px \"Arial\""]
        ];
        getPoints().push(arr);
        drawHelper.redraw(this.context, this.tempContext, points);

        setTimeout(function() {
            // setSelection(document.getElementById('line'), 'Line');
        }, 1000);

        // setTimeout(setDefaultSelectedIcon, 2000);
    }

    syncPoints(isSyncAll) {
        var points = getPoints();
        if (isSyncAll) ShapeHandler.lastPointIndex = 0;

        if (ShapeHandler.lastPointIndex === points.length) return;
        
        var pointsToShare = [];
        for (var i = ShapeHandler.lastPointIndex; i < points.length; i++) {
            pointsToShare[i - ShapeHandler.lastPointIndex] = points[i];
        }

        if (pointsToShare.length) {
            this.syncData({
                points: pointsToShare || [],
                startIndex: ShapeHandler.lastPointIndex
            });
        }

        if (!pointsToShare.length && points.length) return;

        ShapeHandler.lastPointIndex = points.length;
    }

    syncData(data) {
        window.parent.postMessage({
            canvasDesignerSyncData: data,
            uid: ShapeHandler.uid
        }, '*');
    }
}
