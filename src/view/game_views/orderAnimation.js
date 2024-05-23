const animationMoveChip = (basicChipDom, type) => {
  //先建立籌碼dom，
  const sourceRect = basicChipDom.getBoundingClientRect();
  const chipDom = document.createElement('span');
  const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let startPointByRem = null;
  let endPointByRem = null;


  chipDom.className = basicChipDom.className;
  chipDom.classList.remove('act');
  chipDom.classList.add('move-chip');
  chipDom.style.position = 'absolute';
  //理論上要考慮scroll，但是該專案為等比例縮放置裝置高寬，直接忽略scroll的影響
  //chipDom.style.top = ((sourceRect.top + window.scrollY) / htmlFontSize).toFixed(8) + 'rem';  
  //chipDom.style.left = ((sourceRect.left + window.scrollX) / htmlFontSize).toFixed(8) + 'rem';

  startPointByRem = {x:(sourceRect.left) / htmlFontSize, y: (sourceRect.top) / htmlFontSize};
  chipDom.style.top = startPointByRem.x.toFixed(8) + 'rem';
  chipDom.style.left = startPointByRem.y.toFixed(8) + 'rem';


  //一樣忽略scroll的影響，單位
  switch (type) {
    case 'banker':
      endPointByRem = {x:63.125, y: 50.1875};
      break;
    case 'bankerPair':
      endPointByRem = {x:47.6875, y: 53.75};
      break;

    case 'player':
      endPointByRem = {x:77.6875, y:47.6875 };
      break;
    case 'playerPair':
      endPointByRem = {x:43.125, y: 53.75};
      break;
    case 'tie':
      endPointByRem = {x:60.1875, y: 53.75};
      break;
    default:
      throw new Error(`Unhandled  type: ${type}`);
  }

  document.body.appendChild(chipDom);

  chipDom.style.transform = `translate(${(endPointByRem.x - startPointByRem.x).toFixed(8)}rem, ${(endPointByRem.y - startPointByRem.y).toFixed(8)}rem) scale(0.7316627)`;

  setTimeout(()=>{
    chipDom.style.opacity = 0;
    setTimeout(() => {
      document.body.removeChild(chipDom);
    }, 300);
  }, 1000);
};

export {animationMoveChip}
