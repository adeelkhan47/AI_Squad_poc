import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../css/AudioUploader.css';

const AudioUploader = () => {
  const [responseText, setResponseText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const chunksRef = useRef([]);


  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleRecord = () => {
    if (recording) return;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.start();
        setRecording(true);

        mediaRecorder.addEventListener('dataavailable', (event) => {
          chunksRef.current.push(event.data);
        });
        
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const handleStop = () => {
    if (!recording) return;
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.addEventListener('stop', () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
        const file = new File([blob], 'recorded.mp3');
        setSelectedFile(file);
      });
      mediaRecorderRef.current.stop();
      setRecording(false);

      // Clear the recorded chunks for the next recording
      chunksRef.current = [];
    }
  };


  const handleUpload = async (e) => {
    e.preventDefault();
    setSelectedFile(null);

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setIsLoading(true);

      axios.post('http://127.0.0.1:5000/detector/speechtotext', formData)
        .then((response) => {
          console.log("resp", response); // Handle the response from Flask
          setResponseText(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="audio-uploader">
      <h1>Accessibility</h1>
      <form onSubmit={handleUpload}>
        <label htmlFor="file-input" className="file-label">
          Choose an audio file:
        </label>
        <input
          id="file-input"
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
        />
        <button onClick={handleRecord} className={`record-btn ${recording ? 'disabled-button' : ''}`}>
          Record
        </button>
        <button onClick={handleStop} className={`stop-btn ${!recording ? 'disabled-button' : ''}`}>
          Stop
        </button>
        <button type="submit" disabled={!selectedFile} className="upload-btn">
          Upload
        </button>
      </form>
      {isLoading && <div className="loading-overlay">Loading...</div>}
      <textarea className="response-textarea" value={responseText} readOnly />
    </div>
  );
};

export default AudioUploader;
