import React from "react";
import axios from "axios";
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import LineChart from '../components/LineChart';

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
        const {
            data : { tempMsgs },
        } = await axios.post(
          "http://localhost:8080/temperature",
          { date: date}
        );

        this.setState({ tempMsgs , isLoading: false });
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
            dateStr: e.target.value,
            isLoading: false 
        });
        this.getTempData(new Date(this.state.dateStr));
    }

    render() {
        const { classes } = this.props;
        const { isLoading, tempMsgs } = this.state;

        return (
            <Paper className={classes.root}>
                <form className={classes.container} noValidate>
                    <TextField
                        id="date"
                        label="Date"
                        type="date"
                        value={this.state.dateStr}
                        defaultValue={'2021-01-04'}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.onChangeDate}
                    />
                </form>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <LineChart tempMsgs = {tempMsgs} />
                )}
            </Paper>
        );
    }
}

export default withStyles(styles)(Chart);