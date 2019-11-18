import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Warning from './Warning';


class Login extends React.Component {

    state = {
        username: "",
        password: "",
        display: false,
        alertMessage: ""
    }

    componentDidMount() {
        fetch('/users/')
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                console.log(result);
                if (result.success) {
                    if (result.data < 1) {
                        this.props.history.push('/admin');
                        return;
                    }
                    else {
                        this.props.history.push('/home');
                        return;
                    }
                }
                return;
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    loginFunction() {
        if (this.state.username.length < 1 || this.state.password.length < 1) {
            this.setState({
                display: true,
                alertMessage: "Please Fill All The Fields!"
            })
            return;
        }
        let data = {
            username: this.state.username,
            password: this.state.password
        }
        fetch('/users/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                if (result.success) {
                    if (result.data < 1) {
                        this.props.history.push('/admin')
                    }
                    else {
                        this.props.history.push('/home')
                    }
                }
                else {
                    this.setState({
                        display: true,
                        alertMessage: result.message
                    });
                    return;
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div>
                    <form className="text-center p-5 loginFormClass" action="#!">

                        <p className="h4 mb-4">Sign in</p>

                        <input type="text" name="username" className="form-control mb-4" placeholder="Username" onChange={this.handleChange.bind(this)} value={this.state.username}></input>

                        <input type="password" name="password" className="form-control mb-4" placeholder="Password" onChange={this.handleChange.bind(this)} value={this.state.password}></input>

                        <div className="d-flex justify-content-around">
                            <div>
                            </div>
                        </div>

                        <div className="btn btn-secondary btn-block my-4" onClick={this.loginFunction.bind(this)}>Sign in</div>

                        <p>Not a member?
    <Link to="/register">Register</Link>
                        </p>
                        <Warning display={this.state.display} alertMessage={this.state.alertMessage} />
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;