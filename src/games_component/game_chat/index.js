import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLobbyContext } from "provider/GameLobbyProvider";

import './index.scss';


const GameChat = (props) => {

    const {
        t
    } = useLobbyContext();

    // 目前先 hardcode 處理

    const [message, setMessage] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim() === '') return;

        // 將新訊息加到 messages 陣列的最前面
        setMessage([inputValue, ...message.slice(0, 3)]);
        setInputValue('');
    };

    useEffect(() => {
        const messageInterval = setInterval(() => {
            if (message.length > 0) {
                setMessage(message.slice(0, -1));
            }
        }, 5000);

        return () => clearInterval(messageInterval);
    }, [message]);

    return (
        <div className='game-chat-box'>
            <form onSubmit={handleSubmit}>
                <div className='chat-wrap'>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={t('Chat.placeholder')}
                    />
                    <span className='chat-icon' onClick={handleSubmit} />
                </div>
            </form>
            <div className='chat-list'>
                {message.map((message, index) => (
                    <div key={index}>{props.userInfo.RealName}:
                        <span>{message}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.gameLobby.userInfo,
    };
};

export default connect(mapStateToProps)(GameChat);
