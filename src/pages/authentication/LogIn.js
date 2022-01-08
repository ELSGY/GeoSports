import React from 'react';
import '../../App.css';
import {Link, Route, Router} from "react-router-dom";

const CryptoJS = require("crypto-js")

export default class LogIn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            client: {
                name: '',
                username: '',
                email: '',
                password: '',
                photo: '',
                isAdmin: false
            },
            path: ''
        }
        this.updatePassword = this.updatePassword.bind(this);
        this.decryptPassword = this.decryptPassword.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.setUser = this.setUser.bind(this);
        this.setCookie = this.setCookie.bind(this);
    }

    async loginUser(event) {
        event.preventDefault()
        await fetch("http://localhost:8080/user/getUserByUsername/" + this.state.client.username)
            .then(r => r.json())
            .then(r => this.setUser(r))
            .catch(error => {
                console.log(error)
            });
    }

    async setUser(user) {
        const decryptedPassword = await this.decryptPassword(user["password"]);
        const username = user["username"];

        if (this.state.client.password === decryptedPassword && this.state.client.username === username) {
            if (user["isAdmin"] === true) {
                this.setState({
                    path: '/user'
                });
                console.warn("User is logging in...");
            } else {
                this.setState({
                    path: '/admin'
                });
                console.warn("Admin is logging in...");
            }

            await this.setState({
                client: {
                    name: user["name"],
                    username: user["username"],
                    email: user["email"],
                    password: user["password"],
                    photo: user["photo"],
                    isAdmin: user["isAdmin"]
                }
            })
            await this.setCookie()
            alert("Successfully logged in...")
        } else {
            console.warn("Invalid credentials...")
            alert("Invalid credentials...")
        }
    }

    async setCookie() {
        // set cookie from config file
        const clientCookie = {
            username: this.state.client.username,
            email: this.state.client.email
        }
        await sessionStorage.setItem("clientCookie", JSON.stringify(clientCookie));
    }

    async updateUsername(event) {
        await this.setState({
            client: {
                name: this.state.client.name,
                username: event.target.value,
                email: this.state.client.email,
                password: this.state.client.password,
                photo: this.state.client.photo,
                isAdmin: this.state.client.isAdmin
            }
        });
    }

    async updatePassword(event) {
        await this.setState({
            client: {
                name: this.state.client.name,
                username: this.state.client.username,
                email: this.state.client.email,
                password: event.target.value,
                photo: this.state.client.photo,
                isAdmin: this.state.client.isAdmin
            }
        });
    }

    async decryptPassword(password) {
        return await CryptoJS["AES"].decrypt(password, "PASSWORD").toString(CryptoJS["enc"].Utf8);
    }

    render() {
        return (
            <Route>
                <div>
                    <div className="background-signin">
                        <main className="box">
                            <h2>Login</h2>
                            <form>
                                <div className="inputBox">
                                    <label htmlFor="userName"><a className={"required"}>*</a>Username</label>
                                    <input type="text" name="userName" id="userName" placeholder="type your username"
                                           onChange={this.updateUsername}
                                           required/>
                                </div>
                                <div className="inputBox">
                                    <label htmlFor="userPassword"><a className={"required"}>*</a>Password</label>
                                    <input type="password" name="userPassword" id="userPassword"
                                           placeholder="type your password"
                                           onChange={this.updatePassword}
                                           required/>
                                </div>
                                <div className="loginButton">
                                    <Link to={this.state.path}>
                                        <button type="submit" name="loginButton"
                                                onClick={this.loginUser}>Login
                                        </button>
                                    </Link>
                                </div>
                            </form>
                            <div>
                                <p className="signup">Don't have an account?</p>
                                <Link className={"linkButton"} to="/signup"><p className="login">SIGN UP</p></Link>
                            </div>
                        </main>
                    </div>
                </div>
            </Route>
        );
    }
}