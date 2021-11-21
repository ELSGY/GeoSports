import React from 'react';

export default class PopupStatus extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            style : {
                backgroundColor: "#FFFFFF",
                color: "#555",
                display: "none"
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.message !== this.props.message) {
            const style = {
                backgroundColor: "#FFFFFF",
                color: "#555",
                display: "block"
            }
            switch (this.props.type) {
                case 'error' : {
                    style.backgroundColor = "RGBA(255,101,80,0.85)";
                    style.color = "#FFFFFF";
                    style.display = "block";
                    break;
                }
                case 'success' : {
                    style.backgroundColor = "RGBA(88,255,80,0.7)";
                    style.color = "#FFFFFF";
                    style.display = "block";
                    break;
                }
                default : {
                    style.backgroundColor = "RGBA(255,255,255,0.5)";
                    style.color = "#FFFFFF";
                    style.display = "block";
                    break;
                }
            }
            this.setState({ style })

            setTimeout(function () {
                const newStyle = {
                    display : "none"
                }
                this.setState({ style : newStyle })
            }.bind(this), 5 * 1000)
        }
    }


    render() {
        return (
            <div className="popup-status" style={this.state.style}>
                { this.props.message }
            </div>
        )
    }
}