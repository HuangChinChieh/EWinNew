import AlertPop from "component/alertPop";
import "./index.scss";
import { useState } from "react";



const GameIntro = (props) => {
  const { isShow, handleOK } = props;
  const getGameIntroJSX = () => {
    return (<div className="introduction-box">
      <div className="introduction">
        <div className="introduction-title"><span>百家樂介紹</span></div>
        <div className="introduction-content "><span>
        百家樂是全世界最常見的博奕遊戲，來自於義大利，現已被認定是「最公平、公開、公正」的博奕遊戲，百家樂從澳門及拉斯維加斯賭場開始興起，目前無疑是最受歡迎的博弈遊戲之一。簡單來說，百家樂的娛樂模式就是下注莊家或是閒家的博奕遊戲，玩家下注的那一方點數高過對方那就取得勝利，百家樂一般使用八副撲克牌，經過機器或荷官的洗牌、切牌、堆牌後，第一、三張牌發給閒家，第二、四張牌發給莊家，依照補牌規定，至多三張牌，雙方點數最接近9點者就為勝利。</span></div>
      </div>
      <div className="introduction">
        <div className="introduction-title "><span>百家樂牌例</span></div>
        <div className="introduction-content ">
          <span>(一)	閒家補牌規則 
          <br/>&nbsp; {`a)	兩張牌合計點數為以下，則補第三張牌 : 0 – 5點>  必須補牌 `}
          <br/>&nbsp; {`b)	6、7點> 不會再補牌 `}
          <br/>&nbsp;  {`c)	8、9點> 例牌，直接勝負`}
          <br/>(二)	莊家補牌規則 
          <br/>&nbsp; {`a)	兩張牌合計點數為以下，則補第三張牌 : 0 – 2點>  必須補牌 `}
          <br/>&nbsp; {`b)	3點> 若閒家博得第三張牌為8，莊家不得補牌 `}
          <br/>&nbsp; {`c)	4點> 若閒家博得第三張牌為0,1,8,9，莊家不得補牌 `}
          <br/>&nbsp; {`d)	5點> 若閒家博得第三張牌為0,1,2,3,8,9，莊家不得補牌 `}
          <br/>&nbsp; {`e)	6點> 若閒家博得第三張牌為6或7，莊家必須補牌 `}
          <br/>&nbsp; {`f)	7點> 不得補牌 <br>&nbsp; g)	8、9點&gt; 例牌，直接勝負`}
          </span>
          </div>
      </div>
      <div className="introduction">
        <div className="introduction-title "><span>百家樂賠率</span></div>
        <div className="introduction-content ">
          <span >百家樂是一個依靠機率猜測與算牌的博弈遊戲，因此玩家必須在發牌前下注。玩家可以從以下幾個下注選項中，選出任何一方進行投注： 
          <br/>&nbsp; 1.	莊家 ：             
          <br/>&nbsp;&nbsp;	百家樂一般桌 : 玩家押注莊家方並勝出，玩家將得到押注金額95%的賠率，需扣除5%的傭金 
          <br/>&nbsp;&nbsp;	百家樂Super6桌 : 玩家押注莊家方並勝出，玩家將得到押注金額100%的賠率，無需扣除傭金 但莊家6點勝出時，玩家僅得到押注金額50%的賠率 玩家押注Super6結果為莊贏6點，1賠12 
          <br/>&nbsp; 2.	閒家 ：玩家押注閒家方並勝出，玩家將得到和押注相同的賠率，免除傭金            
          <br/>&nbsp; 3.	莊家對子 ：押注莊對子，1賠11 （即莊家首2張牌為同數字或同字母） 
          <br/>&nbsp; 4.	閒家對子 ：押注閒對子，1賠11 （即閒家首2張牌為同數字或同字母） 
          <br/>&nbsp; 5.	和局 ：押注和局結果為和，1賠8。
          </span>
        </div>
      </div>
    </div>
    )
  };

  return (
    <AlertPop isShow={isShow} title={"百家樂說明"} message={getGameIntroJSX()} handleOK={handleOK}></AlertPop>
  );
};

export default GameIntro;
