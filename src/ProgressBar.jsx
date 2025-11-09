import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressComponent = ({ progress }) => {
  return (
    <div style={{ width: 200, height: 200 }}>
      <CircularProgressbar value={progress} text={`${progress}%`} />
    </div>
  );
};

export default CircularProgressComponent;
