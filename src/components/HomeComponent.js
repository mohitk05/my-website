import React from 'react'
import LeftComponent from './LeftComponent';
import NewRight from './NewRight'

class HomeComponent extends React.Component {
    state = {
        activeWork: 0,
        work: [{
            name: 'react-insta-stories',
            html_url: 'https://github.com/mohitk05/react-insta-stories'
        },{
            name: 'react-router-fuzzy',
            html_url: 'https://github.com/mohitk05/react-router-fuzzy'
        },{
            name: 'play-this',
            html_url: 'https://playthis.netlify.com'
        },{
            name: 'sync',
            html_url: 'https://syncapp.xyz'
        }],
    }

    componentDidMount() {
        window.innerWidth >= 600 && this.home.focus()
    }

    _onKeyDown = e => {
        e.preventDefault()
        console.log(e.key, e.code)
        if(e.key === 'ArrowDown' && this.state.activeWork < this.state.work.length - 1) this.setState({activeWork: this.state.activeWork + 1 })
        else if(e.key === 'ArrowUp' && this.state.activeWork > 0) this.setState({activeWork: this.state.activeWork - 1 })
        else if(e.key === 'Enter') {
          window.open(this.state.work[this.state.activeWork].html_url, "_blank")
        }
    }

    render(){
        return(
            <div ref={r => this.home = r} className="main" onKeyDown={this._onKeyDown} tabIndex="0">
                <div className="left">
                    <LeftComponent/>
                </div>
                <div className="newRight">
                    <NewRight work={this.state.work} activeWork={this.state.activeWork}/>
                </div>
            </div>
        )
    }
}

export default HomeComponent