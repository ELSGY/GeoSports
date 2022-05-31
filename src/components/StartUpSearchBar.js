import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import * as Icons from "react-icons/fa";
import "./navbar.css";
import SignUp from "../pages/authentication/SignUp";
import LogIn from "../pages/authentication/LogIn";
import Events from "../pages/client/Events";

export default class StartUpSearchBar extends React.Component {
    render() {
        return (
            <Route>
                <Router>
                    <nav className="navbar">
                        <p className="logo">
                            GeoSports
                            <Icons.FaTree/>
                        </p>
                    </nav>
                    <Switch>
                        <Route exact={true} path="/login">
                            <LogIn username={this.props.history.location.state}/>
                        </Route>
                        <Route exact={true} path="/">
                            <SignUp username={this.props.history.location.state}/>
                        </Route>
                        <Route exact={true} path="/user/events">
                            <Events username={this.props.history.location.state}/>
                        </Route>
                    </Switch>
                </Router>
            </Route>
        );
    }
}