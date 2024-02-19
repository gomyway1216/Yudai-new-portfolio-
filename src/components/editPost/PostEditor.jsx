import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, FormControlLabel, TextField, Switch,
  FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import DeleteItemDialog from '../dialog/DeleteItemDialog';
import InstantMessage from '../popUp/Alert';
import styles from './rich-text-editor.module.scss';
import { getPostCategories } from '../../api/firebase/post';
import ImageUpload from '../image/ImageUpload';
import { RichTextEditor } from '@mantine/rte';
import * as imageApi from '../../api/firebase/image';
import PropTypes from 'prop-types';

const UPDATE_INTERVAL = 10000;

const languageList = [
  { id: 'en', name: 'English' },
  { id: 'ja', name: 'Japanese' },
];

const PostEditor = (props) => {
  const [original, setOriginal] = useState();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(props.category || '');
  const [isPublic, setPublic] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [autoSaveBody, setAutoSaveBody] = useState('');
  const [autoSaveTitle, setAutoSaveTitle] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [language, setLanguage] = useState({'id': 'en', 'name': 'English'});

  const titleRef = useRef(title);
  const bodyRef = useRef(body);
  const isPublicRef = useRef(isPublic);
  const categoryRef = useRef(category);

  // useState<'idle' | 'updating' | 'deleting'>('idle');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    bodyRef.current = body;
  }, [body]);

  useEffect(() => {
    isPublicRef.current = isPublic;
  }, [isPublic]);

  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  const fetchPost = async () => {
    // if id is defined, the rich text editor is expected to load 
    // the data from the server, if not, create a new post
    if (props.postId && props.category) {
      const doc = await props.getPost(props.postId, props.category);
      if (doc) {
        setTitle(doc.title);
        setBody(doc.body);
        setPublic(doc.isPublic);
        setOriginal(doc);
        setImageUrl(doc.image);
        setLanguage(doc.language);
      } else {
        const msg = 'Post not found!';
        setErrorMessage(msg);
      }
    } else {
      const doc = {
        id: '',
        title: '',
        body: '',
        isPublic: false,
        created: new Date(),
        lastUpdated: new Date(),
        category: '',
        image: imageUrl,
        language: language
      };
      setOriginal(doc);
    }
  };

  const fetchCategoryList = async () => {
    const categoryList = await getPostCategories();
    setCategoryList(categoryList);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    fetchCategoryList();
  }, []);


  const deepCompareBodyAndTitle = (body, title) => {
    if (autoSaveBody !== body || autoSaveTitle !== title) {
      setAutoSaveBody(body);
      setAutoSaveTitle(title);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (status === 'idle' && autoSave) {
      const interval = window.setInterval(() => {
        const item = {
          id: props.postId,
          title: titleRef.current,
          body: bodyRef.current,
          isPublic: isPublicRef.current,
          created: original?.created || new Date(), // update the timestamp
          lastUpdated: new Date(), // update the timestamp
          category: categoryRef.current,
          image: imageUrl,
          language: language
        };
        try {
          if (deepCompareBodyAndTitle(bodyRef.current, titleRef.current)) {
            setStatus('updating');
            props.updatePost(item);
            setStatus('idle');
          }
        } catch (err) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage('An error occurred');
          }
          setStatus('idle');
        }

      }, UPDATE_INTERVAL);
      setIntervalId(interval);

      return () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
      };
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    }
  }, [status, autoSave]);


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onAutoSaveSwitchChange = (e) => {
    setAutoSave(e.target.checked);
  };

  const onIsPublicSwitchChange = (e) => {
    setPublic(e.target.checked);
  };


  const handleSave = async () => {
    setStatus('updating');
    const handleFunction = props.postId ? props.updatePost : props.createPost;

    const item = {
      id: props.postId || '',
      title,
      body,
      isPublic,
      created: props.postId && original ? original.created : new Date(),
      lastUpdated: new Date(), // always update the timestamp
      category,
      image: imageUrl,
      language
    };

    try {
      await handleFunction(item);
      navigate(`/blog/${category}/${props.postId || item.id}`);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An error occurred');
      }
    }
    setStatus('idle');
  };


  const handleClose = async () => {
    setStatus('updating');
    try {
      await props.updatePost(original);
      if (props.postId) {
        navigate(`/blog/${category}/${props.postId}`);
      } else {
        navigate('/blog/all');
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An error occurred');
      }
    }
    setStatus('idle');
  };

  const handleDelete = async () => {
    setStatus('deleting');
    const updateStatus = await props.deletePost(props.postId, props.category);
    if (updateStatus) {
      navigate(`/blog/${props.category}/${props.postId}`);
    } else {
      const msg = 'deletion of the post is failing!';
      setErrorMessage(msg);
    }
    setStatus('idle');
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleAlertClose = () => {
    setErrorMessage('');
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleImageUrl = (url) => {
    setImageUrl(url);
  };

  return (
    <div className={styles.root}>
      <div className={styles.subSection}>
        <div className={styles.titleWrapper}>
          <TextField id="outlined-basic" label="Title"
            variant="outlined" value={title}
            onChange={handleTitleChange}
            className={styles.title}
          />
        </div>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Age"
            onChange={handleCategoryChange}
          >
            {categoryList.map((category) => (
              <MenuItem key={category.id} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
          >
            {languageList.map((language) => (
              <MenuItem key={language.id} value={language.id}>{language.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={styles.switchWrapper}>
          {props.postId &&
            <FormGroup>
              <FormControlLabel
                className={styles.switch}
                control={
                  <Switch
                    checked={autoSave}
                    onChange={onAutoSaveSwitchChange}
                  />
                }
                label="Auto Save" />
            </FormGroup>
          }
          <FormGroup>
            <FormControlLabel
              className={styles.switch}
              control={
                <Switch
                  checked={isPublic}
                  onChange={onIsPublicSwitchChange}
                />
              }
              label="Publishing?" />
          </FormGroup>
        </div>
      </div>
      <ImageUpload
        id={props.postId} 
        type="blog" 
        handleImageUrl={handleImageUrl} 
        originalImageUrl={imageUrl} 
      />
      <RichTextEditor 
        value={body} 
        onChange={setBody} 
        onImageUpload={imageApi.getMenuImageRef} 
      />
      <div className={styles.buttons}>
        <Button
          variant="outlined"
          onClick={handleSave}
          className={styles.button}>
          Save and Close
        </Button>
        <Button variant="outlined"
          color="error"
          onClick={handleClose}
          className={styles.button}>
          Close without Saving
        </Button>
        {props.postId && <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
          className={styles.button}
        >
          Delete
        </Button>
        }
      </div>
      <DeleteItemDialog open={deleteDialogOpen}
        onClose={handleDeleteDialogClose} callback={handleDelete}
        errorMessage={errorMessage} />
      {errorMessage && <InstantMessage message={errorMessage}
        onClose={handleAlertClose} />
      }
    </div>
  );
};

PostEditor.propTypes = {
  postId: PropTypes.string,
  category: PropTypes.string,
  getPost: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

export default PostEditor;
