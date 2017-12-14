import {
    CP_UPDATE_CLICKED,
    CP_UPDATE_CLICKED_SEGMENT,
    CP_UPDATE_RE_DRAW,
    CP_UPDATE_IS_FIRST,
    CP_CLEAR_CLICKED_SEGMENT
} from '../actions/ChartActions';

const InitialState = {
    clicked:false,
    clickedSegments:[],
    reDraw:false,
    isFirst:true,

}

export default function (state = InitialState, action) {
  switch (action.type) {
      case CP_UPDATE_CLICKED:
          return{ ...state, clicked:action.payload }
      case CP_UPDATE_CLICKED_SEGMENT:
          if(!state.clickedSegments.some(item => item.market === action.payload.market)) {
              return {...state, clickedSegments:[... state.clickedSegments,action.payload ]};
          } else {
              return {...state, clickedSegments: state.clickedSegments.filter((item) => {
                  return item.market != action.payload.market;
              })}
          }
      case CP_UPDATE_RE_DRAW:
          return{ ...state, reDraw:action.payload }
      case CP_UPDATE_IS_FIRST:
          return{ ...state, isFirst:action.payload  }
      case CP_CLEAR_CLICKED_SEGMENT:
          return {...state, clickedSegments: [], clicked:false}

    default:
      break;
  }

  return state;
}
