import React from 'react';

export default class ManageEvents extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            API_key: 'AIzaSyC9-oir9k71wA2xOmZD9d-UNe_2e5Gmtqw',
            address: '',
            city: '',
            area: '',
            state: '',
            zoom: 15,
            height: 400,
            mapPosition: {
                lat: 0,
                lng: 0,
            },
            markerPosition: {
                lat: 0,
                lng: 0,
            }
        }
    }

    render() {
        return (
            <div className="background">

                <div className="main">
                    <div className="activities">
                    </div>
                </div>
            </div>
        );
    }
}