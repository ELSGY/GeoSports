import React from 'react';
import {DirectionsRenderer, GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";
import {Link} from "react-router-dom";
import image from "E:\\Faculta\\Proiect Licenta\\FrontEnd\\src\\images\\event.PNG";

let google;

export default class MyEventsDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            API_key: 'AIzaSyC9-oir9k71wA2xOmZD9d-UNe_2e5Gmtqw',
            client: {
                username: '',
                email: '',
                lat: '',
                lng: '',
                address: ''
            },
            activity: [
                {
                    id: 0,
                    name: "Nan",
                    latitude: 0,
                    longitude: 0,
                    avbPlaces: 0,
                    category: "Nan",
                    subcategory: "Nan",
                    address: "Nan",
                    date: "Nan",
                    time: "Nan",
                    photo: '',
                    enrollCheck: 0
                }
            ],
            destination: '',
            travelMode: ''
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.fetchActivity = this.fetchActivity.bind(this);
        this.getActivityCookie = this.getActivityCookie.bind(this);
        this.getUserCookie = this.getUserCookie.bind(this);
        this.calcRoute = this.calcRoute.bind(this);
        this.sendUnenrolledEmail = this.sendUnenrolledEmail.bind(this);
        this.updateTravelMode = this.updateTravelMode.bind(this);
        this.getMaps = this.getMaps.bind(this);
    }

    async componentDidMount() {
        await this.getMaps()
        await this.getUserCookie();
        await this.getActivityCookie();
        await this.fetchActivity();

        // setTimeout(function () {
        //     window.location.reload(1);
        // }, 5000);

        // console.log(this.state);
        await this.calcRoute()
            .then((result) => this.setState({
                destination: result
            })).catch(() => {
                console.warn("Couldn't retrieve maps...")
            });
    }

    async getMaps() {
        google = await window.google;
    }

    async getActivityCookie() {
        // get cookie from localStorage
        const activityCookie = await localStorage.getItem("activityCookie");
        const cookie = JSON.parse(activityCookie)

        this.setState({
            client: this.state.client,
            activity: {
                name: cookie.activityName
            }
        });
    }

    async getUserCookie() {
        // get cookie from localStorage
        const clientCookie = await localStorage.getItem("clientCookie");

        const cookie = JSON.parse(clientCookie)
        // console.log(cookie)
        this.setState({
            client: cookie
        })
    }

    async fetchActivity() {
        await fetch("http://localhost:8080/activity/getActivityByNameForUser/" + this.state.activity.name + "/" + this.state.client.username)
            .then(res => res.json())
            .then(res => this.buildActivities(res))
            .catch(() => {
                console.warn("No events available...");
            });
    }

    async buildActivities(response) {
        await this.setState({
            API_key: this.state.API_key,
            client: this.state.client,
            activity: response,
            travelMode: 'DRIVING'
        });
    }

    async sendUnenrolledEmail() {
        await fetch("http://localhost:8080/mail/unsubscribe/" + this.state.client.email + "/" + this.state.client.username + "/" + this.state.activity.name)
            .then(() => alert("You've been unenrolled!"))
            .catch(() => {
                console.warn("E-mail address could not be found...")
            });

        window.location.reload();
    }

    async calcRoute() {
        const directionService = new google.maps.DirectionsService();
        return directionService.route({
            origin: this.state.client.address,
            destination: this.state.activity.address,
            travelMode: this.state.travelMode
        });
    }

    async updateTravelMode(e) {
        // console.log(e.target.value)
        const travelMode = e.target.value;
        this.setState({
            travelMode: travelMode
        })
        await this.calcRoute();
    }

    render() {
        const AsyncMap = withScriptjs(
            withGoogleMap(
                () => (
                    <GoogleMap
                        zoom={10}
                        defaultCenter={{lat: this.state.activity.latitude, lng: this.state.activity.longitude}}
                        mapTypeId={'roadmap'}
                    >
                        <DirectionsRenderer directions={this.state.destination}/>
                    </GoogleMap>
                )
            )
        );
        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000, height: '90%'}}>
                        <div className={"activityDetailsAll"}>
                            <div className={"activityDetails"}>
                                <div className={"actDetailsColumn"}>
                                    {this.state.activity["photo"] !== '' ?
                                        (<img className={"activityDetailsImg"}
                                              src={this.state.activity["photo"]}
                                              alt={""}/>) :
                                        (<img className={"activityDetailsImg"}
                                              src={image}
                                              alt={""}/>)
                                    }
                                    <div className={"text"}>
                                        <h3 className={"actDetailsTitle1"}>{this.state.activity["name"]}</h3>
                                        <h5 className={"actDetailsTitle2"}>Location
                                            : {this.state.activity["address"]}</h5>
                                        <h5 className={"actDetailsTitle2"}>Category
                                            : {this.state.activity["subcategory"]}</h5>
                                        <h5 className={"actDetailsTitle2"}>Date : {this.state.activity["date"]}</h5>
                                        <h5 className={"actDetailsTitle2"}>Time : {this.state.activity["time"]}</h5>
                                        <h5 className={"actDetailsTitle2"}>Available places
                                            : {this.state.activity["avbPlaces"]}</h5>
                                        <div className={"actColumn2"}>
                                            <Link className={"actLink2"}
                                                  to={"/user/myEvents"}
                                                  onClick={this.sendUnenrolledEmail}>Leave event</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className={"activityMap"}>
                                    <div className="input">
                                        <label htmlFor="address">🚩 You are here (A):</label>
                                        <input type="text" name="name" id="name" value={this.state.client["address"]}
                                               readOnly/>
                                    </div>
                                    <div className="input">
                                        <label htmlFor="address">🏁 Event takes place at (B):</label>
                                        <input type="text" name="name" id="name" value={this.state.activity["address"]}
                                               readOnly/>
                                    </div>
                                    <div className="input">
                                        <label htmlFor="address">I want to get there by:</label>
                                        <select className="category" onChange={this.updateTravelMode}>
                                            <option value={'DRIVING'}>DRIVING</option>
                                            <option value={'BICYCLING'}>BICYCLING</option>
                                            <option value={'TRANSIT'}>TRANSIT</option>
                                            <option value={'WALKING'}>WALKING</option>
                                        </select>
                                    </div>
                                    <AsyncMap
                                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${this.state.API_key}&libraries=places`}
                                        loadingElement={
                                            <div style={{height: `100%`}}/>
                                        }
                                        containerElement={
                                            <div style={{height: '430px'}}/>
                                        }
                                        mapElement={
                                            <div style={{height: `100%`}}/>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}