import React, { useRef, useState } from "react";
import "./DragAndDrop.css";

function DragAndDrop() {
  const acceptedFileType = ["image/png", "image/jpeg", "image/jpg"];

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('')
  const [prediction, setPrediction] = useState('');
  const inputRef = useRef(null);

  const dragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    e.stopPropagation();
  };

  const dragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const dragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.dataTransfer.files[0]);
  };

  const getImage = (e) => {
    const formData = new FormData();
    
    formData.append("file", e.target.files[0]);
    formData.append("filename", e.target.files[0].name)
  
    setFilename(e.target.files[0].name)
    
     fetch(`//localhost:3001/upload`,{method:'POST', body: formData})
        .then(res => console.log(res))
        .catch(err => console.warn(err));

    const reader = new FileReader();

    if (e.target.files[0] && acceptedFileType.includes(e.target.files[0].type)) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setFile(readerEvent.target.result);
    };
  };

  const getPrediction = async (file) => {
      await fetch(`//localhost:3001/predict/${file}`, {method: 'POST', body: file})
      .then(res => res.json())
      .then(data => setPrediction(data))
  };

  console.log(prediction)

  return (
    <>
      <div className="container">
        {file ? (
          <>
            {prediction && <p>{prediction.Class} - {prediction.Prediction}</p>}
            <img className="image" src={file} onClick={() => getPrediction(filename)} />
            <button onClick={() => setFile(null)}>Close</button>
          </>
        ) : (
          <>
            <div
              onDragOver={dragOver}
              onDragEnter={dragEnter}
              onDragLeave={dragLeave}
              onDrop={fileDrop}
              onClick={() => inputRef.current.click()}
              className="dragdrop"
            >
              <div className="drop-message">
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  onChange={(e) => getImage(e)}
                />
                <div className="upload-icon"></div>
                Drop a file here.
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DragAndDrop;
