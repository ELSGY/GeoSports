import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from "./pages/authentication/SignUp";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LogIn from "./pages/authentication/LogIn";
import AdminSearchBar from "./components/AdminSearchBar";
import ClientSearchBar from "./components/ClientSearchBar";

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path={"/signup"} component={SignUp}/>
            <Route epath={"/login"} component={LogIn}/>
            <Route epath={"/admin"} component={AdminSearchBar}/>
            <Route epath={"/user"} component={ClientSearchBar}/>
        </Switch>
    </Router>
    , document.getElementById("root"));

