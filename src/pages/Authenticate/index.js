import React, { Component, Fragment} from 'react';
import { GraphQLClient } from 'graphql-request';
import debug from 'debug';

import './style.scss';

const client = new GraphQLClient('https://api.graph.cool/simple/v1/cjuhavbfm4dew0136f5svjec8');
const log = debug('page:authenticate');

class Login extends Component {
	state = {
		name: '',
		email: '',
    password: '',
    pageStatus: 'signUp' //determine between sign up and sign in
	};

	signUp = (event) => {
    event.preventDefault();
    log('sending the mutation request');

		const signinRequest = client.request(`
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

		signinRequest
			.then((data) => {
				log('successfully signed up user', data);
			})
			.catch((e) => {
				log('error while signing up user ', e);
			});
  };
  
  logIn = (event) => {
    event.preventDefault();
    log('sending the mutation request');

		const signinRequest = client.request(`
				mutation {
					signinUser(
						email: {
              email: "${this.state.email}"
              password: "${this.state.password}"
            }
					) {
						token
						user {
              id
              name
            }
					}
        }
				`);

		signinRequest
			.then((data) => {
        log('successfully signed in user', data);
        // TODO keep the token in localstorage
        localStorage.setItem('auth', data.signinUser.token);
        this.props.history.push(`/home`);
			})
			.catch((e) => {
				log('error while signing in user ', e);
			});
  };
  
  handleForm = (event) => {
		log('changing the value of '+event.target.name+' to '+event.target.value);
		this.setState({
			[event.target.name]: event.target.value
		});
  };

  changePageStatus = (pageStatus) => {
    log('changed to '+pageStatus)
		this.setState({pageStatus});
  };

	// Render
	render() {
		return (
      <div className="page-container">
        <div className="form">
          <div>
            {this.state.pageStatus === 'signUp' &&
              <Fragment>
                <h1>Sign Up </h1>
                <p>Please fill in this form to create an account.</p>
              </Fragment>
            }
            {this.state.pageStatus === 'signIn' &&
              <Fragment>
                <h1>Sign In </h1>
                <p>Please log in.</p>
              </Fragment>
            }
            <br />
            {this.state.pageStatus === 'signUp' &&
              <Fragment>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleForm}
                  required
                />
              </Fragment>
            }
            <br />
            <br />
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={this.state.email}
              onChange={this.handleForm}
              required
            />
            <br />
            <br />
            <label htmlFor="password">
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              value={this.state.password}
              onChange={this.handleForm}
              required
            />
            <br />
            <br />
            <div className="clearfix">
              {this.state.pageStatus === 'signUp' &&
              <button type="button" className="signupbtn" onClick={this.signUp}>
                Sign Up
              </button>}
              {this.state.pageStatus === 'signIn' &&
              <button type="button" className="signupbtn" onClick={this.logIn}>
                Log In
              </button>}
            </div>
          </div>
          <div className="footer-note">
            {this.state.pageStatus === 'signUp' ? 
            <Fragment>
              Already signed up? <u onClick={()=>{this.changePageStatus('signIn')}}>click here to sign in</u>
            </Fragment> :
            <Fragment>
              New user? <u onClick={()=>{this.changePageStatus('signUp')}}>click here to sign up</u>
            </Fragment>}
          </div>
        </div>
      </div>
		);
	}
}

export default Login;
