import React from 'react';
import {Navbar, NavDropdown, Form, FormControl, Button, Nav} from 'react-bootstrap'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import * as Icons from "react-icons/fa";
import "./navbar.css";
import {adminNavItems} from "./AdminNavItems";
import ManageEvents from "../pages/admin/ManageEvents";
import AddEvents from "../pages/admin/AddEvents";
import Search from "../pages/admin/Search";
import SignIn from "../pages/authentication/SignIn";

export default class SearchBar extends React.Component {
    render() {
        return (
            <Router>
                <nav className="navbar">
                    <p className="logo">
                        GeoSports
                        <Icons.FaTree/>
                    </p>
                    <ul className={"nav-items"}>
                        {adminNavItems.map(item => {
                            return (
                                <li key={item.id} className={item.cName}>
                                    <Link to={item.path}>{item.title}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <Switch>
                    <Route path="/home">
                        <ManageEvents/>
                    </Route>
                    <Route path="/addEvents">
                        <AddEvents/>
                    </Route>
                    <Route path="/searchClient">
                        <Search/>
                    </Route>
                    <Route path="/signOut">
                        <SignIn/>
                    </Route>
                </Switch>
            </Router>

        )
    }
}