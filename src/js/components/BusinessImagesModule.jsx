import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dropzone from 'react-dropzone';
import Img from 'react-image';
import Lightbox from 'react-images';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

// Material UI Icons
import AddPhoto from '@material-ui/icons/AddAPhoto';

// Custom Components
import ConfirmationDialog from './utils/ConfirmationDialog';

import config from '../config/config';

const styles = (theme) => ({
  "container": {
    marginBottom: theme.spacing.unit,
  },
  "paper": {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
  "dropZone": {
    width: '100%',
    height: '100%',
    minHeight: 200,
    border: 2,
    borderStyle: 'dashed',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
  },
  "card": {
    width: '100%',
  },
  "media": {
    width: '100%',
    height: 150,
  },
  "buttonContainer": {
    "display": "flex",
    justifyContent: "center"
  },
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
  "imageContainer": {
    position: 'relative',
    '&:hover $imageButtonContainer': {
      zIndex: 1,
      backgroundColor: 'black',
    },
  },
  "image": {
    width: '100%',
    height: 'auto',
  },
  "imageButtonContainer": {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    "display": "flex",
    justifyContent: "center",
    zIndex: -1,
    opacity: 0.7,
  },
  "imageButton": {
    color: "white",
    opacity: 1,
  }
});

class BusinessImagesModule extends Component {
  constructor(props) {
    super(props)

    this.state = {
      thumbnail: [],
      images: [],
      LightboxOpen: false,
      currentImage: 0,
      confirmationDialogOpen: false,
      willBeDeleted: '',
    };

    this.onDropThumbnail = this.onDropThumbnail.bind(this);
    this.onDropImages = this.onDropImages.bind(this);
    this.handleDeleteNewImage = this.handleDeleteNewImage.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpenLightbox = this.handleOpenLightbox.bind(this);
    this.gotoPrevLightboxImage = this.gotoPrevLightboxImage.bind(this);
    this.gotoNextLightboxImage = this.gotoNextLightboxImage.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleCloseLightbox = this.handleCloseLightbox.bind(this);
    this.hanldeOpenDeleteDialog = this.hanldeOpenDeleteDialog.bind(this);
    this.hanldeCloseDeleteDialog = this.hanldeCloseDeleteDialog.bind(this);
    this.handleDeleteUploadedImage = this.handleDeleteUploadedImage.bind(this);
  }

  onDropThumbnail(acceptedFiles) {
    this.setState({
      thumbnail: acceptedFiles
    });
  }

  onDropImages(acceptedFiles) {
    this.setState({
      images:  this.state.images.concat(acceptedFiles)
    });
  }

  handleDeleteNewImage = index => e => {
    const images = this.state.images.slice();
    images.splice(index, 1);

    this.setState({
      images: images.slice()
    });
  }

  handleClear() {
    this.setState({
      thumbnail: [],
      images: [],
    });
  }

  handleSubmit() {
    if (this.props.id) {
      let formData = new FormData();

      if(!_.isEmpty(this.state.thumbnail)) {
        formData.append("thumbnail", this.state.thumbnail[0], this.state.thumbnail[0].name);
      }

      if(!_.isEmpty(this.state.images)) {
        this.state.images.map(image => formData.append("images", image, image.name));
      }

      this.props.handleUpload(this.props.id, formData).then(response => {
        this.props.updateBusinessImages(response);
      });
    }
  }

  handleOpenLightbox = index => e => {
    this.setState({
      LightboxOpen: true,
      currentImage: index,
    });
  }

  gotoPrevLightboxImage() {
    this.setState({
      currentImage: this.state.currentImage - 1,
    });
  }

  gotoNextLightboxImage() {
    this.setState({
      currentImage: this.state.currentImage + 1,
    });
  }

  gotoImage(index) {
    this.setState({
      currentImage: index
    });
  }

  handleCloseLightbox() {
    this.setState({
      LightboxOpen: false
    });
  }

  hanldeOpenDeleteDialog = image => e => {
    this.setState({
      confirmationDialogOpen: true,
      willBeDeleted: image,
    });
  }

  hanldeCloseDeleteDialog() {
    this.setState({
      confirmationDialogOpen: false,
      willBeDeleted: false,
    });
  }

  handleDeleteUploadedImage() {
    this.props.handleDelete(this.props.id, { image: this.state.willBeDeleted }).then(response => {
      this.props.updateBusinessImages(response);
    });
  }

  render() {
    const { classes } = this.props;

    let uploadedImages = [];

    if (!_.isEmpty(this.props.imagesUri)) {
      this.props.imagesUri.map(image =>
        uploadedImages.push({
          src: config.API_GATEWAY_ROOT + '/' + image
        })
      );
    }

    return (
      <Paper className={classes.paper}>
        <Grid container spacing={16} className={classes.container}>
          <Grid item xs={12}>
            <Typography type="display1" gutterBottom>Thumbnail & Images</Typography>
          </Grid>
          <Grid item xs={4}>
            <Dropzone
              multiple={false}
              accept="image/*"
              onDrop={this.onDropThumbnail}
              className={classes.dropZone}
            >
              {
                _.isEmpty(this.state.thumbnail)
                  ? <div>
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
                    {
                      _.isEmpty(this.props.thumbnailUri.hd)
                      ? <Typography type="title">Add Thumbnail</Typography>
                      : <Img src={config.API_GATEWAY_ROOT + '/' + this.props.thumbnailUri.hd + '?thumbnail&t=' + Date.now()} className={classes.image} />
                    }
                    </div>
                  : <Img src={this.state.thumbnail[0].preview} className={classes.image} />
              }
            </Dropzone>
          </Grid>

          <Grid item xs={12}>
            <Typography type="display1" gutterBottom>Uploaded Images</Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={16}>
              {
                _.isEmpty(this.props.imagesUri) ? ''
                : this.props.imagesUri.map((image, index) =>
                    <Grid item xs={3} key={index}>
                      <div className={classes.imageContainer}>
                        <div className={classes.imageButtonContainer}>
                          <Button disableRipple disableFocusRipple className={classes.imageButton} onClick={this.handleOpenLightbox(index)}>View</Button>
                          <Button disableRipple disableFocusRipple className={classes.imageButton} onClick={this.hanldeOpenDeleteDialog(image)}>Delete</Button>
                        </div>
                        <Img src={config.API_GATEWAY_ROOT + '/' + image + '?images&t=' + Date.now()} className={classes.image} />
                      </div>
                    </Grid>
                  )
              }
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography type="display1" gutterBottom>New Images</Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={16}>
              {
                _.isEmpty(this.state.images) ? ''
                : this.state.images.map((image, index) =>
                    <Grid item xs={3} key={index}>
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.media}
                          image={image.preview}
                          title={image.name}
                        />
                        <CardContent>
                          <Typography type="body1">{image.name}</Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="secondary" onClick={this.handleDeleteNewImage(index)}>Delete</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
              }
              <Grid item xs={3}>
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
                  <Typography type="title">Add images</Typography>
                </Dropzone>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.buttonContainer}>
              <Button variant="raised" color="primary"
                className={classes.button}
                disabled={_.isEmpty(this.props.id) || (_.isEmpty(this.state.thumbnail) && _.isEmpty(this.state.images))}
                onClick={this.handleSubmit}
              >
                Upload
              </Button>
              <Button className={classes.button}
                onClick={this.handleClear}
              >
                Reset
              </Button>
            </div>
          </Grid>
        </Grid>

        <Lightbox
          currentImage={this.state.currentImage}
          images={uploadedImages}
          showThumbnails={true}
          showImageCount={false}
          isOpen={this.state.LightboxOpen}
          onClickPrev={this.gotoPrevLightboxImage}
          onClickNext={this.gotoNextLightboxImage}
          onClickThumbnail={this.gotoImage}
          onClose={this.handleCloseLightbox}
        />

        <ConfirmationDialog
          open={this.state.confirmationDialogOpen}
          handleClose={this.hanldeCloseDeleteDialog}
          operation={this.handleDeleteUploadedImage}
          title="Warning"
          content="Are your sure to delete the image?"
        />
      </Paper>
    );
  }
}

BusinessImagesModule.propTypes = {
  "classes": PropTypes.object.isRequired,
  "id": PropTypes.string.isRequired,
  "thumbnailUri": PropTypes.object.isRequired,
  "imagesUri": PropTypes.array.isRequired,
  "handleUpload": PropTypes.func.isRequired,
  "handleDelete": PropTypes.func.isRequired,
  "updateBusinessImages": PropTypes.func.isRequired,
}

export default withStyles(styles)(BusinessImagesModule);
