import { combineReducers } from 'redux';

import assignment from './assignment';

const reducers = combineReducers({
  assignment,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
