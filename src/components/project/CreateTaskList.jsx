import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as voiceTaskApi from '../../api/backend/voiceTask';
import {
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const TEST_USER_ID = 'aoUPpC4gz7QlvbMcpNH5';

const CreateTaskList = () => {
  const [listName, setListName] = useState('');
  const navigate = useNavigate();

  const handleCreateList = async () => {
    try {
      const response = await voiceTaskApi.createTaskList(TEST_USER_ID, listName);
      const { task_id } = response;
      console.log('Created list with ID:', task_id);
      // navigate(-1, { state: { selectedListId: taskId } });
      // navigate(-1);
      navigate('/voice-task', { state: { selectedListId: task_id, selectedListName: listName } });
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  return (
    <div className="create-list">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <h2>Create new list</h2>
          <Button color="inherit" onClick={handleCreateList}>
            Done
          </Button>
        </Toolbar>
      </AppBar>
      <TextField
        autoFocus
        margin="dense"
        label="Enter list title"
        fullWidth
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
    </div>
  );
};

export default CreateTaskList;