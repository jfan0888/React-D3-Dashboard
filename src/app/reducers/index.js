import { combineReducers } from 'redux';

import ViewReducer from './ViewReducer';
import UserInfoReducer from './UserInfoReducer';

const rootReducer = combineReducers({
  view: ViewReducer,
  userInfo: UserInfoReducer,
});

export default rootReducer;
