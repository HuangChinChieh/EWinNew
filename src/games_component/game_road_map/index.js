/* eslint-disable eqeqeq */

import './index.scss';
import React, { Component } from 'react';
import { RoadMapAPI } from '../../utils/RoadMap.js';



class GameRoadMap extends Component {
  constructor(props) {
    super(props);
    this.shoeResultStr = props.shoeResult;    
    this.roadMap1 = React.createRef();
    this.roadMap2 = React.createRef();
    this.roadMap3 = React.createRef();
    this.roadMap4 = React.createRef();
    this.roadMap5 = React.createRef();
    //初始化路單處理API;

  }

  componentDidMount() {
     this.RoadMapAPI = new RoadMapAPI();
    // //config設定檔先寫在內部
    // //debugger;     
    // this.handleResize();
    // window.addEventListener('resize', this.handleResize.bind(this));

    this.RoadMapAPI.init({
      el: this.roadMap1.current,
      colMax: 20,
      rowMax: 6,
      x: 0,
      y: 0,
      width: 30,
      height: 30 //主路單不做顯示
    }, {
      el: this.roadMap2.current,
      colMax: 27,
      rowMax: 6,
      x: 0,
      y: 0,
      width: 20,
      height: 20
    }, {
      el: this.roadMap3.current,
      colMax: 54,
      rowMax: 6,
      x: 0.5,
      y: 0,
      width: 10,
      height: 10 //主路單不做顯示
    }, {
      el: this.roadMap4.current,
      colMax: 54,
      rowMax: 6,
      x: 0.5,
      y: 0,
      width: 10,
      height: 10 //主路單不做顯示
    }, {
      el: this.roadMap5.current,
      colMax: 27,
      rowMax: 3,
      x: 0.5,
      y: 0,
      width: 10,
      height: 10 //主路單不做顯示
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
      // <div className='roadMap-baccarat' ref={this.myRoadMapDivParentParent}>
      <div className='roadMap-baccarat' >
        <div className='roadMap-left'>
          <div className='roadMap-road1' ref={this.roadMap1}></div>
          <div className='backImg'></div>
        </div>
        <div className='roadMap-right'>
          <div className='roadMap-road2' ref={this.roadMap2}></div>
          <div className='roadMap-road3' ref={this.roadMap3}></div>
          <div className='roadMap-road4' ref={this.roadMap4}></div>
          <div className='roadMap-road5' ref={this.roadMap5}></div>
          <div className='backImg'></div>
        </div>
      </div>
    );
  }
}

export default GameRoadMap;
