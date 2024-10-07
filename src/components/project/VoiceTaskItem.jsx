import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Add,
  ArrowBack,
  ScheduleOutlined,
  SubdirectoryArrowRight,
  Notes,
  RadioButtonUnchecked
} from '@mui/icons-material';
// import DateSelector from '../date/DateSelector';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as voiceTaskApi from '../../api/backend/voiceTask';
import { useParams, useNavigate } from 'react-router-dom';

const TEST_USER_ID = 'aoUPpC4gz7QlvbMcpNH5';

const VoiceTaskItem = () => {
  const [taskName, setTaskName] = useState('hello');
  const [subtasks, setSubtasks] = useState([]);
  const [detailsText, setDetailsText] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { taskId } = useParams();

  const handleSubtaskToggle = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);
  };

  const handleDetailsToggle = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };

  const handleDetailsTextChange = (event) => {
    setDetailsText(event.target.value);
  };

  const handleCreateSubTask = async () => {
    try {
      // create and set subtask for a task, then call api. If error, show error message and remove subtask
      const newSubtask = { name: 'subtask', completed: false };
      setSubtasks([...subtasks, newSubtask]);
      await voiceTaskApi.createSubTask(TEST_USER_ID, taskId, newSubtask);
    } catch (error) {
      console.error('Error:', error);
      setSubtasks(subtasks.filter((subtask, index) => index !== subtasks.length - 1));
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="h1" flexGrow={1}>
          {taskName}
        </Typography>
      </Box>

      <List>
        <ListItem>
          <IconButton style={{ alignSelf: 'flex-start' }}>
            <Notes />
          </IconButton>
          {isDetailsOpen ?
            <TextField
              id="standard-multiline-flexible"
              placeholder="Add details"
              multiline
              variant="standard"
              size="small"
              margin="dense"
              value={detailsText}
              onChange={handleDetailsTextChange}
              autoFocus // this is needed for the textfield to be focused when rendered by the conditional rendering
              InputProps={{
                disableUnderline: true // Disables the underline directly
              }}
            />
            :
            <ListItemText primary="Add details" onClick={handleDetailsToggle} />}
        </ListItem>

        <ListItem>
          <IconButton>
            <ScheduleOutlined />
          </IconButton>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              slotProps={{
                textField: {
                  variant: 'standard',
                  sx: {
                    color: '#1565c0',
                    // borderRadius: '7px',
                    // borderWidth: '1px',
                    borderColor: '#2196f3',
                    // border: '1px solid',
                    // backgroundColor: '#90caf9',
                  }
                }
              }}
            />
          </LocalizationProvider>
        </ListItem>
        {/* {subtasks.length > 0 && (
          <ListItem>
            <List>
              {subtasks.map((subtask, index) => (
                <ListItem key={index}>
                  <Checkbox
                    checked={subtask.completed}
                    onChange={() => handleSubtaskToggle(index)}
                  />
                  <ListItemText primary={subtask.name} />
                </ListItem>
              ))}
            </List>
          </ListItem>
        )} */}
        <ListItem>
          <IconButton>
            <SubdirectoryArrowRight />
          </IconButton>
          <List>
            {subtasks.map((subtask, index) => (
              <ListItem key={'subTask' + index} style={{ paddingLeft: 0 }}>
                <IconButton style={{ alignSelf: 'flex-start', marginLeft: 0, paddingLeft: 0 }}>
                  <RadioButtonUnchecked />
                </IconButton>
                <TextField
                  id="standard-multiline-flexible"
                  placeholder="Add details"
                  multiline
                  variant="standard"
                  size="small"
                  margin="dense"
                  value={detailsText}
                  onChange={handleDetailsTextChange}
                  autoFocus // this is needed for the textfield to be focused when rendered by the conditional rendering
                  InputProps={{
                    disableUnderline: true // Disables the underline directly
                  }}
                />
              </ListItem>
            ))}
            <ListItemText primary="Add subtasks" onClick={handleCreateSubTask} />
          </List>
        </ListItem>
      </List>
      <Typography variant="body2" align="center">
        Mark completed
      </Typography>

    </Box>
  );
};

export default VoiceTaskItem;