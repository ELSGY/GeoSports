import React from 'react';
import ReactDOM from 'react-dom';
import AddEvents from "./pages/admin/AddEvents";
import Search from "./pages/admin/Search";
import ManageEvents from "./pages/admin/ManageEvents";
import AdminSearchBar from "./components/AdminSearchBar";
import ClientSearchBar from "./components/ClientSearchBar";
import SeeEvents from "./pages/client/SeeEvents";

ReactDOM.render(<AdminSearchBar/>, document.getElementById("root"));