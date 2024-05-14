import React, { useEffect, useState } from 'react';
import * as voiceTaskApi from '../../api/backend/voiceTask';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  CircularProgress,
  Backdrop,
  Tabs,
  Tab,
  Avatar,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  ListItemIcon
} from '@mui/material';
import {
  Add as AddIcon, CheckCircle as CheckCircleIcon,
  Undo as UndoIcon, Delete as DeleteIcon,
  Star as StarIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import Recorder from './Recorder';

const TEST_USER_ID = 'aoUPpC4gz7QlvbMcpNH5';

const VoiceTask = () => {
  const [botResponse, setBotResponse] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const [selectedListId, setSelectedListId] = useState('default');
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state && state.selectedListId) {
      lists.push({ id: state.selectedListId, name: state.selectedListName });
      setLists(lists);
      setSelectedListId(state.selectedListId);
      // navigate(location.pathname, { replace: true, state: {} });
      window.history.replaceState({}, document.title, location.pathname);
      // fetchTasks();
      fetchTasks(state.selectedListId);
    } else {
      fetchTasks('default');
    }
    // fetchLists();
    // fetchTasks();
  }, [location]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const listsData = await voiceTaskApi.getAllTaskLists(TEST_USER_ID);
      setLists(listsData);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const fetchTasks = async (selectedId) => {
    try {
      setIsLoading(true);
      const incompleteTasksData =
        await voiceTaskApi.getIncompleteTasks(TEST_USER_ID, selectedId ? selectedId : selectedListId);
      // const completedTasksData = await voiceTaskApi.getCompletedTasks(TEST_USER_ID, selectedListId);
      // setCompletedTasks(completedTasksData);
      setIncompleteTasks(incompleteTasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStarredTasks = async () => {
    try {
      setIsLoading(true);
      const starredTasksData = await voiceTaskApi.getStarredTasks(TEST_USER_ID);
      setIncompleteTasks(starredTasksData);
    } catch (error) {
      console.error('Error fetching starred tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListChange = (event, newListId) => {
    setSelectedListId(newListId);
    setCompletedTasks([]);
    setCompletedExpanded(false);
    if (newListId === 'Favorites') {
      fetchStarredTasks();
    } else {
      fetchTasks(newListId);
    }
  };

  const handleCreateList = () => {
    navigate('/voice-task/create-list');
  };

  const handleCreateTask = async () => {
    const taskData = {
      name: newTaskName,
      list_id: selectedListId,
      description: newTaskDescription,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await voiceTaskApi.createTask(TEST_USER_ID, taskData);
      const { task_id } = response;

      setIncompleteTasks((prevTasks) => [
        ...prevTasks,
        { id: task_id, ...taskData, listId: selectedListId, completed: false },
      ]);

      setOpenDialog(false);
      setNewTaskName('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
      setSnackbarMessage('Failed to create task');
      setSnackbarOpen(true);
    }
  };

  const fetchIncompleteTasks = async () => {
    try {
      const incompleteTasksData = await voiceTaskApi.getIncompleteTasks(TEST_USER_ID, selectedListId);
      setIncompleteTasks(incompleteTasksData);
    } catch (error) {
      console.error('Error fetching incomplete tasks:', error);
    }
  };

  const handleRecordingComplete = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('audio', file, 'input.mp3');
    formData.append('user_id', TEST_USER_ID);
    formData.append('list_id', selectedListId);
    try {
      const response = await voiceTaskApi.getResponse(formData);
      const responseText = await response.text();
      setBotResponse(responseText);
      await fetchIncompleteTasks(); // Fetch tasks after receiving the response
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    if (completed) {
      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setIncompleteTasks((prevTasks) => {
        const taskToAdd = completedTasks.find((task) => task.id === taskId);
        if (taskToAdd) {
          return [...prevTasks, { ...taskToAdd, completed: false }];
        }
        return prevTasks;
      });
      try {
        await voiceTaskApi.markTaskAsIncomplete(TEST_USER_ID, taskId);
      } catch (error) {
        console.error('Error marking task as incomplete:', error);
        setIncompleteTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setCompletedTasks((prevTasks) => [...prevTasks, completedTasks.find((task) => task.id === taskId)]);
      }
    } else {
      setIncompleteTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setCompletedTasks((prevTasks) => {
        const taskToAdd = incompleteTasks.find((task) => task.id === taskId);
        if (taskToAdd) {
          return [...prevTasks, { ...taskToAdd, completed: true }];
        }
        return prevTasks;
      });
      try {
        await voiceTaskApi.markTaskAsCompleted(TEST_USER_ID, taskId);
      } catch (error) {
        console.error('Error marking task as completed:', error);
        setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setIncompleteTasks((prevTasks) => [...prevTasks, incompleteTasks.find((task) => task.id === taskId)]);
      }
    }
  };

  const toggleTaskStar = async (taskId, starred) => {
    let removedTask;
    try {
      // change the star color of the task in imcompleted task before the api call and undo when receiving an erro
      // update incomplete tasks
      setIncompleteTasks((prevTasks) => prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, starred: !starred };
        }
        return task;
      }));

      let taskListId = selectedListId;
      if (selectedListId === 'Favorites') {
        removedTask = incompleteTasks.find((task) => task.id === taskId);
        taskListId = removedTask.list_id;
      } else {
        setIncompleteTasks((prevTasks) => prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, starred: !starred };
          }
          return task;
        }));
      }

      if (starred) {
        // remove the unstarred task from the starred task view
        if (selectedListId === 'Favorites') {
          setIncompleteTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        }
        await voiceTaskApi.unstarTask(TEST_USER_ID, taskListId, taskId);
      } else {
        await voiceTaskApi.starTask(TEST_USER_ID, taskListId, taskId);
      }
    } catch (error) {
      console.error('Error updating task star:', error);
      setSnackbarMessage('Failed to update task star');
      setSnackbarOpen(true);
      // undo the star color change
      if (selectedListId === 'Favorites') {
        // add back removedTask
        setIncompleteTasks((prevTasks) => [...prevTasks, removedTask]);
      } else {
        setIncompleteTasks((prevTasks) => prevTasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, starred: !starred };
          }
          return task;
        }));
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setIncompleteTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    try {
      await voiceTaskApi.deleteTask(TEST_USER_ID, selectedListId, taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      await fetchTasks();
    }
  };

  const handleCompletedExpand = async (expanded) => {
    setCompletedExpanded(expanded);
    if (expanded) {
      try {
        const completedTasksData = await voiceTaskApi.getCompletedTasks(TEST_USER_ID, selectedListId);
        setCompletedTasks(completedTasksData);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      }
    }
  };

  return (
    <div className="voice-chat">
      <AppBar position="static">
        <Toolbar>
          <h2>Tasks</h2>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </Toolbar>
      </AppBar>
      <Tabs
        value={selectedListId}
        onChange={handleListChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="Favorites" icon={<StarIcon />} />
        <Tab label="My Tasks" value="default" />
        {lists.map((list) => (
          <Tab key={list.id} label={list.name} value={list.id} />
        ))}
        <Tab label="+ New list" value="new_list" onClick={handleCreateList} />
      </Tabs>

      <div className="task-lists">
        <div className="task-list">
          <h3>Pending Tasks</h3>
          <List>
            {incompleteTasks.map((task) => (
              <ListItem key={task.id} onClick={() => navigate(`/voice-task/${task.id}`)}>
                <ListItemIcon>
                  <IconButton
                    edge="start"
                    color="primary"
                    size="large"
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  >
                    <CheckCircleIcon fontSize="inherit" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={task.name}
                  secondary={new Date(task.created_at).toLocaleString()}
                />
                <IconButton
                  edge="end"
                  color={task.starred ? 'secondary' : 'default'}
                  size="large"
                  onClick={() => toggleTaskStar(
                    task.id, task.starred)}
                >
                  <StarIcon fontSize="inherit" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
      </div>

      <Accordion expanded={completedExpanded} onChange={(event, expanded) => handleCompletedExpand(expanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Completed Tasks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {completedTasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText
                  primary={task.name}
                  secondary={new Date(task.created_at).toLocaleString()}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="primary"
                    size="large"
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  >
                    <UndoIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="secondary"
                    size="large"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <DeleteIcon
                      fontSize="inherit"
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <div className="fab-container">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
        <Recorder onRecordingComplete={handleRecordingComplete} />
      </div>
      <Backdrop open={isLoading} className="loading-overlay">
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            fullWidth
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTask} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default VoiceTask;