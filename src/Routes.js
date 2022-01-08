import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
} from "react-router-dom";
import {BsFillGrid1X2Fill} from "react-icons/bs"
import {GiCardPickup} from "react-icons/gi";
import {IoMdArrowDropright, IoMdArrowDropdown} from "react-icons/io"
import React from "react";
import PopupStatus from "./components/Utils/PopupStatus";
import AdminMenu from "./pages/admin/AdminMenu"
import AddEvents from "./pages/admin/AddEvents"
import ManageEvents from "./pages/admin/ManageEvents"

export default class Routes extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            popupStatusMessage: "",
            popupStatusType: "",
            isLoading: true,
            configIsPresent: true,
            menuExpanded: false,
            menus: [
                {
                    name: "Home",
                    path: "/",
                    icon: <BsFillGrid1X2Fill/>,
                    expandedSubmenu: false,
                    submenus: []
                },
                {
                    name: "Add Events",
                    path: "/",
                    icon: <GiCardPickup/>,
                    expandedSubmenu: false,
                    submenus: []
                },
                {
                    name: "Manage Events",
                    path: "/",
                    icon: <BsFillGrid1X2Fill/>,
                    expandedSubmenu: false,
                    submenus: []
                }
            ]
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: false
        })
    }

    updateTitle(title) {
        this.setState({title});
    }

    updatePopupStatusMessage = (popupStatusMessage, popupStatusType) => {
        this.setState({popupStatusMessage, popupStatusType});
    }

    setMenuExpanded = (expanded) => {
        this.setState({
            menuExpanded: expanded
        })
    }

    switchSubMenu = (event, name) => {
        const menus = this.state.menus;
        const index = menus.findIndex((menu, index) => menu.name === name);
        menus[index].expandedSubmenu = !menus[index].expandedSubmenu;

        this.setState({menus});
        // console.log(this.state.menus)
    }

    render() {

        const isMenuExpanded = this.state.menuExpanded;

        return (
            <Router>
                <nav
                    className={`main-menu ${this.state.menuExpanded ? "expanded" : ""}`}
                    onMouseEnter={() => this.setMenuExpanded(true)}
                    onMouseLeave={() => this.setMenuExpanded(false)}>
                    <ul>
                        {
                            this.state.menus.map((menu, i) => {
                                const isSubMenuPresent = menu.submenus.length !== 0;
                                const isSubMenuExpanded = menu.expandedSubmenu;
                                return (
                                    <li key={i}
                                        onMouseEnter={event => this.switchSubMenu(event, menu.name)}
                                        onMouseLeave={event => this.switchSubMenu(event, menu.name)}>
                                        {isSubMenuPresent ?
                                            <React.Fragment>
                                                <NavLink to={menu.path} activeClassName="active">
                                                    <span className="button">
                                                        <span className="nav-icon">{menu.icon}</span>
                                                        <span className="nav-text">{menu.name}</span>
                                                        {isSubMenuExpanded ?
                                                            <span
                                                                className="nav-icon-submenu"><IoMdArrowDropdown/></span> :
                                                            <span
                                                                className="nav-icon-submenu"><IoMdArrowDropright/></span>
                                                        }
                                                    </span>
                                                </NavLink>
                                                {isSubMenuExpanded && isMenuExpanded &&
                                                <div>
                                                    <ul className="submenu">
                                                        {menu.submenus.map((submenu, j) => {
                                                            return (
                                                                <li key={j}>
                                                                    <NavLink to={submenu.path}
                                                                             activeClassName="active">
                                                                        <span className="nav-icon">{submenu.icon}</span>
                                                                        <span className="nav-text">{submenu.name}</span>
                                                                    </NavLink>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                                }
                                            </React.Fragment> :
                                            <React.Fragment>
                                                {i === 0 ?
                                                    <NavLink exact to={`${menu.path}`} activeClassName="active">
                                                        <span className="button">
                                                            <span className="nav-icon">{menu.icon}</span>
                                                            <span className="nav-text">{menu.name}</span>
                                                        </span>
                                                    </NavLink> :
                                                    <NavLink to={`${menu.path}`} activeClassName="active">
                                                        <span className="button">
                                                            <span className="nav-icon">{menu.icon}</span>
                                                            <span className="nav-text">{menu.name}</span>
                                                        </span>
                                                    </NavLink>
                                                }
                                            </React.Fragment>
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>
                </nav>
                <div className="bg-light">
                    <PopupStatus message={this.state.popupStatusMessage} type={this.state.popupStatusType}/>
                    <Switch>
                        <Route exact path="/">
                            <AdminMenu updateTitle={this.updateTitle}/>
                        </Route>
                        <Route path="/add-events">
                            <AddEvents updateTitle={this.updateTitle}
                                       updatePopupStatusMessage={this.updatePopupStatusMessage}/>
                        </Route>
                        <Route path="/manage-events">
                            <ManageEvents updateTitle={this.updateTitle}
                                          updatePopupStatusMessage={this.updatePopupStatusMessage}/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}