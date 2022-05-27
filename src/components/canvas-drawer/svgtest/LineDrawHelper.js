

const getControlPoints = (x0, y0, x1, y1, x2, y2, t) => {
    var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
    var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    var fa=t*d01/(d01+d12);
    var fb=t-fa;
    var p1x=x1+fa*(x0-x2), p1y=y1+fa*(y0-y2);
    var p2x=x1-fb*(x0-x2), p2y=y1-fb*(y0-y2);
    return [p1x,p1y,p2x,p2y];
};

const getCenterQuadraticPoint = (x0, y0, cx1, cy1, x1, y1) => {
    var qu = 20;
    var bp = new Array();
    var t=1/qu;
    bp.push({ x: x0, y: y0});
    for(var k=1;k<qu;k++) {
        t+=1/qu;
        var x = (1-t)*((1-t)*x0+t*cx1)+t*((1-t)*cx1+t*x1), y = (1-t)*((1-t)*y0+t*cy1)+t*((1-t)*cy1+t*y1);
        bp.push({ x: x, y: y });
    }
    return bp[11];
};

const createPath = (prev, node, next, lineKind) => {
    var path = "";
    if(lineKind === "Curve") {
        path += "L"+prev.x+","+prev.y+","+node.x+","+node.y+","+next.x+","+next.y+" ";
    } else if(lineKind === "Straight") {
        
    }
    return path;
}

const calculateCenterPoint = (prevPoint, controlPoint, nextPoint) => {

}

export {
    calculateCenterPoint,
    createPath,
    getControlPoints,
    getCenterQuadraticPoint
}
