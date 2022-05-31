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
            <Route exact={true} path={"/"} component={SignUp}/>
            <Route exact={true} path={"/login"} component={LogIn}/>
            <Route exact={true} path={"/admin/manageEvents"} component={AdminSearchBar}/>
            <Route exact={true} path={"/admin/editType"} component={AdminSearchBar}/>
            <Route exact={true} path={"/admin/addEvents"} component={AdminSearchBar}/>
            <Route exact={true} path={"/admin/top"} component={AdminSearchBar}/>
            <Route exact={true} path={"/admin/searchClient"} component={AdminSearchBar}/>
            <Route exact={true} path={"/user/events"} component={ClientSearchBar}/>
            <Route exact={true} path={"/user/myEvents"} component={ClientSearchBar}/>
            <Route exact={true} path={"/user/pastEvents"} component={ClientSearchBar}/>
            <Route exact={true} path={"/user/eventsDetails"} component={ClientSearchBar}/>
            <Route exact={true} path={"/user/myEventsDetails"} component={ClientSearchBar}/>
        </Switch>
    </Router>
    , document.getElementById("root"));

