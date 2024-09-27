import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import './index.scss';

// 之後會優化代碼

const GameBettingArea = forwardRef((props, ref) => {
  const betAreaPath = useRef(null);
  const chipMaxCount = 5;
  const [winAreas, setWinAreas] = useState([]);
  const handleAddBetValue = (event, areaType) => {
    props.handleBet("addBet", { areaType: areaType }, null)
  };

  const generateChipDom = (chipData) => {
    return (
      <div className="chip-stack">
        <div className={"game-chip chips-" + chipData.styleIndex}>
          <div className='game-chipValue'>{chipData.chipValue}</div>
        </div>
      </div>
    );
  };

  const generateTotalValueDom = (areaData) => {
    return (<div className="chip-stack">
      <div className={"game-chipTotal " + ((areaData.unConfirmValue === 0) ? "confirm-bet " : " ") + ((areaData.totalValue > 0) ? "show " : " ")}>
        <div className="game-chipTotal-content">
          <div className="game-chipTotal-icon">

          </div>
          <div className="game-chipTotal-checkIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
              <path d="M18.3828 4.11719C18.8711 4.60547 18.8711 5.39844 18.3828 5.88672L8.38281 15.8867C7.89453 16.375 7.10156 16.375 6.61328 15.8867L1.61328 10.8867C1.125 10.3984 1.125 9.60547 1.61328 9.11719C2.10156 8.62891 2.89453 8.62891 3.38281 9.11719L7.5 13.2305L16.6172 4.11719C17.1055 3.62891 17.8984 3.62891 18.3867 4.11719H18.3828Z" fill="white" />
            </svg>
          </div>
          <div className="game-chipTotal-value">{areaData.totalValue}</div>
          <div className="game-chipTotal-leftLine"></div>
          <div className="game-chipTotal-rightLine"></div>
          <div className="game-chipTotal-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" className="nocheck" viewBox="0 0 19 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.93836 10.5638C8.1075 12.4821 10.8926 12.4821 12.0618 10.5638L18.5001 0H0.5L6.93836 10.5638Z" fill="black" fillOpacity="0.6" />
              <path fillRule="evenodd" clipRule="evenodd" d="M11.3425 9.98552C10.5309 11.3382 8.4691 11.3382 7.6575 9.98552L1.6662 1.70469e-05H17.3338L11.3425 9.98552ZM0.5 0L0.50001 1.70469e-05L6.80001 10.5C8.00001 12.5 11 12.5 12.2 10.5L18.5 1.70469e-05L18.5 0H0.5Z" fill="#CBCBCB" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="check" viewBox="0 0 19 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.72352 10.5611C7.89265 12.4794 10.6778 12.4794 11.8469 10.5611L18.2853 -0.00268555H0.285156L6.72352 10.5611Z" fill="#B8870A" fillOpacity="0.6" />
              <path fillRule="evenodd" clipRule="evenodd" d="M11.1277 9.98284C10.3161 11.3355 8.25426 11.3355 7.44266 9.98284L1.45136 -0.0026685H17.119L11.1277 9.98284ZM0.285156 -0.00268555L0.285166 -0.0026685L6.58517 10.4973C7.78517 12.4973 10.7852 12.4973 11.9852 10.4973L18.2852 -0.0026685L18.2852 -0.00268555H0.285156Z" fill="#FFB423" />
            </svg>
          </div>
        </div>
      </div>
    </div>)
  };

  const generateWinClassStr = (areaType) => {
    let areaClass;
    switch (areaType) {
      case "Player":
        areaClass = "svg-player";
        break;
      case "Banker":
        areaClass = "svg-banker";
        break;
      case "PlayerPair":
        areaClass = "svg-player-pair";
        break;
      case "BankerPair":
        areaClass = "svg-banker-pair";
        break;
      case "Tie":
        areaClass = "svg-tie";
        break;
      default:
        break;
    }

    if (winAreas.includes(areaType)) {
      return areaClass + " win";
    } else {
      return areaClass;
    }
  };

  //初始化設定檔
  useEffect(() => {
    betAreaPath.current = {
      banker: {
        snap: window.Snap(".svg-banker"),
        close:
          "M0,0 H274.27 C274.27,0 275,4 275,4 C296,137 295,142 196,142 H0 V0 Z",
        open:
          "M0.5,0.5H285.932C289.535 10.324 291.5 20.9328 291.5 32C291.5 82.5339 250.534 123.5 200 123.5H0.5V0.5Z"
      },
      player: {
        snap: window.Snap(".svg-player"),
        close:
          "M15.65,0H291.92V142H89.92C-5.08,142,-6.08,137,14.92,4C14.92,4,15.65,0,15.65,0Z",
        open:
          "M6.06847, 0.5H291.5V123.5H92C41.4661 123.5 0.5 82.5339 0.5 32C0.5 20.9328 2.46535 10.324 6.06847 0.5Z"
      },
      bankerPair: {
        snap: window.Snap(".svg-banker-pair"),
        close:
          "M154.5,0 H239.23 V180 C239.23,202.09,221.32,220,199.23,220 H75.9 L-0.77,142 H76.23 C175.23,142,176.23,137,155.23,4 L154.5,0 Z",
        open:
          "M163.996 0.5  H239.5V122C239.5 165.904 203.904 201.5 160 201.5H78.2086L1.96871 124.5H77C128.086 124.5 169.5 83.0861 169.5 32C169.5 20.9427 167.559 10.336 163.996 0.5Z"
      },
      playerPair: {
        snap: window.Snap(".svg-player-pair"),
        close:
          "M1,0 H83.73 L83,4 C62,137,63,142,162,142H240L162.77,220H41C18.91,220,1,202.09,1,180V0Z",
        open:
          "M0.5 0.5 H74.0041 C70.441 10.336 68.5 20.9427 68.5 32 C68.5 83.0861 109.914 124.5 161 124.5 H238.031 L161.791 201.5 H80 C36.0961 201.5 0.5 165.904 0.5 122 V0.5Z"
      },
      tie: {
        snap: window.Snap(".svg-tie"),
        close: "M0 80L80 0 H320 L400 80H0Z",
        open: "M1.19869 77.5L77.4386 0.5H322.561L398.801 77.5H1.19869Z"
      }
    };
  }, []);

  //處理收合投注區
  useEffect(() => {
    if (props.isCanBet) {
      for (let key in betAreaPath.current) {
        let path = betAreaPath.current[key].snap.select(".svg-eve");

        path.animate({ d: betAreaPath.current[key].open }, 500, window.mina.linear);
      }
    } else {
      for (let key in betAreaPath.current) {
        let path = betAreaPath.current[key].snap.select(".svg-eve");

        path.animate({ d: betAreaPath.current[key].close }, 500, window.mina.linear);
      }
    }
  }, [props.isCanBet]);

  useImperativeHandle(ref, () => ({
    ShowWinAreas: (winAreas) => {
      let checkCanUse = true;
      let canUseArea = ["Player", "Banker", "PlayerPair", "BankerPair", "Tie"];
      for(let winArea of winAreas){
        if(canUseArea.includes(winArea) === false){
          checkCanUse = false;
          break;
        }
      }

      if(checkCanUse !== false){
        setWinAreas(winAreas);
      }

      setTimeout(() => {
        setWinAreas([]);
      }, 8000);
    }
  }));

  return (
    <div className={"betArea " + (props.isCanBet ? "" : "close")}>
      <svg className="betWinEffect">
        <filter id="blurFilter">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter
          id="filter0_ii_1724_13078"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-1" dy="-1" />
          <feGaussianBlur stdDeviation="7">
            <animate
              attributeName="stdDeviation"
              values="2;7;2"
              dur="1s"
              repeatCount="indefinite"
            />
          </feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_1724_13078"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" dy="1" />
          <feGaussianBlur stdDeviation="7" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_1724_13078"
            result="effect2_innerShadow_1724_13078"
          />
        </filter>
      </svg>
      <svg
        className={generateWinClassStr("PlayerPair")}
        viewBox="0 0 240 221"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        pointerEvents="none"
      >
        <path
          className="svg-eve"
          d="M0.5 0.5 H74.0041 C70.441 10.336 68.5 20.9427 68.5 32 C68.5 83.0861 109.914 124.5 161 124.5 H238.031 L161.791 201.5 H80 C36.0961 201.5 0.5 165.904 0.5 122 V0.5Z"
          fill="url(#paint0_linear_1640_16820)"
          stroke="url(#paint1_linear_1640_16820)"
          pointerEvents="visibleFill"
          shapeRendering="geometricPrecision"
          onClick={(event) => (handleAddBetValue(event, 'PlayerPair'))}
        />
        <defs>
          <linearGradient
            className="svg-eve-fill"
            id="paint0_linear_1640_16820"
            x1="119.615"
            y1="0"
            x2="119.615"
            y2="202"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0F52B7" stopOpacity="0.9" />
            <stop offset="1" stopColor="#003380" />
          </linearGradient>
          <linearGradient
            className="svg-eve-border"
            id="paint1_linear_1640_16820"
            x1="119.615"
            y1="0"
            x2="119.615"
            y2="202"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#17AAFF" />
            <stop offset="1" stopColor="#625FFF" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        className={generateWinClassStr("BankerPair")}
        viewBox="0 0 240 221"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        pointerEvents="none"
      >
        <path
          className="svg-eve"
          d="M163.996 0.5  H239.5V122C239.5 165.904 203.904 201.5 160 201.5H78.2086L1.96871 124.5H77C128.086 124.5 169.5 83.0861 169.5 32C169.5 20.9427 167.559 10.336 163.996 0.5Z"
          fill="url(#paint0_linear_1640_16822)"
          stroke="url(#paint1_linear_1640_16822)"
          pointerEvents="visibleFill"
          shapeRendering="geometricPrecision"
          onClick={(event) => (handleAddBetValue(event, 'BankerPair'))}
        />
        <defs>
          <linearGradient
            className="svg-eve-fill"
            id="paint0_linear_1640_16822"
            x1="120.385"
            y1="0"
            x2="120.385"
            y2="202"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B70F0F" stopOpacity="0.9" />
            <stop offset="1" stopColor="#720000" />
          </linearGradient>
          <linearGradient
            className="svg-eve-border"
            id="paint1_linear_1640_16822"
            x1="120.385"
            y1="0"
            x2="120.385"
            y2="202"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF5B53" />
            <stop offset="1" stopColor="#EA311D" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        className={generateWinClassStr("Banker")}
        viewBox="0 0 292 142"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        pointerEvents="none"
      >
        <path
          className="svg-eve"
          d="M0.5,0.5H285.932C289.535 10.324 291.5 20.9328 291.5 32C291.5 82.5339 250.534 123.5 200 123.5H0.5V0.5Z"
          fill="url(#paint0_linear_1640_16818)"
          stroke="url(#paint1_linear_1640_16818)"
          pointerEvents="visibleFill"
          shapeRendering="geometricPrecision"
          onClick={(event) => (handleAddBetValue(event, 'Banker'))}
        />
        <defs>
          <linearGradient
            className="svg-eve-fill"
            id="paint0_linear_1640_16818"
            x1="146"
            y1="0"
            x2="146"
            y2="124"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B70F0F" stopOpacity="0.9" />
            <stop offset="1" stopColor="#720000" />
          </linearGradient>
          <linearGradient
            className="svg-eve-border"
            id="paint1_linear_1640_16818"
            x1="146"
            y1="0"
            x2="146"
            y2="124"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF5B53" />
            <stop offset="1" stopColor="#EA311D" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        className={generateWinClassStr("Player")}
        viewBox="0 0 292 142"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="svg-eve"
          d="M6.06847, 0.5H291.5V123.5H92C41.4661 123.5 0.5 82.5339 0.5 32C0.5 20.9328 2.46535 10.324 6.06847 0.5Z"
          fill="url(#paint0_linear_1640_16816)"
          stroke="url(#paint1_linear_1640_16816)"
          shapeRendering="geometricPrecision"
          onClick={(event) => (handleAddBetValue(event, 'Player'))}
        />
        <defs>
          <linearGradient
            className="svg-eve-fill"
            id="paint0_linear_1640_16816"
            x1="146"
            y1="0"
            x2="146"
            y2="124"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0F52B7" stopOpacity="0.9" />
            <stop offset="1" stopColor="#003380" />
          </linearGradient>
          <linearGradient
            className="svg-eve-border"
            id="paint1_linear_1640_16816"
            x1="146"
            y1="0"
            x2="146"
            y2="124"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#17AAFF" />
            <stop offset="1" stopColor="#625FFF" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        className={generateWinClassStr("Tie")}
        viewBox="0 0 400 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        pointerEvents="none"
      >
        <path
          className="svg-eve"
          d="M1.19869 77.5L77.4386 0.5H322.561L398.801 77.5H1.19869Z"
          fill="url(#paint0_linear_1640_16824)"
          stroke="url(#paint1_linear_1640_16824)"
          pointerEvents="visibleFill"
          shapeRendering="crispEdges"
          onClick={(event) => (handleAddBetValue(event, 'Tie'))}
        />
        <defs>
          <linearGradient
            className="svg-eve-fill"
            id="paint0_linear_1640_16824"
            x1="200"
            y1="0"
            x2="200"
            y2="78"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0FB766" stopOpacity="0.9" />
            <stop offset="1" stopColor="#064F2C" />
          </linearGradient>
          <linearGradient
            className="svg-eve-border"
            id="paint1_linear_1640_16824"
            x1="200"
            y1="0"
            x2="200"
            y2="78"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#26FF7A" />
            <stop offset="1" stopColor="#0B7453" />
          </linearGradient>
        </defs>
      </svg>
      <div className="betTextArea">
        <div className="bet-text bet-text-banker">
          <div className="bet-text-title">庄</div>
          <div className="bet-text-num">1:0:9</div>
        </div>
        <div className="bet-text bet-text-player">
          <div className="bet-text-title">閒</div>
          <div className="bet-text-num">1:0:9</div>
        </div>
        <div className="bet-text bet-text-banker-pair">
          <div className="bet-text-title">庄對</div>
          <div className="bet-text-num">1:0:9</div>
        </div>
        <div className="bet-text bet-text-player-pair">
          <div className="bet-text-title">閒對</div>
          <div className="bet-text-num">1:0:9</div>
        </div>
        <div className="bet-text bet-text-tie">
          <div className="bet-text-title">和</div>
          <div className="bet-text-num">1:0:9</div>
        </div>
        <div className="betArea-bakText-banker">庄</div>
        <div className="betArea-bakText-player">閒</div>
      </div>
      <div className="betChipArea">
        <div className="bet-chip-banker">
          {props.orderData.Banker.chips.map(
            (chipData, index, array) =>
              array.length - index <= chipMaxCount && generateChipDom(chipData)
          )}
          {generateTotalValueDom(props.orderData.Banker)}
        </div>
        <div className="bet-chip-player">
          {props.orderData.Player.chips.map(
            (chipData, index, array) =>
              array.length - index <= chipMaxCount && generateChipDom(chipData)
          )}
          {generateTotalValueDom(props.orderData.Player)}
        </div>
        <div className="bet-chip-bankerpair">
          {props.orderData.BankerPair.chips.map(
            (chipData, index, array) =>
              array.length - index <= chipMaxCount && generateChipDom(chipData)
          )}
          {generateTotalValueDom(props.orderData.BankerPair)}
        </div>
        <div className="bet-chip-playerpair">
          {props.orderData.PlayerPair.chips.map(
            (chipData, index, array) =>
              array.length - index <= chipMaxCount && generateChipDom(chipData)
          )}
          {generateTotalValueDom(props.orderData.PlayerPair)}
        </div>
        <div className="bet-chip-tie">
          {props.orderData.Tie.chips.map(
            (chipData, index, array) =>
              array.length - index <= chipMaxCount && generateChipDom(chipData)
          )}
          {generateTotalValueDom(props.orderData.Tie)}
        </div>
      </div>
    </div>
  );
});



export default GameBettingArea;