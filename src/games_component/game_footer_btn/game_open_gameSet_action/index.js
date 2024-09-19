import './index.scss';

const GameOpenGameSetAction = (props ) => {
    const handleButtonClick = () => {
        props.updateMiddleBtnType("GameSet"); // 你可以傳遞你想要設定的值
    };

    return (
        <div className='game-open-gameSetAction-box' onClick={handleButtonClick}>
            <span className='icon-box'>傳統專用-桌檯功能列表</span>
        </div>
    )
}

export default GameOpenGameSetAction;