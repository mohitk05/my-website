import React from 'react'
import { FaReact, FaNodeJs } from 'react-icons/fa';

export default class NewRight extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentDidMount(){
        

    }

    

    render(){
        return(
            <div>
                <div className="homeImageOverlay">
                    <div className="bioHeader">
                        <h1 style={{flex: 0.4}}>Mohit Karekar</h1>
                        <div><img className="faceContainer" src="/assets/images/mohit.jpg" /></div>
                    </div>
                    
                    <div className="bio">
                        <span>Stack: <b>JavaScript <FaReact size={30}/> <FaNodeJs size={30}/> (with hints of Python and Go)</b></span>
                        <span>Experience in tech: <b>{Math.round((Date.now() - new Date(2017, 7, 14))/(1000*60*60*24*30))} months<span className="blinking-cursor">|</span></b></span>
                        <span>Location: <b>Mumbai, India</b></span>
                        <span>Currently working with: <b>Terribly Tiny Tales</b></span>
                        <span>Contact: <b><a href="mailto:karekar.mohit@gmail.com" style={{borderBottom: '1px solid tomato'}}>karekar.mohit@gmail.com</a></b></span>
                        <br/>
                        {window.innerWidth >= 600 ? 
                                <div ref={r => this.term = r} className="termWindow">
                                    <span>~/mohitkarekar/my-recent-work</span>
                                    <span style={{opacity: 0.4}}>Use arrow keys to move up and down the list. Press enter to open a project.</span>
                                    <div style={{display: 'flex', flexDirection: 'column', height: 50}}>{this.props.work.map((w, i) => <span className={this.props.activeWork === i ? 'activeWork' : ''}>{this.props.activeWork === i ? `> ${w.name}` : w.name}</span>)}</div>
                                </div>
                            : null }
                    </div>
                </div>
            </div>
        )
    }
}