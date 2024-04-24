import React, { useState } from 'react';
import './index.scss';

const FullscreenButton = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        const element = document.documentElement;

        if (!isFullscreen) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        setIsFullscreen((prevFullscreen) => !prevFullscreen);
    };

    return (
        <div>
            <div className='forpc'>
                {isFullscreen ? <span onClick={toggleFullscreen} className='exitfullscreen'></span> : <span onClick={toggleFullscreen} className='fullscreen'></span>}
            </div>
            <div className='formb'>
                <div className='screen-box'>
                    {isFullscreen ?
                        <span onClick={toggleFullscreen} className='flex-box'>
                            <span className='exitfullscreen'></span>
                            <span>半屏</span>
                        </span>
                        : <span onClick={toggleFullscreen} className='flex-box'>
                            <span className='fullscreen'></span>
                            <span>全屏</span>
                        </span>
                    }
                </div>
            </div>
        </div>
    );
};

export default FullscreenButton;
