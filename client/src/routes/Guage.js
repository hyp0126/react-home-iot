import React from "react";

class Guage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    
    componentDidMount() {

    }

    render() {
        return this.props.roomData.map(function (data) {
            return (
                <div>
                    <p>{data.temperature}</p>
                    <p>{data.humidity}</p>
                    <p>{data.brightness}</p>
                    <p>{data.ledState}</p>
                </div>
            );
        });
    }
}

export default Guage;