import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

class Menu extends React.Component{
    render() {
        return(
                <div className={this.props.open ? 'menuClose menuOpen' : 'menuClose'}>
                    <Link onClick={this.props.toggleMenu} to="/"><h1 className="menu_item col-6">Home</h1></Link>
                    <Link onClick={this.props.toggleMenu} to="/work"><h1 className="menu_item col-6">Work</h1></Link>
                    <Link onClick={this.props.toggleMenu} to="/posts"><h1 className="menu_item col-6">Posts</h1></Link>
                    <Link onClick={this.props.toggleMenu} to="/about"><h1 className="menu_item col-6">About</h1></Link>
                    <Link onClick={this.props.toggleMenu} to="/contact"><h1 className="menu_item col-6">Contact</h1></Link>
                </div>
        )
    }
}

export default Menu
