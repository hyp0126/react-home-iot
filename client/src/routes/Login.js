import React from "react";
import { Paper, withStyles, Grid, TextField, Button } from "@material-ui/core";
import { homeApiLogin } from "../services/homeapi.service";

const styles = (theme) => ({
  root: {
    margin: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  login: {
    width: 250,
    padding: theme.spacing(1),
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      isLoggedIn: false,
    };

    this.handleSubmit.bind(this);
  }

  handleChangeUsername = (e) => {
    this.setState({ username: e.target.value });
  };

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      //this.handleSubmit();
      this.btn.click();
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    var token = await homeApiLogin(this.state.username, this.state.password);

    if (token !== null || token !== undefined) {
      sessionStorage.setItem("token", token);
      if (this.props.history !== undefined) {
        this.props.history.push("/");
      }
      this.setState({ isLoggedIn: true });
    } else {
      sessionStorage.clear(token);
      this.setState({ isLoggedIn: false });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.login}>
          {this.state.isLoggedIn ? (
            <p>successfully logged in</p>
          ) : (
            <form noValidate autoComplete="off">
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item md={true} sm={true} xs={true}>
                  <TextField
                    id="username"
                    label="Username"
                    type="email"
                    onChange={this.handleChangeUsername}
                    fullWidth
                    autoFocus
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item md={true} sm={true} xs={true}>
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    onChange={this.handleChangePassword}
                    onKeyPress={this.handleKeyPress}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              <Grid container justify="center" style={{ marginTop: "10px" }}>
                <Button
                  size="large"
                  variant="outlined"
                  color="primary"
                  onClick={this.handleSubmit}
                  ref={(node) => (this.btn = node)}
                  style={{ textTransform: "none" }}
                >
                  Login
                </Button>
              </Grid>
            </form>
          )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
