import { useRef, useState, useEffect } from 'react';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './index.scss';
import Videos from 'img/videoplayback.mp4';
const VideoBox = (props) => {
    const { t } = useLobbyContext();
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [getUrl, setGetUrl] = useState('');

    const { gameTitle } = props
    const [checkLocalTitle, setCheckLocalTitle] = useState('');


    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        // 這邊控制項先拿掉, 不確定要怎麼撥放, 一般狀況可使用 video 或安裝 react-player
        // if (isPlaying) {
        //     videoRef.current.pause();
        // } else {
        //     videoRef.current.play();
        // }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        // 這邊控制項先拿掉, 不確定要怎麼撥放, 一般狀況可使用 video 或安裝 react-player
        // videoRef.current.muted = !isMuted;
    };

    const onClose = () => {
        setGetUrl('');
        localStorage.setItem('gameTitle', '')
    }

    useEffect(() => {
        setGetUrl(props.url.split('/').pop());
        // 透過 getUrl 拿到的遊戲id, 去顯示 websocket對應遊戲的視訊
        setCheckLocalTitle(localStorage.getItem('gameTitle'));

    }, [])

    return (
        <div className='video-wrap'>
            {getUrl &&
                <div>
                    <div className='video-box forpc'>
                        <div className='video-bg-box'></div>
                        <div className={`video-play-box ${isPlaying ? 'video-pause' : 'video-play'}`} onClick={togglePlay}>
                            <span />
                        </div>
                        <div className='video-footer'>
                            <div className='left-box'>
                                <h4>
                                    {
                                        gameTitle === ''
                                            ? <span>{checkLocalTitle}</span>
                                            : <span>{gameTitle}</span>
                                    }
                                </h4>
                                {/* 這邊應該是後端返回的狀態，目前先做假顯示 */}
                                <span>{t("Global.progress")}</span>
                            </div>
                            <div className='right-box'>
                                <div className={`video-control ${isMuted ? 'video-unmute' : 'video-mute'}`} onClick={toggleMute}>
                                </div>
                                <div className='video-size'></div>
                                <div className='video-close' onClick={onClose} ></div>
                            </div>
                        </div>
                    </div>
                    <div className='video-box formb'>
                        <div className='video-bg-box'></div>
                        <div className={`video-play-box ${isPlaying ? 'video-pause' : 'video-play'}`} onClick={togglePlay}>
                            <span />
                        </div>
                        <div className='video-footer'>
                            <div className='left-box'>
                                <h4>
                                    {
                                        gameTitle === ''
                                            ? <span>{checkLocalTitle}</span>
                                            : <span>{gameTitle}</span>
                                    }
                                </h4>
                                {/* 這邊應該是後端返回的狀態，目前先做假顯示 */}
                                <span>{t("Global.progress")}</span>
                            </div>
                            <div className='right-box'>
                                <div className={`video-control ${isMuted ? 'video-unmute' : 'video-mute'}`} onClick={toggleMute}>
                                </div>
                                <div className='video-close' onClick={onClose} ></div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>

    )
}

const mapStateToProps = (state) => ({
    gameTitle: state.root.gameTitle

});


export default connect(mapStateToProps)(VideoBox);