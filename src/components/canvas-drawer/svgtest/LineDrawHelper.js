

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
    var qu = 25;
    var bp = new Array();
    var t=1/qu;
    bp.push({ x: x0, y: y0});
    for(var k=1;k<qu;k++) {
        t+=1/qu;
        var x = (1-t)*((1-t)*x0+t*cx1)+t*((1-t)*cx1+t*x1), y = (1-t)*((1-t)*y0+t*cy1)+t*((1-t)*cy1+t*y1);
        bp.push({ x: x, y: y });
    }
    return bp[12];
};

const getCenterBeizerPoint = (x0, y0, cx1, cy1, x1, y1) => {
    var xu = 0.0 , yu = 0.0 , u = 0.5; 
    var i = 0 ; 
    // for(u = 0.0 ; u <= 1.0 ; u += 0.05) { 
        xu = Math.pow(1-u,3)*x0+3*u*Math.pow(1-u,2)*cx1+3*Math.pow(u,2)*(1-u)*x1; 
        yu = Math.pow(1-u,3)*y0+3*u*Math.pow(1-u,2)*cy1+3*Math.pow(u,2)*(1-u)*y1;
    // }
    return { x: xu, y: yu };
}

const createPath = (prev, controlPoint, next, lineKind) => {
    var path = "M"+prev.x+","+prev.y+" ";
    if(lineKind === "Curve") {
        path += "Q"+controlPoint.x+","+controlPoint.y+","+next.x+","+next.y+" ";
    } else if(lineKind === "Straight") {
        path += "L"+prev.x+","+prev.y+","+next.x+","+next.y+" ";
    }
    return path;
}

const calculateTwoCenterPoints = (prev, node, next, lineKind) => {
    var centerPoints = [];
    if(lineKind === "Curve") {
        var bezierPoints = getControlPoints(prev.x, prev.y, node.x, node.y, next.x, next.y, 0.5);
        var center1 = getCenterQuadraticPoint(prev.x, prev.y, bezierPoints[0], bezierPoints[1], node.x, node.y);
        var center2 = getCenterQuadraticPoint(node.x, node.y, bezierPoints[2], bezierPoints[3], next.x, next.y);
        
        centerPoints.push({
            x: center1.x,
            y: center1.y,
            cx: bezierPoints[0],
            cy: bezierPoints[1]
        });
        centerPoints.push({
            x: center2.x,
            y: center2.y,
            cx: bezierPoints[2],
            cy: bezierPoints[3]
        });

    } else if(lineKind === "Straight") {
        centerPoints.push({
            x: (prev.x+node.x)/2,
            y: (prev.y+node.y)/2
        });
        centerPoints.push({
            x: (node.x+next.x)/2,
            y: (node.y+next.y)/2
        });
    }

    return centerPoints;
}

export {
    calculateTwoCenterPoints,
    createPath,
    getControlPoints,
    getCenterQuadraticPoint
}
