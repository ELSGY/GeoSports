import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from "./pages/authentication/SignUp";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LogIn from "./pages/authentication/LogIn";
import AdminSearchBar from "./components/AdminSearchBar";
import ClientSearchBar from "./components/ClientSearchBar";
import ActivityEnrollPage from "./pages/client/ActivityEnrollPage";

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact={true} path={"/"} component={SignUp}/>
            <Route exact={true} path={"/login"} component={LogIn}/>
            <Route exact={true} path={"/admin/manageEvents"} component={AdminSearchBar}/>
            <Route exact={true} path={"/admin/addEvents"} component={AdminSearchBar}/>
            <Route exact={true} path={"/admin/searchClient"} component={AdminSearchBar}/>
            <Route exact={true} path={"/user/seeEvents"} component={ClientSearchBar}/>
            <Route exact={true} path={"/user/seeActivityDetails"} component={ActivityEnrollPage}/>
        </Switch>
    </Router>
    , document.getElementById("root"));

