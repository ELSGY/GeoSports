import React from 'react';
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
import LogIn from "../pages/authentication/LogIn";

export default class AdminSearchBar extends React.Component {
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
                        <Route path="/admin/manageEvents">
                            <ManageEvents/>
                        </Route>
                        <Route path="/admin/addEvents">
                            <AddEvents/>
                        </Route>
                        <Route path="/admin/searchClient">
                            <Search/>
                        </Route>
                        <Route path="/signOut">
                            <LogIn/>
                        </Route>
                    </Switch>
                </Router>
            </Route>
        )
    }
}