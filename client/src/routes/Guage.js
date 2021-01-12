import React from "react";
import axios from "axios";

class Guage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            roomData: [],
        };
    }
    
    getRoomData = async () => {
        const {
            data : { roomData },
        } = await axios.get(
          "http://localhost:8080/roomData"
        );
        // const { roomData }
        //  = await fetch(
        //   "http://localhost:8080/roomData"
        // ).then((res) => res.json());
        this.setState({ roomData , isLoading: false });
    };

    componentDidMount() {
        this.getRoomData();
        var intervalId = setInterval(this.getRoomData, 10000);
        this.setState({intervalId: intervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    render() {
        const { isLoading, roomData } = this.state;
        return (
            <div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                    {roomData.map((data, i) => (
                        <div key={i}>
                        <p>{data.temperature}</p>
                        <p>{data.humidity}</p>
                        <p>{data.brightness}</p>
                        <p>{data.ledState}</p>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        );
    }
}

export default Guage;