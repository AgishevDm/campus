import React from 'react';
import './GooeyLoader.scss';

const GooeyLoader = () => (
  <div className="gooey-wrapper">
    <svg width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="gooey">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix in="blur" mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooey" />
        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
      </filter>
    </svg>
    <div className="gooey-loader">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  </div>
);

export default GooeyLoader;
