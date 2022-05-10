import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import * as Icons from "react-icons/fa";
import "./navbar.css";
import {clientNavItems} from "./ClientNavItems";
import SeeUnenrolledEvents from "../pages/client/SeeUnenrolledEvents";
import SignUp from "../pages/authentication/SignUp";
import ActivityEnrollPage from "../pages/client/ActivityEnrollPage";

export default class ClientSearchBar extends React.Component {
    render() {
        return (
            <Route>
                <Router>
                    <nav className="navbar">
                        <p className="logo">
                            GeoSports
                            <Icons.FaTree/>
                        </p>
                        <ul className={"nav-items"}>
                            {clientNavItems.map(item => {
                                return (
                                    <li key={item.id} className={item.cName}>
                                        <Link to={item.path}>{item.title}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                    <Switch>
                        <Route exact={true} path="/user/seeEvents">
                            <SeeUnenrolledEvents/>
                        </Route>
                        <Route exact={true} path="/user/seeActivityDetails">
                            <ActivityEnrollPage/>
                        </Route>
                        <Route exact={true} path="/">
                            <SignUp/>
                        </Route>
                    </Switch>
                </Router>
            </Route>
        );
    }
}