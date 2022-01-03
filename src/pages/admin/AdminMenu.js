import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import AddEvents from "./AddEvents";
import '../../App.css';

export default class AdminMenu extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <SearchBar/>
                <Switch>
                    <Route exact path="./addEvents" component={AddEvents}/>
                </Switch>
            </BrowserRouter>
        );
    }
}