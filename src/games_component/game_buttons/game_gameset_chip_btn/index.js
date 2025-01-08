import "./index.scss";

const GameSetChip = (props) => {
  const chipsItem = props.chipsItem;

  return (
    <div className="gameSet-chips-area">
      <div className="gameSet-chips-box">
        {chipsItem.map((item) => (
          <div
            key={`chips${item.styleIndex}`}
            className={`chips-${item.styleIndex} ${props.selChipIndex === item.styleIndex ? "act" : ""
              }`}
            onClick={() => props.fn_click(item.showText)}
          >
            <div>{item.showText}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSetChip;
