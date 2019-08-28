import React from 'react'
//import MovingRocket from './MovingRocket'
import * as PIXI from 'pixi.js'

export default class PixiComponent extends React.Component {
    app;
    myView;

    constructor(props){
        super(props)
        this.height = this.props.height;
        this.width = this.props.width;
        this.options = {
            backgroundColor: 0x222222
        };
        
    }

    componentDidMount(){
        //this.draw()
    }

    draw = () => {
        this.app = new PIXI.Application(this.width, this.height, this.options)
        this.myView.appendChild(this.app.view)
        
        const graphics = new PIXI.Graphics()
        //graphics.beginFill(0x444444)
        const rect_h = this.width * 0.1
        
        for(let i = 0; i < 12; i++){
            graphics.beginFill(i % 2 ? 0x333333 : 0xaaaaaa, 1);
            graphics.moveTo(0, i * rect_h)
            graphics.lineTo(i * rect_h, 0)
            graphics.lineTo(rect_h * (i + 1), 0)
            graphics.lineTo(0, (i + 1) * rect_h)
            //graphics.lineTo(i * rect_h, 0)
            graphics.endFill()
        }
        // graphics.beginFill(0x444444, 1);
        // graphics.moveTo(this.width * 0.1, 0);
        // graphics.lineTo(this.width * 0.1, this.height * 0.6);
        // graphics.quadraticCurveTo(this.width * 0.1, this.height * 0.63, this.width * 0.15, this.height * 0.63);
        // graphics.lineTo(this.width * 0.66, this.height * 0.63);
        // graphics.quadraticCurveTo(this.width * 0.75, this.height * 0.63, this.width * 0.75, this.height * 0.68);
        // graphics.lineTo(this.width * 0.75, this.height * 0.9);
        // graphics.lineTo(this.width * 0.85, this.height * 0.9);
        // graphics.lineTo(this.width * 0.85, 0);
        // graphics.endFill();
        this.app.stage.addChild(graphics)
        this.app.start()
    }

    componentWillUnmount() {
        this.app.stop()
    }

    

    render(){
        return(
            <div ref={(div) => this.myView = div}></div>
        )
    }


}