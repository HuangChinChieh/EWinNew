import React, { useState, useContext, useRef, useEffect } from 'react';
import './index.scss';
import { MusicIsPlayingContext } from 'provider/GameLobbyProvider';
import musicMP3 from 'music/lobby_music/Lobby.mp3';
import musicOGG from 'music/lobby_music/Lobby.ogg';
import musicAAC from 'music/lobby_music/Lobby.aac';


const MuteButton = () => {
    const { musicIsPlaying, muteSwitch } = useContext(MusicIsPlayingContext);
    const audioRef = useRef(null);
    const lastTimeRef = useRef(0); 

    // 切換圖示跟變更全域音樂的播放狀態
    const toggleMute = () => {
        muteSwitch(!musicIsPlaying); // 將靜音狀態保存到 Context 中
    }

    // 判斷是否繼續播放
    useEffect(() => {
        if (musicIsPlaying) {
            handlePlay();
        } else {
            handlePause();
        }
    }, [musicIsPlaying]);

    // 讀取最後音樂時間點並啟用音樂
    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = lastTimeRef.current;
            audioRef.current.volume = 0.6;
            audioRef.current.play();
        }
    };

    // 存取最後音樂時間點並停止音樂
    const handlePause = () => {
        if (audioRef.current) {
            lastTimeRef.current = audioRef.current.currentTime; 
            audioRef.current.pause();
        }
    };

    return (
        <div className='mute-box forpc'>
            {musicIsPlaying ?
                <div onClick={toggleMute} className='unmute' />
                :
                <div onClick={toggleMute} className='mute' />
            }
            <audio ref={audioRef} autoPlay loop >
                <source src={musicMP3} type="audio/mpeg" />
                <source src={musicOGG} type="audio/ogg" />
                <source src={musicAAC} type="audio/aac" />
            </audio>
        </div>
    );
}

export default MuteButton;