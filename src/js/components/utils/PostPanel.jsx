import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Img from 'react-image';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ThumbUp from 'material-ui-icons/ThumbUp';
import IconButton from 'material-ui/IconButton';

import ProperName from './ProperName';
import ElapsedTime from '../../helpers/ElapsedTime';

import image from '../../../css/ikt-icon.gif';

const styles = theme => ({
  thumbnail: {
    width: '100%',
    height: 'auto',
  }
});

class PostPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, post } = this.props;

    const thumbnail = (
      <Grid item xs={4}>
        <Img src={image} className={classes.thumbnail}/>
      </Grid>
    );

    const content = (
      <Grid item xs={8}>
        <Typography type="display1" gutterBottom>{post.title}</Typography>
        <Typography type="body1" gutterBottom>{post.summary}</Typography>
        <Typography type="body1" gutterBottom>
          By <strong><ProperName  user={post.authorId} /></strong>
        </Typography>
        <Typography type="body1" gutterBottom>Creadted at: {ElapsedTime(post.createdAt)}</Typography>
      </Grid>
    );

    return (
      <div>
        <Link to={"/post/s/" + this.props.post._id}>
          <Grid container>
            {this.props.rtl ? content : thumbnail}
            {this.props.rtl ? thumbnail : content}
          </Grid>
        </Link>
      </div>
    );
  }
 }

PostPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "post": PropTypes.object.isRequired,
};

export default withStyles(styles)(PostPanel);
