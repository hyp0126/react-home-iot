import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Home } from "@material-ui/icons"

const styles = theme => ({
  navDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
    padding: 8
  },
  linkText: {
    textDecoration: `none`,
    textTransform: `uppercase`,
    color: `white`
  }
});

class Navigation extends React.Component {

    handleMenuOpen = ev => {
        this.setState({ anchorAccountMenu: ev.currentTarget });
    }

    handleMenuClose = ev => {
        this.setState({ anchorAccountMenu: null });
    }

    menuGotoUrl = siteUrl => ev => {
        console.log(siteUrl);

        this.props.history.push(siteUrl);
        //this.handleMenuClose(ev);
    }

    render() {
        const { classes } = this.props;

        const navLinks = [
            { title: `Real-Time Gauge`, path: `#gauge` },
            { title: `Daily Chart`, path: `#chart` },
            { title: `Login`, path: `#login` },
            { title: `Logout`, path: `#logout` },
            ];

        return (
            <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="home">
                    <Home fontSize="large" />
                </IconButton>
                <Typography variant="h5" component="h5">
                    Home IoT
                </Typography>
                <List
                    component="nav"
                    aria-labelledby="main navigation"
                    className={classes.navDisplayFlex} >
                    {navLinks.map(({ title, path }) => (
                        <a href={path} key={title} className={classes.linkText}>
                            <ListItem button>
                                <ListItemText primary={title} />
                            </ListItem>
                        </a>
                    ))}
                </List>
            </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(Navigation);