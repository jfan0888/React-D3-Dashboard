import {
  UPDATE_VIEW_STATE,
  UPDATE_VIEW_MODAL,
} from '../actions/View';

export default function (state = {}, action) {
  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case UPDATE_VIEW_STATE:
      newState.state = action.payload;
      return newState;
    case UPDATE_VIEW_MODAL:
      newState.modal = action.payload;
      return newState;
    default:
      break;
  }

  return state;
}
