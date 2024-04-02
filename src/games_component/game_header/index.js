
import { connect } from 'react-redux';

import './index.scss';
// header 左邊選單項目
import GameBack from 'games_component/game_back';
import GameFavorite from 'games_component/game_favorite';
import HowToPlayButton from 'games_component/game_buttons/how_to_play_btn';

// header 中間項目
import Marquee from 'games_component/game_marquee';

// header 右邊選單項目
import GameSettingButton from 'games_component/game_buttons/game_setting_btn';
import GameMuteButton from 'games_component/game_buttons/game_mute_btn';
import GameBettingHistoryButton from 'games_component/game_buttons/game_betting_history_btn';
import GameLimitButton from 'games_component/game_buttons/game_limit_btn';
import GameGoodTrendNoticeButton from 'games_component/game_buttons/game_good_trend_notice_btn';
import GameFullscreenButton from 'games_component/game_buttons/game_fs_btn';
import GameHDSDButton from 'games_component/game_buttons/game_hdsd_btn';
import GameReloadButton from 'games_component/game_buttons/game_reload_btn';

import { useEffect, useState } from 'react';
const GameHeader = (props) => {
    const [checkLocalTitle, setCheckLocalTitle] = useState('');

    useEffect(() => {
        setCheckLocalTitle(localStorage.getItem('gameTitle'));
    }, [])


    return (
        <div className='game-header-wrap'>
            <div className='game-left-box'>
                <div className='game-flex-box'>
                    <GameBack />
                    {/* 避免在遊戲內時重整畫面, 拿不到redux內儲存的id時,顯示 '' 產生的相關錯誤 */}
                    {props.gameTitle === ''
                        ? <span>{checkLocalTitle}</span>
                        : <span>{props.gameTitle}</span>}

                </div>
                {/* user-icon 部分設計沒有做相關UX, 之後有點擊互動時要抽出去寫成組件 */}
                <span className='user-icon' />
                <HowToPlayButton />
                <GameFavorite />
                <GameLimitButton />
            </div>
            <div className='game-middle-box'>
                <Marquee />
            </div>
            <div className='game-right-box'>
                <GameReloadButton />
                <GameHDSDButton />
                <GameFullscreenButton />
                <GameMuteButton />
                <GameBettingHistoryButton />
                <GameGoodTrendNoticeButton />
                <GameSettingButton />
            </div>

        </div>
    )
}


const mapStateToProps = (state) => ({
    gameTitle: state.root.gameTitle

});

export default connect(mapStateToProps)(GameHeader);