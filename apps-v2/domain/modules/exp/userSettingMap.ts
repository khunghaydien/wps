import { Reducer } from 'redux';

import { UserSetting } from '@apps/domain/models/UserSetting';

const ACTIONS = {
  SET: 'MODULES/EXP/USER_SETTING_MAP/SET',
};

type State = {
  // Key is empHistoryId
  [key: string]: UserSetting;
};
const initialState: State = {};

export const setUserSettingInMap = (key: string, setting: UserSetting) => ({
  type: ACTIONS.SET,
  payload: { key, setting },
});

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const { payload } = action;
      const { key, setting } = payload;
      return { ...state, ...(key ? { [key]: setting } : {}) };
    default:
      return state;
  }
}) as Reducer<State, any>;
