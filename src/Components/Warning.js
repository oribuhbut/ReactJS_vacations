import React from 'react';

class Warning extends React.Component {
    render() {
        if (this.props.display) {
            return (
                <div>
                    <div className="alert alert-dark" role="alert">
                        {this.props.alertMessage}
                    </div>
                </div>
            )
        }
        else {
            return null;
        }
    }
}

export default Warning;