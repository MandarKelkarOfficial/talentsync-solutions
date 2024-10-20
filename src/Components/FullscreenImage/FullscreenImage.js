// FullscreenImage.js
import React from 'react';
import './FullscreenImage.css'; // Add a separate CSS file if needed

const FullscreenImage = ({ imageUrl, onClose }) => {
  return (
    <div className="fullscreen-modal" onClick={onClose}>
      <img className="fullscreen-image" src={imageUrl} alt="Fullscreen" />
      <span className="close" onClick={onClose}>&times;</span>
    </div>
  );
};

export default FullscreenImage;
