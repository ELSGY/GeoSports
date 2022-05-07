import React from 'react';

export default class ActivityEnrollPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
            ]
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.fetchActivity = this.fetchActivity.bind(this);
        this.getActivityCookie = this.getActivityCookie.bind(this)

    }

    async componentDidMount() {
        await this.getActivityCookie();
        await this.fetchActivity()
    }

    async getActivityCookie() {
        // get cookie from localStorage
        const activityCookie = await localStorage.getItem("activityCookie");
        const cookie = JSON.parse(activityCookie)

        await this.setState({
            activity: {
                name: cookie.activityName
            }
        });
    }

    async fetchActivity() {
        await fetch("http://localhost:8080/activity/getActivityByName/" + this.state.activity.name)
            .then(res => res.json())
            .then(res => this.buildActivities(res));
    }

    async buildActivities(response) {
        await this.setState({
            activity: response
        });
        console.log(this.state.activity);
    }

    render() {
        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000, height: '90%'}}>
                        <div className={"activity"}>
                            <div className={"activityDetails"}>
                                <div className={"actColumn"}>
                                    <img className={"activityImg"}
                                         src={this.state.activity["photo"]}
                                         alt={""}/>
                                </div>
                                <div className={"actColumn"}>
                                    <h3 className={"actTitle1"}>{this.state.activity["name"]}</h3>
                                </div>
                                <div className={"actColumn"}>
                                    <h5 className={"actTitle2"}>{this.state.activity["address"]}</h5>
                                </div>
                            </div>
                            <div className={"activityMap"}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}