import React from 'react';
import ReactDOM from 'react-dom';
import SignUp from "./pages/authentication/SignUp";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LogIn from "./pages/authentication/LogIn";
import AdminSearchBar from "./components/AdminSearchBar";
import ClientSearchBar from "./components/ClientSearchBar";
import SeeEvents from "./pages/client/SeeEvents";

ReactDOM.render(
    <Router>
        <Switch>
            {/*<Route exact path={"/signup"} component={SignUp}/>*/}
            {/*<Route path={"/login"} component={LogIn}/>*/}
            <Route path={"/admin/manageEvents"} component={AdminSearchBar}/>
            {/*<Route path={"/user/seeEvents"} component={SeeEvents}/>*/}
        </Switch>
    </Router>
    , document.getElementById("root"));

