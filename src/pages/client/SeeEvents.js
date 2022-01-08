import React from 'react';
import {login} from './Cookies'

export default class SeeEvents extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            client: {
                username: '',
                email: '',
                attending: ''
            },
            activities: [
                {
                    id: 0,
                    name: "",
                    latitude: 0,
                    longitude: 0,
                    avbPlaces: 0,
                    category: "",
                    subcategory: "",
                    address: "",
                    date: "",
                    time: "",
                    attending: 0
                }
            ]
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.getActivityById = this.getActivityById.bind(this);
        this.sendEnrolledEmail = this.sendEnrolledEmail.bind(this);
        this.setCookie = this.setCookie.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.fetchDefaultActivities = this.fetchDefaultActivities.bind(this)

    }

    componentDidMount() {
        this.setCookie().catch(e => console.log(e));
        this.getCookie().catch(e => console.log(e));
        this.fetchDefaultActivities().catch(e => console.log(e))
    }

    async fetchDefaultActivities() {
        await fetch("http://localhost:8080/activity/getDefaultActivitiesForUser/Flavi23")
            .then(res => res.json())
            .then(res => this.buildActivities(res));
    }

    async getCookie() {
        // get cookie from sessionStorage
        const clientCookie = await sessionStorage.getItem("clientCookie");
        const cookie = JSON.parse(clientCookie)

        await this.setState({
            client: {
                username: cookie.username,
                email: cookie.email,
            }
        })

        console.log(this.state.client.username)
    }

    async setCookie() {
        // set cookie from config file
        const clientCookie = {
            username: login.username,
            email: login.email
        }
        await sessionStorage.setItem("clientCookie", JSON.stringify(clientCookie));
    }

    async buildActivities(response) {
        console.log(response);

        await this.setState({
            activities: response
        })
    }

    async sendEnrolledEmail(event) {

        const activityId = event.target.id
        await this.setState({
            client: {
                email: this.state.client.email,
                username: this.state.client.username,
                attending: this.state.activities[activityId]["name"]
            }
        })

        await fetch("http://localhost:8080/mail/" + this.state.client.email + "/" + this.state.client.username + "/" + this.state.client.attending)
            .then(() => alert("You've been enrolled!"))
            .catch(() => {
                console.warn("E-mail address could not be found...")
            });

    }

    getActivityById(id) {
        return this.state.activities[id];
    }

    render() {
        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000}}>
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Date</th>
                                <th width="10px">Time</th>
                                <th>Available places</th>
                            </tr>
                            {
                                this.state.activities.map((obj, index) => {
                                    return (<tr key={index}>
                                        <td>
                                            {obj["name"]}
                                        </td>
                                        <td>
                                            {obj["category"]}
                                        </td>
                                        <td>
                                            {obj["subcategory"]}
                                        </td>
                                        <td>
                                            {obj["date"]}
                                        </td>
                                        <td>
                                            {obj["time"]}
                                        </td>
                                        <td>
                                            {obj["avbPlaces"]}
                                        </td>
                                        {
                                            obj["avbPlaces"] === 0 ?
                                                (<td style={{background: "transparent"}}>
                                                    <input type="submit" id={index} value="Unavailable"
                                                           style={{background: "rgb(221, 221, 221)"}}/>

                                                </td>)
                                                : (<td style={{background: "transparent"}}>
                                                    <input type="submit" id={index} value="Enroll"
                                                           onClick={this.sendEnrolledEmail}/>

                                                </td>)
                                        }
                                    </tr>)
                                })
                            }
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}