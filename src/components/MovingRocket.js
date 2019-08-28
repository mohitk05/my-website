import React from 'react'
import Rocket from './Rocket'
import PropTypes from 'prop-types'

export default class MovingRocket extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            y: window.innerHeight + Math.random() * 200,
            x: Math.floor(Math.random() * (this.props.width - 50)) + 20
        }
    }

    componentDidMount() {
        this.context.app.ticker.add(this.animate);
    }

    componentWillUnmount() {
        this.context.app.ticker.remove(this.animate);
    }

    animate = delta => {
        const mouseposition = this.context.app.renderer.plugins.interaction.mouse.global
        if(mouseposition.x > 0) this.setState(state => {
            return {
                ...state,
                y: mouseposition.y,
                x: mouseposition.x
            }
        })
    }

    render(){
        return(
            <Rocket x={this.state.x} y={this.state.y}/>
        )
    }
}

MovingRocket.contextTypes = {
    app: PropTypes.object,
};