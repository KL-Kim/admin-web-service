import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Stars from 'react-stars';
import Dropzone from 'react-dropzone';
import Img from 'react-image';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core/Dialog';
import Input, { InputLabel } from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

// Material UI Icons
import AddPhoto from '@material-ui/icons/AddAPhoto';

const styles = theme => ({
  "button": {
    marginRight: theme.spacing.unit,
  },
  "image": {
    width: '100%',
  },
  "dropZone": {
    width: '100%',
    height: '100%',
    minHeight: 100,
    border: 2,
    borderStyle: 'dashed',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
  },
});

class WriteReviewDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: props.rating || null,
      content: props.content || '',
      images: [],
      "serviceGood": props.serviceGood || false,
      "envGood": props.envGood || false,
      "comeback": props.comeback || false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStarChange = this.handleStarChange.bind(this);
    this.onDropImages = this.onDropImages.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        rating: nextProps.rating || null,
        content: nextProps.content || '',
        "serviceGood": nextProps.serviceGood || false,
        "envGood": nextProps.envGood || false,
        "comeback": nextProps.comeback || false,
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleStarChange(rating) {
    this.setState({
      "rating": rating,
    });
  }

  handleClick = (name) => e => {
    this.setState({
      [name]: !this.state[name]
    });
  }

  onDropImages(acceptedFiles) {
    this.setState({
      images:  this.state.images.concat(acceptedFiles)
    });
  }

  handleClose() {
    this.setState({
      rating: null,
      content: '',
      images: [],
      "serviceGood": false,
      "envGood": false,
      "comeback": false,
    });
    this.props.handleClose();
  }

  handleSubmit() {
    if (this.props.user && !this.props.readOnly) {
      const data = {
        uid: this.props.user._id,
        rating: this.state.rating,
        content: this.state.content,
        serviceGood: this.state.serviceGood,
        envGood: this.state.envGood,
        comeback: this.state.comeback,
        bid: this.props.business._id,
      }

      this.props.addNewReview(data)
        .then(response => {
          this.handleClose();
        });
    }

  }

  render() {
    const { classes, business } = this.props;

    return (
      <Dialog fullWidth
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="review-dialog-title"
        aria-describedby="review-dialog-description"
      >
        <DialogTitle id="review-dialog-title">
          <Link to={"/business/s/" + this.props.business.enName}>
            "{business.krName}"
          </Link>
          에 대한 리뷰
        </DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <Stars count={5} size={24} half={false} value={this.state.rating} onChange={this.handleStarChange} edit={!this.props.readOnly} />
            </Grid>
            <Grid item xs={12}>
              <Tooltip id="tooltip-service" title="서비스가 좋은가요?" placement="bottom">
                <Button size="small"
                  color="primary"
                  disabled={this.props.readOnly}
                  className={classes.button}
                  raised={this.state.serviceGood}
                  onClick={this.handleClick("serviceGood")}

                >
                  서비스 {this.state.serviceGood ? '+1' : ''}
                </Button>
              </Tooltip>
              <Tooltip id="tooltip-env" title="환경이 좋은가요?" placement="bottom">
                <Button size="small"
                  disabled={this.props.readOnly}
                  color="primary"
                  className={classes.button}
                  raised={this.state.envGood}
                  onClick={this.handleClick("envGood")}
                >
                  환경 {this.state.envGood ? '+1' : ''}
                </Button>
              </Tooltip>
              <Tooltip id="tooltip-back" title="다시 오실 건가요?" placement="bottom">
                <Button size="small"
                  disabled={this.props.readOnly}
                  color="primary"
                  className={classes.button}
                  raised={this.state.comeback}
                  onClick={this.handleClick("comeback")}
                >
                  다시 오고 싶다 {this.state.comeback ? '+1' : ''}
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="content">Content</InputLabel>
                <Input
                  type="text"
                  id="content"
                  disabled={this.props.readOnly}
                  multiline
                  rows={10}
                  name="content"
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container space={16}>
            {
              _.isEmpty(this.state.images) ? ''
              : this.state.images.map((image, index) =>
                  <Grid item xs={3}>
                    <Img className={classes.image} src={image.preview} />
                  </Grid>
                )
            }
            {
              this.props.readOnly ? ''
                : <Grid item xs={3}>
                  <Dropzone
                    multiple={true}
                    accept="image/*"
                    onDrop={this.onDropImages}
                    className={classes.dropZone}
                  >
                    <AddPhoto style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: 50,
                      height: 50,
                      transform: 'translate(-50%, -50%)',
                      opacity: 0.5,
                      }}
                    />
                  </Dropzone>
                </Grid>
            }

          </Grid>
        </DialogContent>

        <DialogActions>
          {
            this.props.readOnly ? ''
              : <Button raised autoFocus color="primary" disabled={!this.state.rating} onClick={this.handleSubmit}>
                Save
              </Button>
          }

          <Button color="primary" onClick={this.handleClose}>
            {this.props.readOnly ? 'Close' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

WriteReviewDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "readOnly": PropTypes.bool,
  "open": PropTypes.bool.isRequired,
  "business": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "handleClose": PropTypes.func.isRequired,
  "handleSubmit": PropTypes.func,
}

export default withStyles(styles)(WriteReviewDialog);
