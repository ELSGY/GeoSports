import React from 'react';
import {FaStar} from "react-icons/all";

const colors = {
    orange: "FFBA5A",
    grey: "a9a9a9"
}

export default class Top extends React.Component {

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
            activities: [
                {
                    id: undefined,
                    name: undefined,
                    latitude: undefined,
                    longitude: undefined,
                    avbPlaces: undefined,
                    category: undefined,
                    subcategory: undefined,
                    address: undefined,
                    date: undefined,
                    time: undefined,
                    attending: undefined,
                    currentValue: 0,
                    hoverValue: undefined
                }
            ]
        }

        this.buildActivities = this.buildActivities.bind(this);
        this.fetchTop = this.fetchTop.bind(this)
    }

    async componentDidMount() {
        await this.fetchTop();
    }

    async fetchTop() {
        await fetch("http://localhost:8080/activity/getTopActivities")
            .then(res => res.json())
            .then(res => this.buildActivities(res));
    }


    async buildActivities(response) {
        console.log(response);

        const array = Array();

        const sortedArray = response.sort((a, b) => b.rating - a.rating);

        sortedArray.map(act => {
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

    render() {

        const stars = Array(5).fill(0);

        return (
            <div className="background">
                <div className="main">
                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000, height: '90%'}}>
                        {
                            this.state.activities[0].name === undefined ?
                                <div className={"noEvents"}>
                                    <div className={"noEventsImg"}/>
                                    <h2 className={"noEventsMessage"}>No ratings yet</h2>
                                </div>
                                :
                                this.state.activities.map((obj, index1) => {
                                    return (
                                        <div className={"pastActivities"}>
                                            <div className={"activityDetails"}>
                                                <div className={"actDetailsColumn"}>
                                                    <div className={"topNumber"}>
                                                        <label>{index1 + 1}</label>
                                                    </div>

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
                                                                        <FaStar className={"stars2"} key={index}
                                                                                color={(this.state.activities[index1].hoverValue || this.state.activities[index1].currentValue) > index ? colors.orange : colors.grey}/>
                                                                    )
                                                                })
                                                            }
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