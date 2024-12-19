import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import './index.scss';
import { useHistory } from "react-router-dom";
import Tooltip from "component/tooltip";

const ChannelLineButton = () => {
    const [active, setActive] = useState(false);
    const popRef = useRef(null);
    const history = useHistory();


    const showchannelLine = () => {
        setActive(true);
    }

    const hidechannelLine = () => {
        popRef.current.classList.add('hide');
        setTimeout(() => {
            setActive(false);
        }, 400);
    }

    useEffect(() => {
  

    }, []);

    return (
        <Tooltip text={"視頻線路"}>
            <div className='channelLine-box'>
                <div className='channelLine-box-content' onClick={showchannelLine}>
                    <div className="channelLine-box-icon"></div>
                    <div className='channelLine-box-title'>無</div>
                    <div className='channelLine-box-icon-arrow'></div>
                </div>
                {active && <>
                    <div className='channelLine-box-options' ref={popRef}>
                        <div className='channelLine-box-options-header'>
                            選擇線路視頻:
                            <div className='tip'>
                                HD為高畫質線路，若連線品質不佳時會有延遲狀況發生。
                            </div>
                        </div>

                        <div className='channelLine-box-option' key='1'>
                            <div className='channelLine-box-no'>Auto</div>

                            <div className='channelLine-box-title'>
                                <span class="clsVideoHD">
                                    <input type="radio" class="rdoVideoSourceHD" name="videoSourceHD" value="vid2.starservicegate.com" />
                                    <label for="autoH" class="TL_gamepopup_list_op lineBtnsGroup_label">
                                        <i class="icon icon-ico-selected"></i>
                                        <span class="iconHD">HD</span>
                                        <span class="txtVideoSourceHD">HD</span>
                                    </label>
                                </span>
                            </div>
                            <div className='channelLine-box-title'>
                                <span class="clsVideoStd">
                                    <input type="radio" class="rdoVideoSource" name="videoSource" value="vid2.starservicegate.com" />
                                    <label for="autoL" class="TL_gamepopup_list_op lineBtnsGroup_label">
                                        <i class="icon icon-ico-selected"></i>
                                        <span class="txtVideoSource">SD</span>
                                    </label>
                                </span>
                            </div>
                        </div>


                        <div className='channelLine-box-options-footer'><div className='channelLine-box-options-close' onClick={hidechannelLine}><i></i>關閉</div></div>
                    </div>
                </>}
            </div>
        </Tooltip>
    );
};




export default ChannelLineButton;