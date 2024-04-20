import React, { useEffect, useState } from 'react';
import * as voiceTaskApi from '../../api/backend/voiceTask';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    const taskData = {
      name: newTaskName,
      description: newTaskDescription,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await voiceTaskApi.createTask(TEST_USER_ID, taskData);
      const { task_id } = response;

      setIncompleteTasks((prevTasks) => [
        ...prevTasks,
        { id: task_id, ...taskData, completed: false },
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

  const fetchTasks = async () => {
    try {
      const incompleteTasksData = await voiceTaskApi.getIncompleteTasks(TEST_USER_ID);
      const completedTasksData = await voiceTaskApi.getCompletedTasks(TEST_USER_ID);
      setCompletedTasks(completedTasksData);
      setIncompleteTasks(incompleteTasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleRecordingComplete = async (file) => {
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
      await voiceTaskApi.deleteTask(TEST_USER_ID, taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      await fetchTasks();
    }
  };

  return (
    <div className="voice-chat">
      <h2>Voice Task</h2>
      <Recorder onRecordingComplete={handleRecordingComplete} />
      {botResponse && <p>{botResponse}</p>}
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  >
                    Done
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  >
                    Undo
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={() => setOpenDialog(true)}
      >
        <AddIcon />
      </Fab>
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