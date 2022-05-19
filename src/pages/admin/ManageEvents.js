import React from 'react';

export default class ManageEvents extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activities: [],
            onUpdate: {
                name: "",
                avbPlaces: "",
                date: "",
                time: ""
            }
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.updateName = this.updateName.bind(this);
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
                avbPlaces: this.state.onUpdate.avbPlaces,
                date: this.state.onUpdate.date,
                time: event.target.value
            }
        });
        // console.log(this.state.onUpdate);
    }

    async updateDate(event) {
        await this.setState({
            onUpdate: {
                name: this.state.onUpdate.name,
                avbPlaces: this.state.onUpdate.avbPlaces,
                date: event.target.value,
                time: this.state.onUpdate.time
            }
        });
        // console.log(this.state.onUpdate);
    }

    async updateParticipants(event) {
        await this.setState({
            onUpdate: {
                name: this.state.onUpdate.name,
                avbPlaces: event.target.value,
                date: this.state.onUpdate.date,
                time: this.state.onUpdate.time
            }
        });
        // console.log(this.state.onUpdate);
    }

    async updateName(event) {
        await this.setState({
            onUpdate: {
                name: event.target.value,
                avbPlaces: this.state.onUpdate.avbPlaces,
                date: this.state.onUpdate.date,
                time: this.state.onUpdate.time
            }
        });
        // console.log(this.state.onUpdate);
    }

    async getActivityById(id) {
        return await this.state.activities[id];
    }

    async updateActivity(event) {
        const index = event.target.id;
        const activity = this.state.activities[index];

        const updatedName = this.state.onUpdate.name;
        const updatedDate = this.state.onUpdate.date;
        const updatedTime = this.state.onUpdate.time;
        const updatedPlaces = this.state.onUpdate.avbPlaces;

        if (updatedName !== "") {
            activity['name'] = updatedName;
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

        console.log(activity);

        fetch("http://localhost:8080/activity/updateActivity/" + activity.name + "/" + activity.date + "/" + activity.time + "/" + activity.avbPlaces + "/" + activity.id)
            .catch(error => {
                console.log(error)
            });
        alert("Activity was updated!")

        window.location.reload(true);
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
                                    <td style={{width: '100px', background: "transparent"}}>
                                    </td>
                                    <td style={{width: '130px'}}>
                                        <input type="text" placeholder={"search new location"}
                                               onChange={this.updateName}/>
                                    </td>
                                    <td style={{width: '7%'}}>
                                        <input type="date" onChange={this.updateDate}/>
                                    </td>
                                    <td style={{width: '7%'}}>
                                        <input type="time" onChange={this.updateTime}/>
                                    </td>
                                    <td style={{width: '9%'}}>
                                        <input type="text" placeholder={"type"}
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