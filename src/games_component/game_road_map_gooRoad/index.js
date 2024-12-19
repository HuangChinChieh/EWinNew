/* eslint-disable eqeqeq */

import './index.scss';
import React, { Component } from 'react';
import { RoadMapAPI } from '../../utils/RoadMap.js';



class GameRoadMapGoodRoad extends Component {
  constructor(props) {
    super(props);
    this.shoeResultStr = props.shoeResult;
    this.roadMap2 = React.createRef();
  }

  componentDidMount() {
    this.RoadMapAPI = new RoadMapAPI();
    // //config設定檔先寫在內部
    // //debugger;     
    // this.handleResize();
    // window.addEventListener('resize', this.handleResize.bind(this));
    this.RoadMapAPI.init(null, {
      el: this.roadMap2.current,
      colMax: 18,
      rowMax: 6,
      x: 0,
      y: 0,
      width: 20,
      height: 20
    }, null, null, null);
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
        <div className='roadMap-baccarat_goodRoad'>
          <div className='roadMap-road2' ref={this.roadMap2}></div>   
          <div className='backImg'></div> 
        </div>
    );
  }
}

export default GameRoadMapGoodRoad;
