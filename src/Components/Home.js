import React from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001')

class Home extends React.Component {
    constructor(props) {
        super(props)
    }

    //State

    state = {
        vacations: [],
        titleMessage: ""
    }

    //ComponentDidMount

    componentDidMount() {
        socket.on('vacationadminupdate', () => {
            this.getVacations();
        });
        socket.on('vacationuserupdate', () => {
            this.getVacations()
        });
        this.checkLog()
        this.getVacations()
    }


    // Get Vacaction Function


    getVacations() {
        fetch('/users/uservacation')
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                console.log(result);
                if (result.data == null) {
                    this.setState({ titleMessage: "Theres No Vacation Available At The Moment", vacations: [] })
                }
                else {
                    this.setState({ vacations: result.data, titleMessage: "Put Your Mouse On To See More Details" });
                }
            })
    }

    // Check Role Function

    checkLog() {
        fetch('/users')
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
                        return;
                    }
                }
                this.props.history.push('/');
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Follow Vacation Function

    followVacation(id) {
        let data = {
            id: id
        }
        fetch('/users/follow', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                socket.emit('vacationuser');
                console.log(result)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // Unfollow Vacation Function

    unfollowVacation(id) {
        let data = {
            id: id
        }
        fetch('/users/unfollow', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                socket.emit('vacationuser');
                console.log(result)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <div className="container">
                <div className="col-md-12 text-center lead display-4">ObserVacation</div>
                <div className="col-md-12 text-center lead">{this.state.titleMessage}</div>
                <div className="row justify-content-center">
                    {this.state.vacations.map((val) => {
                        if (val.userFollow) {
                            return <div key={val.id} className="card image-area">
                                <div className="img-wrapper">
                                    <img src={val.photo}></img>
                                    <div className="content">
                                        <h5 className="card-title">{val.country}</h5>
                                        <p className="card-text lead">{val.description}</p>
                                        <ol className="list-unstyled list-inline font-small text-white">
                                            <li className="list-inline-item white-text"><div className="lead">From: {val.start_date}</div></li>
                                            <li className="list-inline-item white-text"><div className="lead">To: {val.end_date}</div></li>
                                            <li className="list-inline-item"><div className="lead">Followers: {val.followers}</div></li>
                                            <li className="list-inline-item"><div className="lead">Price: {val.price}</div></li>
                                            <li className="list-inline-item"><i className="fa fa-thumbs-down fontAwesomeClass" onClick={this.unfollowVacation.bind(this, val.id)}></i></li>
                                        </ol>
                                    </div>
                                    <ul className="list-unstyled list-inline font-small text-white">
                                        <li><i className="fa fa-heart like"></i></li>
                                    </ul>
                                </div>
                            </div>
                        }
                        else {
                            return <div key={val.id} className="card image-area">
                                <div className="img-wrapper">
                                    <img src={val.photo}></img>
                                    <div className="content">
                                        <h5 className="card-title">{val.country}</h5>
                                        <p className="card-text lead">{val.description}</p>
                                        <ol className="list-unstyled list-inline font-small text-white">
                                            <li className="list-inline-item white-text"><div className="lead">From: {val.start_date}</div></li>
                                            <li className="list-inline-item white-text"><div className="lead">To: {val.end_date}</div></li>
                                            <li className="list-inline-item"><div className="lead">Followers: {val.followers}</div></li>
                                            <li className="list-inline-item"><div className="lead">Price: {val.price}</div></li>
                                            <li className="list-inline-item"><i className="fa fa-thumbs-up fontAwesomeClass" onClick={this.followVacation.bind(this, val.id)}></i></li>
                                        </ol>
                                    </div>
                                    <ul className="list-unstyled list-inline font-small text-white">
                                        <li><i className="fa fa-heart unlike"></i></li>
                                    </ul>
                                </div>
                            </div>
                        }
                    })}
                </div>
            </div>
        )
    }
}

export default Home;