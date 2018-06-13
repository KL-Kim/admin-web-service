import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import { adminEditUser, adminGetUser } from '../actions/admin.actions.js';

const styles = (theme) => ({
  "paper": {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 4,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
});

class SingleUserInfoPage extends Component {
  constructor(props) {
    super(props);

    const userId = _.isUndefined(props.location.state) ? '' : props.location.state.userId;

    this.state = {
      "userId": userId,
      "userStatus": '',
      "role": '',
      'user': {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount() {
    if (_.isEmpty(this.props.location.state.userId)  )
      this.props.history.push('/404');
  }

  componentDidMount() {
    if (this.state.userId) {
      this.props.adminGetUser(this.state.userId)
        .then(user => {
          if (user) {
            this.setState({
              user: Object.assign({}, user),
              userStatus: user.userStatus,
              role: user.role,
            });
          }
        });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit() {
    const { role, userStatus } = this.state;
    let data = {};

    if (role) data.role = role;
    if (userStatus) data.userStatus = userStatus;

    if (role || userStatus)
      this.props.adminEditUser(this.state.userId, data);
  }

  handleCancel() {
    this.props.history.goBack();
  }

  render() {
    const { classes, location } = this.props;
    const { user } = this.state;

    return _.isEmpty(user) ? '' :(
      <SettingContainer>
        <div>
          <Typography variant="display1" gutterBottom>Email -  {(_.isEmpty(user) ? '' : user.email)}</Typography>
          <Paper className={classes.paper}>
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={3}>
                <TextField fullWidth disabled id="username" label="Username"  margin="normal" defaultValue={user.username} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="phone" label="Phone"  margin="normal" defaultValue={_.isUndefined(user.phoneNumber) ? 'None' : user.phoneNumber.toString()} />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="status">Status</InputLabel>
                  <Select native
                    name="userStatus"
                    value={this.state.userStatus}
                    inputProps={{
                      id: "status"
                    }}
                    onChange={this.handleChange}
                  >
                    <option value="normal">Normal</option>
                    <option value="suspended">Suspened</option>
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select native
                    name="role"
                    value={this.state.role}
                    inputProps={{
                      id: "role"
                    }}
                    onChange={this.handleChange}
                  >
                    <option value="regular">Regular</option>
                    <option value="writer">Writer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>

                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="name" label="Name" margin="normal" defaultValue={
                  (_.isUndefined(user.firstName) ? '' : user.firstName) + ' ' + (_.isUndefined(user.lastName) ? '' : user.lastName)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="verified" label="Verification"  margin="normal" defaultValue={user.isVerified ? 'Yes' : 'No'} />
              </Grid>

              <Grid item xs={3}>
                <TextField fullWidth disabled id="gender" label="Gender" margin="normal" defaultValue={_.isUndefined(user.gender) ? 'None' : user.gender} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="birthday" label="Birthday" margin="normal" defaultValue={_.isUndefined(user.birthday) ? 'None' : user.birthday} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth disabled id="address" label="Address" margin="normal" defaultValue={
                  _.isUndefined(user.address) ? 'None' : user.address.province.name + ' ' + user.address.city.name + ' ' + user.address.area.name + ' ' + user.address.street}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="point" label="Point" margin="normal" defaultValue={_.isUndefined(user.point) ? '0' : user.point.toString()} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="createdAt" label="Join at" margin="normal" defaultValue={_.isUndefined(user.createdAt) ? 'none' : user.createdAt.toString()} />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.buttonContainer}>
                  <Button variant="raised" color="primary" className={classes.button} onClick={this.handleSubmit}>
                    Update
                  </Button>
                  <Button color="primary" className={classes.button} onClick={this.handleCancel}>
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="display1" gutterBottom>Login History</Typography>
          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Agent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.isUndefined(user.lastLogin) ? '' : user.lastLogin.map((item, index) => {
                  const date = new Date(item.time);
                  return (
                    <TableRow key={index}>
                      <TableCell>{date.toLocaleString()}</TableCell>
                      <TableCell>{item.ip}</TableCell>
                      <TableCell>{item.agent}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </SettingContainer>
    );
  }
}

SingleUserInfoPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
  };
};

export default connect(mapStateToProps, { adminEditUser, adminGetUser })(withStyles(styles)(SingleUserInfoPage));
