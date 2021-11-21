import React from 'react';
import '../../App.css';

export default class LogIn extends React.Component {

    constructor(props) {
        super(props);
    }

render(){
    return (
        <div>
            <div className="background-signin">
            <main className="box">
                <h2>Login</h2>
                <form>
                    <div className="inputBox">
                        <label htmlFor="userName">Username</label>
                        <input type="text" name="userName" id="userName" placeholder="type your username" required/>
                    </div>
                    <div className="inputBox">
                        <label htmlFor="userPassword">Password</label>
                        <input type="password" name="userPassword" id="userPassword" placeholder="type your password"
                               required/>
                    </div>
                    <div>
                        <button type="submit" name="" style={{ float: "left" }}>Submit</button>
                        {/*<Link className="button" to="/register" style={{ float: "left" }}>Register</Link>*/}
                    </div>
                </form>
            </main>
            </div>
        </div>
    );
}

}