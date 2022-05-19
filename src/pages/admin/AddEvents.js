import React from 'react';
import '../../App.css';
import {GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import API from "../../API";
import dateFormat, {masks} from "dateformat";

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
                category: 1,
                subcategory: 3,
                participants: 0,
                date: '',
                time: '',
                photo: ''
            },
            categories: [
                {
                    category: '',
                    subcategories: [
                        ''
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
        this.updatePhoto = this.updatePhoto.bind(this);
        this.convertFile = this.convertFile.bind(this);
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

        API.get(url)
            .then(res => this.buildCategories(res))
            .catch(error => {
                console.error(error)
            });
    };

    buildCategories(response) {
        const categories = [];
        // console.log(response)
        //fetch categories
        response.data.forEach(obj => {
            categories.push({
                category: obj["category"],
                subcategories: obj["subcategories"]
            });
        });

        this.setState({categories: categories});
        // console.log(this.state.categories);
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

    async updateName(event) {
        await this.setState({
            event: {
                name: event.target.value,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: this.state.address,
                participants: this.state.event.participants,
                date: this.state.event.date,
                time: this.state.event.time,
                photo: this.state.event.photo
            }
        });
    }

    async updateCategory(event) {

        // console.log(event);

        const arraySplit = event.target.value.split(",");

        // console.log(arraySplit[0])
        // console.log(arraySplit[1])
        await this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: arraySplit[0],
                subcategory: arraySplit[1],
                address: this.state.address,
                participants: this.state.event.participants,
                date: this.state.event.date,
                time: this.state.event.time,
                photo: this.state.event.photo
            }
        });
    }

    async updateAddress(event) {
        await this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: event.target.value,
                participants: this.state.event.participants,
                date: this.state.event.date,
                time: this.state.event.time,
                photo: this.state.event.photo
            }
        });
    }

    async updateParticipants(event) {
        await this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: this.state.address,
                participants: parseInt(event.target.value),
                date: this.state.event.date,
                time: this.state.event.time,
                photo: this.state.event.photo
            }
        });
    }

    async updateDate(event) {
        const now = new Date(event.target.value);
        masks.hammerTime = 'yyyy-mm-dd';
        const date = dateFormat(now, "hammerTime");
        // console.log(date)

        await this.setState({
            event: {
                name: this.state.event.name,
                latitude: this.state.markerPosition.lat,
                longitude: this.state.markerPosition.lng,
                category: this.state.event.category,
                subcategory: this.state.event.subcategory,
                address: this.state.address,
                participants: this.state.event.participants,
                date: date,
                time: this.state.event.time,
                photo: this.state.event.photo
            }
        });
    }

    async updateTime(event) {
        // console.log(event.target.value)
        await this.setState({
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
                time: event.target.value,
                photo: this.state.event.photo
            }
        });
    }

    async updatePhoto(event) {
        const file = event.target.files[0];
        const resultPhoto = await this.convertFile(file);
        // console.log(resultPhoto);

        await this.setState({
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
                time: this.state.event.time,
                photo: resultPhoto
            }
        });
        // console.log(this.state.event.photo);
    };

    convertFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = function () {
                resolve(reader.result)
            };
        })
    }

    async addEvent() {

        const activity = {
            name: this.state.event.name,
            latitude: this.state.markerPosition.lat,
            longitude: this.state.markerPosition.lng,
            avbPlaces: parseInt(this.state.event.participants),
            idCat: this.state.event.category,
            idSubcat: this.state.event.subcategory,
            address: this.state.address,
            date: this.state.event.date,
            time: this.state.event.time,
            photo: this.state.event.photo
        }

        // console.log(activity)

        const url = "/activity/insertActivity";
        await API.post(url, activity)
            .then(() => alert("Event " + this.state.event.name + " was added!"))
            .catch(error => {
                console.error(error)
            });
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

                        {/*For Auto complete Search Box*/}
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
                {/*<AdminSearchBar/>*/}
                <div className="main">
                    <form onSubmit={this.addEvent}>
                        <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000}}>
                            <div className="input">
                                <label htmlFor="eventName"><a className={"required"}>*</a>Name</label>
                                <input type="text" name="name" id="name" placeholder="type..."
                                       onChange={this.updateName} required/>
                            </div>
                            <div className="input">
                                <label htmlFor="eventCategory"><a className={"required"}>*</a>Category</label>
                                <select className="category" placeholder="Choose category"
                                        onChange={this.updateCategory} required>
                                    {
                                        this.state.categories.map((obj, index) => {
                                            return <optgroup id={obj["category"]["catId"]}
                                                             label={obj["category"]["catName"]}>
                                                {obj.subcategories.map((sub, index1) => {
                                                    const value = [obj["category"]["catId"], sub["subCatId"]];
                                                    return <option value={value}>{sub["subCatName"]}</option>
                                                })}
                                            </optgroup>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="input">
                                <label htmlFor="address"><a className={"required"}>*</a>Address</label>
                                <input type="text" name="name" id="name" value={this.state.address} readOnly
                                       onChange={this.updateAddress} required/>
                            </div>
                            <div className="input">
                                <label htmlFor="date"><a className={"required"}>*</a>Date</label>
                                <input type="date" name="name" id="name"
                                       onChange={this.updateDate} required/>
                            </div>
                            <div className="input">
                                <label htmlFor="date"><a className={"required"}>*</a>Time</label>
                                <input type="time" name="name" id="name" onChange={this.updateTime} required/>
                            </div>
                            <div className="input">
                                <label htmlFor="nop"><a className={"required"}>*</a>Number of participants</label>
                                <input type="number" name="name" id="name" onChange={this.updateParticipants} required/>
                            </div>
                            <div className="input">
                                <input type="file" onChange={this.updatePhoto}/>
                            </div>
                            <div className="input">
                                <input type="submit" name="name" id="name" value="Add Event"/>
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
                    </form>
                </div>
            </div>
        )
    }
}