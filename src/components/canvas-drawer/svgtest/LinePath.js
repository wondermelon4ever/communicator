import React, { useState } from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';

export default class LinePath extends React.Component {

    constructor(props) {
        super(props);

        this.id = props.id;
        this.state = {
            lineKind: props.lineKind,
            point1: props.point1,
            point2: props.point2,
            pointc: props.pointc,
            // 나중에 path별로 변경할 수 있는 속성들 (컨텍스트 메뉴에서 특정 라인만 변경할 수도 있음)
            values: {
                stroke: props.stroke,
                strokeWidth: props.strokeWidth,
                fill: props.fill,
            },
            path: "",

            contextMenuOpen: false,
            contextMenuAnchorPoint: {
                x: 10, y: 10
            }
        }

        this.handleContextMenuClose = this.handleContextMenuClose.bind(this);
        this.handleContextMenuOpen = this.handleContextMenuOpen.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.makePath = this.makePath.bind(this);
    }

    componentDidMount () {
        this.makePath();
    }

    componentDidUpdate (prevProps) {
        if (this.props.point1 !== prevProps.point1 || 
            this.props.point2 !== prevProps.point2 || 
            this.props !== prevProps.point2 ) {
            this.setState({
                point1: this.props.point1,
                point2: this.props.point2,
                pointc: this.props.pointc,
            });
        }
    }

    changeLineKind (lineKind) {
        this.setState({
            ...this.state,
            lineKind: lineKind,
            contextMenuOpen: false
        });
    }

    makePath () {
        var newPath = "M"+point1.x+","+point1.y+" ";
        if(this.state.lineKind === "Straight") {
            newPath += "L"+point1.x+","+point1.y+","+point2.x+","+point2.y;
        } else {
            newPath += "Q"+pointc.x+","+pointc.y+","+point2.x+","+point2.y;
        }
        this.setState({
            ...this.state,
            path: newPath
        });
    }

    handleContextMenuClose () {
        this.setState({
            ...this.state,
            contextMenuOpen: false
        })
    }

    handleOnClick (event) {
        this.props.handleOnLinePathClick(event);
    }

    handleContextMenuOpen () {
        this.setState({
            ...this.state,
            contextMeunOpen: true
        });
    }

    render () {
        return (
            <>
                <path 
                    id={ this.id } 
                    d={ this.state.path }
                    stroke={ this.state.values.stroke }
                    strokeWidth={ this.state.values.strokeWidth }
                    fill={ this.props.values.fill }

                    onContextMenu={ this.handleContextMenuOpen }
                    onClick={ this.handleOnClick }
                />
                <Menu
                    open={ this.state.contextMenuOpen }
                    onClose={ this.handleContextMenuClose }
                    anchorReference="anchorPosition"
                    anchorPosition={
                        { top: this.state.contextMenuAnchorPoint.y, left: this.state.contextMenuAnchorPoint.x }
                    }
                >
                    <MenuItem onClick={ () => this.changeLineKind ("Curve") }>Curve</MenuItem>
                    <MenuItem onClick={ () => this.changeLineKind ("Straight") }>Straight</MenuItem>
                    <Divider />
                    <MenuItem onClick={ this.handleContextMenuClose }>Change attributes</MenuItem>
                </Menu>
            </>
        );
    }
}