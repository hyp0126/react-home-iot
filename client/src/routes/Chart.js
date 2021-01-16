import React from "react";
import axios from "axios";
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import LineChart from '../components/LineChart';
import * as DotEnv from './DotEnv';

const styles = theme => ({
    root: {
        margin: 16,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    container: {
        margin: 8, 
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 150,
    },
  });

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dateStr: '',
            tempMsgs: [],
        };
    }
    
    getTempData = async (date) => {
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        //local -> UTC Time
        var startTime = new Date(year, month, day, 0, 0, 0);
        startTime = startTime.toUTCString();
        var endTime = new Date(year, month, day, 23, 59, 59);
        endTime = endTime.toUTCString();

        const {
            data : { tempMsgs },
        } = await axios.post(
            DotEnv.ADDRESS_TEMPERATURE,
          { startTime: startTime,
            endTime: endTime,
            token: sessionStorage.getItem('token')},
            { withCredentials: true }
        );

        this.setState({ isLoading: false });
        this.setState({ tempMsgs });
        //console.log(tempMsgs);
    };

    componentDidMount() {
        var date = new Date();
        var dateStr = `${date.getFullYear()}-${('0'+(date.getMonth()+1)).slice(-2)}-${('0'+date.getDate()).slice(-2)}`;
        this.setState({dateStr});
        this.getTempData(date);
    }

    onChangeDate = (e) => {
        this.setState({
            dateStr: String(e.target.value),
            isLoading: true 
        }, () => { 
            // Should Post Here (setState is async)
            var dateStrs = this.state.dateStr.split('-');
            this.getTempData(new Date(dateStrs[0], dateStrs[1]-1, dateStrs[2]));
        });
    }

    render() {
        const { classes } = this.props;
        const { isLoading, tempMsgs, dateStr } = this.state;
        var chart;

        const token = sessionStorage.getItem('token');
        if(!token) {
          return (
            <Paper className={classes.root}>
                <p>Please, Log in First</p>
            </Paper>
          );
        }

        if (isLoading) {
            chart = <p>Loading...</p>;
        } else if (tempMsgs.length === 0) {
            chart = <p>No Data</p>;
        } else {
            chart = <LineChart tempMsgs = {tempMsgs} dateStr = {dateStr}/>;
        }

        return (
            <Paper className={classes.root}>
                <form className={classes.container} noValidate>
                    <TextField
                        id="date"
                        label="Date"
                        type="date"
                        value={dateStr}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.onChangeDate}
                    />
                </form>
                {chart}
            </Paper>
        );
    }
}

export default withStyles(styles)(Chart);