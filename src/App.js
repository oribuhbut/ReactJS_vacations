import React from 'react';
import './App.css';
import Login from './Components/Login'
import Register from './Components/Register'
import Admin from './Components/Admin'
import Home from './Components/Home'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Route path="/" exact component={Login} history={this.props.history} />
          <Route path="/register" component={Register} />
          <Route path="/admin/" component={Admin} />
          <Route path="/home/" component={Home} />
        </Router>
      </div>
    );
  }
}

export default App;
