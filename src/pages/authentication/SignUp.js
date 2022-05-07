import React from 'react';
import '../../App.css';
import Webcam from "react-webcam";
import API from "../../API";
import {
    Link,
    Route
} from "react-router-dom";

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
            webcamRef: React.createRef(),
            webcamActive: false,
            refreshed: 1,
            popupStatusMessage: '',
            popupStatusType: '',
            alreadyExistEmail: ''
        }

        this.updateName = this.updateName.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.encryptPassword = this.encryptPassword.bind(this);
        this.takePhoto = this.takePhoto.bind(this);
        this.activateCamera = this.activateCamera.bind(this);
        this.deactivateCamera = this.deactivateCamera.bind(this);
        this.updatePopupStatusMessage = this.updatePopupStatusMessage.bind(this);
    }

    async componentDidMount() {
        if (localStorage.getItem("clientCookie") !== null) {
            localStorage.clear();
            window.location.reload(true);
        }
    }

    updatePopupStatusMessage(message, type) {
        this.setState({
                popupStatusMessage: message,
                popupStatusType: type
            }
        )
    }

    async updateName(event) {
        await this.setState({
            client: {
                name: event.target.value,
                username: this.state.client.username,
                email: this.state.client.email,
                password: this.state.client.password,
                photo: this.state.client.photo,
                isAdmin: this.state.client.isAdmin,
            }
        });
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

    async updateEmail(event) {
        await this.setState({
            client: {
                name: this.state.client.name,
                username: this.state.client.username,
                email: event.target.value,
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

    async registerUser(e) {
        e.preventDefault();
        await fetch("http://localhost:8080/user/getUserByEmail/" + this.state.client.email)
            .then(r => r.json())
            .then(r => this.setState({alreadyExistEmail: r["email"]}))

        console.log(this.state.alreadyExistEmail);

        if (this.state.alreadyExistEmail.length > 6) {
            console.log("Account already exists!")
            alert("Account already exists!")
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
                    console.log(error)
                });

            fetch("http://localhost:8080/mail/welcome/" + this.state.client.email + "/" + this.state.client.name)
                .catch(error => {
                    console.log(error)
                });
            alert("Your account was created!")
            this.props.history.push("/user/seeEvents");
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
        await localStorage.setItem("clientCookie", JSON.stringify(clientCookie));
    }

    async takePhoto(event) {
        event.preventDefault()
        const image = this.state.webcamRef.current.getScreenshot();
        // console.log(image)
        await this.setState({
            client: {
                name: this.state.client.name,
                username: this.state.client.username,
                email: this.state.client.email,
                password: this.state.client.password,
                photo: image,
                isAdmin: this.state.client.isAdmin
            }
        });
        // this.updatePopupStatusMessage("fot", 'success');
        // alert("Photo taken!", , )
        alert("Photo taken!");
    }

    activateCamera() {
        this.setState({
            webcamActive: true
        })
    }

    deactivateCamera() {
        this.setState({
            webcamActive: false
        })
    }

    render() {
        const videoConstraints = {
            facingMode: "client"
        };
        return (
            <Route>
                <div className="background-signin">
                    <main className="box">
                        <h2>Create account</h2>
                        <form onSubmit={this.registerUser}>
                            <div className="inputBox">
                                <label htmlFor="userName"><a className={"required"}>*</a>Name</label>
                                <input type="text" name="name" id="name" placeholder="type your username"
                                       onChange={this.updateName}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="username"><a className={"required"}>*</a>Username</label>
                                <input type="text" name="userName" id="userName" placeholder="type your username"
                                       onChange={this.updateUsername}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="email"><a className={"required"}>*</a>E-mail</label>
                                <input type="email" name="userEmail" id="userEmail" placeholder="type your e-mail"
                                       onChange={this.updateEmail}
                                       required/>
                            </div>
                            <div className="inputBox">
                                <label htmlFor="userPassword"><a className={"required"}>*</a>Password</label>
                                <input type="password" name="userPassword" id="userPassword"
                                       placeholder="type your password"
                                       onChange={this.updatePassword}
                                       required/>
                            </div>
                            {this.state.webcamActive ?
                                <div className="inputBox">
                                    <div>
                                        <Webcam className="video" width={250} height={250}
                                                videoConstraints={videoConstraints}
                                                ref={this.state.webcamRef} screenshotFormat="image/jpeg"/>
                                        <button type="submit" name="userPhoto" placeholder="your photo"
                                                onClick={this.takePhoto}>Take photo
                                        </button>
                                        <button type="submit" name="userPhoto" placeholder="your photo"
                                                onClick={this.deactivateCamera}>Close
                                        </button>
                                    </div>

                                </div>
                                :
                                <button type="submit" name="userPhoto" placeholder="your photo"
                                        onClick={this.activateCamera}>Upload photo
                                </button>
                            }
                            <button type="submit" style={{float: "left"}}>Sign Up
                            </button>
                        </form>
                        {/*!this.state.webcamActive ?*/}
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