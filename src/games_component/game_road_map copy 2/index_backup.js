// /* eslint-disable eqeqeq */

// import './index.scss';
// import React, { Component } from 'react';
// import '../../utils/RoadMapReact.js'
// import { RoadMapAPI } from '../../utils/RoadMapReact.js';



// class RoadMap extends Component {
//     constructor(props) {
//       super(props);
  
//       //初始化狀態，此處就各個img區分開來，方便控管事件(如果有)
//       this.state = {       
//        bigRoad:[]
//       };
  
     
//       this.shoeResultStr = props.shoeResult;
//       this.queryRoadType = null;   
//       //初始化路單處理API;
//         this.RoadMapAPI = new RoadMapAPI();
//         //config設定檔先寫在內部
//         this.initBigRoad({           
//             enableDisplay:false //主路單不做顯示
//         }, {           
//             colMax: 12,
//             rowMax: 6,
//             x: 1,
//             y: 1,
//             width: 50,
//             height: 50
//         });
//     }

//     componentDidUpdate(prevProps, prevState){

//     }

//     shouldComponentUpdate(nextProps, nextState){
//         //檢查是不是因為shoeResult的異動觸發渲染
//         if(nextProps.shoeResultStr == this.shoeResultStr){
//            //不是，為state的異動觸發
//             return true;
//         }else{
//            //是，重新整理state
           
//            this.shoeResultStr = nextProps.shoeResultStr;
//            return false;
//         }
//     }

//     resetBigRoad(){
//         let newBigRoadState = null;
//         RoadMapAPI.setRoadMapByString(this.shoeResultStr);
        
//         newBigRoadState = RoadMapAPI.bigRoad.map((element) => {
           
//         });


//         this.setState(bigRoad:);        
//     }
  
//     rebuildRoadData(type, element){
//         let ret = {};

//         if(element.dataImg){
//             ret.dataImg.tag = element.dataImg.tag;
//             ret.dataImg.cssText = element.dataImg.getCssText();
//             ret.dataImg.key = "data_" +  road.RoundNumber;
//             ret.dataImg.BlinkId
//         }


//         if  
        
//         //大路
//         if(type == 1){

//         }
//     }


//     render() {
//       return (
//         <div>
//           {/* 其他渲染内容 */}
//           <p>Constant state: {this.state.constantState}</p>
//         </div>
//       );
//     }
//   }
  
//   export default RoadMap;
