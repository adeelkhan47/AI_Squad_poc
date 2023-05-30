import React, { useState } from 'react';
import axios from 'axios';

const AudioUploader = () => {
  const [audioPath, setAudioPath] = useState('');
  const [responseText, setResponseText] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://127.0.0.1:8000/detector/speechtotext', formData)
        .then((response) => {
          console.log(response.data); // Handle the response from Flask
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" accept="audio/*" onChange={handleFileSelect} />
        <button type="submit" disabled={!selectedFile}>
          Upload
        </button>
      </form>
      <textarea value={responseText} readOnly />
    </div>
  );
};

export default AudioUploader;
