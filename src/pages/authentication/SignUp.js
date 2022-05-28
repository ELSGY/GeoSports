import React from 'react';
import '../../App.css';
import API from "../../API";
import {Link, Route} from "react-router-dom";

const CryptoJS = require("crypto-js")

export default class SignUp extends React.Component {

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
            alreadyExistEmail: '',
            alreadyExistUsername: ''
        }

        this.updateName = this.updateName.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.encryptPassword = this.encryptPassword.bind(this);
        this.updatePhoto = this.updatePhoto.bind(this);
        this.convertFile = this.convertFile.bind(this);
    }

    async componentDidMount() {
        if (localStorage.getItem("clientCookie") !== null) {
            localStorage.clear();
            window.location.reload(true);
        }
    }

    async updateName(event) {
        await this.setState({
            client: {
                ...this.state.client,
                name: event.target.value
            }
        });
    }

    async updateUsername(event) {
        await this.setState({
            client: {
                ...this.state.client,
                username: event.target.value
            }
        });
    }

    async updateEmail(event) {
        await this.setState({
            client: {
                ...this.state.client,
                email: event.target.value
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

    async registerUser(e) {
        e.preventDefault();
        await fetch("http://localhost:8080/user/getUserByEmail/" + this.state.client.email)
            .then(r => r.json())
            .then(r => this.setState({alreadyExistEmail: r["email"]}))

        await fetch("http://localhost:8080/user/getUserByUsername/" + this.state.client.username)
            .then(r => r.json())
            .then(r => this.setState({alreadyExistUsername: r["username"]}))

        // console.log(this.state);

        if (this.state.alreadyExistEmail.length >= 2 && this.state.alreadyExistUsername.length >= 2) {
            console.log("Account already exists! Try LOGIN")
            alert("Account already exists! Try LOGIN")
        } else if (this.state.alreadyExistEmail.length >= 2) {
            console.log("This email already exists! Try another one")
            alert("This email already exists! Try another one")
        } else if (this.state.alreadyExistUsername.length >= 2) {
            console.log("This username already exists! Try another one")
            alert("This username already exists! Try another one")
        } else {
            const encryptedPassword = this.encryptPassword();

            const urlInsert = "/user/insertUser";

            const user = {
                full_name: this.state.client.name,
                username: this.state.client.username,
                email: this.state.client.email,
                password: encryptedPassword,
                photo: this.state.client.photo,
                isAdmin: this.state.client.isAdmin
            }

            this.setCookie().then(() => console.warn("Cookie is set up..."))

            API.post(urlInsert, user)
                .catch(error => {
                    console.error(error)
                });

            fetch("http://localhost:8080/mail/welcome/" + this.state.client.email + "/" + this.state.client.name)
                .catch(error => {
                    console.error(error)
                });
            alert("Your account was created!")
            this.props.history.push("/user/events");
        }
    }

    encryptPassword() {
        return CryptoJS["AES"].encrypt(this.state.client.password, this.state.client.username).toString()
    }

    async setCookie() {
        // set cookie from config file
        const clientCookie = {
            username: this.state.client.username,
            email: this.state.client.email
        }
        await localStorage.setItem(this.state.client.username, JSON.stringify(clientCookie));
    }

    async updatePhoto(event) {
        const file = event.target.files[0];
        const resultPhoto = await this.convertFile(file);
        // console.log(resultPhoto);

        await this.setState({
            client: {
                ...this.state.client,
                photo: resultPhoto
            }
        });
        // console.log(this.state);
    }

    convertFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function () {
                resolve(reader.result)
            };
        })
    }

    render() {
        return (
            <Route>
                <div className="background-signin">
                    <main className="box">
                        <h2>Create account</h2>
                        <form onSubmit={this.registerUser}>
                            <div className="inputBox">
                                <label htmlFor="userName">Full Name<a className={"required"}>*</a></label>
                                <input type="text" name="name" id="name" placeholder="type your username"
                                       onChange={this.updateName}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="username">Username<a className={"required"}>*</a></label>
                                <input type="text" name="userName" id="userName" placeholder="type your username"
                                       onChange={this.updateUsername}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="email">E-mail<a className={"required"}>*</a></label>
                                <input type="email" name="userEmail" id="userEmail" placeholder="type your e-mail"
                                       onChange={this.updateEmail}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="userPassword">Password<a className={"required"}>*</a></label>
                                <input type="password" name="userPassword" id="userPassword" minLength="8"
                                       placeholder="8 characters minimum"
                                       onChange={this.updatePassword}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="photo">Photo <i>(opt.)</i></label>
                                <input type="file" id={"files"} onChange={this.updatePhoto}/>
                            </div>
                            <button type="submit" style={{float: "center"}}>Sign Up
                            </button>
                        </form>
                        <div>
                            <p className="login">Already have an account?</p>
                            <Link className={"linkButton"} to="/login"><p className="login">LOGIN</p></Link>
                        </div>
                    </main>
                </div>
            </Route>
        );
    }
}