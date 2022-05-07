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
        this.fetchDefaultActivities = this.fetchDefaultActivities.bind(this)

    }

    async componentDidMount() {
        // if (navigator.geolocation) {
        //     await navigator.geolocation.getCurrentPosition(position => {
        //             this.fetchDefaultActivities(position.coords.latitude, position.coords.longitude)
        //         }
        //     )
        // }
    }

    async fetchDefaultActivities(lat, lng) {
        await fetch("http://localhost:8080/activity/getDefaultActivitiesForUser/123/" + lat + "/" + lng)
            .then(res => res.json())
            .then(res => this.buildActivities(res));
    }

    async buildActivities(response) {
        console.log(response);

        await this.setState({
            activity: response
        })
    }

    render() {
        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000, height: '90%'}}>
                        {/*{*/}
                        {/*    this.state.activity.name === "Nan" ?*/}
                        {/*        <div className={"noEvents"}>*/}
                        {/*            <div className={"noEventsImg"}/>*/}
                        {/*            <h2 className={"noEventsMessage"}>No events found </h2>*/}
                        {/*        </div>*/}
                        {/*        :*/}
                        {/*        this.state.activity.map((obj, index) => {*/}
                        {/*            return (*/}
                        {/*                <div className={"activities"}>*/}
                        {/*                    <div id={obj["name"]} className={"activity"}>*/}
                        {/*                        <div className={"actColumn"}>*/}
                        {/*                            <img className={"activityImg"}*/}
                        {/*                                 src={obj["photo"]}*/}
                        {/*                                 alt={""}/>*/}
                        {/*                        </div>*/}
                        {/*                        <div className={"actColumn"}>*/}
                        {/*                            <h3 className={"actTitle1"}>{obj["name"]}</h3>*/}
                        {/*                        </div>*/}
                        {/*                        <div className={"actColumn"}>*/}
                        {/*                            <h5 className={"actTitle2"}>{obj["address"]}</h5>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            )*/}
                        {/*        })*/}
                        {/*}*/}
                    </div>
                </div>
            </div>
        );

    }
}