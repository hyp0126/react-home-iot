import React from "react";
import axios from "axios";
import GaugeChart from "react-gauge-chart";
import { withStyles } from "@material-ui/styles";
import "fontsource-roboto";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import * as DotEnv from "./DotEnv";

const styles = (theme) => ({
  root: {
    margin: 16,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  guageRow: {
    margin: 8,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  guageCol: {
    margin: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
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
      data: { roomData },
    } = await axios.post(
      DotEnv.ADDRESS_ROOMDATA,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    this.setState({ roomData, isLoading: false });
  };

  componentDidMount() {
    this.getRoomData();
    var intervalId = setInterval(this.getRoomData, 10000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  onChangeLed = async (e) => {
    console.log(e.target.id);
    console.log(e.target.value);
    axios.post(
      DotEnv.ADDRESS_LED,
      { id: e.target.id.substr(-1, 1) },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { isLoading, roomData } = this.state;

    const token = sessionStorage.getItem("token");
    if (!token) {
      return (
        <Paper className={classes.root}>
          <p>Please, Log in First</p>
        </Paper>
      );
    }

    return (
      <Paper className={classes.root}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Box className={classes.guageRow}>
            {roomData.map((data, i) => (
              <Box key={i} className={classes.guageCol}>
                <Typography variant="h5" component="h5">
                  Room{i + 1}
                </Typography>
                {data.ledState === "" ? (
                  <div></div>
                ) : (
                  <div className={classes.guageCol}>
                    <Typography variant="h6" component="h6">
                      LED
                    </Typography>
                    <Switch
                      id={"led" + (i + 1)}
                      value={data.ledState}
                      checked={data.ledState === "1"}
                      onChange={(e) => this.onChangeLed(e)}
                    />
                  </div>
                )}
                {data.temperature === "" ? (
                  <div></div>
                ) : (
                  <div className={classes.guageCol}>
                    <Typography variant="h6" component="h6">
                      Temperature
                    </Typography>
                    <GaugeChart
                      id="gauge-chart-5"
                      nrOfLevels={420}
                      arcsLength={[0.3, 0.5, 0.2]}
                      colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                      percent={data.temperature / 40}
                      arcPadding={0.02}
                      formatTextValue={(value) =>
                        ((value / 100) * 40).toFixed(2)
                      }
                      textColor="#FF0000"
                      needleColor="#A9A9A9"
                    />
                  </div>
                )}
                {data.humidity === "" ? (
                  <div></div>
                ) : (
                  <div className={classes.guageCol}>
                    <Typography variant="h6" component="h6">
                      Humidity
                    </Typography>
                    <GaugeChart
                      id="gauge-chart-5"
                      nrOfLevels={420}
                      arcsLength={[0.3, 0.5, 0.2]}
                      colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                      percent={data.humidity / 100}
                      arcPadding={0.02}
                      formatTextValue={(value) => value}
                      textColor="#FF0000"
                      needleColor="#A9A9A9"
                    />
                  </div>
                )}
                {data.brightness === "" ? (
                  <div></div>
                ) : (
                  <div className={classes.guageCol}>
                    <Typography variant="h6" component="h6">
                      Brightness
                    </Typography>
                    <GaugeChart
                      id="gauge-chart-5"
                      nrOfLevels={420}
                      arcsLength={[0.3, 0.5, 0.2]}
                      colors={["#5BE12C", "#F5CD19", "#EA4228"]}
                      percent={(1024 - data.brightness) / 1024}
                      arcPadding={0.02}
                      formatTextValue={(value) =>
                        ((value / 100) * 1024).toFixed(0)
                      }
                      textColor="#FF0000"
                      needleColor="#A9A9A9"
                    />
                  </div>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(Guage);
