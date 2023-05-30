import React, { useState } from 'react';
import axios from 'axios';
import '../css/AudioUploader.css';

const AudioUploader = () => {
  const [responseText, setResponseText] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setSelectedFile(null);
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://127.0.0.1:5000/detector/speechtotext', formData)
        .then((response) => {
          console.log("resp",response); // Handle the response from Flask
          setResponseText(response.data)
          setSelectedFile(response.data);
          
        })
        .catch((error) => {
          console.error(error);
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
        <button type="submit" disabled={!selectedFile} className="upload-btn">
          Upload
        </button>
      </form>
      <textarea
        className="response-textarea"
        value={responseText}
        readOnly
      />
    </div>
  );
};

export default AudioUploader;
