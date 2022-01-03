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
import LogIn from "../pages/authentication/LogIn";
import SeeEvents from "../pages/client/SeeEvents";

export default class ClientSearchBar extends React.Component {
    render() {
        return (
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
                    <Route path="/seeEvents">
                        <SeeEvents/>
                    </Route>
                    <Route path="/signOut">
                        <LogIn/>
                    </Route>
                </Switch>
            </Router>

        )
    }
}