import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import "./index.scss";
import RoadMap from "component/road_map";
import { useHistory } from "react-router-dom";
import { EWinGameLobbyClient } from "signalr/bk/EWinGameLobbyClient";
import {
  FavorsContext,
  LobbyPersonalContext,
} from "provider/GameLobbyProvider";

const ChangeTable = (props) => {
  const lobbyClient = EWinGameLobbyClient.getInstance();
  const [tableList, setTableList] = useState([]);
  const [areaCode, setAreaCode] = useState("");
  const [areaCodeName, setAreaCodeName] = useState("");
  const history = useHistory();

  useEffect(() => {
    setAreaCode(props.areaCode.current);
    setAreaCodeName(props.areaCode.current);
  }, []);

  useEffect(() => {
    refreshTableList(areaCode);
  }, [areaCode]);

  const handleClose = () => {
    if (props.onChangeTableClose) {
      props.onChangeTableClose();
    }
  };

  const showSeleCountry = () => {
    if (
      window.getComputedStyle(document.getElementById("divCountrySel"))
        .display == "none"
    ) {
      document.getElementById("divCountrySel").style.display = "block";
    } else {
      document.getElementById("divCountrySel").style.display = "none";
    }
  };

  const seleCountry = (event, value, name) => {
    document.getElementById("divCountrySel").style.display = "none";

    if (value === "All") {
      setAreaCode("");
    } else {
      setAreaCode(value);
    }
    setAreaCodeName(name);
  };

  const refreshTableList = (areaCode) => {
    //GetTableInfoList lobby
    lobbyClient.GetTableInfoList(areaCode, 0, (success, o) => {
      if (success) {
        if (o.ResultCode === 0) {
          let array = o.TableInfoList.filter((data) => {
            let type = data.TableType.split(".");
            return (
              (type[1] === "0" || type[1] === "1") &&
              data.Status !== "Close" &&
              data.Status !== "NoService" &&
              data.Status !== "AccidentPending"
            );
          }).map((data) => {
            return {
              TableNumber: data.TableNumber,
              Image: data.ImageList.find((image) => image.ImageType === 1),
              CurrencyType: data.CurrencyType,
              Status: data.Status,
              ShoeResult: data.ShoeResult,
              TableType: data.TableType,
            };
          });

          setTableList(array);
        }
      }
    });
  };

  const SectionLiFavor1 = (props) => {
    const { favors } = useContext(FavorsContext);
    return (
      <span
        className={`${
          favors.includes(props.tableNumber) ? "has-favorites" : ""
        }`}
      />
    );
  };

  const SectionLi = (props) => {
    const entryTable = (TableNumber) => {
      props.entryRoadMap(TableNumber);
    };

    return (
      <li
        key={"li_" + props.tableInfo.TableNumber}
        onClick={() => entryTable(props.tableInfo.TableNumber)}
        className="li-box"
      >
        <SectionLiFavor1 tableNumber={props.tableInfo.TableNumber} />
        <div className={`games`}>
          {props.tableInfo.Image ? (
            <img src={props.tableInfo.Image.ImageUrl} alt="Table Image" />
          ) : (
            <img
              src="http://bm.dev.mts.idv.tw/images/JINBEI1.png"
              alt="Default Table Image"
            />
          )}
          <RoadMap shoeResult={props.tableInfo.ShoeResult} roaMapType={0} />
        </div>
        <p className="game-title">{props.tableInfo.TableNumber}</p>
        <p className="game-wallet">
          <span>{"CNY(暫)"}</span>
          <span></span>
        </p>
      </li>
    );
  };

  return (
    <div className="gamesetChangeTable">
      <div className="divChangeTable">
        <div className="header">
          <span className="title">要求換桌</span>
          <div className="search" onClick={showSeleCountry}>
            <div className="location"></div>

            <div className="place">
              <span className="place1">地點</span>
              <div className="Vector"></div>
              <span className="place2">{areaCodeName}</span>
            </div>
            <div className="upper"></div>
          </div>
          <div className="close" onClick={handleClose}>
            <div className="closeOutline"></div>
            <div className="closeicon"></div>
          </div>
        </div>
        <div className="country" id="divCountrySel">
          {props.countryItem.map((item) => (
            <div
              key={item.value}
              className="countryItem"
              onClick={(event) => seleCountry(event, item.value, item.name)}
            >
              <div className="location"></div>
              <div className="place">
                <span className="place1">{item.name}</span>
              </div>
              <div className="check"></div>
            </div>
          ))}
        </div>
        <div className="section_box">
          <ul>
            {tableList.length > 0
              ? tableList.map((data) => (
                  <SectionLi key={data.TableNumber} tableInfo={data} entryRoadMap={props.entryRoadMap} />
                ))
              : <span style={{ color:"#ffffff", fontSize:"1.375rem", fontWeight:"500", fontFamily:"Noto Sans TC" }}>No Data</span>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangeTable;
