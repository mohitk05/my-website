import React, { Component } from 'react';
import './App.css';
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet';
import Main from './Main'

const App = withRouter(props => <AppInside {...props} />);

class AppInside extends Component {
	render() {
		return (
			<div className="App">
				<Helmet>
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:creator" content="@MohitKarekar" />
					<meta property="og:title" content="Mohit Karekar - Web & Design" />
					<meta property="og:url" content="https://mohitkarekar.com" />
					<meta property="og:description" content="Hello, I am Mohit Karekar, know more about me here." />
					<meta property="og:image" content="/mohit.jpg" />
				</Helmet>
				<Main />
			</div>
		);
	}
}

export default App;

