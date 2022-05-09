import React from 'react';
import {GoogleMap, Marker, withGoogleMap, withScriptjs, DirectionsRenderer} from "react-google-maps";
import dateFormat, {masks} from "dateformat";

const google = window.google;

export default class ActivityEnrollPage extends React.Component {

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
                    photo: ''
                }
            ],
            pastEvent: 0,
            destination: ''
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.fetchActivity = this.fetchActivity.bind(this);
        this.getActivityCookie = this.getActivityCookie.bind(this);
        this.getUserCookie = this.getUserCookie.bind(this);
        this.sendEnrolledEmail = this.sendEnrolledEmail.bind(this);
        this.calcRoute = this.calcRoute.bind(this);

    }

    async componentDidMount() {
        await this.getUserCookie();
        await this.getActivityCookie();
        await this.fetchActivity();
        const now = new Date();
        masks.hammerTime = 'yyyy-mm-dd';
        const date = dateFormat(now, "hammerTime");
        console.log(date);
        if (date > this.state.activity.date) {
            await this.setState({
                API_key: this.state.API_key,
                client: this.state.client,
                activity: this.state.activity,
                pastEvent: 1
            });
        }
        console.log(this.state);
        // await this.calcRoute();
        // console.log(google.maps.TransitMode.BUS)
    }

    async getActivityCookie() {
        // get cookie from localStorage
        const activityCookie = await localStorage.getItem("activityCookie");
        const cookie = JSON.parse(activityCookie)

        await this.setState({
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

        await this.setState({
            client: {
                username: cookie.username,
                email: cookie.email,
                lat: cookie.lat,
                lng: cookie.lng,
                address: cookie.address
            }
        })
    }

    async fetchActivity() {
        await fetch("http://localhost:8080/activity/getActivityByName/" + this.state.activity.name)
            .then(res => res.json())
            .then(res => this.buildActivities(res));
    }

    async buildActivities(response) {
        await this.setState({
            API_key: this.state.API_key,
            client: this.state.client,
            activity: response,
            pastEvent: this.state.pastEvent
        });
        // console.log(this.state);
    }

    async sendEnrolledEmail() {
        await fetch("http://localhost:8080/mail/" + this.state.client.email + "/" + this.state.client.username + "/" + this.state.activity.name)
            .then(() => alert("You've been enrolled!"))
            .catch(() => {
                console.warn("E-mail address could not be found...")
            });

        await fetch("http://localhost:8080/activity/userEnrolled/" + this.state.activity.name)
            .catch(() => {
                console.warn("Error updating activity...")
            });

        window.location.reload(true);
    }

    async calcRoute() {

        const directionService = new google.maps.DirectionsService();
        const result = directionService.route({
            origin: this.state.client.address,
            destination: this.state.activity.address,
            travelMode: google.maps.TravelMode.DRIVING
        });
        console.log(result);
        await this.setState({
            destination: result
        })
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
                        {/*Marker*/}
                        <Marker
                            google={this.props.google}
                            draggable={false}
                            position={{lat: this.state.activity.latitude, lng: this.state.activity.longitude}}
                        />
                        <Marker/>
                        <Marker
                            google={this.props.google}
                            draggable={false}
                            position={{lat: this.state.client.lat, lng: this.state.client.lng}}
                            // icon={'🏁'}
                        />
                        <Marker/>
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
                                    <img className={"activityDetailsImg"}
                                         src={this.state.activity["photo"]}
                                         alt={""}/>
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
                                        {
                                            this.state.paste === 1 ?
                                                <input type="submit" value="Event closed"/> :
                                                <input type="submit" value="Enroll" onClick={this.sendEnrolledEmail}/>
                                        }
                                    </div>
                                </div>
                                <div className={"activityMap"}>
                                    {/*<FontAwesomeIcon icon="fa-solid fa-location-dot"/>*/}
                                    <div className="input">
                                        <label htmlFor="address">🚩 Starting point:</label>
                                        <input type="text" name="name" id="name" value={this.state.client["address"]}
                                               readOnly/>
                                    </div>
                                    <div className="input">
                                        <label htmlFor="address">🏁 Destination point:</label>
                                        <input type="text" name="name" id="name" value={this.state.activity["address"]}
                                               readOnly/>
                                    </div>
                                    <AsyncMap
                                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${this.state.API_key}&libraries=places`}
                                        loadingElement={
                                            <div style={{height: `100%`}}/>
                                        }
                                        containerElement={
                                            <div style={{height: '330px'}}/>
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