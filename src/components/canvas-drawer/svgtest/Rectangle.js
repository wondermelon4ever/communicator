import React from 'react';

export default class Rectangle extends React.Component {

    constructor(props) {
        super(props);
        this.id = props.id;

        this.state = {
            anchorPosition: {
                x: props.position.x,
                y: props.position.y
            },
            width: props.width,
            height: props.height,
            title: props.title,
            isSelected: false
        }
    }

    render () {
        return (
           <>
                <rect 
                    x={ this.state.anchorPosition.x } 
                    y={ this.state.anchorPosition.y } 
                    width={ this.state.width } 
                    height={ this.state.height }
                >
                    <title>
                        { this.props.title }
                    </title>
                </rect>
           </>
        );
    }
}