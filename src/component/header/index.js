import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Logo from 'component/logo';
import { useLobbyContext } from 'provider/GameLobbyProvider';
import FullscreenButton from 'component/buttons/fs_btn';
import MuteButton from 'component/buttons/mute_btn';
import SettingButton from 'component/buttons/setting_btn';
import BettingHistory from 'component/buttons/betting_history_btn';
import GoodTrendNotice from 'component/buttons/good_trend_notice_btn';
import { useLanguage } from 'hooks';

import './index.scss';




const Header = (props) => {

  const { t, userInfo } = useLobbyContext();
  const { favorites } = props;
  const [aniHeader, setAniHeader] = useState('aniHeader');
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const toggleHamburger = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    const handleScroll = () => {

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.scrollY;

      // 判斷滾動的方向，並更新 aniHeader 的狀態
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        setAniHeader('aniHeaderAction');
      } else if (scrollTop < lastScrollTop) {
        setAniHeader('aniHeader');
      }
      // 更新 lastScrollTop
      setLastScrollTop(scrollTop);

    };
    window.addEventListener('scroll', handleScroll);



    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);


  const [isLightboxOpen, setLightboxOpen] = useState(false);

  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState('Jisdom');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setLightboxOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 在這裡添加檢查用戶名和密碼的邏輯
    if (userName === 'jisdom' && password === '777') {
      // 登入成功
      setIsLogged(true);
      setUserName('Jisdom');
      localStorage.setItem('isLogin', true)
      setLightboxOpen(false);

    } else {
      // 登入失敗，顯示錯誤提示
      setError('Invalid username or password');
    }
  };


  return (
    <div className={aniHeader}>
      <div className="header-box">
        <Logo />
        <div className='nav-box'>
          {/* 之後傳接api再處理判斷, 有可能不再這邊做登入處理 在父層登入 */}
          {isLogged ? (
            <div className='tool-box-left'>
              {/* user-icon 部分設計沒有做相關UX, 之後有點擊互動時要抽出去寫成組件 */}
              <span><span className='user-icon' /></span>
              <span className='forpc'><span className='user-wallet' />{userInfo.BetLimitCurrencyType} 0</span>
              <span className='forpc'><span>{t("Global.favorites")}({favorites.length}) </span></span>
              <span className='formb'><a className="user-favorite" href='/'></a></span>

            </div>
          ) : (
            <div className='tool-box-left'>
              <span><span className='user-icon' /></span>
              <span className='forpc'>
                <span className='user-wallet' />
                {userInfo.BetLimitCurrencyType}&nbsp;
                {userInfo && userInfo.Wallet && userInfo.Wallet.map((i, index) => (
                  i.CurrencyType === userInfo.BetLimitCurrencyType ? <span className='without-mr' key={index}>{i.Balance}</span> : ''
                ))}
              </span>
              <span><a className="user-favorite" href='/Gamefavorite'></a></span>
            </div>
          )}
        </div>
        <div className={`hamb ${isOpen ? 'open' : ''}`} onClick={toggleHamburger}>
          <span />
          <span />
          <span />
        </div>
        <div className="toolbar">
          <FullscreenButton />
          <MuteButton />
          <BettingHistory />
          <GoodTrendNotice />
          <SettingButton />
        </div>
      </div>
      {isLightboxOpen &&
        <div className="lightbox-box">
          <div className='form-box'>
            <span className='close' onClick={() => setLightboxOpen(false)} >X</span>
            <form onSubmit={handleSubmit}>
              <label>
                <input
                  type="text"
                  placeholder='Username'
                  id="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </label>
              <br />
              <label>
                <input
                  type="password"
                  placeholder='Password'
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <br />
              {error && <span className="error">{error}</span>}
              <button type="submit">{t("Global.login")}</button>
            </form>
          </div>
        </div>
      }
      {isOpen &&
        <div>
          <div className={`lightbox-box ${isOpen ? 'open' : ''}`} onClick={toggleHamburger} />
          <div className='mb-footer-box'>
            <h4>{t("Global.menu")}</h4>
            <FullscreenButton />
            <SettingButton />
            <span className='close' onClick={() => setIsOpen(false)} />
          </div>
        </div>
      }
    </div>
  );
};


const mapStateToProps = (state) => ({
  favorites: state.root.favorites,
});

export default connect(mapStateToProps)(Header);
