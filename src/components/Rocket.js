import React from 'react'
import {Sprite} from 'react-pixi-fiber'
import * as PIXI from 'pixi.js';

const bunny = "https://i.imgur.com/IaUrttj.png";
const centerAnchor = new PIXI.Point(0.5, 0.5);

export default class Rocket extends React.Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        return(
            <Sprite
                anchor={centerAnchor}
                texture={PIXI.Texture.fromImage(bunny)}
                {...this.props}
            />
        )
    }
}