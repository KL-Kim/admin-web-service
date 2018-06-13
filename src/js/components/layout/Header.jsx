import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// Material UI Component
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Material UI Icons
import Dashboard from '@material-ui/icons/Dashboard';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Notifications from '@material-ui/icons/Notifications';

// Custom Components
import LinkContainer from '../utils/LinkContainer';
import Avatar from '../utils/Avatar';
import ProperName from '../utils/ProperName';



const styles = theme => ({
  "appBar": {
    zIndex: theme.zIndex.drawer + 1,
  },
  "flex": {
    "flex": 1,
  },
  "menuButton": {
    "marginLeft": -12,
    "marginRight": 20,
  },
  "drawerPaper": {
    "width": 300,
  },
  "account": {
    "margin": "0 auto",
    "marginTop": theme.spacing.unit * 3,
    "marginBottom": theme.spacing.unit * 3,
    "textAlign": "center",
  },
  "name": {
    "marginTop": theme.spacing.unit,
  },
  "bootstrapRoot": {
    padding: 0,
    backgroundColor: theme.palette.common.white,
    borderRadius: 4,
    border: '1px solid #ced4da',
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  "bootstrapInput": {
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  "popoverContainer": {
    width: 500,
    height: 400,
    padding: theme.spacing.unit,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "drawerOpen": false,
      "search": '',
      "popoverOpen": false,
      "notificationsList": [],
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
  }

  toggleDrawer() {
    this.setState({
      "drawerOpen": !this.state.drawerOpen
    });
  }

  handlePopoverOpen() {
    this.props.getNotification({
      uid: this.props.user._id,
      unRead: true,
      limit: 10,
    })
    .then(response => {
      if (response) {
        this.setState({
          popoverOpen: true,
          notificationsList: response.list.slice(),
        });
      }
    });
  }

  handlePopoverClose() {
    this.setState({
      popoverOpen: false,
    });
  }

  handleLogout() {
    this.props.logout();
    this.setState({
      drawerOpen: false,
    });
    this.props.history.push('/');
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleClickListItem = item => e => {
    switch (item.type) {
      case "BUSINESS":
        this.props.history.push('/business/s/' + item.subjectUrl);
        break;

      case "REVIEW":
        this.props.history.push('/business/s/' + item.subjectUrl, { reviewId: item.commentId });
        break;

      case "COMMENT":
        this.props.history.push('/post/s/' + item.subjectUrl, { commentId: item.commentId });
        break;

      default:
        return ;
    }
  }

  render() {
    const { classes, user, isLoggedIn, updatedAt } = this.props;

    return (
      <div>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <LinkContainer to="/">
              <Typography variant="title" color="inherit" align="left" className={classes.flex}>
                <Button color="inherit">
                  iKoreaTown
                </Button>
              </Typography>
            </LinkContainer>
            {
              isLoggedIn
                ? <Button color="inherit" onClick={this.toggleDrawer}>
                    <Avatar user={user} updatedAt={updatedAt} />
                  </Button>
                : <LinkContainer to="/signin"><Button color="inherit">Sign In</Button></LinkContainer>
            }
          </Toolbar>
        </AppBar>
        {
          isLoggedIn
           ? (<Drawer
                anchor="right"
                open={this.state.drawerOpen}
                onClose={this.toggleDrawer}
                variant="temporary"
                classes={{paper: classes.drawerPaper}}
              >
                <div className={classes.account}>
                  <Avatar user={user} type="MEDIUM" updatedAt={updatedAt} />
                  <Typography variant="body1" className={classes.name}><ProperName user={user} /></Typography>
                </div>

                <Divider />

                <MenuList>
                  <LinkContainer to={{
                      pathname: "/dashboard",
                      state: {
                        admin: user
                      },
                    }}
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <Dashboard />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </MenuItem>
                  </LinkContainer>

                  <LinkContainer to={{
                      pathname: "/notification",
                      state: {
                        user
                      },
                    }}
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <Notifications />
                      </ListItemIcon>
                      <ListItemText primary="Notification" />
                    </MenuItem>
                  </LinkContainer>

                  <Divider />

                  <MenuItem>
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="logout" onClick={this.handleLogout}/>
                  </MenuItem>
                </MenuList>
              </Drawer>)
            : ''
        }
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(Header));
