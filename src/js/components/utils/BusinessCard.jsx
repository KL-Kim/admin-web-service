import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Stars from 'react-stars';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Card, { CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Share from 'material-ui-icons/Share';
import FavoriteBorder from 'material-ui-icons/FavoriteBorder';
import Favorite from 'material-ui-icons/Favorite';

import { favorOperation } from '../../actions/user.actions';

import config from '../../config/config';
import image from '../../../css/ikt-icon.gif';

const styles = {
  // card: {
  //   maxWidth: 345,
  // },
  media: {
    height: 200,
  },
};

class BusinessCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFavor: props.isFavor,
    };

    this.hanldeAddToFavor = this.hanldeAddToFavor.bind(this);
  }

  hanldeAddToFavor() {
    if (!this.props.isLoggedIn) {
      this.props.history.push('/signin');
    }

    if (!_.isEmpty(this.props.user) && !_.isEmpty(this.props.bid)) {
      this.props.favorOperation(this.props.user._id, this.props.bid)
        .then(response => {
          if (response) {
            this.setState({
              isFavor: !this.state.isFavor
            });
          }
        });
    }
  }

  render() {
    const { classes, thumbnailUri } = this.props;
    const thumbnail = _.isEmpty(thumbnailUri) ? image : config.API_GATEWAY_ROOT + '/' + thumbnailUri.hd;

    return (
      <div>
        <Card className={classes.card}>
          <Link to={{
            "pathname": "/business/s/" + this.props.enName,
          }}>
            <CardMedia className={classes.media}
              image={thumbnail}
              title={this.props.title}
            />
            <CardContent>
              <Typography type="title">{this.props.title}</Typography>
              <Stars count={5} size={20} value={this.props.rating} edit={false} />
            </CardContent>
          </Link>
          <CardActions>
            <Tooltip id="favor-icon" title="Add to Favor">
              <IconButton color={this.state.isFavor ? "secondary" : 'default'} onClick={this.hanldeAddToFavor}>
                {
                  this.state.isFavor ? <Favorite /> : <FavoriteBorder />
                }
              </IconButton>
            </Tooltip>
            <Tooltip id="share-icon" title="Share">
              <IconButton aria-label="Share">
                <Share />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      </div>
    );
  }
}

BusinessCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "bid": PropTypes.string.isRequired,
  "enName": PropTypes.string.isRequired,
  "rating": PropTypes.number,
  "thumbnail": PropTypes.object,
  "isFavor": PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps, { favorOperation })(withStyles(styles)(BusinessCard));
