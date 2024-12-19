import React, { useState, useRef } from 'react';
import GameRoadMapGoodRoad from '../game_road_map_gooRoad'
import CountdownLittleCircle from '../game_count_down_circle_little'
import './index.scss'
const MiniTableGoodRoad = ({ tableName, remainingSecond, lastQueryDate, tableTimeoutSecond, shoeResult }) => {

    const [playerOrderData, setPlayerOrderData] = useState({
        orderValue: 0,
        lastChipStyleIndex: 0
    });

    const [bankerOrderData, setBankerOrderData] = useState({
        orderValue: 0,
        lastChipStyle: 0
    });



    return (
        <div className='miniTableGoodRoad'>
            <div className='miniTableGoodRoad-bet'>
                <div className='miniTableGoodRoad-betArea'>
                    <div className='miniTableGoodRoad-betArea-banker'>
                        <div className='miniTableGoodRoad-betArea-text'>閒</div>
                    </div>
                    <div className='miniTableGoodRoad-betArea-player'>
                        <div className='miniTableGoodRoad-betArea-text'>庄</div>
                    </div>
                </div>
                <div className='miniTableGoodRoad-betCheck'>
                    <div className='miniTableGoodRoad-betCheck-cancel'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M15.7765 2.77646C16.4112 2.1417 16.4112 1.11084 15.7765 0.476074C15.1417 -0.158691 14.1108 -0.158691 13.4761 0.476074L8.12881 5.82842L2.77646 0.481152C2.1417 -0.153613 1.11084 -0.153613 0.476074 0.481152C-0.158691 1.11592 -0.158691 2.14678 0.476074 2.78154L5.82842 8.12881L0.481152 13.4812C-0.153613 14.1159 -0.153613 15.1468 0.481152 15.7815C1.11592 16.4163 2.14678 16.4163 2.78154 15.7815L8.12881 10.4292L13.4812 15.7765C14.1159 16.4112 15.1468 16.4112 15.7815 15.7765C16.4163 15.1417 16.4163 14.1108 15.7815 13.4761L10.4292 8.12881L15.7765 2.77646Z" />
                        </svg>
                    </div>
                    <div className='miniTableGoodRoad-betCheck-confirm'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
                            <path d="M22.8976 1.35229C23.5323 1.98706 23.5323 3.01792 22.8976 3.65269L9.89756 16.6527C9.26279 17.2875 8.23193 17.2875 7.59717 16.6527L1.09717 10.1527C0.462402 9.51792 0.462402 8.48706 1.09717 7.85229C1.73193 7.21753 2.76279 7.21753 3.39756 7.85229L8.7499 13.1996L20.6022 1.35229C21.237 0.717529 22.2679 0.717529 22.9026 1.35229H22.8976Z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className='miniTableGoodRoad-tableInfo'>
                <div className='miniTableGoodRoad-tableInfo-roadMap'>
                    <GameRoadMapGoodRoad shoeResult="1751111221121122ADEEE121151212211121212212112211222311211B2111115512332229D11"></GameRoadMapGoodRoad>
                </div>
                <div className='miniTableGoodRoad-tableInfo-information'>
                    <div className='miniTableGoodRoad-tableInfo-tableName'>
                        <span className='miniTableGoodRoad-tableInfo-tableName-tableNumber'>百家樂F桌</span>
                        <span className='miniTableGoodRoad-tableInfo-tableName-roundInfo'>-11-1</span>
                    </div>
                    <div className='miniTableGoodRoad-tableInfo-countdown'>
                        <CountdownLittleCircle></CountdownLittleCircle>
                    </div>
                </div>
            </div>
        </div>
    );
};




export default MiniTableGoodRoad;