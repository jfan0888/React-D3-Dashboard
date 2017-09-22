import {
  UPDATE_USER_EMAIL,
  UPDATE_USER_PHONE,
} from '../actions/UserInfo';

export default function (state = {}, action) {
  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case UPDATE_USER_EMAIL:
      newState.email = action.payload;
      return newState;
    case UPDATE_USER_PHONE:
      newState.phone = action.payload;
      return newState;
    default:
      break;
  }

  return state;
}
