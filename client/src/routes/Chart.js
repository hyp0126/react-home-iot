import React from "react";
import { withStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import LineChart from "../components/LineChart";
import { homeApiGetTempData } from "../services/homeapi.service";
import { connect } from "react-redux";

const styles = (theme) => ({
  root: {
    margin: 16,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  container: {
    margin: 8,
    display: "flex",
    flexWrap: "wrap",
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
      dateStr: "",
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

    var tempMsgs = await homeApiGetTempData(startTime, endTime);

    this.setState({ isLoading: false });
    this.setState({ tempMsgs });
    //console.log(tempMsgs);
  };

  componentDidMount() {
    var date = new Date();
    var dateStr = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
      -2
    )}-${("0" + date.getDate()).slice(-2)}`;
    this.setState({ dateStr });
    this.getTempData(date);
  }

  onChangeDate = (e) => {
    this.setState(
      {
        dateStr: String(e.target.value),
        isLoading: true,
      },
      () => {
        // Should Post Here (setState is async)
        var dateStrs = this.state.dateStr.split("-");
        this.getTempData(new Date(dateStrs[0], dateStrs[1] - 1, dateStrs[2]));
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { isLoading, tempMsgs, dateStr } = this.state;
    var chart;

    const token = sessionStorage.getItem("token");
    if (!token) {
      return (
        <Paper className={classes.root}>
          <p>Please, Log in First</p>
        </Paper>
      );
    }

    var maxRoomNum = 3;

    if (isLoading) {
      chart = <p>Loading...</p>;
    } else if (tempMsgs.length === 0) {
      chart = <p>No Data</p>;
    } else {
      chart = (
        <LineChart
          maxRoomNum={maxRoomNum}
          tempMsgs={tempMsgs}
          dateStr={dateStr}
        />
      );
    }

    var roomDate = this.props.roomData;

    return (
      <Paper className={classes.root}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell align="right">Temperature</TableCell>
                <TableCell align="right">Humidity</TableCell>
                <TableCell align="right">Brightness</TableCell>
                <TableCell align="right">LED</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomDate.map((data, i) => (
                <TableRow key={i + 1}>
                  <TableCell component="th" scope="row">
                    Room{i + 1}
                  </TableCell>
                  <TableCell align="right">{data.temperature}</TableCell>
                  <TableCell align="right">{data.humidity}</TableCell>
                  <TableCell align="right">{1024 - data.brightness}</TableCell>
                  <TableCell align="right">{data.ledState}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

let mapStateToProps = (state) => {
  //console.log(state);
  return { roomData: state.room.roomData };
};

Chart = connect(mapStateToProps, null)(Chart);

export default withStyles(styles)(Chart);
