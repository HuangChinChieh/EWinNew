
function initialOrderData(){
    return  {
        orderBanker:0,
        orderPlayer:0,
        orderTie:0,
        orderBankerPair:0,
        orderPlayerPair:0
    }; 
}

function orderReducer(state, action) {    
  switch (action.type) {
    case 'addBanker':
      return { ...state, orderBanker: state.orderBanker + action.payload };
    case 'addPlayer':
        return { ...state, orderPlayer: state.orderPlayer + action.payload };
    case 'addTie':
        return { ...state, orderTie: state.orderTie + action.payload };        
    case 'addBankerPair':
        return { ...state, orderBankerPair: state.orderBankerPair + action.payload };
        
    case 'addPlayerPair':
        return { ...state, orderPlayerPair: state.orderPlayerPair + action.payload };
    case 'clear':
      if(Object.values(state).every(value => value === 0)){
        return state;
      }else{
        return initialOrderData(); // 使用 payload 傳遞新值
      }      
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export {orderReducer, initialOrderData};