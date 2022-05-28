import React from 'react';
import {FaStar} from "react-icons/all";

const colors = {
    orange: "FFBA5A",
    grey: "a9a9a9"
}

export default class PastEvents extends React.Component {

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
        this.setCoords = this.setCoords.bind(this);
        this.giveRating = this.giveRating.bind(this);
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
        console.log(this.state.coords)
    }

    async fetchDefaultActivities() {
        await fetch("http://localhost:8080/activity/getEnrolledPastActivitiesForUser/" + this.state.client.username)
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
        console.log(response);

        const array = Array();

        response.map(act => {
            const activity = {
                id: act.id,
                name: act.name,
                latitude: act.latitude,
                longitude: act.longitude,
                avbPlaces: act.avbPlaces,
                category: act.category,
                subcategory: act.subcategory,
                address: act.address,
                date: act.date,
                time: act.time,
                photo: act.photo,
                attending: act.attending,
                currentValue: act.rating,
                hoverValue: undefined
            }
            array.push(activity);
        })

        await this.setState({
            activities: array
        })
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

    clickStar(actIndex, value) {

        // 1. Make a shallow copy of the array
        const activitiesCopy = [...this.state.activities];

        // 2. Make a shallow copy of the element you want to mutate
        const updateActivity = {...activitiesCopy[actIndex]};

        // 3. Update the property you're interested in
        updateActivity["currentValue"] = value;

        activitiesCopy[actIndex] = updateActivity;

        this.setState({activities: activitiesCopy})

    }

    hoverStar(actIndex, value) {

        // 1. Make a shallow copy of the array
        const activitiesCopy = [...this.state.activities];

        // 2. Make a shallow copy of the element you want to mutate
        const updateActivity = {...activitiesCopy[actIndex]};

        // 3. Update the property you're interested in
        if (value >= updateActivity["currentValue"]) {
            updateActivity["hoverValue"] = value;
        }

        activitiesCopy[actIndex] = updateActivity;

        this.setState({activities: activitiesCopy})
    }

    unHoverStar(actIndex) {

        // 1. Make a shallow copy of the array
        const activitiesCopy = [...this.state.activities];

        // 2. Make a shallow copy of the element you want to mutate
        const updateActivity = {...activitiesCopy[actIndex]};

        // 3. Update the property you're interested in
        updateActivity["hoverValue"] = 0;

        activitiesCopy[actIndex] = updateActivity;

        this.setState({activities: activitiesCopy})
    }

    async giveRating(actIndex) {

        // 1. Make a shallow copy of the array
        const activitiesCopy = [...this.state.activities];

        // 2. Make a shallow copy of the element you want to mutate
        const activity = {...activitiesCopy[actIndex]};

        const id = activity.id;
        const rating = activity.currentValue;
        // console.log(activity)

        await fetch("http://localhost:8080/activity/updateActivityRating/" + this.state.client.username + "/" + id + "/" + rating)
            .catch(() => {
                console.warn("Rating couldn't be given")
            });

        window.location.reload();
    }

    render() {

        const stars = Array(5).fill(0);

        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000, height: '90%'}}>
                        {
                            this.state.activities.length < 1 ?
                                <div className={"noEvents"}>
                                    <div className={"noEventsImg"}/>
                                    <h2 className={"noEventsMessage"}>Nothing to rate yet</h2>
                                </div>
                                :
                                this.state.activities.map((obj, index1) => {
                                    return (
                                        <div className={"pastActivities"}>
                                            <div className={"activityDetails"}>
                                                <div className={"actDetailsColumn"}>
                                                    <img className={"activityDetailsImg2"}
                                                         src={obj["photo"]}
                                                         alt={""}
                                                         key={index1}/>
                                                    <div className={"text"}>
                                                        <h2 className={"actDetailsTitle1"}>{obj["name"]}</h2>
                                                        <h3 className={"actDetailsTitle2"}>Location
                                                            : {obj["address"]}</h3>
                                                        <h3 className={"actDetailsTitle2"}>Date
                                                            : {obj["date"]}</h3>
                                                        <div className={"actColumn2"}>
                                                            {
                                                                stars.map((star, index) => {
                                                                    return (
                                                                        <FaStar className={"stars"} key={index}
                                                                                color={(this.state.activities[index1].hoverValue || this.state.activities[index1].currentValue) > index ? colors.orange : colors.grey}
                                                                                onClick={() => this.clickStar(index1, index + 1)}
                                                                                onMouseOver={() => this.hoverStar(index1, index + 1)}
                                                                                onMouseLeave={() => this.unHoverStar(index1)}/>
                                                                    )
                                                                })
                                                            }
                                                            <button className={"actLink2"}
                                                                    onClick={() => this.giveRating(index1)}>Rate
                                                            </button>
                                                        </div>
                                                    </div>
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