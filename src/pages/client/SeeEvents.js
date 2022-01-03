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

    }

    componentDidMount() {
        fetch("http://localhost:8080/activity/allActivities")
            .then(res => res.json())
            .then(res => this.buildActivities(res));

        this.setCookie();
        this.getCookie();
    }

    getCookie() {
        // get cookie from sessionStorage
        const cookie = JSON.parse(sessionStorage.getItem("clientCookie"))

        this.setState({
            client: {
                username: cookie.username,
                email: cookie.email,
            }
        })

        console.log(cookie)
    }

    setCookie() {
        // set cookie from config file
        const clientCookie = {
            username: login.username,
            email: login.email
        }
        sessionStorage.setItem("clientCookie", JSON.stringify(clientCookie));
    }

    buildActivities(response) {

        const activities = []
        response.forEach(obj => {

            const activity = {
                id: obj.id,
                name: obj.name,
                latitude: obj.lat,
                longitude: obj.lng,
                avbPlaces: obj.avbPlaces,
                category: obj.category,
                subcategory: obj.subcategory,
                address: obj.address,
                participants: obj.participants,
                date: obj.date,
                time: obj.time,
                attending: 0
            }
            activities.push(activity);
        });

        this.setState({
            activities: activities
        })
        console.log(this.state.activities);
    }

    async sendEnrolledEmail() {
        alert(this.state.client.username)
        // await fetch("http://localhost:8080/mail/" + this.state.client.email + "/" + this.state.client.username + "/" + this.state.client.attending)
        //     .then(() => alert("You've been enrolled!"))
        //     .catch(error => {
        //         console.log(error)
        //     });
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
                                <th>Avb. places</th>
                                <th>Action</th>
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
                                        <td>
                                            <input type="submit" id={index} value="Enroll"
                                                   onClick={this.sendEnrolledEmail}/>
                                        </td>
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