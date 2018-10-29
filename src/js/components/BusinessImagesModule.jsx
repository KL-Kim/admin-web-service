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

const styles = (theme) => ({
  "container": {
    marginBottom: theme.spacing.unit * 2,
  },
  "paper": {
    padding: theme.spacing.unit * 4,
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
  },
  "imageInfo": {
    width: "100%",
    height: 100,
    backgroundColor: theme.palette.background.default,
  }
});

class BusinessImagesModule extends Component {
  constructor(props) {
    super(props)

    this.state = {
      main: [],
      images: [],
      LightboxOpen: false,
      currentImage: 0,
      confirmationDialogOpen: false,
      imageId: '',
    };

    this.handleDropMain = this.handleDropMain.bind(this);
    this.handleDropImages = this.handleDropImages.bind(this);
    this.handleDeleteNewImage = this.handleDeleteNewImage.bind(this);
    this.handleClearGallery = this.handleClearGallery.bind(this);
    this.handleSubmitMain = this.handleSubmitMain.bind(this);
    this.handleSubmitGallery = this.handleSubmitGallery.bind(this);
    this.handleOpenLightbox = this.handleOpenLightbox.bind(this);
    this.gotoPrevLightboxImage = this.gotoPrevLightboxImage.bind(this);
    this.gotoNextLightboxImage = this.gotoNextLightboxImage.bind(this);
    this.gotoImage = this.gotoImage.bind(this);
    this.handleCloseLightbox = this.handleCloseLightbox.bind(this);
    this.hanldeOpenDeleteDialog = this.hanldeOpenDeleteDialog.bind(this);
    this.hanldeCloseDeleteDialog = this.hanldeCloseDeleteDialog.bind(this);
    this.handleDeleteUploadedImage = this.handleDeleteUploadedImage.bind(this);
  }

  handleDropMain(acceptedFiles) {
    this.setState({
      main: [...acceptedFiles]
    });
  }

  handleDropImages(acceptedFiles) {
    this.setState({
      images:  this.state.images.concat(acceptedFiles)
    });
  }

  handleDeleteNewImage = index => e => {
    const images = this.state.images.slice();
    images.splice(index, 1);

    this.setState({
      images: [...images]
    });
  }

