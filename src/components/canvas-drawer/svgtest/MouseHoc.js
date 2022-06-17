import React from 'react';

var num = 0;

const withMouse = (shape, decideMouseCursor) => ( TargetComponent ) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.targetId = shape+(num++);
            this.element =  undefined;

            this.state = {
                isSelected: false,
                cursor: "pointer",
                isMouseInside: false,
                isMouseInsideDown: false,
                mouse: { x: 0, y: 0 }
            }

            this.handleMouseDown = this.handleMouseDown.bind(this);
            this.handleMouseLeave= this.handleMouseLeave.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleMouseOver = this.handleMouseOver.bind(this);
            this.handleMouseUp = this.handleMouseUp.bind(this);
        }

        componentDidMount() {
            this.element = document.getElementById(this.targetId);
        }

        handleMouseDown (event) {
            event.preventDefault();
            this.setState({
                ...this.state,
                isMouseInsideDown: true
            })
        }

        handleMouseUp (event) {
            event.preventDefault();
            this.setState({
                ...this.state,
                isMouseInsideDown: false
            })
        }

        handleMouseMove (event) {
            if(this.state.isMouseInside === true) {
                var rect = this.element.getBoundingClientRect();
                var cursor = decideMouseCursor(event, rect);
                this.setState({
                    ...this.state,
                    cursor: cursor,
                });

                if(this.state.isMouseInsideDown === true) {
                    this.setState({
                        ...this.state,
                        mouse: { x: event.clientX, y: event.clientY },
                    });
                }
            }
        }

        handleMouseOver (event) {
            this.setState({
                ...this.state,
                isMouseInside: true
            })
        }

        handleMouseLeave (event) {
            this.setState({
                ...this.state,
                cursor: "pointer",
                isMouseInside: false
            });
        }

        render() {
            return (
                <svg
                    id={ this.targetId }
                    onMouseLeave={ this.handleMouseLeave }
                    onMouseOver={ this.handleMouseOver }
                    onMouseMove={ this.handleMouseMove }
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp }
                >
                    <TargetComponent 
                        // isSelected={ this.state.isSelected }
                        mouse={ this.state.mouse }
                        cursor={ this.state.cursor }
                        isMouseInside={ this.state.isMouseInside }
                        isMouseInsideDown={ this.state.isMouseInsideDown }
                        {...this.props }
                    />
                </svg>
            )
        }
    }
}

export default withMouse;
