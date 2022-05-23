import React from 'react';
import Autocomplete from 'react-google-autocomplete';

export default class ManageEvents extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            onUpdate: {
                name: "",
                address: '',
                avbPlaces: "",
                date: "",
                time: "",
                lat: 0.0,
                lng: 0.0
            }
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updateParticipants = this.updateParticipants.bind(this);
        this.getActivityById = this.getActivityById.bind(this);
        this.updateActivity = this.updateActivity.bind(this);
        this.deleteActivity = this.deleteActivity.bind(this);
    }

    componentDidMount() {
        fetch("http://localhost:8080/activity/allActivities")
            .then(res => res.json())
            .then(res => this.buildActivities(res))
            .catch(() => {
                console.warn("No activities found...")
            });
    }

    async deleteActivity(event) {
        const activityId = event.target.id
        fetch("http://localhost:8080/activity/deleteActivity/" + activityId)
            .catch(() => {
                console.error("Couldn't delete activity...")
            });
        window.location.reload(true);
    }

    async buildActivities(response) {

        const activities = []
        // console.log(response);
        if (response["status"] !== 500) {
            response.forEach(obj => {
                activities.push(obj);
            });

            this.setState({
                activities: activities
            })
            console.log(this.state.activities);
        }
    }

    async updateTime(event) {
        await this.setState({
            onUpdate: {
                name: this.state.onUpdate.name,
                address: this.state.onUpdate.address,
                avbPlaces: this.state.onUpdate.avbPlaces,
                date: this.state.onUpdate.date,
                time: event.target.value,
                lat: this.state.onUpdate.lat,
                lng: this.state.onUpdate.lng
            }
        });
        // console.log(this.state.onUpdate);
    }

    async updateDate(event) {
        await this.setState({
            onUpdate: {
                name: this.state.onUpdate.name,
                address: this.state.onUpdate.address,
                avbPlaces: this.state.onUpdate.avbPlaces,
                date: event.target.value,
                time: this.state.onUpdate.time,
                lat: this.state.onUpdate.lat,
                lng: this.state.onUpdate.lng
            }
        });
        // console.log(this.state.onUpdate);
    }

    async updateParticipants(event) {
        await this.setState({
            onUpdate: {
                name: this.state.onUpdate.name,
                address: this.state.onUpdate.address,
                avbPlaces: event.target.value,
                date: this.state.onUpdate.date,
                time: this.state.onUpdate.time,
                lat: this.state.onUpdate.lat,
                lng: this.state.onUpdate.lng
            }
        });
        // console.log(this.state.onUpdate);
    }

    async updateName(event) {
        await this.setState({
            onUpdate: {
                name: event.target.value,
                address: this.state.onUpdate.address,
                avbPlaces: this.state.onUpdate.avbPlaces,
                date: this.state.onUpdate.date,
                time: this.state.onUpdate.time,
                lat: this.state.onUpdate.lat,
                lng: this.state.onUpdate.lng
            }
        });
        console.log(this.state.onUpdate);
    }

    async updateLocation(place) {

        const address = place["formatted_address"],
            latValue = place["geometry"].location.lat(),
            lngValue = place["geometry"].location.lng();

        await this.setState({
            onUpdate: {
                name: this.state.onUpdate.name,
                address: address,
                avbPlaces: this.state.onUpdate.avbPlaces,
                date: this.state.onUpdate.date,
                time: this.state.onUpdate.time,
                lat: latValue,
                lng: lngValue
            }
        });
        console.log(this.state.onUpdate);
    }

    async getActivityById(id) {
        return await this.state.activities[id];
    }

    async updateActivity(event) {
        const index = event.target.id;
        const activity = this.state.activities[index];

        const updatedName = this.state.onUpdate.name;
        const updatedAddress = this.state.onUpdate.address;
        const updatedDate = this.state.onUpdate.date;
        const updatedTime = this.state.onUpdate.time;
        const updatedPlaces = this.state.onUpdate.avbPlaces;
        const updatedLat = this.state.onUpdate.lat;
        const updatedLng = this.state.onUpdate.lng;

        if (updatedName !== "") {
            activity['name'] = updatedName;
        }
        if (updatedAddress !== "") {
            activity['address'] = updatedAddress;
        }
        if (updatedDate !== "") {
            activity['date'] = updatedDate;
        }
        if (updatedTime !== "") {
            activity['time'] = updatedTime;
        }
        if (updatedPlaces !== "") {
            activity['avbPlaces'] = updatedPlaces;
        }
        if (updatedLat !== "") {
            activity['lat'] = updatedLat;
        }
        if (updatedLng !== "") {
            activity['lng'] = updatedLng;
        }

        console.log(activity);

        fetch("http://localhost:8080/activity/updateActivity/" + activity.name + "/" + activity.address + "/" + activity.date + "/" + activity.time + "/" + activity.avbPlaces + "/" + activity.id + "/" + activity.lat + "/" + activity.lng)
            .catch(error => {
                console.log(error)
            });
        alert("Activity was updated!")

        // window.location.reload(true);
    }

    render() {
        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1100}}>
                        {this.state.activities.length < 1 ? <div className={"noEvents"}>
                                <div className={"noEventsImg"}/>
                                <h2 className={"noEventsMessage"}>No events to come</h2>
                            </div> :
                            (<table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Tickets</th>
                                </tr>
                                <tr>
                                    <td style={{width: '100px'}}>
                                        <input type="text"
                                               placeholder={"Type new name here"}
                                               onChange={this.updateName}/>
                                    </td>
                                    <td style={{width: '130px'}}>
                                        <Autocomplete
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                paddingLeft: '16px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                backgroundColor: '#f1f1f1'
                                            }}
                                            apiKey={"AIzaSyC9-oir9k71wA2xOmZD9d-UNe_2e5Gmtqw"}
                                            onPlaceSelected={(place) => this.updateLocation(place)}
                                        />
                                    </td>
                                    <td style={{width: '7%'}}>
                                        <input type="date" onChange={this.updateDate}/>
                                    </td>
                                    <td style={{width: '7%'}}>
                                        <input type="time" onChange={this.updateTime}/>
                                    </td>
                                    <td style={{width: '9%'}}>
                                        <input type="text" placeholder={"No."}
                                               onChange={this.updateParticipants}/>
                                    </td>
                                </tr>
                                {
                                    this.state.activities.map((obj, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <input type="text" id={index} value={obj["name"]}
                                                           style={{align: "center"}} readOnly/>
                                                </td>
                                                <td>
                                                    <input type="text" id={index} value={obj["address"]}
                                                           readOnly/>
                                                </td>
                                                <td>
                                                    <input type="date" id={index} value={obj["date"]}
                                                           readOnly/>
                                                </td>
                                                <td>
                                                    <input type="time" id={index} value={obj["time"]}
                                                           readOnly/>
                                                </td>
                                                <td>
                                                    <input type="number" id={index} value={obj["avbPlaces"]}
                                                           readOnly/>
                                                </td>
                                                <td style={{background: "transparent", width: '8%'}}>
                                                    {obj["name"] !== 'NaN' ?
                                                        (<input type="submit" id={index} value="Update"
                                                                onClick={this.updateActivity}/>
                                                        ) : (<input type="submit" id={index} value="Unavailable"
                                                                    style={{background: "rgb(221, 221, 221)"}}
                                                        />)
                                                    }
                                                </td>
                                                <td style={{width: '8px', padding: '0px'}}>
                                                    <h3 className={"deleteEvent"} id={obj["id"]}
                                                        onClick={this.deleteActivity}>X</h3>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </thead>
                            </table>)
                        }
                    </div>
                </div>
            </div>
        );
    }

}