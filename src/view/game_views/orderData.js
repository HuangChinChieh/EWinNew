const initialOrderData = {
  totalValue: 0,
  confirmValue: 0,
  unConfirmValue: 0,
  orderSequence:0,


  Tie: {
    totalValue: 0,
    confirmValue: 0,
    unConfirmValue: 0,
    chips: []
  },
  Banker: {
    totalValue: 0,
    confirmValue: 0,
    unConfirmValue: 0,
    chips: []
  },
  Player: {
    totalValue: 0,
    confirmValue: 0,
    unConfirmValue: 0,
    chips: []
  },
  PlayerPair: {
    totalValue: 0,
    confirmValue: 0,
    unConfirmValue: 0,
    chips: []
  },
  BankerPair: {
    totalValue: 0,
    confirmValue: 0,
    unConfirmValue: 0,
    chips: []
  }
};

function orderReducer(state, action) {
  const newOrderData = { ...state };

  switch (action.type) {
    case 'addBet':
      //待補上動畫
      newOrderData.totalValue += action.payload.selChipData.chipValue;
      newOrderData.unConfirmValue += action.payload.selChipData.chipValue;
      newOrderData[action.payload.areaType].totalValue += action.payload.selChipData.chipValue;
      newOrderData[action.payload.areaType].unConfirmValue += action.payload.selChipData.chipValue;
      newOrderData[action.payload.areaType].chips.push({
        index: action.payload.selChipData.index,
        styleIndex: action.payload.selChipData.styleIndex,
        chipValue: action.payload.selChipData.chipValue,
        orderUnix: Date.now().toString()
      });

      return newOrderData
    case 'doubleBet':
      //待補上動畫                  
      newOrderData.totalValue += newOrderData.totalValue;
      newOrderData.unConfirmValue += newOrderData.totalValue;

      for (let areaType in newOrderData) {
        if (newOrderData[areaType].totalValue !== 0) {
          newOrderData[areaType].unConfirmValue += newOrderData[areaType].totalValue;
          newOrderData[areaType].totalValue += newOrderData[areaType].totalValue;
          newOrderData[areaType].chips.push(
            ...[...newOrderData[areaType].chips]
          );
        }
      }

      return newOrderData;
    case 'clearBet':
      //待補上動畫          
      newOrderData.totalValue = 0;
      newOrderData.confirmValue = 0;
      newOrderData.unConfirmValue = 0;
      newOrderData.orderSequence = 0;

      for (let areaType in newOrderData) {
        newOrderData[areaType].unConfirmValue = 0;
        newOrderData[areaType].totalValue = 0;
        newOrderData[areaType].confirmValue = 0;
        newOrderData[areaType].chips.length = 0;
      }

      return newOrderData;
    case 'confirmBet':
      newOrderData.confirmValue += newOrderData.unConfirmValue;
      newOrderData.unConfirmValue = 0;

      for (let areaType in newOrderData) {
        newOrderData[areaType].confirmValue += newOrderData[areaType].unConfirmValue;
        newOrderData[areaType].unConfirmValue = 0;
      }

      newOrderData.orderSequence +=1 ;

      return newOrderData;


    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export { orderReducer, initialOrderData };