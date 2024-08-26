import { animationMoveChip } from "./orderAnimation"

const moveChipAnimation = (areaType, cb) => {
    let endPoint = { x: 0, y: 0 };
    let endDom;
    let startChipDom;

    switch (areaType) {
        case "Player":
            endDom = document.querySelector(".betChipArea .bet-chip-player");
            break;
        case "Banker":
            endDom = document.querySelector(".betChipArea .bet-chip-banker");
            break;
        case "PlayerPair":
            endDom = document.querySelector(".betChipArea .bet-chip-playerpair");
            break;
        case "BankerPair":
            endDom = document.querySelector(".betChipArea .bet-chip-bankerpair");
            break;
        case "Tie":
            endDom = document.querySelector(".betChipArea .bet-chip-tie");
            break;
        default:
            break;
    }

    if (endDom) {
        let endRect = endDom.getBoundingClientRect();
        endPoint.x = endRect.x;
        endPoint.y = endRect.y; //要往上一個籌碼高度
    }

    startChipDom = document.querySelector(".game-chips-box .act");

    animationMoveChip(startChipDom, endPoint, cb);
};

export {moveChipAnimation}