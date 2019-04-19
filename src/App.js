import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import Authenticate from './pages/Authenticate';


function AppRouter() {
	return (
		<Router>
			<Fragment>
				<Route exact path="/" exact component={Authenticate} />
				<Route path="/home" exact component={Home} />
			</Fragment>
		</Router>
	);
}

export default AppRouter;
