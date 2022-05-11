import React from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import * as Icons from "react-icons/fa";
import "./navbar.css";
import {clientNavItems} from "./ClientNavItems";
import Events from "../pages/client/Events";
import MyEvents from "../pages/client/MyEvents";
import SignUp from "../pages/authentication/SignUp";
import EventsDetails from "../pages/client/EventsDetails";
import MyEventsDetails from "../pages/client/MyEventsDetails";

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
                        <Route exact={true} path="/user/events">
                            <Events/>
                        </Route>
                        <Route exact={true} path="/user/myEvents">
                            <MyEvents/>
                        </Route>
                        <Route exact={true} path="/user/eventsDetails">
                            <EventsDetails/>
                        </Route>
                        <Route exact={true} path="/user/myEventsDetails">
                            <MyEventsDetails/>
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