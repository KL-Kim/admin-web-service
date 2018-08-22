import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import Stars from 'react-stars';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

// Material UI Icons
import Whatshot from '@material-ui/icons/Whatshot';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Favorite from '@material-ui/icons/Favorite';

// Custom Components
import Container from './layout/Container'

// Actions
import { getSingleBusiness } from '../actions/business.actions';

import config from '../config/config';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

// Mock image
import image from '../../css/logo.svg';

const styles = theme => ({
  "thumbnail": {
    width: '100%',
  },
  "paper": {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  },
  "button": {
    margin: theme.spacing.unit,
  },
  "badgeContent": {
    paddingRight: theme.spacing.unit * 2,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
});

class SingleBusinessPage extends Component {
  componentDidMount() {
    this.props.getSingleBusiness(this.props.match.params.slug);
  }

  render() {
    const { classes, business } = this.props;
    const thumbnail = _.isEmpty(business) || _.isEmpty(business.thumbnailUri) ? image : config.API_GATEWAY_ROOT + '/' + business.thumbnailUri.hd;

    return (
      <Container>
        {
          _.isEmpty(business) 
            ? null 
            : <div>
                <Grid container spacing={16}>
                  <Grid item xs={4}>
                    <Img src={thumbnail} className={classes.thumbnail} />
                  </Grid>
                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Grid container alignItems="center">
                        <Grid item xs={6}>
                          <Typography type="display1" color="primary">{business.krName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.buttonContainer}>
                            <Tooltip id="favor-icon" title="Add to Favor">
                              <IconButton color='default'>
                                <FavoriteBorder />

                              </IconButton>
                            </Tooltip>
                            <Tooltip id="report-icon" title="Report">
                              <IconButton>
                                <ErrorOutline />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </Grid>
                      </Grid>
                      <Typography type="body1" gutterBottom>{business.cnName}</Typography>
                      <Stars count={5} size={24} value={business.ratingAverage} edit={false} />
                        <Typography type="body2">{business.category.krName}</Typography>
                      <Typography type="body1">Tel: {business.tel}</Typography>
                      <Typography type="body1">{business.address.area.name + ' ' + business.address.street}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Typography type="title" gutterBottom>지도</Typography>

                    </Paper>
                  </Grid>

                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Typography type="display1" gutterBottom>More</Typography>
                      <Typography type="body1" gutterBottom>가격: {business.priceRange}</Typography>
                      <Typography type="body1" gutterBottom>배달: {business.delivery}</Typography>
                      <Typography type="body1" gutterBottom>언어: {business.supportedLanguage}</Typography>
                      <Typography type="body1" gutterBottom>Payments: {business.payment}</Typography>
                      <Typography type="body1" gutterBottom>휴식일: {business.rest}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Typography type="title" gutterBottom>분점</Typography>
                      {business.chains.map(item =>
                        (<Link to={item.enName} key={item.enName}>
                          <Typography type="body1">{item.krName}</Typography>
                        </Link>)
                      )}
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Typography type="title" gutterBottom>영업시간</Typography>
                      <Typography type="body1" gutterBottom>월요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.mon}</Typography>
                      <Typography type="body1" gutterBottom>화요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.tue}</Typography>
                      <Typography type="body1" gutterBottom>수요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.wed}</Typography>
                      <Typography type="body1" gutterBottom>목요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.thu}</Typography>
                      <Typography type="body1" gutterBottom>금요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.fri}</Typography>
                      <Typography type="body1" gutterBottom>토요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sat}</Typography>
                      <Typography type="body1" gutterBottom>일요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sun}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Typography type="title" gutterBottom>Description</Typography>
                      <Typography type="body1" gutterBottom>{business.description}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Typography type="title" gutterBottom>Event</Typography>
                      <Typography type="body1" gutterBottom>{business.event}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper className={classes.paper}>
                      <Typography type="title" gutterBottom>Menu</Typography>
                      {
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              _.isEmpty(business.menu) ? (<TableRow></TableRow>)
                              : business.menu.map((item, index) => {
                                  let name;

                                  if (item.hot) {
                                    name = <Badge color="secondary" badgeContent={<Whatshot />}>
                                        <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
                                      </Badge>
                                  } else if (item.new) {
                                    name = <Badge color="primary" badgeContent="New">
                                        <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
                                      </Badge>
                                  } else {
                                    name = <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
                                  }

                                return (<TableRow hover key={index}>
                                  <TableCell>
                                    {name}
                                  </TableCell>
                                  <TableCell>{item.price}</TableCell>
                                </TableRow>
                              )})
                            }
                          </TableBody>
                        </Table>
                      }
                    </Paper>
                  </Grid>
                </Grid>
              </div>
        }
      </Container>
    );
  }
}

SingleBusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "business": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    business: state.businessReducer.business,
  };
};

export default connect(mapStateToProps, {
  getSingleBusiness,
})(withStyles(styles)(SingleBusinessPage));
