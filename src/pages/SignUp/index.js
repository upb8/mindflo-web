import React, { Component } from 'react';
import './style.scss';
import { request, GraphQLClient } from 'graphql-request';

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjuhavbfm4dew0136f5svjec8', {
	headers: {
		Authorization: 'Bearer YOUR_AUTH_TOKEN'
	}
});

class Login extends Component {
	state = {
		name: '',
		email: '',
		password: ''
	};

	setItem = (e) => {
		e.preventDefault();
		console.log('setItem was called');
		let ob = client.request(`
				mutation		
				{
                createUser(
                name: "${this.state.name}"
                authProvider: {
                email: {
                    email: "${this.state.email}"
                    password: "${this.state.password}"
                }
                }
                ) {
                id
                name
                }
                }
				`);

		ob
			.then((data) => {
				console.log(data);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	handleName = (e) => {
		console.log(e.target.value);
		this.setState({
			name: e.target.value
		});
	};

	handleEmail = (e) => {
		console.log(e.target.value);
		this.setState({
			email: e.target.value
		});
	};

	handlePassword = (e) => {
		console.log(e.target.value);
		this.setState({
			password: e.target.value
		});
	};

	// Render
	render() {
		return (
			<form onSubmit={this.setItem}>
				<div className="container">
					<h1>Sign Up</h1>
					<p>Please fill in this form to create an account.</p>
					<br />
					<label htmlFor="name">
						<b>Name : </b>
					</label>
					<input
						type="text"
						placeholder="Enter your Name"
						name="name"
						value={this.state.name}
						onChange={this.handleName}
						required
					/>
					<br />

					<br />
					<label htmlFor="email">
						<b>Email : </b>
					</label>
					<input
						type="email"
						placeholder="Enter Email"
						name="email"
						value={this.state.email}
						onChange={this.handleEmail}
						required
					/>
					<br />
					<br />
					<label htmlFor="password">
						<b>Password : </b>
					</label>
					<input
						type="password"
						placeholder="Enter Password"
						name="password"
						value={this.state.password}
						onChange={this.handlePassword}
						required
					/>
					<br />
					<br />
					<div className="clearfix">
						<button type="button" className="cancelbtn">
							Cancel
						</button>
						<br />
						<br />
						<button type="submit" className="signupbtn">
							Sign Up
						</button>
					</div>
				</div>
			</form>
		);
	}
}

export default Login;
