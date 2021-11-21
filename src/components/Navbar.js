import React from 'react';
import {BrowserRouter, Link} from "react-router-dom";
import * as Icons from "react-icons/fa";
import "./navbar.css";
import {adminNavItems} from "./AdminNavItems";

function Navbar() {
    return (
        <>
            <BrowserRouter>
                <nav className="navbar">
                    <Link className="logo">
                        GeoSports
                        <Icons.FaTree/>
                    </Link>
                    <ul className={"nav-items"}>
                        {adminNavItems.map(item => {
                            return(
                            <li key={item.id} className={item.cName}>
                                <Link to={item.path}>{item.title}</Link>
                            </li>
                        );
                        })}
                    </ul>
                </nav>
            </BrowserRouter>
        </>
    );
}

export default Navbar;