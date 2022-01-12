import React from 'react';

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            code: '',
            client: {
                name: '',
                username: '',
                email: '',
                photo: ''
            }
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
            }
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
                                (<div>
                                        {
                                            this.state.client.photo  ?
                                                <img src={this.state.client.photo.src} width="330" height="250"
                                                     alt={"No photo available for this user"}/> : null
                                        }
                                        <div className="input">

                                            <label htmlFor="ticketCode">Name</label>
                                            <input type="text" name="Name" id="Name" value={this.state.client.name}
                                                   readOnly/>
                                            <label htmlFor="ticketCode">Username</label>
                                            <input type="text" name="Username" id="Username"
                                                   value={this.state.client.username} readOnly/>
                                            <label htmlFor="ticketCode">Email</label>
                                            <input type="text" name="Email" id="Email" value={this.state.client.email}
                                                   readOnly/>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}