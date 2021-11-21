import React from 'react';
import '../../App.css';
import {withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker} from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import Navbar from "../../components/Navbar";

Geocode["setApiKey"]("AIzaSyC9-oir9k71wA2xOmZD9d-UNe_2e5Gmtqw");
Geocode["enableDebug"]();

export default class AddEvents extends React.Component {

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
            },
            event: {
                name: '',
                category: '',
                participants: ''
            }
        }

        this.getCity = this.getCity.bind(this);
        this.getArea = this.getArea.bind(this);
        this.getState = this.getState.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
        this.onPlaceSelected = this.onPlaceSelected.bind(this);

    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                        mapPosition: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                        markerPosition: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }
                    },
                    () => {
                        Geocode["fromLatLng"](position.coords.latitude, position.coords.longitude).then(
                            response => {
                                // console.log(response);
                                const address = response.results[0]["formatted_address"],
                                    addressArray = response.results[0]["address_components"],
                                    city = this.getCity(addressArray),
                                    area = this.getArea(addressArray),
                                    state = this.getState(addressArray);
                                // console.log('city', city, area, state);
                                this.setState({
                                    address: (address) ? address : '',
                                    area: (area) ? area : '',
                                    city: (city) ? city : '',
                                    state: (state) ? state : '',
                                })
                            },
                            error => {
                                console.error(error);
                            }
                        );

                    })
            });
        } else {
            console.error("Geolocation is not supported by this browser!");
        }
    };

    getCity(addressArray) {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i]["long_name"];
                return city;
            }
        }
    };

    getArea(addressArray) {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i]["long_name"];
                        return area;
                    }
                }
            }
        }
    };

    getState(addressArray) {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i]["long_name"];
                    return state;
                }
            }
        }
    };

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    };

    onMarkerDragEnd(event) {
        let newLat = event["latLng"].lat(),
            newLng = event["latLng"].lng();

        Geocode["fromLatLng"](newLat, newLng).then(
            response => {
                const address = response.results[0]["formatted_address"],
                    addressArray = response.results[0]["address_components"],
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);
                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                    mapPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                })
            },
            error => {
                console.error(error);
            }
        );
    };

    onPlaceSelected(place) {
        const address = place["formatted_address"],
            addressArray = place["address_components"],
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            latValue = place["geometry"].location.lat(),
            lngValue = place["geometry"].location.lng();

        // update state
        this.setState({
            address: (address) ? address : '',
            area: (area) ? area : '',
            city: (city) ? city : '',
            state: (state) ? state : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
        })
    };

    render() {
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap
                        defaultZoom={this.state.zoom}
                        defaultCenter={{lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng}}
                    >
                        {/* InfoWindow on top of marker */}

                        {/*Marker*/}
                        <Marker
                            google={this.props.google}
                            name={'Dolores park'}
                            draggable={true}
                            onDragEnd={this.onMarkerDragEnd}
                            position={{lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng}}
                        />
                        <InfoWindow
                            position={{
                                lat: (this.state.markerPosition.lat + 0.0018),
                                lng: this.state.markerPosition.lng
                            }}
                        >
                            <div>
                                <span style={{padding: 0, margin: 0}}>{this.state.address}</span>
                            </div>
                        </InfoWindow>
                        <Marker/>

                        {/* For Auto complete Search Box */}
                        <Autocomplete className="input"
                                      style={{
                                          width: '100%',
                                          height: '40px',
                                          paddingLeft: '16px',
                                          marginTop: '5px',
                                          marginBottom: '2rem',
                                          border: 'none',
                                          borderRadius: '4px',
                                          backgroundColor: '#f1f1f1'
                                      }}
                                      placeholder={"Change current location"}
                                      onPlaceSelected={this.onPlaceSelected}
                                      types={['(regions)']}
                        />
                    </GoogleMap>
                )
            )
        );

        return (
            <div className="background">
                <Navbar/>
                <div className="main">

                    <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000}}>
                        <div className="input">
                            <label htmlFor="eventName">Event's Name</label>
                            <input type="text" name="name" id="name" placeholder="type..." required/>
                        </div>
                        <div className="input">
                            <label htmlFor="eventCategory">Category</label>
                            <select className="category" id="Event Type" placeholder="Choose category">
                                <optgroup label="Land sports">
                                    <option value="Trekking">Trekking</option>
                                    <option value="Hiking">Hiking</option>
                                    <option value="Climbing">Climbing</option>
                                </optgroup>
                                <optgroup label="Water sports">
                                    <option value="Rafting">Rafting</option>
                                    <option value="saab">Kitesurfing</option>
                                </optgroup>
                                <optgroup label="Aero sports">
                                    <option value="volvo">Bungee Jumping</option>
                                    <option value="saab">Ski Jumping</option>
                                </optgroup>
                            </select>
                        </div>
                        <div className="input">
                            <label htmlFor="city">City</label>
                            <input type="text" name="name" id="name" value={this.state.city}/>
                        </div>
                        <div className="input">
                            <label htmlFor="area">Area</label>
                            <input type="text" name="name" id="name" value={this.state.area}/>
                        </div>
                        <div className="input">
                            <label htmlFor="state">State</label>
                            <input type="text" name="name" id="name" value={this.state.state}/>
                        </div>
                        <div className="input">
                            <label htmlFor="address">Address</label>
                            <input type="text" name="name" id="name" value={this.state.address}/>
                        </div>
                        <AsyncMap
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${this.state.API_key}&libraries=places`}
                            loadingElement={
                                <div style={{height: `100%`}}/>
                            }
                            containerElement={
                                <div style={{height: this.state.height}}/>
                            }
                            mapElement={
                                <div style={{height: `100%`}}/>
                            }
                        />

                    </div>

                </div>

            </div>

        )
    }
}