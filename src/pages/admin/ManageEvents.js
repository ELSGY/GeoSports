import React from 'react';

export default class ManageEvents extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
                    time: ""
                }
            ]
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateParticipants = this.updateParticipants.bind(this);
        this.getActivityById = this.getActivityById.bind(this);

    }

    componentDidMount() {
        fetch("http://localhost:8080/activity/allActivities")
            .then(res => res.json())
            .then(res => this.buildActivities(res));
    }

    async buildActivities(response) {

        const activities = []
        response.forEach(obj => {
            activities.push(obj);
        });

        this.setState({
            activities: activities
        })
        console.log(this.state.activities);
    }

    updateTime(event) {
        console.log(event.target.value)
        console.log(event.target.id)
    }

    updateDate(event) {
        console.log(event.target.value)
        console.log(event.target.id)
    }

    updateParticipants(event) {
        const index = event.target.id;
        console.log(index)

        const _activities = this.state.activities;
        _activities[index].participants = event.target.value;
        this.setState({
            activities: _activities
        }, () => console.log("Participants updated..."))

        console.log(this.state.activities[index])
    }

    updateName(event) {
        console.log(event.target.value)
        console.log(event.target.id)
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
                                {/*<th>Category</th>*/}
                                {/*<th>Subcategory</th>*/}
                                <th>Date</th>
                                <th>Time</th>
                                <th>Available places</th>
                                {/*<th>Action</th>*/}
                            </tr>
                            {
                                this.state.activities.map((obj, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <input type="text" id={index} value={obj["name"]}
                                                       onChange={this.updateName}/>
                                            </td>
                                            {/*<td>{obj["category"]}</td>*/}
                                            {/*<td>{obj["subcategory"]}</td>*/}
                                            <td>
                                                <input type="date" id={index} value={obj["date"]}
                                                       onChange={this.updateDate}/>
                                            </td>
                                            <td>
                                                <input type="time" id={index} value={obj["time"]}
                                                       onChange={this.updateTime}/>
                                            </td>
                                            <td>
                                                <input type="number" id={index} value={obj["avbPlaces"]}
                                                       onChange={this.updateParticipants}/>
                                            </td>
                                            <td style={{background: "transparent"}}>
                                                <input type="submit" id={index} value="Update"
                                                       onClick={this.updateParticipants}/>
                                            </td>
                                        </tr>
                                    )
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