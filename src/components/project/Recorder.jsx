import React, { useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import PropTypes from 'prop-types';
import { Fab } from '@mui/material';
import { Mic as MicIcon, Stop as StopIcon } from '@mui/icons-material';

const recorder = new MicRecorder({
  bitRate: 128,
  encoder: 'mp3',
  numberOfChannels: 1,
  sampleRate: 44100,
});

const Recorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    recorder.start().then(() => {
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    recorder.stop().getMp3().then(([buffer, blob]) => {
      const file = new File(buffer, 'input.mp3', { type: blob.type, lastModified: Date.now() });
      onRecordingComplete(file);
      setIsRecording(false);
    });
  };

  return (
    <Fab
      color={isRecording ? 'secondary' : 'primary'}
      aria-label={isRecording ? 'stop recording' : 'start recording'}
      onClick={isRecording ? stopRecording : startRecording}
    >
      {isRecording ? <StopIcon /> : <MicIcon />}
    </Fab>
  );
};

Recorder.propTypes = {
  onRecordingComplete: PropTypes.func.isRequired,
};

export default Recorder;