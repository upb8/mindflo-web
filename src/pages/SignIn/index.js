import React, { Component } from 'react';
import './style.scss';
import { request, GraphQLClient } from 'graphql-request';

class Login extends Component {
	// Render
	render() {
		return (
			<div className="container">
				<label htmlFor="username">
					<b>Email</b>
				</label>
				<br />
				<input type="email" placeholder="Enter Your Email" name="username" required />
				<br />
				<br />

				<label htmlFor="password">
					<b>Password</b>
				</label>
				<br />

				<input type="password" placeholder="Enter Your Password" name="password" required />
				<br />
				<br />

				<button type="submit">Login</button>
				<br />
				<br />

				<button type="button">Cancel</button>
			</div>
		);
	}
}

export default Login;
