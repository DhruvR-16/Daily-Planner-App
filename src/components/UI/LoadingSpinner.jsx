import React from 'react';
import './LoadingSpinnerStyles.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  fullScreen = false,
  className = '' 
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `spinner-${size}`,
    `spinner-${color}`,
    fullScreen && 'spinner-fullscreen',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <div className={spinnerClasses}>
      <div className="spinner-circle">
        <div className="spinner-inner"></div>
      </div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-overlay">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;