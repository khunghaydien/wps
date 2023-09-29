/* @flow */
import { type Dispatch } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import { fetchUserSetting } from '../../commons/actions/userSetting';
import BaseWSPError from '../../commons/errors/BaseWSPError';
import msg from '../../commons/languages';
import LangUtil from '../../commons/utils/LangUtil';

import {
  convertUrlQueryToParam,
  save as saveOAuthResult,
} from '../models/OAuthResult';

type State = {|
  done: boolean,
  isSucceeded?: boolean,
  error?: BaseWSPError,
|};

type Action = {|
  type: string,
  payload: State,
|};

const initialState: State = {
  done: false,
};

const ACTIONS = {
  SUCCEEDED: 'OAUTH_RESULT_VIEW/MODULES/APP/SUCCEEDED',
  FAILED: 'OAUTH_RESULT_VIEW/MODULES/APP/FAILED',
};

const onSuccess = () => ({
  type: ACTIONS.SUCCEEDED,
  payload: {
    done: true,
    isSucceeded: true,
  },
});

const onFailure = (error: BaseWSPError) => ({
  type: ACTIONS.FAILED,
  payload: {
    done: true,
    isSucceeded: false,
    error,
  },
});

const initializeUserSetting = (): Promise<void> => {
  return fetchUserSetting().then((userSetting) => {
    // 言語設定を初期化
    const language = LangUtil.convertSfLang(userSetting.language);
    window.empInfo = { language }; // FIXME: for msg()

    return Promise.resolve();
  });
};

const initialize =
  () =>
  (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(loadingStart());

    return initializeUserSetting()
      .then(() => {
        const param = convertUrlQueryToParam();
        if (param !== null) {
          return saveOAuthResult(param);
        } else {
          throw new BaseWSPError(
            msg().Oauth_Err_CalendarAccessAuthError,
            msg().Oauth_Msg_CalendarAccessAuthErrorNoParam,
            msg().Oauth_Msg_CalendarAccessAuthErrorNoParamSolution,
            { isContinuable: false }
          );
        }
      })
      .then(() => dispatch(onSuccess()))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: false }))) // ApiErrorはここでcatchされる
      .catch((err) => dispatch(onFailure(err))) // BaseWSPErrorはここでcatchされる
      .then(() => dispatch(loadingEnd()));
  };

export const actions = {
  initialize,
};

export default function appReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTIONS.SUCCEEDED:
    case ACTIONS.FAILED:
      return action.payload;

    default:
      return state;
  }
}
