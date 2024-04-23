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
} from '@mui/material';
import {
  Add as AddIcon, CheckCircle as CheckCircleIcon,
  Undo as UndoIcon, Delete as DeleteIcon,
  Star as StarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Recorder from './Recorder';

const TEST_USER_ID = 'aoUPpC4gz7QlvbMcpNH5';

const VoiceTask = () => {
  const [botResponse, setBotResponse] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);
  const [tasksByList, setTasksByList] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [selectedListId, setSelectedListId] = useState('default');
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    console.log('state:', state);
    if (state && state.selectedListId) {
      console.log('setting selected list:', state.selectedListId);
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

  console.log('lists:', lists);
  console.log('selectedListId:', selectedListId);


  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const listsData = await voiceTaskApi.getAllTaskLists(TEST_USER_ID);
      console.log('lists:', listsData);
      setLists(listsData);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  // useEffect(() => {
  //   // fetchTasks();
  //   // fetchTasksByList(selectedList);
  //   console.log('useEffect of selectedListId:', selectedListId);
  //   fetchTasks();
  // }, [selectedListId]);

  const fetchTasks = async (selectedId) => {
    try {
      console.log('fetching completed and incomplete tasks. selectedId: ', selectedId);
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

  const fetchTasksByList = async (listId) => {
    try {
      console.log('fetching tasks by list:', listId);
      const tasksByListData = await voiceTaskApi.getTasksByList(TEST_USER_ID, listId);
      setTasksByList(tasksByListData);
    } catch (error) {
      console.error('Error fetching tasks by list:', error);
    }
  };



  const handleListChange = (event, newListId) => {
    console.log('newList:', newListId);
    setSelectedListId(newListId);
    fetchTasks(newListId);
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
      const incompleteTasksData = await voiceTaskApi.getIncompleteTasks(TEST_USER_ID);
      setIncompleteTasks(incompleteTasksData);
    } catch (error) {
      console.error('Error fetching incomplete tasks:', error);
    }
  };

  const handleRecordingComplete = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('audio', file, 'input.mp3');
    try {
      const response = await voiceTaskApi.getResponse(formData);
      console.log('chat response:', response);
      const responseText = await response.text();
      console.log('responseText:', responseText);
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
        console.log('marking task as completed:', taskId);
        await voiceTaskApi.markTaskAsCompleted(TEST_USER_ID, taskId);
      } catch (error) {
        console.error('Error marking task as completed:', error);
        setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setIncompleteTasks((prevTasks) => [...prevTasks, incompleteTasks.find((task) => task.id === taskId)]);
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
                    <CheckCircleIcon
                      fontSize="inherit"
                    />
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
        </div>
        <div className="task-list">
          <h3>Completed Tasks</h3>
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
        </div>
      </div>

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