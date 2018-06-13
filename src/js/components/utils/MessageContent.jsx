import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Actions
import { getSingleReview } from '../../actions/review.actions';

const styles = theme => ({
});

class MessageContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "dialogOpen": false,
      "review": {},
      "message": '',
    }

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { type, event, subjectTitle } = this.props;

    switch (type) {
      case "BUSINESS":
        switch (event) {
          case "START_EVENT":
            this.setState({
              message: subjectTitle + "started new event",
            });
            break;

          default:
            return ;
        }
        break;

      case "REVIEW":
        switch (event) {
          case "UPVOTE":
            this.setState({
              message: "likes your review about " + subjectTitle,
            });
            break;

          default:
            return ;
        }
        break;

      case "COMMENT":
        switch (event) {
          case "UPVOTE":
            this.setState({
              message: "upvotes your comment",
            });
            break;

          case "DOWNVOTE":
            this.setState({
              message: "downvotes your comment",
            });
            break;

          case "REPLY":
            this.setState({
              message: "replyed to your comment",
            });
            break;

          default:
            return ;
        }
        break;

      default:
        return ;
    }
  }

  handleClose() {
    this.setState({
      dialogOpen: false,
    });
  }

  render() {

    return (
      <div>
        <strong>{_.isEmpty(this.props.sender) ? '' : this.props.sender.username}</strong>
        {' ' + this.state.message}
        <Typography>{this.props.commentContent}</Typography>
      </div>
    )
  }
}

MessageContent.propTypes = {
  "classes": PropTypes.object.isRequired,
  "type": PropTypes.string.isRequired,
  "content": PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps, { getSingleReview })(withStyles(styles)(MessageContent));
