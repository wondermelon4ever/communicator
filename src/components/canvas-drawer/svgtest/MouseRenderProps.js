import React from 'react';

// cursor 모양변경, 
export default class Mouse extends React.Component {
    constructor(props) {
        super(props);
        this.targetId = props.targetId;
        this.onMouseDown = props.onMouseDown;
        this.onMouseUp = props.onMouseUp;
        this.onMouseMove = props.onMouseMove;

        this.state = {
            position: {
                x: 0, y: 0
            }, 
            cursor: "pointer",
            isMouseDown: false,
            isCtrlKeyPressed: false
        }

        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount () {

    }

    handleMouseDown (event) {

    }

    handleMouseUp (event) {
        
    }

    handleMouseMove (event) {

    }

    render () {
        return (
            <>
                { this.props.render (this.state) }
            </>
        )
    }
}
