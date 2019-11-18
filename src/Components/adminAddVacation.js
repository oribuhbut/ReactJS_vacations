import React from 'react';
import io from 'socket.io-client';
import ImageUploader from 'react-images-upload';
const socket = io('http://localhost:3001')
class adminAddVacation extends React.Component {
    constructor(props) {
        super(props)
        this.addVacation = this.addVacation.bind(this);
    }
    state = {
        display: false,
        destination: "",
        description: "",
        price: "",
        startDate: "",
        endDate: "",
        image: ""

    }
    addVacation() {
        let data = {
            destination: this.state.destination,
            description: this.state.description,
            price: this.state.price,
            startDate: this.state.startDate,
            image: this.state.image,
            endDate: this.state.endDate
        }
        fetch('/users/vacation', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((result) => {
                return result.json()
            })
            .then((result) => {
                socket.emit('vacationadmin');
                console.log(result)
                this.props.getVacations();
                this.setState({
                    description: "",
                    destination: "",
                    startDate: "",
                    endDate: "",
                    price: "",
                    image: ""
                })
                this.props.displayFunction();
            })
            .catch((error) => {
                console.log(error);
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
    render() {
        if (this.props.display) {
            return (
                <div className="col-md-6" style={{color:'white'}}>
                    <h5 className="text-center display-5">Add Vacation</h5>
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
                    <div className="btn btn-success" onClick={this.addVacation.bind(this)}>Save The Vacation</div>
                </div>
            )
        }
        else {
            return null;
        }

    }
}

export default adminAddVacation;