import React from 'react';

export default function withMouse ( TargetComponent, ...props ) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.targetId = props.targetId;
            this.onMouseDown = props.onMouseDown;
            this.onMouseUp = props.onMouseUp;
            this.onMouseMove = props.onMouseMove;
            this.isMouseInside = false;

            this.state = {
                position: {
                    x: 0, y: 0
                },
                isMouseDown: false,
                isSelected: false,
                cursor: "pointer",
            }

            this.handleMouseDown = this.handleMouseDown.bind(this);
            this.handleMouseLeave= this.handleMouseLeave.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleMouseOver = this.handleMouseOver.bind(this);
            this.handleMouseUp = this.handleMouseUp.bind(this);
            this.handleClick = this.handleClick.bind(this);

            this.decideMouseCursor = this.decideMouseCursor.bind(this);
        }

        decideMouseCursor = (event) => {
            this.setState({
                ...this.state,
                cursor: "nw-resize"
            })
            // const posX = event.offsetX-this.state.offset.x, posY = event.clientY-this.state.offset.y;
            // const posX = event.offsetX, posY = event.clientY;
            // var cursor = "move";
            // if(posY < this.state.anchorPosition.y+20) {
            //     if(posX < this.state.anchorPosition.x+20) {
            //         cursor = "nw-resize";
            //     } else if(posX > this.state.anchorPosition.x+this.state.width-20) {
            //         cursor = "ne-resize";
            //     } else {
            //         cursor = "n-resize";
            //     }
            // } else if(posY > this.state.anchorPosition.y+this.state.height-20) {
            //     if(posX < this.state.anchorPosition.x+20) {
            //         cursor = "sw-resize";
            //     } else if(posX > this.state.anchorPosition.x+this.state.width-20) {
            //         cursor = "se-resize";
            //     } else {
            //         cursor = "s-resize";
            //     }
            // } else {
            //     if(posX < this.state.anchorPosition.x + 20) {
            //         cursor = "w-resize";
            //     } else if(posX > this.state.anchorPosition.x+this.state.width-20) {
            //         cursor = "e-resize";
            //     }
            // }
     
            // this.setState({
            //     ...this.state,
            //     mouseCursor: cursor
            // })
        }

        handleMouseDown (event) {
            event.preventDefault();
            this.setState({
                ...this.state,
                isMouseDown: true
            })
            document.addEventListener('mousemove', this.handleMouseMove);
        }

        handleMouseUp (event) {
            event.preventDefault();
            this.setState({
                ...this.state,
                isMouseDown: false
            });
            document.removeEventListener ('mousemove', this.handleMouseMove);
        }

        handleMouseMove (event) {
            if(this.isMouseInside === true) {
                this.decideMouseCursor(event);
            }
            this.state({
                ...this.state,
                position: {
                    x: event.clientX,
                    y: event.clientY
                }
            });
            event.preventDefault();
            this.onMouseMove(event);
        }

        handleMouseOver (event) {
            this.isMouseInside = true;
        }

        handleMouseLeave (event) {
            this.setState({
                ...this.state,
                mouseCursor: "pointer"
            })
            this.isMouseInside = false;
        }

        render() {
            return (
                <TargetComponent 
                    isMouseDown={ this.state.isMouseDown }
                    isSelected={ this.state.isSelected }
                    mouse={ this.state.position }
                    cursor={ this.state.cursor }

                    handleMouseDown={ this.handleMouseDown }
                    handleMouseLeave={ this.handleMouseLeave }
                    // handleMouseMove={ this.handleMouseMove }
                    handleMouseOver={ this.handleMouseOver }
                    handleMouseUp={ this.handleMouseUp }
                    handleClick={ this.handleclick }
                    {...props }
                />
            )
        }
    }
}
