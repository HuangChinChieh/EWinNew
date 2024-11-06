import BigNumber from 'bignumber.js';
const initialOrderData = {
    totalValue: 0,
    confirmValue: 0,
    unConfirmValue: 0,
    orderSequence: 0,


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
                if (typeof newOrderData[areaType] !== "number") {
                    newOrderData[areaType].unConfirmValue = new BigNumber(newOrderData[areaType].unConfirmValue).plus(newOrderData[areaType].totalValue).toNumber();
                    newOrderData[areaType].totalValue = new BigNumber(newOrderData[areaType].totalValue).plus(newOrderData[areaType].totalValue).toNumber();
                    newOrderData[areaType].chips.push(
                        ...[...newOrderData[areaType].chips]
                    );
                }
            }

            return newOrderData;
        case 'clearBet':
            newOrderData.totalValue = 0;
            newOrderData.confirmValue = 0;
            newOrderData.unConfirmValue = 0;

            for (let areaType in newOrderData) {
                if (typeof newOrderData[areaType] !== "number") {
                    newOrderData[areaType].unConfirmValue = 0;
                    newOrderData[areaType].totalValue = 0;
                    newOrderData[areaType].confirmValue = 0;
                    newOrderData[areaType].chips.length = 0;
                }
            }

            return newOrderData;
        case 'cancelConfirmBet':
            //待補上動畫          
            newOrderData.totalValue = new BigNumber(newOrderData.totalValue).minus(newOrderData.unConfirmValue).toNumber();
            newOrderData.unConfirmValue = 0;

            for (let areaType in newOrderData) {
                if (typeof newOrderData[areaType] !== "number") {
                    newOrderData[areaType].totalValue = new BigNumber(newOrderData[areaType].totalValue).minus(newOrderData[areaType].unConfirmValue).toNumber();
                    newOrderData[areaType].unConfirmValue = 0;

                    newOrderData[areaType].confirmValue = 0;
                    newOrderData[areaType].chips.length = 0;
                }
            }

            return newOrderData;
        case 'confirmBet':
            newOrderData.confirmValue = new BigNumber(newOrderData.confirmValue).plus(newOrderData.unConfirmValue).toNumber();
            newOrderData.unConfirmValue = 0;

            for (let areaType in newOrderData) {
                if (typeof newOrderData[areaType] !== "number") {
                    newOrderData[areaType].confirmValue = new BigNumber(newOrderData[areaType].confirmValue).plus(newOrderData[areaType].unConfirmValue).toNumber();
                    newOrderData[areaType].unConfirmValue = 0;

                    newOrderData[areaType].unConfirmValue = 0;
                }
            }

            newOrderData.orderSequence += 1;

            return newOrderData;


        case 'resetOrderSequence':
            if (newOrderData.orderSequence === 0) {
                return state;
            } else {
                newOrderData.orderSequence = 0;
                return newOrderData;
            }
        case 'processOrderData':
            let isChanged = false;
            let totalValue = 0;
            let totalConfirmValue = 0;
            let totalUnConfirmValue = 0;            
          
            for(let areaStr in ['Tie', 'Banker', 'Player', 'BankerPair', 'PlayerPair'] ){
                let selfOrderAreaStr = 'Order' + areaStr;

                if (!(new BigNumber(newOrderData[areaStr].confirmValue).eq(action.payload.SelfOrder[selfOrderAreaStr]))) {

                    //有尚未投注之數字，檢查是否已經轉換成投注
                    if(state.unConfirmValue !== 0){
                        if (new BigNumber(newOrderData[areaStr].confirmValue).plus(newOrderData[areaStr].unConfirmValue).eq(action.payload.SelfOrder[selfOrderAreaStr])) {
                            newOrderData[areaStr].unConfirmValue = 0;
                        }    
                    }
                                  
                    newOrderData['Tie'].confirmValue = action.payload.SelfOrder[selfOrderAreaStr];
                    isChanged = true;
                }
            }
         
            if (newOrderData.orderSequence !== action.payload.SelfOrder.OrderSequence) {
                newOrderData.orderSequence = action.payload.SelfOrder.OrderSequence;
                isChanged = true;
            }

            if (isChanged) {
                for (let type in newOrderData) {
                    if (typeof newOrderData[type] !== "number") {
                        newOrderData[type].totalValue = newOrderData[type].confirmValue + newOrderData[type].unConfirmValue;
                        totalValue = new BigNumber(totalValue).plus(newOrderData[type].totalValue).toNumber();
                        totalConfirmValue = new BigNumber(totalConfirmValue).plus(newOrderData[type].confirmValue).toNumber();
                        totalUnConfirmValue = new BigNumber(totalUnConfirmValue).plus(newOrderData[type].unConfirmValue).toNumber();

                        if (newOrderData[type].totalValue === 0) {
                            newOrderData[type].chips.length = 0;
                        }else{
                            //如果有投注數字，但是沒籌碼，隨意加上籌碼

                            if(newOrderData[type].chips.length === 0){
                                if(action.payload.SelChipData){
                                    newOrderData[type].chips.push({
                                        index: action.payload.SelChipData.index,
                                        styleIndex: action.payload.SelChipData.styleIndex,
                                        chipValue: action.payload.SelChipData.chipValue,
                                        isConfirm: true,
                                        orderUnix: Date.now().toString()
                                    });
                                }else{
                                    newOrderData[type].chips.push({
                                        index: 0,
                                        styleIndex: 1,
                                        chipValue: 25,
                                        isConfirm: true,
                                        orderUnix: Date.now().toString()
                                    });
                                }
                            }                                                      
                        }
                    }
                }

                newOrderData.totalValue = totalValue;
                newOrderData.confirmValue = totalConfirmValue;
                newOrderData.unConfirmValue = totalUnConfirmValue;

                return newOrderData
            } else {
                return state;
            }

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export { orderReducer, initialOrderData };