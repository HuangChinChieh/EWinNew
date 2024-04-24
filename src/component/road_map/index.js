/* eslint-disable eqeqeq */

import './index.scss';
import React, { Component } from 'react';
import { RoadMapAPI } from '../../utils/RoadMap.js';



class RoadMap extends Component {
  constructor(props) {
    super(props);
    this.shoeResultStr = props.shoeResult;
    this.myRoadMapDiv = React.createRef();
    //初始化路單處理API;

  }

  componentDidMount() {
    this.RoadMapAPI = new RoadMapAPI();
    //config設定檔先寫在內部
    //debugger;
    this.RoadMapAPI.init({
      enableDisplay: false //主路單不做顯示
    }, {
      el: this.myRoadMapDiv.current,
      colMax: 35,
      
      rowMax: 5,
      x: 1,
      y: 1,
      width: 10,
      height: 10
    }, {
      enableDisplay: false //主路單不做顯示
    }, {
      enableDisplay: false //主路單不做顯示
    }, {
      enableDisplay: false //主路單不做顯示
    });

    this.RoadMapAPI.setRoadMapByString(this.shoeResultStr);
  }

  shouldComponentUpdate(nextProps, nextState) {
    //檢查是不是因為shoeResult的異動觸發渲染
    if (nextProps.shoeResultStr == this.shoeResultStr) {
      //不是，為state的異動觸發

    } else {
      //是，重新整理state
      //this.shoeResultStr = nextProps.shoeResultStr;
      //this.RoadMapAPI.setRoadMapByString(this.shoeResultStr);
    }

    return false;
  }



  render() {
    return (
      <div>
        <div ref={this.myRoadMapDiv} style={{ position: "relative", width: "350px", height: "50px" }}>
        </div>
      </div>
    );
  }
}

export default RoadMap;
