import React, { useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import * as voiceTaskApi from '../../api/backend/voiceTask';

const recorder = new MicRecorder({
  bitRate: 128,
  encoder: 'mp3',
  numberOfChannels: 1,
  sampleRate: 44100,
});

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [botResponse, setBotResponse] = useState('');

  const startRecording = () => {
    recorder.start().then(() => {
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    recorder.stop().getMp3().then(async ([buffer, blob]) => {
      const file = new File(buffer, 'input.mp3', {
        type: blob.type,
        lastModified: Date.now(),
      });
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

  return (
    <div>
      <h2>Voice Task</h2>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {botResponse && <p>{botResponse}</p>}
    </div>
  );
};

export default VoiceChat;