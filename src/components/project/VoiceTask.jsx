import React, { useEffect, useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import * as voiceTaskApi from '../../api/backend/voiceTask';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Button } from '@mui/material';

const TEST_USER_ID = 'aoUPpC4gz7QlvbMcpNH5';

const recorder = new MicRecorder({
  bitRate: 128,
  encoder: 'mp3',
  numberOfChannels: 1,
  sampleRate: 44100,
});

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [botResponse, setBotResponse] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const completedTasksData = await voiceTaskApi.getCompletedTasks(TEST_USER_ID);
      const incompleteTasksData = await voiceTaskApi.getIncompleteTasks(TEST_USER_ID);
      setCompletedTasks(completedTasksData);
      setIncompleteTasks(incompleteTasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const startRecording = () => {
    recorder.start().then(() => {
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    recorder.stop().getMp3().then(async ([buffer, blob]) => {
      const file = new File(buffer, 'input.mp3', { type: blob.type, lastModified: Date.now() });
      const formData = new FormData();
      formData.append('audio', file, 'input.mp3');
      try {
        const response = await voiceTaskApi.getResponse(formData);
        console.log('chat response:', response);
        const responseText = await response.text();
        console.log('responseText:', responseText);
        setBotResponse(responseText);
      } catch (error) {
        console.error('Error:', error);
      }
      setIsRecording(false);
    });
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
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {botResponse && <p>{botResponse}</p>}
      <div className="task-lists">
        <div className="task-list">
          <h3>Pending Tasks</h3>
          <List>
            {incompleteTasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText primary={task.name} />
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
                <ListItemText primary={task.name} />
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
    </div>
  );
};

export default VoiceChat;