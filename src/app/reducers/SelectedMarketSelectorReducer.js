import {
    CP_CLEAR_USER_SELECTED_MARKET_SELECTORS,
    CP_POPULATE_SAVED_SEGMENT_TO_SELECTED,
    CP_REMOVE_SELECTED_MARKET,
    CP_TOGGLE_SELECTED_MARKET
} from "../actions/MarketSelector";




export default function (state = [], action) {
  switch (action.type) {
    case CP_TOGGLE_SELECTED_MARKET:
      if(!state.some(market => market.id == action.payload.id)) {
          if(state.length < 3){
              return [...state, {id:action.payload.id, key: action.payload.key, type:action.payload.type }];
          }else{
              return [...state];
          }

      } else {
          return state.filter((market) => {
              return market.id != action.payload.id;
          });
      }

      case CP_REMOVE_SELECTED_MARKET:
          return state.filter((market) => {
              return market.id != action.payload.id;
          });


      case CP_POPULATE_SAVED_SEGMENT_TO_SELECTED :

          return action.payload

      case CP_CLEAR_USER_SELECTED_MARKET_SELECTORS:
          return []

    default:
      break;
  }

  return state;
}
