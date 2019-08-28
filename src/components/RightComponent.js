import React from 'react'
import COTD from './COTD'
import {FaFacebook, FaInstagram} from 'react-icons/fa'

class RightComponent extends React.Component{

    constructor(props){
        super()
        this.state = {
            backColor: '#222',
            mouseEntered: false
        }
    }

    componentDidMount(){

    }

    mouseEnter = (e) => {
        console.log('mouse entered')
        this.setState({backColor: 'transparent', mouseEntered: true})
    }

    mouseLeave = (e) => {
        this.setState({backColor: '#222', mouseEntered: false})
    }

    render(){
        return(
            <div className="col-md-4 right" style={{background: this.state.backColor}}>
                <div>
                    <div className="profile_pic">
                            <img onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} alt="Profile" src='/mohit.jpg' className="face" />
                            <div style={nameStyles}>
                                <div style={{fontFamily: 'Poppins', fontSize: '1.8rem'}}>मोहित कारेकर</div>
                                <div className="colored" style={{marginLeft: 'auto', marginRight: 'auto', fontSize: '1rem'}}>Web Developer</div>
                                <div className="colored" style={{margin: 'auto', marginRight: 'auto', fontSize: '1rem'}}>Graphic Designer</div>
                            </div>
                    </div>
                    {1 ? <COTD backColor={this.state.mouseEntered}/> : null}
                    {0 ? <div><div className="rects1" style={this.state.mouseEntered ? hoverStrips : {}}></div>
                    <div className="rects2" style={this.state.mouseEntered ? hoverStrips : {}}></div>
                    <div className="rects3" style={this.state.mouseEntered ? hoverStrips : {}}></div></div> : null}
                    <div className="social">
                        <a href={FACEBOOK} target="_blank" className="social_logo"><FaFacebook /></a>
                        <a href={INSTA} target="_blank" className="social_logo"><FaInstagram /></a>
                    </div>
                </div>
            </div>
        )
    }
}

const hoverStrips = {
    transform: 'translate(3vw, 3vh) rotate(-45deg)'
}

const nameStyles = {
    textAlign: 'center',
    zIndex: 9,
    color: '#777',
    marginTop: 15,
}

const FACEBOOK = `https://www.facebook.com/karekar.mohit`
const INSTA = `https://www.instagram.com/mohitkarekar/`

// const pixi = {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     zIndex: -1
// }

export default RightComponent