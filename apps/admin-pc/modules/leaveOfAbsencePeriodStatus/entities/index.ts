import { combineReducers } from 'redux';

import leaveOfAbsenceList from './leaveOfAbsenceList';
import leaveOfAbsencePeriodStatusList from './leaveOfAbsencePeriodStatusList';

const reducers = combineReducers({
  leaveOfAbsenceList,
  leaveOfAbsencePeriodStatusList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
