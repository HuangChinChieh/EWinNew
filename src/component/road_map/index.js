/* eslint-disable eqeqeq */

import './index.scss';
import React, { Component } from 'react';
import { RoadMapAPI } from '../../utils/RoadMap.js';



class RoadMap extends Component {
  constructor(props) {
    super(props);
    this.shoeResultStr = props.shoeResult;
    this.roadMapType = props.roaMapType;
    this.myRoadMapDiv = React.createRef();
    this.myRoadMapDivParent = React.createRef();
    this.myRoadMapDivParentParent = React.createRef();
    //初始化路單處理API;

  }

  componentDidMount() {
    this.RoadMapAPI = new RoadMapAPI();
    //config設定檔先寫在內部
    //debugger;     
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

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

  componentWillUnmount() {
    // 組件消失時的事件，例如：清除計時器
    window.removeEventListener('resize', this.handleResize);
  }


  handleResize = () => {
    //處理路單偏移，先處理顯示外框的基本寬度，必須要是10的倍數   

    if (this.myRoadMapDivParentParent.current != null) {
      let elementWidth = this.myRoadMapDivParentParent.current.offsetWidth;
      if (elementWidth != 0) {
        //顯示之基數
        let elementWidthBase = (parseInt(elementWidth / 10));
        elementWidth = elementWidthBase * 10;

        if (elementWidth <= 350) {
          this.myRoadMapDivParent.current.style.width = elementWidth + "px";
        } else {
          elementWidthBase = 35;
          this.myRoadMapDivParent.current.style.width = "350px";
        }

        this.RoadMapAPI.init({
          enableDisplay: false //主路單不做顯示
        }, {
          el: this.myRoadMapDiv.current,
          colMax: elementWidthBase,
          rowMax: 6,
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
    };
  }

  render() {
    return (
      <div ref={this.myRoadMapDivParentParent}>
        <div className={`roadMap-container-outside type${this.roadMapType}`} ref={this.myRoadMapDivParent}>
          <div className='roadMap-container' ref={this.myRoadMapDiv}>
          </div>
        </div>
      </div>
    );
  }
}

export default RoadMap;
