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
} from '@mui/icons-material';
// import DateSelector from '../date/DateSelector';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const VoiceTaskItem = () => {
  const [taskName, setTaskName] = useState('hello');
  const [subtasks, setSubtasks] = useState([]);
  const [detailsText, setDetailsText] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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
        {subtasks.length > 0 && (
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
        )}
        <ListItem>
          <IconButton>
            <SubdirectoryArrowRight />
          </IconButton>
          <ListItemText primary="Add subtasks" />
        </ListItem>
      </List>
      <Typography variant="body2" align="center">
        Mark completed
      </Typography>

    </Box>
  );
};

export default VoiceTaskItem;