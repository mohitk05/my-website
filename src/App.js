import React, { Component } from 'react';
import './App.css';
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet';

import Main from './Main';

const App = withRouter(props => <AppInside {...props}/>);

class AppInside extends Component {

  render() {
    return (
      <div ref={r => this.app = r} className="App" onKeyDown={this._onKeyDown} tabIndex="0">
        <Helmet>
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:creator" content="@MohitKarekar" />
          <meta property="og:title" content="Mohit Karekar - Web & Design" />
          <meta property="og:url" content="https://mohitkarekar.com"/>
          <meta property="og:description" content="Hello, I am Mohit Karekar, know more about me here."/>
          <meta property="og:image" content="/mohit.jpg"/>
        </Helmet>
        <Main />
        {/* <div className="main">
          <div className="left">
            <LeftComponent menuOpen = {this.state.menuOpen} toggleMenu = {this.openMenu}/>
            <hr/>
            <div className="social">
              <a href={GITHUB} target="_blank" className="social_logo"><FaGithub /></a>        
              <a href={FACEBOOK} target="_blank" className="social_logo"><FaFacebook /></a>
              <a href={INSTA} target="_blank" className="social_logo"><FaInstagram /></a>
          </div>
          </div>
          <div className="newRight">
            <NewRight work={this.state.work} activeWork={this.state.activeWork}/>
          </div>
        </div> */}
        
      </div>
    );
  }
}

export default App;

