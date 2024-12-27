import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from "react-dom";
import './index.scss';

const ToolTipContext = createContext();

//調整成更為泛用的版本，捨棄children，直接傳入要顯示在其下方的dom
const TooltipProvider = (props) => {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [text, setText] = useState("");
    const [top, setTop] = useState("0");
    const [left, setLeft] = useState("0");
    const [fontStyle, setFontStyle] = useState("white");
    const [targetDom, setTargetDom] = useState(null);
    const tipDomRef = useRef();

    useEffect(() => { //rem
        const gap = 0.75;
        let timer;
        let topValue = 0;
        let leftValue = 0;
        if (targetDom != null) {
            if (hovered) {

                const rect = targetDom.getBoundingClientRect();
                const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                const tooltipWidth = tipDomRef.current.offsetWidth;
                const tooltipHeight = tipDomRef.current.offsetHeight;
                topValue = rect.top + rect.height + (gap * htmlFontSize);
                leftValue = rect.left + (rect.width / 2) - (tooltipWidth / 2);

                if (leftValue + tooltipWidth > window.innerWidth) {
                    leftValue = window.innerWidth - tooltipWidth - 10; // 贴齐右边缘
                }

                if (leftValue < 0) {
                    leftValue = 10; // 贴齐左边缘
                }

                // 检查下边界
                if (topValue + tooltipHeight > window.innerHeight) {
                    topValue = rect.top - gap - tooltipHeight; // 调整到目标上方
                }

                setTop((topValue / htmlFontSize) + "rem");
                setLeft((leftValue / htmlFontSize) + "rem");

                timer = setTimeout(() => setVisible(true), 500);
            } else {
                setVisible(false);
            }
        } else {
            setVisible(false);
        }


        return () => clearTimeout(timer);
    }, [hovered, targetDom]);


    const showTooltip = useCallback((_targetDom, _text, _style = "white") => {
        if (_targetDom) {
            setTargetDom(_targetDom);
            setText(_text);
            setHovered(true);
            setFontStyle(_style);
        }
    }, []);


    const hideTooltip = useCallback(() => {
        setTargetDom(null);
        setHovered(false);
    }, []);


    return (
        <>
            <ToolTipContext.Provider value={{ showTooltip, hideTooltip }}>
                {props.children}
            </ToolTipContext.Provider>


            {hovered ? ReactDOM.createPortal(
                <div  ref={tipDomRef} style={{ top: top, left: left }} className={`tooltip2 ${visible ? 'show' : ''} ${fontStyle}`}>
                    {text}
                </div>,
                document.body
            ) : <></>}
        </>
    );
};

export default TooltipProvider;
export { ToolTipContext }