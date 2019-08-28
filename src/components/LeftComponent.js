import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

import {FaInstagram, FaGithub, FaTwitter} from 'react-icons/fa'

const TWITTER = `https://twitter.com/MohitKarekar`
const INSTA = `https://www.instagram.com/mohitkarekar/`
const GITHUB = `https://github.com/mohitk05`

class LeftComponent extends React.Component {

    render(){
        return(
            <div>
                <p className="quoteContainer"><span className="homeQuote">Create the things you wish existed.</span></p>
                <p className="tagline">I'm a <mark style={{color: '#fff', backgroundColor:'#ef5350'}}>software engineer</mark> who loves to create products. I build stuff I imagine or think of. My mantra - Got an idea? Code it.</p>
                <Link to="/work"><button className="myButton">Work</button></Link>
                <Link to="/posts"><button className="myButton">Blog</button></Link>
                {/* <button onClick={() => window.open('https://medium.com/@mohitkarekar', '_blank')} className="myButton">Blog</button> */}
                
                <hr/>
                <div className="social">
                    <a href={GITHUB} target="_blank" className="social_logo"><FaGithub /></a>        
                    <a href={TWITTER} target="_blank" className="social_logo"><FaTwitter /></a>
                    <a href={INSTA} target="_blank" className="social_logo"><FaInstagram /></a>
                </div>
            </div>
        )
    }
}

export default LeftComponent