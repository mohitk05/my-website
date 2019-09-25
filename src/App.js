import React, { Component } from 'react';
import './App.css';
import { withRouter } from 'react-router-dom'
import Main from './Main'

const App = withRouter(props => <AppInside {...props} />);

class AppInside extends Component {
	render() {
		return (
			<div className="App">
				<Main />
			</div>
		);
	}
}

export default App;

