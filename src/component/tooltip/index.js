import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import './index.scss';

const Tooltip = ({ text, children, delay = 500, active = false }) => {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [top, setTop] = useState("0");
    const [left, setLeft] = useState("0");
    const targetDom = useRef(null);

    useEffect(() => {
        let timer;        
        if (hovered) {
            const rect = targetDom.current.getBoundingClientRect();
            const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            setTop(((rect.top + rect.height) / htmlFontSize) + "rem");
            setLeft(((rect.left + (rect.width / 2)) / htmlFontSize) + "rem");
            timer = setTimeout(() => setVisible(true), delay);
        } else {
            setVisible(false);
        }
        return () => clearTimeout(timer);
    }, [hovered, delay]);

    const showTooltip = () => setHovered(true);
    const hideTooltip = () => setHovered(false);



    return (
        <>
            <div ref={targetDom} className={children ? "tooltip-container-hasChildren" : "tooltip-container"} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
                {children ? children : <></>}
            </div>
            {(hovered && (active === false)) ? ReactDOM.createPortal(
                <div style={{ top: top, left: left }} className={`tooltip ${visible ? 'show' : ''}`}>
                    {text}
                </div>,
                document.body
            ) : ""}

        </>
    );
};

export default Tooltip;