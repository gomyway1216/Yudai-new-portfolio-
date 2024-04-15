import React, { useEffect, useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import * as voiceTaskApi from '../../api/backend/voiceTask';
import * as voiceTaskDataApi from '../../api/firebase/task';

const recorder = new MicRecorder({
  bitRate: 128,
  encoder: 'mp3',
  numberOfChannels: 1,
  sampleRate: 44100,
});

const testUid = 'aoUPpC4gz7QlvbMcpNH5';

const VoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [botResponse, setBotResponse] = useState('');
  const [taskList, setTaskList] = useState([]);

  const fetchData = async () => {
    const taskList = await voiceTaskDataApi.getTasks(testUid);
    setTaskList(taskList);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        const taskList = await voiceTaskDataApi.getTasks(testUid);
        setTaskList(taskList);
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
      {taskList.length > 0 && (
        <ul>
          {taskList.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VoiceChat;