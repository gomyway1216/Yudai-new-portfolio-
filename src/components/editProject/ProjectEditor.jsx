import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormGroup, FormControlLabel, TextField, Switch } from '@mui/material';
import DeleteItemDialog from '../dialog/DeleteItemDialog';
import InstantMessage from '../popUp/Alert';
import styles from './rich-text-editor.module.scss';
import { getProjectCategories } from '../../api/firebase/project';
import ImageUpload from '../image/ImageUpload';
import { RichTextEditor } from '@mantine/rte';
import * as imageApi from '../../api/firebase/image';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import ImageMultipleUpload from '../image/ImapgeMultipleUpload';
import UrlListEditor from '../url/UrlListEditor';
import CategorySelector from '../category/CategorySelector';
import DateSelector from '../date/DateSelector';
import TechnologiesSelector from '../technology/TechnologiesSelector';

const UPDATE_INTERVAL = 10000;

const ProjectEditor = (props) => {
  const navigate = useNavigate();

  // store the original record
  const [original, setOriginal] = useState();

  // project related states
  const [title, setTitle] = useState('');
  // we need to make sure we only inlcude year, month and day.
  // probaly we should use some type of date picker
  const [date, setDate] = useState(dayjs());
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [industry, setIndustry] = useState('');
  const [urls, setUrls] = useState([{ name: '', link: '' }]); // Array of URLs
  const [technologies, setTechnologies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [thumbImage, setThumbImage] = useState('');
  const [images, setImages] = useState([]);

  // editor related states
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // auto save related states
  const [autoSave, setAutoSave] = useState(false);
  const [autoSaveTitle, setAutoSaveTitle] = useState('');
  const [autoSaveDate, setAutoSaveDate] = useState(null);
  const [autoSaveDescription, setAutoSaveDescription] = useState('');
  const [autoSaveClient, setAutoSaveClient] = useState('');
  const [autoSaveIndustry, setAutoSaveIndustry] = useState('');
  const [autoSaveUrls, setAutoSaveUrls] = useState([]);
  const [autoSaveTechnologies, setAutoSaveTechnologies] = useState([]);
  const [autoSaveCategories, setAutoSaveCategories] = useState([]);
  const [autoSaveThumbImage, setAutoSaveThumbImage] = useState('');
  const [autoSaveImages, setAutoSaveImages] = useState([]);

  // values to be used in the editor
  const [categoryList, setCategoryList] = useState([]);

  // create refs to keep track of the changes
  const titleRef = useRef(title);
  const dateRef = useRef(date);
  const descriptionRef = useRef(description);
  const clientRef = useRef(client);
  const industryRef = useRef(industry);
  const urlsRef = useRef(urls);
  const technologiesRef = useRef(technologies);
  const categogiesRef = useRef(categories);

  // keep track of update status
  // const [status, setStatus] = useState<'idle' | 'updating' | 'deleting'>('idle');
  const [status, setStatus] = useState('idle');

  // update the ref when the state changes
  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    dateRef.current = date;
  }, [date]);

  useEffect(() => {
    descriptionRef.current = description;
  }, [description]);

  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  useEffect(() => {
    industryRef.current = industry;
  }, [industry]);

  useEffect(() => {
    urlsRef.current = urls;
  }, [urls]);

  useEffect(() => {
    technologiesRef.current = technologies;
  }, [technologies]);

  useEffect(() => {
    categogiesRef.current = categories;
  }, [categories]);

  const handleImageUrl = (url) => {
    setThumbImage(url); // Update the state with the new array of image URLs
  };

  const handleImageUrls = (urls) => {
    setImages(urls); // Update the state with the new array of image URLs
  };

  const fetchProject = async () => {
    // if id is defined, the rich text editor is expected to load 
    // the data from the server, if not, create a new project
    if (props.projectId) {
      const doc = await props.getProject(props.projectId);
      if (doc) {
        setOriginal(doc);
        // set the state with the data from the server
        setTitle(doc.title);
        setDate(dayjs(doc.date));
        setDescription(doc.description);
        setClient(doc.client);
        setIndustry(doc.industry);
        setUrls(doc.urls);
        setTechnologies(doc.technologies);
        setCategories(doc.categories);
        setThumbImage(doc.thumbImage);
        setImages(doc.images);
      } else {
        const msg = 'Project not found!';
        setErrorMessage(msg);
      }
    } else {
      const doc = {
        id: '',
        title: '',
        description: '',
        client: '',
        industry: '',
        urls: [],
        technologies: [],
        categories: [],
        thumbImage: '',
        images: [],
      };
      setOriginal(doc);
    }
  };

  const fetchCategoryList = async () => {
    const categoryList = await getProjectCategories();
    setCategoryList(categoryList);
  };

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    fetchCategoryList();
  }, []);


  const deepCompare = () => {
    let changeRequries = false;

    if (autoSaveTitle !== title) {
      setAutoSaveTitle(title);
      changeRequries = true;
    }

    if (autoSaveDate !== date) {
      setAutoSaveDate(date);
      changeRequries = true;
    }

    if (autoSaveDescription !== description) {
      setAutoSaveDescription(description);
      changeRequries = true;
    }

    if (autoSaveClient !== client) {
      setAutoSaveClient(client);
      changeRequries = true;
    }

    if (autoSaveIndustry !== industry) {
      setAutoSaveIndustry(industry);
      changeRequries = true;
    }

    if (autoSaveUrls !== urls) {
      setAutoSaveUrls(urls);
      changeRequries = true;
    }

    if (autoSaveTechnologies !== technologies) {
      setAutoSaveTechnologies(technologies);
      changeRequries = true;
    }

    if (autoSaveCategories !== categories) {
      setAutoSaveCategories(categories);
      changeRequries = true;
    }

    if (autoSaveThumbImage !== thumbImage) {
      setAutoSaveThumbImage(thumbImage);
      changeRequries = true;
    }

    if (autoSaveImages !== images) {
      setAutoSaveImages(images);
      changeRequries = true;
    }
    
    return changeRequries;
  };

  useEffect(() => {
    if (status === 'idle' && autoSave) {
      const interval = window.setInterval(() => {
        const item = {
          id: props.projectId,
          title: titleRef.current,
          date: titleRef.current,
          description: descriptionRef.current,
          client: clientRef.current,
          industry: industryRef.current,
          thumbImage: thumbImage,
          images: images,
          urls: urlsRef.current,
          technologies: technologies,
          categories: project.categories
        };
        try {
          if (deepCompare()) {
            setStatus('updating');
            props.updateProject(item);
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

  const onAutoSaveSwitchChange = (e) => {
    setAutoSave(e.target.checked);
  };

  const handleSave = async () => {
    setStatus('updating');
    const handleFunction = props.projectId ? props.updateProject : props.createProject;

    const item = {
      id: props.projectId || '',
      title,
      date,
      description,
      client,
      industry,
      thumbImage,
      images,
      urls,
      technologies,
      categories
    };

    try {
      await handleFunction(item);
      navigate('/#work');
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
      await props.updateProject(original);
      navigate('/#work');
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
    const updateStatus = await props.deleteProject(props.projectId);
    if (updateStatus) {
      navigate('/#work');
    } else {
      const msg = 'deletion of the project is failing!';
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

  const handleCategoriesChange = (event) => {
    const value = event.target.value;
    setCategories(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div className={styles.root}>
      <div className={styles.subSection}>
        <div className={styles.firstRow}>
          <div className={styles.titleWrapper}>
            <TextField id="title" label="Title"
              variant="outlined" value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.title}
            />
          </div>
          <CategorySelector
            categoryList={categoryList}
            selectedCategories={categories}
            onCategoryChange={handleCategoriesChange}
          />
          <DateSelector
            date={date}
            setDate={setDate}
          />
        </div>
        <div className={styles.secondRow}>
          <div>
            <TextField id="client" label="Client"
              variant="outlined" value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>
          <div>
            <TextField id="industry" label="Industry"
              variant="outlined" value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <UrlListEditor urls={urls} setUrls={setUrls} />
        </div>
        <div className={styles.switchWrapper}>
          {props.projectId &&
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
        </div>
      </div>
      <TechnologiesSelector
        selectedTechnologies={technologies}
        setSelectedTechnologies={setTechnologies}
      />
      <ImageUpload 
        id={props.projectId} 
        type="project"
        handleImageUrl={handleImageUrl} 
        originalImageUrl={thumbImage} 
      />
      <ImageMultipleUpload
        id={props.projectId}
        type="project"
        handleImageUrls={handleImageUrls}
        originalImageUrls={images} // Pass the current array of image URLs for display
      />
      <RichTextEditor value={description} onChange={setDescription} 
        onImageUpload={imageApi.getMenuImageRef} />
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
        {props.projectId && <Button
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

ProjectEditor.propTypes = {
  projectId: PropTypes.string,
  getProject: PropTypes.func.isRequired,
  createProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired
};

export default ProjectEditor;
