import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from 'hooks';
import './newStyle.scss';
import { ReactComponent as BTN1 } from 'img/games/control/newbtn1-1.svg';
import { ReactComponent as BTN2 } from 'img/games/control/newbtn2.svg';


// 這邊是使用 svg 去畫path, 這是直接畫path去模擬按鈕, 但實際設計給的圖有遮罩, 畫起來會很麻煩

const GameBettingAreaNew = (props) => {
    const { t } = useLanguage();

    const handleBTN1 = () => {
        console.log('btn1')
    }

    const handleBTN2 = () => {
        console.log('btn2')
    }

    const buttonList = [
        { class: "button-inner-left", link: "http://example.com/A" },
        { class: "button-inner-right", link: "http://example.com/B" },
        { class: "button-outer-left", link: "http://example.com/C" },
        { class: "button-outer-center", link: "http://example.com/D" },
        { class: "button-outer-right", link: "http://example.com/E" }
    ];

    useEffect(() => {
        const handleClick = (link) => {
            console.log('link', link)
        };

        buttonList.forEach((item) => {
            const button = document.getElementsByClassName(item.class)[0];

            if (button) {
                button.addEventListener("click", () => handleClick(item.link));

                return () => {
                    button.removeEventListener("click", () => handleClick(item.link));
                };
            }
        });

        // Cleanup function to remove event listeners when component unmounts
        return () => {
            buttonList.forEach((item) => {
                const button = document.getElementsByClassName(item.class)[0];
                if (button) {
                    button.removeEventListener("click", () => handleClick(item.link));
                }
            });
        };
    }, []);




    return (
        <div className='game-betting-area-new'>
            <div className='game-betting-area-new-box'>
                <div className='left-box'>
                    <svg width="284" height="120" viewBox="0 0 284 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.75">
                            <mask id="path-1-inside-1_855_22069" fill="white">
                                <path fillRule="evenodd" clipRule="evenodd" d="M283.032 119.56H88.0967C39.4421 119.56 -0.000244141 80.1179 -0.000244141 31.4632C-0.000244141 20.3781 2.04711 9.77122 5.78432 0H283.032V119.56Z" />
                            </mask>
                            <path fillRule="evenodd" clipRule="evenodd" d="M283.032 119.56H88.0967C39.4421 119.56 -0.000244141 80.1179 -0.000244141 31.4632C-0.000244141 20.3781 2.04711 9.77122 5.78432 0H283.032V119.56Z" fill="url(#paint0_linear_855_22069)" />
                            <path d="M283.032 119.56V121.56H285.032V119.56H283.032ZM5.78432 0V-2H4.40797L3.91629 -0.714468L5.78432 0ZM283.032 0H285.032V-2H283.032V0ZM88.0967 121.56H283.032V117.56H88.0967V121.56ZM-2.00024 31.4632C-2.00024 81.2224 38.3375 121.56 88.0967 121.56V117.56C40.5466 117.56 1.99976 79.0133 1.99976 31.4632H-2.00024ZM3.91629 -0.714468C0.0932076 9.28128 -2.00024 20.1301 -2.00024 31.4632H1.99976C1.99976 20.6261 4.00102 10.2612 7.65235 0.714468L3.91629 -0.714468ZM283.032 -2H5.78432V2H283.032V-2ZM281.032 0V119.56H285.032V0H281.032Z" fill="url(#paint1_linear_855_22069)" mask="url(#path-1-inside-1_855_22069)" />
                        </g>
                        <defs>
                            <linearGradient id="paint0_linear_855_22069" x1="141.516" y1="0" x2="141.516" y2="119.56" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#0F52B7" stopOpacity="0.9" />
                                <stop offset="1" stopColor="#003380" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_855_22069" x1="141.516" y1="0" x2="141.516" y2="119.56" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#17AAFF" />
                                <stop offset="1" stopColor="#625FFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className={`middle-box ${props.seconds === 0 ? 'disable' : 'enable'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 383.51 109">
                        <defs>
                            <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#c95a59" />
                                <stop offset="100%" stopColor="#944244" />
                            </linearGradient>

                            <linearGradient id="gradient-red-hover" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#c95a59" />
                                <stop offset="100%" stopColor="#944244" />
                            </linearGradient>

                            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                                {/* <stop offset="0%" stopColor="#0F52B7" />
                                    <stop offset="100%" stopColor="#003380" /> */}
                                <stop stopColor="#0F52B7" stopOpacity="0.9" />
                                <stop offset="1" stopColor="#003380" />
                                <stop stopColor="#17AAFF" />
                                <stop offset="1" stopColor="#625FFF" />
                            </linearGradient>

                            <linearGradient id="gradient-blue-hover" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#0F52B7" />
                                <stop offset="100%" stopColor="#003380" />

                            </linearGradient>

                            <linearGradient id="gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#5cc894" />
                                <stop offset="100%" stopColor="#4c9476" />
                            </linearGradient>

                            <linearGradient id="gradient-green-hover" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="#5cc894" />
                                <stop offset="100%" stopColor="#4c9476" />
                            </linearGradient>
                        </defs>

                        <path className="button-outer-right" d="M344.18,0c2.27,5.63,3.53,11.78,3.53,18.22h0c0,26.92-21.82,48.74-48.74,48.74h-42.69l42.04,42.04h41.77c23.98,0,43.41-19.44,43.41-43.41V0h-39.33Z" />
                        <path className="button-outer-left" d="M83.87,66.96c-26.92,0-48.74-21.82-48.74-48.74h0C35.13,11.78,36.39,5.63,38.66,0H0V65.59c0,23.98,19.44,43.41,43.41,43.41h41.91l42.04-42.04h-43.5Z" />
                        <polygon className="button-outer-center" points="131.84 66.96 89 109 295.22 109 252.38 66.96 131.84 66.96" />
                        <path className="button-inner-right" d="M341.41,0H192.75V64.3h106.57c25.36,0,45.93-20.56,45.93-45.93h0c0-6.53-1.37-12.74-3.83-18.37Z" />
                        <path className="button-inner-left" d="M190.2,0H41.53c-2.46,5.63-3.83,11.84-3.83,18.37h0c0,25.36,20.56,45.93,45.93,45.93h106.57V0Z" />
                        <text className="text" x="115" y="33">Ⓐ</text>
                        <text className="text" x="266" y="33">Ⓑ</text>
                        <text className="text" x="31" y="81">Ⓒ</text>
                        <text className="text" x="188" y="90">Ⓓ</text>
                        <text className="text" x="346" y="81">Ⓔ</text>


                    </svg>

                    {/* <div className="abcde">
                        <div className="cde">
                            <div className="c2">
                                <a href="http://example.com/A" target="_blank" className="button c"></a>
                            </div>
                            <a href="http://example.com/D" target="_blank" className="button d"></a>
                            <div className="e2">
                                <a href="http://example.com/E" target="_blank" className="button e"></a>
                            </div>
                        </div>
                        <div className="ab2">
                            <div className="ab">
                                <a href="http://example.com/A" target="_blank" className="button a"></a>
                                <a href="http://example.com/B" target="_blank" className="button b"></a>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className='right-box'>

                </div>
            </div>
        </div>

    )
}

export default GameBettingAreaNew;