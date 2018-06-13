import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Drawer from '@material-ui/core/Drawer';

// Material UI Icons
import Dashboard from '@material-ui/icons/Dashboard';
import RateReview from '@material-ui/icons/RateReview';
import Book from '@material-ui/icons/Book';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import Notifications from '@material-ui/icons/Notifications';
import Group from '@material-ui/icons/Group';
import Business from '@material-ui/icons/Business';
import Restaurant from '@material-ui/icons/Restaurant';
import Loyalty from '@material-ui/icons/Loyalty';

// Custom Components
import LinkContainer from '../utils/LinkContainer';

const styles = theme => ({
  "drawerPaper": {
    width: 260,
    position: 'fixed',
    marginTop: theme.spacing.unit * 8,
  },
  'selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  }
});

class Sidebar extends Component {
  render() {
    const { classes, user, match } = this.props;
    const role = _.isEmpty(user) ? '' : user.role;

    return (
      <div>
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >

            <MenuList>
              <LinkContainer to={{
                  pathname: "/dashboard",
                  state: {
                    user: user
                  },
                }}>
                <MenuItem selected={match.path === "/dashboard"}>
                  <ListItemIcon>
                    <Dashboard />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" classes={match.path === "/dashboard" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>



              <LinkContainer to={{
                  pathname: "/notification",
                  state: {
                    user: user
                  },
                }}>
                <MenuItem selected={match.path === "/notification"}>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" classes={match.path === "/notification" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              <LinkContainer to={{
                  pathname: "/business",
                  state: {
                    user: user
                  },
                }}
              >
                <MenuItem selected={match.path === "/business"}>
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText primary="Business" classes={match.path === "/business" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              <LinkContainer to={{
                  pathname: "/category",
                  state: {
                    user: user
                  },
                }}
              >
                <MenuItem selected={match.path === "/category"}>
                  <ListItemIcon>
                    <Restaurant />
                  </ListItemIcon>
                  <ListItemText primary="Category" classes={match.path === "/category" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              <LinkContainer to={{
                  pathname: "/tag",
                  state: {
                    user: user
                  },
                }}
              >
                <MenuItem selected={match.path === "/tag"}>
                  <ListItemIcon>
                    <Loyalty />
                  </ListItemIcon>
                  <ListItemText primary="Tag" classes={match.path === "/tag" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              <LinkContainer to={{
                  pathname: "/review",
                  state: {
                    user: user
                  },
                }}>
                <MenuItem selected={match.path === "/review"}>
                  <ListItemIcon>
                    <RateReview />
                  </ListItemIcon>
                  <ListItemText primary="Reviews" classes={match.path === "/review" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              <LinkContainer to={{
                  pathname: "/post",
                  state: {
                    user: user
                  },
                }}>
                <MenuItem selected={match.path === "/post"}>
                  <ListItemIcon>
                    <Book />
                  </ListItemIcon>
                  <ListItemText primary="Posts" classes={match.path === "/post" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              <LinkContainer to={{
                  pathname: "/comment",
                  state: {
                    user: user
                  },
                }}>
                <MenuItem selected={match.path === "/comment"}>
                  <ListItemIcon>
                    <QuestionAnswer />
                  </ListItemIcon>
                  <ListItemText primary="Comments" classes={match.path === "/comment" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              {
                (role === 'admin' || role === 'god')
                  ? (
                      <LinkContainer to={{
                          pathname: "/user",
                          state: {
                            user: user
                          },
                        }}
                      >
                        <MenuItem selected={match.path === "/user"}>
                          <ListItemIcon>
                            <Group />
                          </ListItemIcon>
                          <ListItemText primary="Users" classes={match.path === "/user" ? { primary: classes.selected } : {}} />
                        </MenuItem>
                      </LinkContainer>
                    )
                  : ''
              }
            </MenuList>

          </Drawer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  "match": PropTypes.object.isRequired,
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
}

export default withStyles(styles)(Sidebar);
