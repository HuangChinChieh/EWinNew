import BigNumber from 'bignumber.js';
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
      newOrderData.totalValue = new BigNumber(newOrderData.totalValue).plus(action.payload.selChipData.chipValue).toNumber();
      newOrderData.unConfirmValue = action.payload.selChipData.chipValue;
      newOrderData[action.payload.areaType].totalValue = new BigNumber(newOrderData[action.payload.areaType].totalValue).plus(action.payload.selChipData.chipValue).toNumber();
      newOrderData[action.payload.areaType].unConfirmValue = new BigNumber(newOrderData[action.payload.areaType].unConfirmValue).plus(action.payload.selChipData.chipValue).toNumber();
      newOrderData[action.payload.areaType].chips.push({
        index: action.payload.selChipData.index,
        styleIndex: action.payload.selChipData.styleIndex,
        chipValue: action.payload.selChipData.chipValue,
        isConfirm: false,
        orderUnix: Date.now().toString()
      });

      return newOrderData
    case 'doubleBet':
      //待補上動畫                  
      newOrderData.totalValue = new BigNumber(newOrderData.totalValue).plus(newOrderData.totalValue).toNumber();
      newOrderData.unConfirmValue = new BigNumber(newOrderData.unConfirmValue).plus(newOrderData.totalValue).toNumber();

      for (let areaType in newOrderData) {
        if (newOrderData[areaType].totalValue !== 0) {
          newOrderData[areaType].unConfirmValue = new BigNumber( newOrderData[areaType].unConfirmValue).plus(newOrderData[areaType].totalValue).toNumber();
          newOrderData[areaType].totalValue = new BigNumber(newOrderData[areaType].totalValue).plus(newOrderData[areaType].totalValue).toNumber();
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

      for (let areaType in newOrderData) {
        newOrderData[areaType].unConfirmValue = 0;
        newOrderData[areaType].totalValue = 0;
        newOrderData[areaType].confirmValue = 0;
        newOrderData[areaType].chips.length = 0;
      }

      return newOrderData;
      case 'cancelConfirmBet':
        //待補上動畫          
        newOrderData.totalValue = new BigNumber(newOrderData.totalValue).minus(newOrderData.unConfirmValue).toNumber();
        newOrderData.unConfirmValue = 0;        
  
        for (let areaType in newOrderData) {
          newOrderData[areaType].totalValue = new BigNumber(newOrderData[areaType].totalValue).minus(newOrderData[areaType].unConfirmValue).toNumber();
          newOrderData[areaType].unConfirmValue = 0;
          
          newOrderData[areaType].confirmValue = 0;
          newOrderData[areaType].chips.length = 0;
        }
  
        return newOrderData;
    case 'confirmBet':
      newOrderData.confirmValue = new BigNumber(newOrderData.confirmValue).plus(newOrderData.unConfirmValue).toNumber();
      newOrderData.unConfirmValue = 0;

      for (let areaType in newOrderData) {
        newOrderData[areaType].confirmValue = new BigNumber(newOrderData[areaType].confirmValue).plus(newOrderData[areaType].unConfirmValue).toNumber();
        newOrderData[areaType].unConfirmValue = 0;

        newOrderData[areaType].unConfirmValue = 0;
      }

      newOrderData.orderSequence +=1 ;

      return newOrderData;


      case 'resetOrderSequence':
        newOrderData.orderSequence = 0;
  
        return newOrderData;
  

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export { orderReducer, initialOrderData };