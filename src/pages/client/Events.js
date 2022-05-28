import React from 'react';
import {Link} from "react-router-dom";
import image from "E:\\Faculta\\Proiect Licenta\\FrontEnd\\src\\images\\event.PNG"

export default class Events extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            client: {
                username: '',
                email: '',
                attending: ''
            },
            coords: {
                lat: 0,
                lng: 0
            },
            activities: []
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.getActivityById = this.getActivityById.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.fetchDefaultActivities = this.fetchDefaultActivities.bind(this)
        this.setCoords = this.setCoords.bind(this)
        this.seeActivityDetails = this.seeActivityDetails.bind(this)

    }

    async componentDidMount() {
        await this.getCookie();
        await this.fetchDefaultActivities();
    }

    async setCoords(lat, lng) {
        await this.setState({
            coords: {
                lat: lat,
                lng: lng
            }
        })
    }

    async fetchDefaultActivities() {
        await fetch("http://localhost:8080/activity/getUnenrolledActivitiesForUser/" + this.state.client.username)
            .then(res => res.json())
            .then(res => this.buildActivities(res))
            .catch(() => {
                console.warn("No events available...");
            });
    }

    async getCookie() {
        // get cookie from localStorage
        const clientCookie = await localStorage.getItem("clientCookie");
        const cookie = JSON.parse(clientCookie)

        this.setState({
            client: {
                username: cookie.username,
                email: cookie.email,
            },
            coords: {
                lat: cookie.lat,
                lng: cookie.lng
            }
        })
        // console.log(this.state.client.username)
    }

    async buildActivities(response) {
        await this.setState({
            activities: response
        })
    }

    async seeActivityDetails(event) {
        const activityName = event.target.id;
        await this.setActivityCookie(activityName).then(() => console.warn("Cookie set"));
    }

    async setActivityCookie(eventName) {
        const activityCookie = {
            activityName: eventName
        }
        localStorage.setItem("activityCookie", JSON.stringify(activityCookie));
    }

    getActivityById(id) {
        return this.state.activities[id];
    }

    render() {
        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000, height: '90%'}}>
                        {
                            this.state.activities.length < 1 ?
                                <div className={"noEvents"}>
                                    <div className={"noEventsImg"}/>
                                    <h2 className={"noEventsMessage"}>No future events found</h2>
                                </div>
                                :
                                this.state.activities.map((obj, key) => {
                                    return (
                                        <div className={"activities"}>
                                            <div id={obj["name"]} key={key} className={"activity"}>
                                                <div className={"actColumn"}>
                                                    {obj["photo"].length > 200 ?
                                                        (<img className={"activityImg"}
                                                              src={obj["photo"]}
                                                              alt={""}/>) :
                                                        (<img
                                                            className={"activityImg"}
                                                            src={image}
                                                            alt={""}/>)
                                                    }
                                                < /div>
                                                <div className={"actColumn"}>
                                                    <h3 className={"actTitle1"}>{obj["name"]}</h3>
                                                </div>
                                                <div className={"actColumn"}>
                                                    <h5 className={"actTitle2"}>{obj["address"]}</h5>
                                                </div>
                                                <div className={"actColumn1"}>
                                                    <Link className={"actLink"}
                                                          to={"/user/eventsDetails"}
                                                          id={obj["name"]}
                                                          onClick={this.seeActivityDetails}>Details</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </div>
            </div>
        )
    }
}