import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from 'react-dropzone';
import Img from 'react-image';

// Material UI Components
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

// Material UI Icons
import AddPhoto from '@material-ui/icons/AddAPhoto';

// Custom Components
import SettingContainer from './layout/SettingContainer';
import ConfirmationDialog from './utils/ConfirmationDialog';

// Actions
import { addNewPost, getSinglePost, updatePost, deletePost, uploadPostImages } from '../actions/blog.actions';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote', 'code', ],
    [{'color': []}, {'background': []}],
    [{ 'align': [] }, {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ]
};

const format = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code',
  'color', 'background',
  'list', 'bullet', 'indent',
  'link', 'image',
];

const styles = (theme) => ({
  "paper": {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
  "progress": {
    margin: theme.spacing.unit * 2,
  },
  "title": {
    paddingRight: theme.spacing.unit * 2,
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
  "image": {
    width: '100%',
    height: 'auto',
  },
});

class SinglePostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      confirmationDialogOpen: false,
      deleteDialogOpen: false,
      status: 'DRAFT',
      state: "NORMAL",
      title: '',
      summary: '',
      content: '',
      keywords: [],
      mainImage: {},
      main: [],
    };

    this.state.id = props.match.params.id === 'new' ? '' : props.match.params.id;

    this.handleChange = this.handleChange.bind(this);
    this.handleContentEditorChange = this.handleContentEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOpenConfirmationDialog =  this.handleOpenConfirmationDialog.bind(this);
    this.handleCloseConfirmationDialog = this.handleCloseConfirmationDialog.bind(this);
    this.handleDeleteConfirmationDialogOpen = this.handleDeleteConfirmationDialogOpen.bind(this);
    this.handleDeleteConfirmationDialogClose = this.handleDeleteConfirmationDialogClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    if (this.state.id) {
      this.props.getSinglePost(this.state.id)
        .then(response => {
          if (response) {
            this.setState({
              id: response.post._id,
              title: response.post.title,
              summary: response.post.summary,
              content: response.post.content,
              status: response.post.status,
              keywords: [...response.post.keywords],
              mainImage: {...response.post.mainImage},
            })
          }
        })
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleContentEditorChange = (editorState) => this.setState({ content: editorState });

  handleSubmit() {
    if (this.props.user && this.state.id === '') {
      this.props.addNewPost({
        title: this.state.title,
        summary: this.state.summary,
        content: this.state.content,
        authorId: this.props.user._id,
        status: this.state.status,
      })
      .then(response => {
        this.props.history.goBack();
      });
    } else if (this.props.user && this.state.id !== '') {
      this.props.updatePost(this.state.id, {
        title: this.state.title,
        summary: this.state.summary,
        content: this.state.content,
        authorId: this.props.user._id,
        status: this.state.status,
      })
    }
  }

  handleDelete() {
    if (this.state.id) {
      this.props.deletePost(this.state.id, {
        authorId: this.props.user._id
      }).then(response => {
        this.props.history.goBack();
      });
    }
  }

  handleCancel() {
    this.props.history.goBack();
  }

  handleOpenConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: true
    });
  }

  handleCloseConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: false
    });
  }

  handleDeleteConfirmationDialogOpen() {
    this.setState({
      deleteDialogOpen: true
    });
  }

  handleDeleteConfirmationDialogClose() {
    this.setState({
      deleteDialogOpen: false
    });
  }

  handleDropMain = (acceptedFiles) => {
    this.setState({
      main: [...acceptedFiles]
    });
  }

  handleSubmitMain = () => {
    if (this.state.id && !_.isEmpty(this.state.main)) {
      let formData = new FormData();
      formData.append("main", this.state.main[0], this.state.main[0].name);      

      this.props.uploadPostImages(this.state.id, formData);
    }
  }

  render() {
    const { classes } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <SettingContainer>
        <div>
          <Grid container spacing={24} alignItems="center">
            <Grid item xs={6}>
              <div>
                <Typography
                  variant="title"
                  className={classes.title}
                >
                  {this.state.title ? this.state.title : 'New post'}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={6}>
              <div className={classes.buttonContainer}>
                <Button
                  color="secondary"
                  disabled={this.state.id ? false : true}
                  className={classes.button}
                  onClick={this.handleDeleteConfirmationDialogOpen}
                >
                  Delete
                </Button>
                <Button 
                  className={classes.button} 
                  onClick={this.handleOpenConfirmationDialog}
                >
                  Cancel
                  </Button>
                <Button 
                  variant="raised" 
                  color="primary" 
                  className={classes.button} 
                  disabled={_.isEmpty(this.state.title) || _.isEmpty(this.state.summary) || _.isEmpty(this.state.content)}
                  onClick={this.handleSubmit}
                >
                  Save
                </Button>
              </div>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <FormControl fullWidth disabled={this.state.id ? false : true}>
                  <FormLabel component="label" required>Status</FormLabel>
                  <RadioGroup
                    row
                    aria-label="status"
                    name="status"
                    
                    value={this.state.status}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel value="DRAFT" control={<Radio color="primary" />} label="Draft" />
                    <FormControlLabel value="PUBLISHED" control={<Radio color="primary" />} label="Published" />
                    <FormControlLabel value="TRASH" control={<Radio color="primary" />} label="Trash" />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <FormControl fullWidth disabled={this.state.id ? false : true}>
                  <FormLabel component="label" required>State</FormLabel>
                  <RadioGroup
                    row
                    aria-label="state"
                    name="state"
                    value={this.state.state}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel value="NORMAL" control={<Radio color="primary" />} label="Normal" />
                    <FormControlLabel value="SUSPENDED" control={<Radio color="primary" />} label="SUSPENDED" />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="title" required>Title</InputLabel>
                    <Input type="text"
                      id="title"
                      name="title"
                      value={this.state.title}
                      onChange={this.handleChange}
                    />
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="summary">Summary</InputLabel>
                  <Input type="text"
                    id="summary"
                    name="summary"
                    multiline
                    rows={5}
                    value={this.state.summary}
                    onChange={this.handleChange}
                  />
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Quill
                  value={this.state.content}
                  modules={modules}
                  format={format}
                  onChange={this.handleContentEditorChange} />
              </Paper>
            </Grid>
          </Grid>

          <div className={classes.container}>
            <Typography variant="title" gutterBottom>Main Photo</Typography>
            <Paper className={classes.paper}>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <Img 
                    className={classes.image} 
                    src={this.state.mainImage.url} 
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
                    disabled={_.isEmpty(this.state.id) || _.isEmpty(this.state.main)}
                    onClick={this.handleSubmitMain}
                  >
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </div>

          <div>
            <ConfirmationDialog
              open={this.state.confirmationDialogOpen}
              title="Warning"
              content="Are your sure to leave?"
              handleClose={this.handleCloseConfirmationDialog}
              operation={this.handleCancel}
            />

            <ConfirmationDialog
              open={this.state.deleteDialogOpen}
              title="Warning"
              content="Are your sure to delete?"
              handleClose={this.handleDeleteConfirmationDialogClose}
              operation={this.handleDelete}
            />
          </div>
        </div>
      </SettingContainer>
    );
  }
}

SinglePostPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "addNewPost": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
  };
};

export default connect(mapStateToProps, {
  addNewPost,
  getSinglePost,
  updatePost,
  deletePost,
  uploadPostImages,
})(withStyles(styles)(SinglePostPage));
