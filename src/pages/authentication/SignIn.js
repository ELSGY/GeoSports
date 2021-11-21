import React from 'react';
import '../../App.css';

export default class SignIn extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="background-signin">

                <main className="box">
                    <h2>Register</h2>
                    <form>
                        <div className="inputBox">
                            <label htmlFor="userName">Name</label>
                            <input type="text" name="name" id="name" placeholder="type your username" required/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="userName" id="userName" placeholder="type your username"
                                   required/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="userEmail" id="userEmail" placeholder="type your email"
                                   required/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="userPassword">Password</label>
                            <input type="password" name="userPassword" id="userPassword"
                                   placeholder="type your password"
                                   required/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="userConfirmPassword">Confirm Password</label>
                            <input type="password" name="userPassword" id="userConfirmPassword"
                                   placeholder="confirm your password"
                                   required/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="photo">Smile for us :)</label>
                            <input type="blob" name="userPhoto"
                                   placeholder="your photo"
                                   required/>
                        </div>
                        <button type="submit" name="" style={{float: "left"}}>Submit</button>
                        {/*<Link className="button" to="/login" style={{ float: "left" }}>Login</Link>*/}
                    </form>
                </main>

            </div>
        );
    }
}