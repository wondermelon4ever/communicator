import React from 'react';

const COLOR = {
    TEMP: "gray",
    CONFIRMED: "red"
}

export default class Circle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            confirmed: props.confirmed,
            ismousedown: false,
            position : {
                x: props.position.x,
                y: props.position.y
            },
            radius: props.radius,
            stroke: props.stroke,
            strokeWidth: props.strokeWidth,
            fill: props.fill
        }

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

    }

    handleMouseDown (evt) {
        this.setState({
            ...this.state,
            ismousedown: true
        });
        document.addEventListener('mousemove', this.handleMouseMove);
    }

    handleMouseUp (evt) {
        document.removeEventListener ('mousemove', this.handleMouseMove, false);
        this.setState({
            ...this.state,
            ismousedown: false,
            confirmed: true
        });
    }

    handleMouseMove (evt) {
        if(this.state.ismousedown === true) {
            this.setState({
                ...this.state,
                position: {
                    x: evt.pageX,
                    y: evt.pageY
                }
            });    
        }
        this.props.handlePositionChanged(this.state.id, this.state.position);
    }

    render () {
        return(
            <>
                <circle 
                    id={ this.state.id } 
                    cx={ this.state.position.x } 
                    cy={ this.state.position.y } 
                    r={ this.state.radius } 
                    stroke={ this.state.stroke } 
                    strokeWidth={ this.state.strokeWidth } 
                    fill={ this.state.confirmed ? COLOR.CONFIRMED : COLOR.TEMP }
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp }
                />
            </>
        );
    }
}
