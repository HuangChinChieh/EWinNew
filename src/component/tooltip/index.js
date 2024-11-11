import React, { useState, useEffect } from 'react';
import './index.scss';

const Tooltip = ({ text, children, delay = 500 }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
      let timer;
      if (hovered) {
          timer = setTimeout(() => setVisible(true), delay);
      } else {
          setVisible(false);
      }
      return () => clearTimeout(timer);
  }, [hovered, delay]);

  const showTooltip = () => setHovered(true);
  const hideTooltip = () => setHovered(false);

  return (
      <div className={children ? "tooltip-container-hasChildren" : "tooltip-container"} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
          {children ?　children : <></>}
          <div className={`tooltip ${visible ? 'show' : ''}`}>
              {text}
          </div>
      </div>
  );
};

export default Tooltip;