import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Stars from 'react-stars';
import { withStyles } from 'material-ui/styles';
import Card, {CardContent, CardActions, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ThumbUp from 'material-ui-icons/ThumbUp';
import IconButton from 'material-ui/IconButton';

import ConfirmationDialog from './ConfirmationDialog';
import ProperName from './ProperName';

import image from '../../../css/ikt-icon.gif';

const styles = theme => ({
  container: {
    width: '33.3%',
  },
  card: {
    margin: theme.spacing.unit * 2,
  },
  media: {
    height: 200,
  },
});

class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "deleteDialogOpen": false,
      "upvoteNum": props.upvoteNum,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.handleClickUpVote = this.handleClickUpVote.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        "upvoteNum": nextProps.upvoteNum,
      });
    }
  }

  handleDeleteDialogOpen() {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  handleDeleteDialogClose() {
    this.setState({
      deleteDialogOpen: false,
    });
  }

  handleDelete() {
    if (!this.props.isLoggedIn) {
      this.props.history.push('/signin');
    }

    if (this.props.handleDelete && this.props.id) {
      this.props.handleDelete({
        _id: this.props.id,
        uid: this.props.owner._id,
      }).then(response => {
        this.setState({
          deleteDialogOpen: false,
        });
      });
    }
  }

  handleClickUpVote() {
    if (!_.isUndefined(this.props.handleVote) && !_.isEmpty(this.props.user) && this.props.owner._id !== this.props.user._id) {
      this.props.handleVote(this.props.id, {
        uid: this.props.user._id,
        businessName: this.props.business.krName + '/' + this.props.business.cnName,
        businessSlug: this.props.business.enName,
        vote: 'upvote',
      }).then(response => {
        if (response) {
          this.setState({
            "upvoteNum": response.review.upvote.length,
          });
        }
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardMedia className={classes.media}
            image={image}
          />
          <CardContent>
            {
              this.props.showBusinessName
                ? <Link to={"/business/s/" + this.props.business.enName}>
                    <Typography type="title" gutterBottom>
                      {this.props.business.krName}
                    </Typography>
                  </Link>
                : ''
            }
            <Stars count={5} size={20} value={this.props.rating} edit={false} />
            {
              this.props.showUser
                ? <Typography type="body1" gutterBottom>
                    <ProperName user={this.props.owner} />
                  </Typography>
                : ''
            }
            <Typography type="body1" gutterBottom>{this.props.content}</Typography>

            <div>
              <span>
                <IconButton onClick={this.handleClickUpVote} disabled={this.props.isOwn}>
                  <ThumbUp color={this.props.isOwn ? "inherit" : "primary"} />
                </IconButton>
                {this.state.upvoteNum}
              </span>
            </div>
          </CardContent>
          {
            this.props.isOwn ? (
              <CardActions>
                <Button color="secondary" onClick={this.handleDeleteDialogOpen}>Delete</Button>
              </CardActions>
            ) : ''
          }
        </Card>
        {
          this.props.isOwn
            ? (<div>
                <ConfirmationDialog
                  open={this.state.deleteDialogOpen}
                  title="Warning"
                  content="Are you sure to delete the review?"
                  operation={this.handleDelete}
                  handleClose={this.handleDeleteDialogClose}
                />
              </div>)
            : ''
        }
      </div>
    );
  }
}

ReviewCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "id": PropTypes.string.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "owner": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,
  "showUser": PropTypes.bool,
  "business": PropTypes.object.isRequired,
  "showBusinessName": PropTypes.bool,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "upvoteNum": PropTypes.number,
  "handleDelete": PropTypes.func,
};

export default withStyles(styles)(ReviewCard);
