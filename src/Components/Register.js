import React from 'react';
import Warning from './Warning';

class Register extends React.Component {

    state = {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        display: false,
        alertMessage: ""
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    registerFucntion() {
        if (this.state.firstName.length < 1 || this.state.lastName.length < 1 || this.state.username.length < 1 || this.state.password.length < 1) {
            this.setState({
                display: true,
                alertMessage: "Please Fill All The Fields"
            })
            return;
        }
        let data = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.username,
            password: this.state.password
        }
        fetch('/users', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                console.log(result);
                if (result.success) {
                    this.props.history.push('/home');
                    return;
                }
                else {
                    this.setState({
                        display: true,
                        alertMessage: result.message
                    })
                    return;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <div className="row justify-content-center">
                    <div className="card registerFormClass">
                        <h5 className="card-header bg-dark text-white text-center py-4">
                            <strong>Sign up</strong>
                        </h5>
                        <br></br>
                        <div className="card-body px-lg-5 pt-0">
                            <form className="text-center">
                                <div className="form-row">
                                    <div className="col">
                                        <div className="md-form">
                                            <input type="text" name="firstName" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.firstName}></input>
                                            <label>First name</label>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="md-form">
                                            <input type="text" name="lastName" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.lastName}></input>
                                            <label>Last name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="md-form mt-0">
                                    <input type="text" name="username" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.username}></input>
                                    <label>Username</label>
                                </div>

                                <div className="md-form">
                                    <input type="password" name="password" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.password}></input>
                                    <label>Password</label>
                                </div>
                                <div className="btn btn-outline-info btn-block my-4 waves-effect z-depth-0" onClick={this.registerFucntion.bind(this)}>Sign in</div>
                                <Warning display={this.state.display} alertMessage={this.state.alertMessage} />
                            </form>
                        </div>
                    </div>
            </div>
        )
    }
}

export default Register;