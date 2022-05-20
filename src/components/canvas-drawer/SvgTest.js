import { ThreeSixty } from '@mui/icons-material';
import React from 'react';
import Circle from './Circle';

class SvgTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mousedowned: false,
            circles: [],
            path1: "",
            path2: "" 
        }

        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.onPositionChanged = this.onPositionChanged.bind(this);
        this.updatePath = this.updatePath.bind(this);
        this.getControlPoints =  this.getControlPoints.bind(this);
    }

    componentDidMount() {
        var circles = [];
        circles.push({
            id: 0,
            position: { x: "70", y: "170" },
            radius: "4",
            stroke: "black",
            strokeWidth: "2",
            fill: "white",
            confirmed: true
        });
        circles.push({
            id: 1,
            position: { x: "110", y: "170" },
            radius: "4",
            stroke: "black",
            strokeWidth: "2",
            fill: "red",
            confirmed: false
        });
        circles.push({
            id: 2,
            position: { x: "150", y: "170" },
            radius: "4",
            stroke: "black",
            strokeWidth: "2",
            fill: "white",
            confirmed: true
        });

        var path1 = "M"+circles[0].position.x+","+circles[0].position.y+" ";
        path1 += "L"+circles[2].position.x+","+circles[2].position.y;

        this.setState({
            ...this.state,
            circles: circles,
            path1: path1
        });
    }

    updatePath (id, position) {
        var circles = this.state.circles;
        var circle = circles[id];
        circle.position = position;

        var controlPoint = this.getControlPoints(
            circles[0].position.x, circles[0].position.y,
            circles[1].position.x, circles[1].position.y,
            circles[2].position.x, circles[2].position.y, 0.75);

        var path1 = "M"+circles[0].position.x+","+circles[0].position.y+" ";
        path1 += "Q"+ controlPoint[0]+","+(controlPoint[1])+","+circles[1].position.x+","+circles[1].position.y;
        var path2 = "M"+circles[1].position.x+","+circles[1].position.y+" ";
        path2 += "Q"+ controlPoint[2]+","+(controlPoint[3])+","+circles[2].position.x+","+circles[2].position.y

        // path += "C"+controlPoint[0]+","+(controlPoint[1])+","+controlPoint[2]+","+(controlPoint[3])+",";
        // path += circles[2].position.x+","+circles[2].position.y;

        this.setState({
            ...this.state,
            circles: circles,
            path1: path1,
            path2: path2
        });
    }

    getControlPoints (x0, y0, x1, y1, x2, y2, t) {
        //x0~y2 는 좌표, t는 탄력(Tension)을 의미하며 곡선의 탄력을 말합니다.
        // var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
        // var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
        var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        // P1->P2 의 기울기, P2->P3의 기울기를 각각 구합니다.
        var fa=t*d01/(d01+d12);
        // 두 기울기의 합에서 첫번째 기울기를 나누고 텐션을 곱합니다. 이는 지정 좌표에서 a 점이 얼마나 떨어져있는가를 결정하는 a계수가됩니다.
        var fb=t-fa;
        // 텐션에서 a계수를 빼 b 계수를 만듭니다.
        var p1x=x1+fa*(x0-x2);
        var p1y=y1+fa*(y0-y2);
        var p2x=x1-fb*(x0-x2);
        var p2y=y1-fb*(y0-y2);
        // var p1x = (x1+x0)/2, p1y = (y1+y0)/2, p2x = (x2+x1)/2, p2y = (y2+y1)/2;
        // P1과 P3 의 거리와 계수를 곱한값을 각각 좌표에서 더하거나 뺍니다.
        return [p1x,p1y,p2x,p2y];
        // 값을 리턴합니다.
    }

    getQuadraticPoint (x0, y0, cx1, cy1, x1, y1) {
        var qu = 20;
        var bp = new Array();
        var t=1/qu;
        bp.push(x0);
        bp.push(y0);
        for(var k=1;k<qu;k++) {
            t+=1/qu;
            var x = (1-t)*((1-t)*x0+t*cx1)+t*((1-t)*cx1+t*x1);
            var y = (1-t)*((1-t)*y0+t*cy1)+t*((1-t)*cy1+t*y1);
            bp.push(x);
            bp.push(y);
        }
        return bp;
    }
   
    handleDrag (event) {
        if(this.state.mousedowned === true) {
            this.setState({
                ...this.state,
                position: {
                    x: event.pageX,
                    y: event.pageY
                }
            });    
        }
    }

    handleDragStart (event) {
        this.setState({
            ...this.state,
            mousedowned: true
        });
        document.addEventListener('mousemove', this.handleDrag, false);
    }

    handleDragEnd (event) {
        document.removeEventListener ('mousemove', this.handleDrag, false);
        this.setState({
            ...this.state,
            mousedowned: false
        });
    }

    onPositionChanged (id, position) {
        this.updatePath(id, position);
    }

    render() {
        return(
            <>
                <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg" id="bcsvg"
                    onMouseUp={ this.handleDragEnd }
                >
                    <svg
                        // onMouseDown={ this.handleDragStart }
                        // onMouseUp={ this.handleDragEnd }
                        // x={ this.state.position.x } 
                        // y={ this.state.position.y }
                    >
                        <path id="path1" d={ this.state.path1 } stroke="green" strokeWidth="2" fill="none"/>
                        <path id="path2" d={ this.state.path2 } stroke="green" strokeWidth="2" fill="none"/>
                        {
                            this.state.circles.map((cir, index)=>{
                                return(
                                    <Circle 
                                        key={ cir.id }
                                        id={ cir.id } 
                                        position={ cir.position } 
                                        radius={ cir.radius } 
                                        stroke={ cir.stroke } 
                                        strokeWidth={ cir.strokeWidth } 
                                        fill={ cir.fill }
                                        handlePositionChanged={ this.onPositionChanged }
                                        confirmed={ cir.confirmed }
                                    />
                                )
                            })
                        }
                        
                        {/* <path id="path1" d="M70 110 Q90,90,110,110" stroke="green" strokeWidth="2" fill="none"/> */}
                        {/* <path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
                        <path d="M70 10 C 70 20, 120 20, 120 10" stroke="black" fill="transparent"/>
                        <path d="M130 10 C 120 20, 180 20, 170 10" stroke="black" fill="transparent"/>
                        <path d="M10 60 C 20 80, 40 80, 50 60" stroke="black" fill="transparent"/>
                        <path d="M70 60 C 70 80, 110 80, 110 60" stroke="black" fill="transparent"/>
                        <path d="M130 60 C 120 80, 180 80, 170 60" stroke="black" fill="transparent"/>
                        <path d="M10 110 C 20 140, 40 140, 50 110" stroke="black" fill="transparent"/>
                        <path d="M70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
                        <path d="M130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent"/> */}
                        {/* <path id="path1" d="M10,60 Q35,35,60,10" stroke="black" strokeWidth="2" fill="none"/> */}
                        {/* <path id="curve2" d="M25,25 Q40,25,40,10" stroke="black" strokeWidth="2" fill="none"/> */}
                    </svg>
                </svg>

{/* <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <circle id="myCircle" cx="0" cy="0" r="5" />

    <linearGradient id="myGradient" gradientTransform="rotate(90)">
      <stop offset="20%" stopColor="gold" />
      <stop offset="90%" stopColor="red" />
    </linearGradient>
  </defs>

  <use x="5" y="5" href="#myCircle" fill="url('#myGradient')" />
</svg> */}
            </>
        )    
    }
}

export default SvgTest;
