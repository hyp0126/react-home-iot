import React from "react";
import axios from "axios";
import GaugeChart from 'react-gauge-chart';
import { withStyles } from '@material-ui/styles';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import * as DotEnv from './DotEnv';

const styles = theme => ({
    root: {
        margin: 16,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    guageRow: {
        margin: 8,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    guageCol: {
        margin: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300
    },
  });

class Guage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            roomData: [],
        };
    }
    
    getRoomData = async () => {
        const {
            data : { roomData },
        } = await axios.post(
            DotEnv.ADDRESS_ROOMDATA,
          { token: sessionStorage.getItem('token') }
        );

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

    onChangeLed = async (e) => {
        console.log(e.target.id);
        console.log(e.target.value);
        axios.post(DotEnv.ADDRESS_LED ,
            { id: e.target.id.substr(-1,1),
            token: sessionStorage.getItem('token') });
    }

    render() {
        const { classes } = this.props;
        const { isLoading, roomData } = this.state;
        return (
            <Paper className={classes.root}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className={classes.guageRow}>
                    {roomData.map((data, i) => (
                        <div key={i} className={classes.guageCol}>
                        <Typography variant="h5" component="h5">
                            Room{i+1}
                        </Typography>
                        <Typography variant="h6" component="h6">
                            LED
                        </Typography>
                        <Switch id={'led'+i+1} value={data.ledState} checked={data.ledState==='1'} onChange={(e) => this.onChangeLed(e)} />
                        <Typography variant="h6" component="h6">
                            Temperature
                        </Typography>
                        <GaugeChart id='gauge-chart-5'
                            nrOfLevels={420}
                            arcsLength={[0.3, 0.5, 0.2]}
                            colors={['#5BE12C', '#F5CD19', '#EA4228']}
                            percent={data.temperature / 40}
                            arcPadding={0.02}
                            formatTextValue={value => (value / 100 * 40).toFixed(2)}
                            textColor='#FF0000'     
                            needleColor='#A9A9A9'                       
                        />
                        <Typography variant="h6" component="h6">
                            Humidity
                        </Typography>
                        <GaugeChart id='gauge-chart-5'
                            nrOfLevels={420}
                            arcsLength={[0.3, 0.5, 0.2]}
                            colors={['#5BE12C', '#F5CD19', '#EA4228']}
                            percent={data.humidity / 100}
                            arcPadding={0.02}
                            formatTextValue={value => value}
                            textColor='#FF0000'     
                            needleColor='#A9A9A9'                       
                        />
                        <Typography variant="h6" component="h6">
                            Brightness
                        </Typography>
                        <GaugeChart id='gauge-chart-5'
                            nrOfLevels={420}
                            arcsLength={[0.3, 0.5, 0.2]}
                            colors={['#5BE12C', '#F5CD19', '#EA4228']}
                            percent={(1024 - data.brightness) / 1024}
                            arcPadding={0.02}
                            formatTextValue={value => (value / 100 * 1024).toFixed(0)}
                            textColor='#FF0000'     
                            needleColor='#A9A9A9'                       
                        />
                        </div>
                    ))}
                    </div>
                )}
            </Paper>
        );
    }
}

export default withStyles(styles)(Guage);