import React, { useRef, useState } from "react";
import "./DragAndDrop.css";

function DragAndDrop() {
  const acceptedFileType = ["image/png", "image/jpeg", "image/jpg"];

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [rawFile, setRawFile] = useState('')
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
    const reader = new FileReader();
    setRawFile(e.files[0]);

    if (e.files[0] && acceptedFileType.includes(e.files[0].type)) {
      reader.readAsDataURL(e.files[0]);
    }

    reader.onload = (readerEvent) => {
      setFile(readerEvent.target.result);
    };
  };

  const getPrediction = (file) => {
      fetch(`//localhost:3001/predict/${file}`)
        .then((response) => response.json())
        .then((data) => setPrediction(data));
  };

  return (
    <>
      <div className="container">
        {file ? (
          <>
            <img className="image" src={file} onClick={() => getPrediction(rawFile)} />
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
                  onChange={(e) => getImage(e.target)}
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
