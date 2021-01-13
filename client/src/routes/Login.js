import React from 'react';
import axios from "axios";
import { Paper, withStyles, Grid, TextField, Button} from '@material-ui/core';
import * as DotEnv from './DotEnv';

const styles = theme => ({
    root: {
        margin: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    login: {
        width: 500,
        padding: theme.spacing(1),
    },
});

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.handleSubmit.bind(this);
    }

    onChangeUsername = (e) => {
        this.setState({username: e.target.value})
    }

    onChangePassword = (e) => {
        this.setState({password: e.target.value})
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const {
            data : { token },
        } = await axios.post(
            DotEnv.ADDRESS_LOGIN,
          { username: this.state.username,
            password: this.state.password }
        );

        sessionStorage.setItem('token', token);
        this.props.history.push('/');
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.login}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="username" label="Username" type="email" 
                            onChange={this.onChangeUsername} fullWidth autoFocus required />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField id="password" label="Password" type="password" 
                            onChange={this.onChangePassword} fullWidth required />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button size="large" variant="outlined" color="primary" 
                        onClick={this.handleSubmit} style={{ textTransform: "none" }}>Login</Button>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(Login);