  handleClearGallery() {
    this.setState({
      main: [],
      images: [],
    });
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

  hanldeOpenDeleteDialog = id => e => {
    this.setState({
      confirmationDialogOpen: true,
      imageId: id,
    });
  }

  hanldeCloseDeleteDialog() {
    this.setState({
      confirmationDialogOpen: false,
      imageId: '',
    });
  }

  handleDeleteUploadedImage() {
    if (!_.isEmpty(this.props.businessId) && !_.isEmpty(this.state.imageId)) {
      this.props.handleDelete(this.props.businessId, { imageId: this.state.imageId })
        .then(response => {
          if (response) {
            this.props.updateBusiness();
            this.hanldeCloseDeleteDialog();
          }
        });
    }
  }

  handleSubmitMain() {
    if (this.props.businessId && !_.isEmpty(this.state.main)) {
      let formData = new FormData();
      formData.append("main", this.state.main[0], this.state.main[0].name);      

      this.props.handleUpload(this.props.businessId, formData)
        .then(response => {
          if (response) {
            this.props.updateBusiness();
          }
        });
    }
  }

  handleSubmitGallery() {
    if (this.props.businessId && !_.isEmpty(this.state.images)) {
      let formData = new FormData();
      this.state.images.map(image => formData.append("gallery", image, image.name));

      this.props.handleUpload(this.props.businessId, formData)
        .then(response => {
          if (response) {
            this.props.updateBusiness();

            this.setState({
              images: [],
            });
          }
        });
    }
  }

  render() {
    const { classes } = this.props;

    let uploadedImages = [];

    if (!_.isEmpty(this.props.gallery)) {
      this.props.gallery.map(image =>
        uploadedImages.push({
          src: image.url
        })
      );
    }

    return (
      <div>
        <Typography variant="display1" gutterBottom>Images</Typography>
      
        <div className={classes.container}>
          <Paper className={classes.paper}>
            <Typography variant="title" gutterBottom>Main Photo</Typography>

            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Img 
                  className={classes.image} 
                  src={this.props.mainImage.url} 
                  loader={<Typography className={classes.imageInfo}>Loading...</Typography>}
                  unloader={<Typography className={classes.imageInfo}>404 Not found</Typography>}
                />
              </Grid>

              <Grid item xs={6}>
                <Dropzone
                  multiple={false}
                  accept="image/*"
                  onDrop={this.handleDropMain}
                  className={classes.dropZone}
                >
                  {
                    _.isEmpty(this.state.main)
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
                          <Typography type="title">Add Main Image</Typography>
                        </div>
                      : <Img src={this.state.main[0].preview} className={classes.image} />
                  }
                </Dropzone>
              </Grid>
            </Grid>

            <br />

            <Grid container justify="center">
              <Grid item>
                <Button 
                  variant="raised" 
                  color="primary"
                  disabled={_.isEmpty(this.props.businessId) || _.isEmpty(this.state.main)}
                  onClick={this.handleSubmitMain}
                >
                  Upload Main
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>

        <div className={classes.container}>
          <Paper className={classes.paper}>
            <Typography variant="title" gutterBottom>Galley</Typography>
                      
            <Grid container spacing={16}>
              {
                _.isEmpty(this.props.gallery)
                  ? <Typography>None</Typography>
                  : this.props.gallery.map((image, index) =>
                      <Grid item xs={3} key={image._id}>
                        <div className={classes.imageContainer}>
                          <div className={classes.imageButtonContainer}>
                            <Button 
                              disableRipple 
                              disableFocusRipple 
                              className={classes.imageButton} 
                              onClick={this.handleOpenLightbox(index)}
                            >
                              View
                            </Button>
                            <Button 
                              disableRipple 
                              disableFocusRipple 
                              className={classes.imageButton} 
                              onClick={this.hanldeOpenDeleteDialog(image._id)}
                            >
                              Delete
                            </Button>
                          </div>
                          <Img 
                            className={classes.image} 
                            src={image.url} 
                            loader={<Typography>Loading...</Typography>}
                            unloader={<Typography className={classes.imageInfo}>404 Not found</Typography>}
                          />
                        </div>
                      </Grid>
                    )
              }
            </Grid>
          </Paper>
        </div>
        
        <div className={classes.container}>
          <Typography variant="title" gutterBottom>New Images</Typography>
        
          <Grid container spacing={16}>
            {
              _.isEmpty(this.state.images) 
                ? null
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
                onDrop={this.handleDropImages}
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
                <Typography type="title">Add to Gallery</Typography>
              </Dropzone>
            </Grid>
          </Grid>

          <br />

          <Grid container justify="center" spacing={16}>
            <Grid item>
              <Button 
                variant="raised" 
                color="primary"
                disabled={_.isEmpty(this.props.businessId) || _.isEmpty(this.state.images)}
                onClick={this.handleSubmitGallery}
              >
                Upload Gallery
              </Button>
            </Grid>

            <Grid item>
              <Button
                onClick={this.handleClearGallery}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </div>
        
        <div>
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
        </div>
      </div>
    );
  }
}

BusinessImagesModule.propTypes = {
  "classes": PropTypes.object.isRequired,
  "businessId": PropTypes.string.isRequired,
  "mainImage": PropTypes.object.isRequired,
  "gallery": PropTypes.array.isRequired,

  // Methods
  "handleUpload": PropTypes.func.isRequired,
  "handleDelete": PropTypes.func.isRequired,
  "updateBusiness": PropTypes.func.isRequired,
}

export default withStyles(styles)(BusinessImagesModule);
