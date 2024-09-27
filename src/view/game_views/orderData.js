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
                if (typeof newOrderData[areaType] !== "number" ) {
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
                if (typeof newOrderData[areaType] !== "number" ) {
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
                if (typeof newOrderData[areaType] !== "number" ) {
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
                if (typeof newOrderData[areaType] !== "number" ) {
                    newOrderData[areaType].confirmValue = new BigNumber(newOrderData[areaType].confirmValue).plus(newOrderData[areaType].unConfirmValue).toNumber();
                    newOrderData[areaType].unConfirmValue = 0;
    
                    newOrderData[areaType].unConfirmValue = 0;
                }
            }

            newOrderData.orderSequence += 1;

            return newOrderData;


        case 'resetOrderSequence':
            if(newOrderData.orderSequence === 0){
                return state;
            }else{
                newOrderData.orderSequence = 0;
                return newOrderData;
            }                        
        case 'processOrderData':
            let isChanged = false;
            let totalValue = 0;
            let totalConfirmValue = 0;
            let totalunConfirmValue = 0;
            let OrderTie = new BigNumber(action.payload.SelfOrder.OrderTie);
            let OrderBanker = new BigNumber(action.payload.SelfOrder.OrderBanker);
            let OrderPlayer = new BigNumber(action.payload.SelfOrder.OrderPlayer);
            let OrderBankerPair = new BigNumber(action.payload.SelfOrder.OrderBankerPair);
            let OrderPlayerPair = new BigNumber(action.payload.SelfOrder.OrderPlayerPair);
            let OrderSequence =new BigNumber(action.payload.SelfOrder.OrderSequence);

            if (state.unConfirmValue !== 0) {
                if (new BigNumber(newOrderData['Tie'].confirmValue).plus(newOrderData['Tie'].unConfirmValue) == OrderTie) {
                    newOrderData['Tie'].unConfirmValue = 0;               
                    isChanged = true;
                }

                if (new BigNumber(newOrderData['Banker'].confirmValue).plus(newOrderData['Banker'].unConfirmValue) == OrderBanker) {
                    newOrderData['Banker'].unConfirmValue = 0;
                    isChanged = true;
                }

                if (new BigNumber(newOrderData['Player'].confirmValue).plus(newOrderData['Player'].unConfirmValue) == OrderPlayer) {
                    newOrderData['Player'].unConfirmValue = 0;
                    isChanged = true;
                }

                if (new BigNumber(newOrderData['BankerPair'].confirmValue).plus(newOrderData['BankerPair'].unConfirmValue) == OrderBankerPair) {
                    newOrderData['BankerPair'].unConfirmValue = 0;
                    isChanged = true;
                }

                if (new BigNumber(newOrderData['PlayerPair'].confirmValue).plus(newOrderData['PlayerPair'].unConfirmValue) == OrderPlayerPair) {
                    newOrderData['PlayerPair'].unConfirmValue = 0;
                    isChanged = true;
                }
            }

            if (newOrderData['Tie'].confirmValue !== OrderTie.toNumber()) {
                newOrderData['Tie'].confirmValue = OrderTie.toNumber();
                isChanged = true;
            }

            if (newOrderData['Banker'].confirmValue !== OrderBanker.toNumber()) {
                newOrderData['Banker'].confirmValue = OrderBanker.toNumber();
                isChanged = true;
            }

            if (newOrderData['Player'].confirmValue !== OrderPlayer.toNumber()) {
                newOrderData['Player'].confirmValue = OrderPlayer.toNumber();
                isChanged = true;
            }

            if (newOrderData['BankerPair'].confirmValue !== OrderBankerPair.toNumber()) {
                newOrderData['BankerPair'].confirmValue = OrderBankerPair.toNumber();
                isChanged = true;
            }

            if (newOrderData['PlayerPair'].confirmValue !== OrderPlayerPair.toNumber()) {
                newOrderData['PlayerPair'].confirmValue = OrderPlayerPair.toNumber();
                isChanged = true;
            }
            
            if (newOrderData.orderSequence !== OrderSequence){
                newOrderData.orderSequence = OrderSequence.toNumber();
                isChanged = true;
            }
            
            if (isChanged) {
                for (let type in newOrderData) {
                    if (typeof newOrderData[type] !== "number" ) {
                        newOrderData[type].totalValue = newOrderData[type].confirmValue + newOrderData[type].unConfirmValue;
                        totalValue = new BigNumber(totalValue).toNumber() + new BigNumber(newOrderData[type].totalValue).toNumber();
                        totalConfirmValue = new BigNumber(totalConfirmValue).toNumber() + new BigNumber(newOrderData[type].confirmValue).toNumber();
                        totalunConfirmValue = new BigNumber(totalunConfirmValue).toNumber() + new BigNumber(newOrderData[type].unConfirmValue).toNumber();
    
                        if (newOrderData[type].totalValue == 0) {
                            newOrderData[type].chips.length = 0;
                        }
                    }
                }

                newOrderData.totalValue = new BigNumber(totalValue).toNumber();
                newOrderData.confirmValue = new BigNumber(totalConfirmValue).toNumber();
                newOrderData.unConfirmValue = new BigNumber(totalunConfirmValue).toNumber();

                return newOrderData
            } else {
                return state;
            }

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export { orderReducer, initialOrderData };