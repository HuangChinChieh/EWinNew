import './index.scss';

// 實際相似遊戲會從後端返回state, 先這樣寫demo用

const SimilarGames = () => {

const listItems = [
    { gametitle: '骰盅A桌', gameid: 'baccarat-1', wallet: '100', walletstate: 'PHP' },
    { gametitle: '骰盅B桌', gameid: 'baccarat-2', wallet: '100', walletstate: 'PHP' },
    { gametitle: '骰盅C桌', gameid: 'baccarat-3', wallet: '100', walletstate: 'PHP' },
    { gametitle: '骰盅D桌', gameid: 'baccarat-4', wallet: '100', walletstate: 'PHP' },
    { gametitle: '骰盅E桌', gameid: 'baccarat-5', wallet: '100', walletstate: 'PHP' },
];
    return (
        <div className='similar-games-box'>
            {listItems.map((item, k) => (
                <div key={k} className='box' >
                    <div className={`games ${item.gameid}`}>
                        <img src={require(`../../img/gamelobby/${item.gameid}.png`)} alt={item.gameid} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SimilarGames;