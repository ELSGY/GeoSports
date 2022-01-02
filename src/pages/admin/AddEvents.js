import React from 'react';
import '../../App.css';
import {withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker} from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import Navbar from "../../components/Navbar";
import API from "../../API";

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
                address: '',
                latitude: 0,
                longitude: 0,
                category: 0,
                subcategory: 0,
                participants: 0,
                date: '',
                time: ''
            },
            categories: [
                {
                    category: "Land Sports",
                    subcategories: [
                        "Climbing",
                        "Trekking",
                        "Hiking"
                    ]
                },
                {
                    category: "Water Sports",
                    subcategories: [
                        "Kitesurfing",
                        "Rafting"
                    ]
                },
                {
                    category: "Aero Sports",
                    subcategories: [
                        "Ski Jumping",
                        "Bungee Jumping"
                    ]
                }]
        }

        this.addEvent = this.addEvent.bind(this);
        this.getCity = this.getCity.bind(this);
        this.getArea = this.getArea.bind(this);
        this.getState = this.getState.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
        this.onPlaceSelected = this.onPlaceSelected.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateAddress = this.updateAddress.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.updateParticipants = this.updateParticipants.bind(this);
        this.buildCategories = this.buildCategories.bind(this);
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

        const url = "/categories/categoriesMap";

        // API.get(url)
        //     .then(res => this.buildCategories(res))
        //     .catch(error => {
        //         console.log(error)
        //     });
        fetch("http://localhost:8080/categories/categoriesMap")
            .then(res => res.json())
            .then(res => this.buildCategories(res));

        // console.log(this.state.categories);
    };

    buildCategories(response) {

        const categories = [];

        //fetch categories
        response.forEach(obj => {
            categories.push({
                category: obj["category"],
                subcategories: obj["subcategories"]
            });
        });

        this.setState({categories: categories});
        console.log(this.state.categories);
    }

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

    updateName(event) {
        this.setState({
            event: {
                name: event.target.value,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: this.state.address,
                participants: this.state.event.participants,
                date: this.state.event.date,
                time: this.state.event.time
            }
        });
    }

    updateCategory(event) {
        this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: event.target.value[0],
                subcategory: event.target.value[2],
                address: this.state.address,
                participants: this.state.event.participants,
                date: this.state.event.date,
                time: this.state.event.time
            }
        });
    }

    updateAddress(event) {
        this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: event.target.value,
                participants: this.state.event.participants,
                date: this.state.event.date,
                time: this.state.event.time
            }
        });
    }

    updateParticipants(event) {
        this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: this.state.address,
                participants: event.target.value,
                date: this.state.event.date,
                time: this.state.event.time
            }
        });
    }

    updateDate(event) {
        this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: this.state.address,
                participants: this.state.event.participants,
                date: event.target.value,
                time: this.state.event.time
            }
        });
    }

    updateTime(event) {
        this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                avbPlaces: this.state.event.avbPlaces,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: this.state.address,
                participants: this.state.event.participants,
                date: this.state.event.date,
                time: event.target.value
            }
        });
    }

    addEvent() {

        const url = "/activity/insertActivity";
        const event = [{
            "name": this.state.event.name,
            "latitude": this.state.markerPosition.lat,
            "longitude": this.state.markerPosition.lng,
            "avbPlaces": this.state.event.participants,
            "idCat": this.state.event.category,
            "idSubcat": this.state.event.subcategory,
            "address": this.state.address,
            "date": this.state.event.date,
            "time": this.state.event.time
        }]

        // API.post(url, JSON.stringify(event))
        //     .then(response => console.log(response))
        //     .catch(error => {
        //         console.log(error)
        //     });

        fetch("http://localhost:8080/activity/insertActivity", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(event)
        }).then(() => alert(JSON.stringify(event)));
    }

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
                        {/*<Autocomplete className="input"*/}
                        {/*              style={{*/}
                        {/*                  width: '100%',*/}
                        {/*                  height: '40px',*/}
                        {/*                  paddingLeft: '16px',*/}
                        {/*                  marginTop: '5px',*/}
                        {/*                  marginBottom: '2rem',*/}
                        {/*                  border: 'none',*/}
                        {/*                  borderRadius: '4px',*/}
                        {/*                  backgroundColor: '#f1f1f1'*/}
                        {/*              }}*/}
                        {/*              placeholder={"Change current location"}*/}
                        {/*              onPlaceSelected={this.onPlaceSelected}*/}
                        {/*              types={['(regions)']}*/}
                        {/*/>*/}
                    </GoogleMap>
                )
            )
        );

        return (
            <div className="background">
                {/*<Navbar/>*/}
                <div className="main">
                    <form onSubmit={this.addEvent}>
                        <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000}}>
                            <div className="input">
                                <label htmlFor="eventName">Name</label>
                                <input type="text" name="name" id="name" placeholder="type..."
                                       onChange={this.updateName}/>
                            </div>
                            <div className="input">
                                <label htmlFor="eventCategory">Category</label>
                                <select className="category" id="Event Type" placeholder="Choose category"
                                        onChange={this.updateCategory} required>
                                    {
                                        this.state.categories.map((obj, index) => {
                                            return <optgroup key={index} label={obj.category}>
                                                {obj.subcategories.map((sub, index1) => {
                                                    const cat = [index + 1, index1 + 1]
                                                    return <option value={cat} key={index1}>{sub}</option>
                                                })}
                                            </optgroup>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="input">
                                <label htmlFor="address">Address</label>
                                <input type="text" name="name" id="name" value={this.state.address}
                                       onChange={this.updateAddress}/>
                            </div>
                            <div className="input">
                                <label htmlFor="date">Date</label>
                                <input type="date" name="name" id="name" onChange={this.updateDate}/>
                            </div>
                            <div className="input">
                                <label htmlFor="date">Time</label>
                                <input type="time" name="name" id="name" onChange={this.updateTime}/>
                            </div>
                            <div className="input">
                                <label htmlFor="nop">Number of participants</label>
                                <input type="number" name="name" id="name" onChange={this.updateParticipants}/>
                            </div>
                            <div className="input">
                                <input type="submit" name="name" id="name" value="Add Event"/>
                            </div>
                            {/*<AsyncMap*/}
                            {/*    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${this.state.API_key}&libraries=places`}*/}
                            {/*    loadingElement={*/}
                            {/*        <div style={{height: `100%`}}/>*/}
                            {/*    }*/}
                            {/*    containerElement={*/}
                            {/*        <div style={{height: this.state.height}}/>*/}
                            {/*    }*/}
                            {/*    mapElement={*/}
                            {/*        <div style={{height: `100%`}}/>*/}
                            {/*    }*/}
                            {/*/>*/}
                        </div>
                    </form>
                </div>
            </div>

        )
    }
}