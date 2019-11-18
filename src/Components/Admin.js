import React from 'react';
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from 'react-images-upload';
import Chart from "react-apexcharts";
import Popup from "reactjs-popup"
import io from 'socket.io-client';
import AdminAddVacation from './adminAddVacation';
const socket = io('http://localhost:3001')
class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.checkLog = this.checkLog.bind(this);
        this.getVacations = this.getVacations.bind(this);
        this.getFollowers.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handlePhoto = this.handlePhoto.bind(this)
        this.displayFunction = this.displayFunction.bind(this)
    }

    // State
    state = {
        description: "",
        destination: "",
        price: "",
        image: "",
        startDate: "",
        endDate: "",
        display: false,
        tempModalId: "",
        open: false,
        vacations: [],
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: []
            }
        },
        series: [
            {
                name: "Followers",
                data: []
            }]
    }

    // Logout 

    logoutFunction() {
        fetch('/users/logout', {
            method: "POST"
        })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                console.log(res)
                this.props.history.push('/')
            })
    }

    // Open Modal Function

    openModal(id) {
        this.setState({ open: true, tempModalId: id });
        fetch(`/users/getVacationDetails/?id=${id}`)
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                this.setState({
                    description: result.data[0].description,
                    destination: result.data[0].country,
                    startDate: result.data[0].start_date,
                    endDate: result.data[0].end_date,
                    price: result.data[0].price,
                    image: result.data[0].photo
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Handle Photo Function

    handlePhoto(photo) {
        var file = photo[photo.length - 1]
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.setState({ image: reader.result });
        };
    }

    // Handle Inputs Change Function

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    // Close Modal Function

    closeModal() {
        this.setState({
            open: false,
            tempModalId: "",
            description: "",
            destination: "",
            startDate: "",
            endDate: "",
            price: "",
            image: ""
        });
    }

    // Delete Vacation Fucntion

    deleteVacation(id) {
        let data = {
            id: id
        }
        console.log(data);
        fetch('/users/vacation', {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                socket.emit('vacationadmin');
                console.log(result)
                if (result.success) {
                    this.getVacations();
                    this.getFollowers();
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Edit Vacation Fucntion

    editVacation() {
        let data = {
            id: this.state.tempModalId,
            destination: this.state.destination,
            description: this.state.description,
            price: this.state.price,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            image: this.state.image
        }
        console.log("data", data)
        fetch('/users/editVacation', {
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
                socket.emit('vacationadmin');
                console.log(result);
                this.getVacations();
                this.getFollowers();
                this.setState({
                    open: false,
                    tempModalId: "",
                    description: "",
                    destination: "",
                    startDate: "",
                    endDate: "",
                    price: "",
                    image: ""
                });
            })
    }

    //

    displayFunction() {
        this.setState({ display: false });
    }
    // Get Vacations Function

    getVacations() {
        fetch('/users/vacation')
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                this.setState({ vacations: result.data });
            })
            .catch((error) => {
                console.log(error)
            })
    }


    // Get Followers Function

    getFollowers() {
        fetch('/users/followers')
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                let vacationArr = [];
                let followersArr = [];
                for (let i = 0; i < result.data.length; i++) {
                    vacationArr.push(result.data[i].country)
                    followersArr.push(result.data[i].followers)
                }
                let copiedArr = JSON.parse(JSON.stringify(this.state.series));
                copiedArr[0].data = followersArr
                this.setState(prevState => ({
                    options: {
                        ...prevState.options,
                        xaxis: {
                            ...prevState.options.xaxis,
                            categories: vacationArr
                        }
                    }
                }))
                this.setState({ series: copiedArr });
            })
    }

    //Checking Role Function

    checkLog() {
        fetch('/users')
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                if (result.success) {
                    if (result.data < 1) {
                        return;
                    }
                    else {
                        this.props.history.push('/home');
                    }
                }
                this.props.history.push('/');
                return;
            })
            .catch((error) => {
                console.log(error)
            })
    }

    //ComponentDidMount

    componentDidMount() {
        socket.on('vacationuserupdate', () => {
            this.getVacations()
            this.getFollowers()
        });
        this.checkLog();
        this.getVacations()
        this.getFollowers()

    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-2 text-left">
                        <i style={{ fontSize: '20px', padding: '10px', cursor: 'pointer',color:'white' }} onClick={this.logoutFunction.bind(this)} class="fas fa-sign-out-alt"></i>
                    </div>
                    <div className="col-md-8 display-4 text-center">
                        Admin
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="btn btn-primary btn-block col-md-6" onClick={() => { this.state.display = true; this.setState({}) }}>add Vacation</div>
                </div>
                <div className="row justify-content-center">
                    <AdminAddVacation getVacations={this.getVacations} display={this.state.display} displayFunction={this.displayFunction} />
                </div>
                <div className="chart">
                    <Chart
                        options={this.state.options}
                        series={this.state.series}
                        type="bar"
                        width="600"
                    />
                </div>
                <br></br>
                <div className="row justify-content-center">
                    {this.state.vacations.map((val) => {
                        return <div key={val.id} className="card col-md-3 cardClass">
                            <div className="view overlay">
                                <img className="card-img-top" src={val.photo} alt="Card image cap"></img>
                                <a>
                                    <div className="mask rgba-white-slight"></div>
                                </a>
                            </div>
                            <a className="btn-floating btn-action ml-auto mr-4 mdb-color lighten-3"></a>
                            <div className="card-body">
                                <h4 className="card-title">{val.country}</h4>
                                <hr></hr>
                                <p className="card-text lead">{val.description}</p>
                            </div>
                            <div className="rounded-bottom bg-dark lighten-2 text-center text-white pt-3">
                                <ul className="list-unstyled list-inline font-small text-white">
                                    <li className="list-inline-item white-text"><div className="lead">From: {val.start_date}</div></li>
                                    <li className="list-inline-item white-text"><div className="lead">To: {val.end_date}</div></li>
                                    <li className="list-inline-item"><div className="lead">Followers: {val.followers}</div></li>
                                    <li className="list-inline-item"><div className="lead">Price: {val.price}</div></li>
                                    <li className="list-inline-item"><i className="fa fa-trash fontAwesomeClass" onClick={this.deleteVacation.bind(this, val.id)}></i></li>
                                    <li className="list-inline-item"><i className="fa fa-edit fontAwesomeClass" onClick={this.openModal.bind(this, val.id)}></i></li>
                                </ul>
                            </div>
                        </div>
                    })}
                </div>

                <Popup
                    open={this.state.open}
                    closeOnDocumentClick
                    onClose={this.closeModal}>
                    <h5 className="text-center display-5">Edit Vacation</h5>
                    <div className="form-group">
                        <input type="text" className="form-control" name="destination" value={this.state.destination} onChange={this.handleChange.bind(this)} placeholder="Destination"></input>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" name="description" value={this.state.description} onChange={this.handleChange.bind(this)} placeholder="Description"></input>
                    </div>
                    <ImageUploader
                        multiple={false}
                        withIcon={true}
                        buttonText='Pick An image'
                        onChange={this.handlePhoto.bind(this)}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    />
                    <div className="form-group">
                        <h5>Start Date: </h5>
                        <input type="date" className="form-control" name="startDate" value={this.state.startDate} onChange={this.handleChange.bind(this)}></input>
                    </div>
                    <div className="form-group">
                        <h5>End Date: </h5>
                        <input type="date" className="form-control" name="endDate" value={this.state.endDate} onChange={this.handleChange.bind(this)}></input>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control" name="price" value={this.state.price} onChange={this.handleChange.bind(this)} placeholder="Price"></input>
                    </div>
                    <div className="btn btn-success" onClick={this.editVacation.bind(this)}>Edit Vacation</div>
                    <div className="btn btn-danger float-right" onClick={this.closeModal.bind(this)}>Close</div>
                </Popup>
            </div>
        )
    }
}

export default Admin;