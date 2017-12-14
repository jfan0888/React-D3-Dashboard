import React from 'react';
import {Component} from 'react';
import {browserHistory} from 'react-router';

export default class Auth extends Component {
    constructor() {
        super();

        this.usernameInput = null;
        this.passwordInput = null;

        this.user = {
            username : 'demo',
            password : 'demo'
        }

        this.state = {
            error: false
        };
    }

    componentDidMount() {
        if(localStorage.getItem('isLoggedIn') == 'true') {
            browserHistory.replace('/');
        }
    }

    submitLogin = (e) => {
        e.preventDefault()
        const username = this.usernameInput.value;
        const password = this.passwordInput.value;
        const {user} = this;

        if (username == user.username && password == user.password) {
            localStorage.setItem('isLoggedIn', true);
            browserHistory.replace("/");
        } else {
            this.setState({
                error: true
            });
        }
    }

    render() {
        return (
            <div className="login-wrap">
                <div className="login-box">
                    <form className="login-twoFactor" onSubmit={this.submitLogin}>
                        <div>
                            <div className="box">
                                <div className="login-box-content">
                                    <div className="form-group">
                                        <input className="input-block"
                                            name="username"
                                            placeholder="Username"
                                            type="text"
                                            ref={(input) => this.usernameInput = input}
                                            required/>
                                    </div>
                                    <div className="form-group">
                                        <input className="input-block"
                                            name="password"
                                            placeholder="Password"
                                            type="password"
                                            ref={(input) => this.passwordInput = input}
                                            required/>
                                    </div>
                                </div>
                                <div className="form-group m-top30 clearfix">
                                    <button action="submit" className="btn btn-orange btn-lg btn-block pull-right">Login</button>
                                </div>
                                <div>
                                    {
                                        this.state.error && <div className="form-group">
                                            <div className="alert alert-error">
                                                <strong>Invalid username/password. Please try again.</strong>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}