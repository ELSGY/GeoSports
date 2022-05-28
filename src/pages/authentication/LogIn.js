import React from 'react';
import '../../App.css';
import {Link} from "react-router-dom";
import Geocode from "react-geocode";

Geocode["setApiKey"]("AIzaSyC9-oir9k71wA2xOmZD9d-UNe_2e5Gmtqw");
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
            path: '',
            coords: {
                lat: '',
                lng: '',
                address: ''
            }
        }
        this.updatePassword = this.updatePassword.bind(this);
        this.decryptPassword = this.decryptPassword.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.setUser = this.setUser.bind(this);
        this.setCookie = this.setCookie.bind(this);
    }

    async componentDidMount() {
        localStorage.clear();
        if (navigator.geolocation) {
            await navigator.geolocation.getCurrentPosition(position => {
                    Geocode["fromLatLng"](position.coords.latitude, position.coords.longitude).then(
                        response => {
                            const address = response.results[0]["formatted_address"];
                            this.setState({
                                coords: {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                    address: (address) ? address : ''
                                }
                            })
                        },
                        error => {
                            console.error(error);
                        }
                    );
                }
            )
        }
    }

    async loginUser(event) {
        event.preventDefault();
        await fetch("http://localhost:8080/user/getUserByUsername/" + this.state.client.username)
            .then(r => r.json())
            .then(r => this.setUser(r))
            .then(r => {
                if (r === "user") {
                    this.props.history.push("/user/events")
                } else if (r === "admin") {
                    this.props.history.push("/admin/manageEvents")
                } else {
                    alert("Invalid credentials...")
                }
            })
            .catch(() => {
                alert("Invalid credentials...")
            });

    }

    async setUser(user) {
        const decryptedPassword = await this.decryptPassword(user["password"], user["username"]);
        const username = user["username"];
        const isAdmin = user["isAdmin"];
        if (this.state.client.password === decryptedPassword && this.state.client.username === username) {
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
            await this.setCookie();
            if (isAdmin === "false") {
                console.warn("User is logging in...");
                return "user";
            } else {
                console.warn("Admin is logging in...");
                return "admin";
            }
        } else {
            console.warn("Invalid credentials...")
            alert("Invalid credentials...")
        }
    }

    async setCookie() {
        // set cookie from config file
        const clientCookie = {
            username: this.state.client.username,
            email: this.state.client.email,
            lat: this.state.coords.lat,
            lng: this.state.coords.lng,
            address: this.state.coords.address
        }
        await localStorage.setItem(this.state.client.username, JSON.stringify(clientCookie));
    }

    async updateUsername(event) {
        await this.setState({
            client: {
                ...this.state.client,
                username: event.target.value
            }
        });
    }

    async updatePassword(event) {
        await this.setState({
            client: {
                ...this.state.client,
                password: event.target.value
            }
        });
    }

    async decryptPassword(password, username) {
        return await CryptoJS["AES"].decrypt(password, username).toString(CryptoJS["enc"].Utf8);
    }

    render() {
        return (
            <div>
                <div className="background-signin">
                    <main className="box">
                        <h2>Login</h2>
                        <form>
                            <div className="inputBox">
                                <label htmlFor="userName">Username<a className={"required"}>*</a></label>
                                <input type="text" name="userName" id="userName"
                                       placeholder="type your username"
                                       onChange={this.updateUsername}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="userPassword">Password<a className={"required"}>*</a></label>
                                <input type="password" name="userPassword" id="userPassword"
                                       placeholder="type your password"
                                       onChange={this.updatePassword}
                                       required/>
                            </div>
                            <div className="loginButton">
                                <Link>
                                    <button type="submit" name="loginButton"
                                            onClick={this.loginUser}>Login
                                    </button>
                                </Link>
                            </div>
                        </form>
                        <div>
                            <p className="signup">Don't have an account?</p>
                            <Link className={"linkButton"} to="/"><p className="login">SIGN UP</p></Link>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}