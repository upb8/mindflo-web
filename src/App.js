import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

function AppRouter() {
	return (
		<Router>
			<Fragment>
				<Route exact path="/" exact component={SignUp} />
				<Route path="/app" exact component={Home} />
				<Route path="/sign-in" exact component={SignIn} />
			</Fragment>
		</Router>
	);
}

export default AppRouter;
