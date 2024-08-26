const animationMoveChip = (basicChipDom, endPoint, cb) => {
  //先建立籌碼dom，
  const sourceRect = basicChipDom.getBoundingClientRect();
  const chipDom = document.createElement('div');
  const chipTextDom = document.createElement('div');
  const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let startPointByRem = null;
  let endPointByRem = null;


  chipTextDom.innerText = basicChipDom.querySelector("div").innerText;
  chipDom.appendChild(chipTextDom);
  chipDom.className = basicChipDom.className;
  chipDom.classList.remove('act');
  chipDom.classList.add('move-chip');
  chipDom.style.position = 'absolute';
  //理論上要考慮scroll，但是該專案為等比例縮放置裝置高寬，直接忽略scroll的影響
  //chipDom.style.top = ((sourceRect.top + window.scrollY) / htmlFontSize).toFixed(8) + 'rem';  
  //chipDom.style.left = ((sourceRect.left + window.scrollX) / htmlFontSize).toFixed(8) + 'rem';

  startPointByRem = { x: (sourceRect.x) / htmlFontSize, y: (sourceRect.y) / htmlFontSize };
  chipDom.style.top = startPointByRem.y.toFixed(8) + 'rem';
  chipDom.style.left = startPointByRem.x.toFixed(8) + 'rem';

  endPointByRem = { x: endPoint.x / htmlFontSize, y: (endPoint.y - 36) / htmlFontSize };


  document.body.appendChild(chipDom);

  //chipDom.style.transform = `translate(${(endPointByRem.x - startPointByRem.x).toFixed(8)}rem, ${(endPointByRem.y - startPointByRem.y).toFixed(8)}rem) scale(0.7316627)`;

  setTimeout(() => {
    //chipDom.style.opacity = 0;
    chipDom.style.transform = `translate(${(endPointByRem.x - startPointByRem.x).toFixed(8)}rem, ${(endPointByRem.y - startPointByRem.y).toFixed(8)}rem) scale(0.7316627)`;
    setTimeout(() => {
      //chipDom.style.opacity = 0;
      document.body.removeChild(chipDom);
      if(cb)
        cb();
      
    }, 300);
  }, 10);
};

export { animationMoveChip }
