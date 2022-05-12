import React from 'react';
import image from "E:\\Faculta\\Proiect Licenta\\FrontEnd\\src\\images\\user.png"

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            code: '',
            client: {
                name: '',
                username: '',
                email: '',
                photo: null
            },
            activityName: ''
        }

        this.fetchClientDetails = this.fetchClientDetails.bind(this);
        this.setDetails = this.setDetails.bind(this);
        this.updateCode = this.updateCode.bind(this);
    }

    async fetchClientDetails(event) {
        event.preventDefault();
        await fetch("http://localhost:8080/user/getUserByPVKey/" + this.state.code)
            .then(res => res.json())
            .then(res => this.setDetails(res));
    }

    async setDetails(response) {
        const image = new Image();
        image.src = response["photo"];
        // document.body.appendChild(image);
        // console.log(image.src)

        await this.setState({
            client: {
                name: response["full_name"],
                username: response["username"],
                email: response["email"],
                photo: image
            },
            activityName: response["activityName"]
        });
        // console.log(this.state.client)
    }

    async updateCode(event) {
        await this.setState({
            code: event.target.value
        });
        console.log(event.target.value)
    }

    render() {
        return (
            <div className="background">
                <div className="main">
                    <form onSubmit={this.fetchClientDetails}>
                        <div style={{padding: '1rem', margin: '0 auto', maxWidth: 1000}}>
                            <div className="input">
                                <label htmlFor="ticketCode"><a className={"required"}>*</a>Code</label>
                                <input type="text" name="Code" id="Code" onChange={this.updateCode}/>
                            </div>
                            <div className="input">
                                <input type="submit" name="name" id="name" value="Search client"/>
                            </div>
                            {this.state.client.name && this.state.client.username && this.state.client.email ?
                                (<div className={"searchDetailsAll"}>
                                        <div className={"activityDetails"}>
                                            <div className={"actDetailsColumn"}>
                                                {this.state.client.photo.length > 0 ?
                                                    <img className={"searchPhoto"} src={this.state.client.photo.src}
                                                         alt={""}/> :
                                                    <img
                                                        className={"searchPhoto"}
                                                        src={image}
                                                        alt={""}/>
                                                }
                                                <div className={"text"}>
                                                    <h3 className={"actDetailsTitle3"}>Ticket
                                                        to : {this.state.activityName}</h3>
                                                    <h5 className={"actDetailsTitle2"}>Full name
                                                        : <input type="text" name="Name" id="Name"
                                                                 value={this.state.client.name}
                                                                 readOnly/></h5>
                                                    <h5 className={"actDetailsTitle2"}>Username
                                                        : <input type="text" name="Username" id="Username"
                                                                 value={this.state.client.username} readOnly/></h5>
                                                    <h5 className={"actDetailsTitle2"}>Email
                                                        : <input type="text" name="Email" id="Email"
                                                                 value={this.state.client.email}
                                                                 readOnly/></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }

                        </div>
                    </form>
                </div>
            </div>
        )
            ;
    }
}